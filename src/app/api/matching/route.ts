import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { findMatches } from '@/utils/matching';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

const app = new Hono();

// Middleware to check if user is authenticated and has completed profile
const requireAuth = async (c: any, next: any) => {
  const user = await currentUser();
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const dbUser = await db
    .select()
    .from(users)
    .where(eq(users.id, user.id))
    .limit(1);

  if (!dbUser[0]) {
    return c.json({ error: 'User not found' }, 404);
  }

  c.set('userId', user.id);
  c.set('user', dbUser[0]);
  await next();
};

// Schema for match request
const matchRequestSchema = z.object({
  limit: z.number().min(1).max(50).optional(),
  weights: z
    .object({
      interests: z.number().min(0).max(1),
      careerPath: z.number().min(0).max(1),
      mentorship: z.number().min(0).max(1),
      universityInvolvement: z.number().min(0).max(1),
      location: z.number().min(0).max(1),
    })
    .optional(),
});

// Get matches for the current user
app.get(
  '/matches',
  requireAuth,
  zValidator('query', matchRequestSchema),
  async (c) => {
    const userId = c.req.header('userId') as string;
    const user = c.req.header('user') as unknown as typeof users.$inferSelect;
    const { limit, weights } = c.req.valid('query');

    // Check if user is a student
    if (user.role !== 'student') {
      return c.json({ error: 'Only students can search for matches' }, 403);
    }

    try {
      const matches = await findMatches(userId, limit, weights);
      return c.json({ matches });
    } catch (error) {
      console.error('Error finding matches:', error);
      return c.json({ error: 'Failed to find matches' }, 500);
    }
  }
);

export const GET = app.fetch;
