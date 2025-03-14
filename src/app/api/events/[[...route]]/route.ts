import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { events, eventRsvps, users } from '@/db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

const app = new Hono().basePath('/api/events');

// Get all events with filters
app.get('/', async (c) => {
  try {
    const { category, status } = c.req.query();
    const userId = c.req.header('X-User-Id');

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    let query = db.query.events.findMany({
      orderBy: [desc(events.date)],
      with: {
        rsvps: {
          where: eq(eventRsvps.userId, userId),
        },
      },
    });

    if (category) {
      query = db.query.events.findMany({
        where: eq(events.category, category),
        orderBy: [desc(events.date)],
        with: {
          rsvps: {
            where: eq(eventRsvps.userId, userId),
          },
        },
      });
    }

    if (status) {
      query = db.query.events.findMany({
        where: eq(events.status, status),
        orderBy: [desc(events.date)],
        with: {
          rsvps: {
            where: eq(eventRsvps.userId, userId),
          },
        },
      });
    }

    const allEvents = await query;

    // Get organizer details for each event
    const eventsWithOrganizers = await Promise.all(
      allEvents.map(async (event) => {
        const organizer = await db.query.users.findFirst({
          where: eq(users.id, event.organizerId),
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        });

        const attendeeCount = await db
          .select({ count: eventRsvps.id })
          .from(eventRsvps)
          .where(
            and(
              eq(eventRsvps.eventId, event.id),
              eq(eventRsvps.status, 'attending')
            )
          );

        return {
          ...event,
          organizer,
          attendeeCount: attendeeCount[0]?.count || 0,
          userRsvp: event.rsvps[0]?.status || null,
        };
      })
    );

    return c.json({ events: eventsWithOrganizers });
  } catch (error) {
    console.error('Error in events API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get event by ID
app.get('/:id', async (c) => {
  try {
    const eventId = c.req.param('id');
    const userId = c.req.header('X-User-Id');

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const event = await db.query.events.findFirst({
      where: eq(events.id, eventId),
      with: {
        rsvps: {
          where: eq(eventRsvps.userId, userId),
        },
      },
    });

    if (!event) {
      return c.json({ error: 'Event not found' }, 404);
    }

    const organizer = await db.query.users.findFirst({
      where: eq(users.id, event.organizerId),
      columns: {
        firstName: true,
        lastName: true,
        profileImage: true,
      },
    });

    const attendees = await db.query.eventRsvps.findMany({
      where: and(
        eq(eventRsvps.eventId, eventId),
        eq(eventRsvps.status, 'attending')
      ),
      with: {
        user: {
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });

    return c.json({
      event: {
        ...event,
        organizer,
        attendees,
        userRsvp: event.rsvps[0]?.status || null,
      },
    });
  } catch (error) {
    console.error('Error in event details API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create new event
app.post('/', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== 'alumni') {
      return c.json({ error: 'Only alumni can create events' }, 403);
    }

    const body = await c.req.json();
    const newEvent = await db
      .insert(events)
      .values({
        ...body,
        organizerId: userId,
      })
      .returning();

    return c.json({ event: newEvent[0] });
  } catch (error) {
    console.error('Error creating event:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Update RSVP status
app.post('/:id/rsvp', async (c) => {
  try {
    const eventId = c.req.param('id');
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { status } = await c.req.json();
    if (!['attending', 'maybe', 'not_attending'].includes(status)) {
      return c.json({ error: 'Invalid RSVP status' }, 400);
    }

    // Check if event exists and is upcoming
    const event = await db.query.events.findFirst({
      where: and(eq(events.id, eventId), gte(events.date, new Date())),
    });

    if (!event) {
      return c.json({ error: 'Event not found or already passed' }, 404);
    }

    // Check if user has already RSVP'd
    const existingRsvp = await db.query.eventRsvps.findFirst({
      where: and(
        eq(eventRsvps.eventId, eventId),
        eq(eventRsvps.userId, userId)
      ),
    });

    let rsvp;
    if (existingRsvp) {
      // Update existing RSVP
      rsvp = await db
        .update(eventRsvps)
        .set({ status, updatedAt: new Date() })
        .where(eq(eventRsvps.id, existingRsvp.id))
        .returning();
    } else {
      // Create new RSVP
      rsvp = await db
        .insert(eventRsvps)
        .values({
          eventId,
          userId,
          status,
        })
        .returning();
    }

    return c.json({ rsvp: rsvp[0] });
  } catch (error) {
    console.error('Error updating RSVP:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
