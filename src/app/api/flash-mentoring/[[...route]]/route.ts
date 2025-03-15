import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import {
  flashMentoringRequests,
  users,
  mentorshipAreas,
  mentorshipOfferings,
} from '@/db/schema';
import { eq, and, desc, sql } from 'drizzle-orm';

const app = new Hono().basePath('/api/flash-mentoring');

app.get('/', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Get user role
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    let query;
    if (user.role === 'student') {
      query = db.query.flashMentoringRequests.findMany({
        where: eq(flashMentoringRequests.studentId, userId),
        with: {
          area: true,
          mentor: {
            columns: {
              firstName: true,
              lastName: true,
              profileImage: true,
              currentRole: true,
              company: true,
            },
          },
        },
        orderBy: [desc(flashMentoringRequests.createdAt)],
      });
    } else {
      // Alumni see pending requests in their mentorship areas
      const mentorAreas = await db
        .select({ areaId: mentorshipAreas.id })
        .from(mentorshipAreas)
        .innerJoin(
          mentorshipOfferings,
          eq(mentorshipOfferings.areaId, mentorshipAreas.id)
        )
        .where(eq(mentorshipOfferings.userId, userId));

      const areaIds = mentorAreas.map((area) => area.areaId);

      query = db.query.flashMentoringRequests.findMany({
        where: and(
          eq(flashMentoringRequests.status, 'pending'),
          sql`${flashMentoringRequests.areaId} = ANY(${areaIds})`
        ),
        with: {
          area: true,
          student: {
            columns: {
              firstName: true,
              lastName: true,
              profileImage: true,
              major: true,
              graduationYear: true,
            },
          },
        },
        orderBy: [desc(flashMentoringRequests.createdAt)],
      });
    }

    const requests = await query;
    return c.json({ requests });
  } catch (error) {
    console.error('Error in flash mentoring API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create a new flash mentoring request
app.post('/', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    // Check if user is a student
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== 'student') {
      return c.json(
        { error: 'Only students can create mentoring requests' },
        403
      );
    }

    const body = await c.req.json();
    const { title, description, areaId, duration, preferredTime } = body;

    // Validate required fields
    if (!title || !description || !areaId || !duration || !preferredTime) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create request
    const [request] = await db
      .insert(flashMentoringRequests)
      .values({
        studentId: userId,
        areaId,
        title,
        description,
        duration,
        preferredTime,
      })
      .returning();

    return c.json({ request });
  } catch (error) {
    console.error('Error creating flash mentoring request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Accept a flash mentoring request
app.post('/:id/accept', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const requestId = c.req.param('id');
    const { scheduledFor, meetingLink } = await c.req.json();

    // Check if user is alumni
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== 'alumni') {
      return c.json(
        { error: 'Only alumni can accept mentoring requests' },
        403
      );
    }

    // Update request
    const [request] = await db
      .update(flashMentoringRequests)
      .set({
        mentorId: userId,
        status: 'accepted',
        scheduledFor: new Date(scheduledFor),
        meetingLink,
        updatedAt: new Date(),
      })
      .where(eq(flashMentoringRequests.id, requestId))
      .returning();

    return c.json({ request });
  } catch (error) {
    console.error('Error accepting flash mentoring request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Complete a flash mentoring session
app.post('/:id/complete', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const requestId = c.req.param('id');

    // Update request
    const [request] = await db
      .update(flashMentoringRequests)
      .set({
        status: 'completed',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(flashMentoringRequests.id, requestId),
          eq(flashMentoringRequests.mentorId, userId)
        )
      )
      .returning();

    return c.json({ request });
  } catch (error) {
    console.error('Error completing flash mentoring session:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Cancel a flash mentoring request
app.post('/:id/cancel', async (c) => {
  try {
    const userId = c.req.header('X-User-Id');
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const requestId = c.req.param('id');

    // Update request
    const [request] = await db
      .update(flashMentoringRequests)
      .set({
        status: 'cancelled',
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(flashMentoringRequests.id, requestId),
          eq(flashMentoringRequests.studentId, userId)
        )
      )
      .returning();

    return c.json({ request });
  } catch (error) {
    console.error('Error cancelling flash mentoring request:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
