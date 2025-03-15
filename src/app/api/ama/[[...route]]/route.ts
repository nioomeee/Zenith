import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { events, users, eventRsvps } from '@/db/schema';
import { eq, and, gte, desc } from 'drizzle-orm';

const app = new Hono().basePath('/api/ama');

app.get('/', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const amaSessions = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        maxAttendees: events.maxAttendees,
        organizerId: events.organizerId,
        status: events.status,
      })
      .from(events)
      .where(and(eq(events.category, 'ama'), gte(events.date, new Date())))
      .orderBy(desc(events.date));

    const sessionsWithDetails = await Promise.all(
      amaSessions.map(async (session) => {
        const organizer = await db.query.users.findFirst({
          where: eq(users.id, session.organizerId),
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
            currentRole: true,
            company: true,
          },
        });

        const rsvp = await db.query.eventRsvps.findFirst({
          where: and(
            eq(eventRsvps.eventId, session.id),
            eq(eventRsvps.userId, userId)
          ),
        });

        const rsvpCount = await db
          .select({ count: eventRsvps.id })
          .from(eventRsvps)
          .where(eq(eventRsvps.eventId, session.id));

        return {
          ...session,
          currentAttendees: rsvpCount.length,
          isRegistered: !!rsvp,
          rsvpStatus: rsvp?.status || null,
          organizer: organizer || {
            firstName: 'Unknown',
            lastName: 'User',
            profileImage: null,
            currentRole: null,
            company: null,
          },
        };
      })
    );

    return c.json({ sessions: sessionsWithDetails });
  } catch (error) {
    console.error('Error in AMA sessions API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

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
      return c.json({ error: 'Only alumni can create AMA sessions' }, 403);
    }

    const body = await c.req.json();
    const {
      title,
      description,
      date,
      duration,
      maxAttendees = 100,
      targetAudience,
    } = body;

    if (!title || !description || !date || !duration) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    const [session] = await db
      .insert(events)
      .values({
        title,
        description,
        date: new Date(date),
        location: 'Online',
        isVirtual: true,
        category: 'ama',
        organizerId: userId,
        maxAttendees,
        status: 'upcoming',
      })
      .returning();

    return c.json({ session });
  } catch (error) {
    console.error('Error creating AMA session:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.post('/:id/register', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionId = c.req.param('id');
    const { status = 'attending' } = await c.req.json();

    // Check if session exists and is not full
    const session = await db.query.events.findFirst({
      where: eq(events.id, sessionId),
    });

    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    const rsvpCount = await db
      .select({ count: eventRsvps.id })
      .from(eventRsvps)
      .where(eq(eventRsvps.eventId, sessionId));

    if (session.maxAttendees && rsvpCount.length >= session.maxAttendees) {
      return c.json({ error: 'Session is full' }, 400);
    }

    const existingRsvp = await db.query.eventRsvps.findFirst({
      where: and(
        eq(eventRsvps.eventId, sessionId),
        eq(eventRsvps.userId, userId)
      ),
    });

    let rsvp;
    if (existingRsvp) {
      [rsvp] = await db
        .update(eventRsvps)
        .set({ status })
        .where(eq(eventRsvps.id, existingRsvp.id))
        .returning();
    } else {
      [rsvp] = await db
        .insert(eventRsvps)
        .values({
          eventId: sessionId,
          userId,
          status,
        })
        .returning();
    }

    return c.json({ rsvp });
  } catch (error) {
    console.error('Error registering for AMA session:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

app.get('/:id', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const sessionId = c.req.param('id');

    const session = await db.query.events.findFirst({
      where: eq(events.id, sessionId),
    });

    if (!session) {
      return c.json({ error: 'Session not found' }, 404);
    }

    // Get organizer details
    const organizer = await db.query.users.findFirst({
      where: eq(users.id, session.organizerId),
      columns: {
        firstName: true,
        lastName: true,
        profileImage: true,
        currentRole: true,
        company: true,
        major: true,
        graduationYear: true,
      },
    });

    const rsvps = await db
      .select({
        id: eventRsvps.id,
        status: eventRsvps.status,
        userId: eventRsvps.userId,
      })
      .from(eventRsvps)
      .where(eq(eventRsvps.eventId, sessionId));

    const rsvpsWithUsers = await Promise.all(
      rsvps.map(async (rsvp) => {
        const user = await db.query.users.findFirst({
          where: eq(users.id, rsvp.userId),
          columns: {
            firstName: true,
            lastName: true,
            profileImage: true,
            role: true,
          },
        });
        return { ...rsvp, user };
      })
    );

    // Get user's RSVP status
    const userRsvp = rsvpsWithUsers.find((rsvp) => rsvp.userId === userId);

    return c.json({
      session: {
        ...session,
        organizer: organizer || {
          firstName: 'Unknown',
          lastName: 'User',
          profileImage: null,
          currentRole: null,
          company: null,
          major: null,
          graduationYear: null,
        },
        rsvps: rsvpsWithUsers,
        isRegistered: !!userRsvp,
        rsvpStatus: userRsvp?.status || null,
      },
    });
  } catch (error) {
    console.error('Error fetching AMA session details:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
