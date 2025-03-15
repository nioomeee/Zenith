import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { mentorshipAreas } from '@/db/schema';

const app = new Hono().basePath('/api/mentorship-areas');

app.get('/', async (c) => {
  try {
    const areas = await db.query.mentorshipAreas.findMany({
      orderBy: (areas) => [areas.name],
    });

    return c.json({ areas });
  } catch (error) {
    console.error('Error fetching mentorship areas:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
