import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { calculateMatchScore } from '@/utils/matching';
import { Context } from 'hono';

interface MatchResponse {
  userId: string;
  score: number;
  profile: {
    firstName: string;
    lastName: string;
    profileImage: string | null;
    major: string;
    graduationYear: number;
    currentRole: string | null;
    company: string | null;
    location: string;
  };
  explanation: string[];
}

const app = new Hono().basePath('/api/matching');

app.get('/matches', async (c) => {
  try {
    const userId = c.req.header('X-User-Id') as string;
    if (!userId)
      return c.json({ error: 'Unauthorized id not found' }, { status: 401 });

    // Get current user from database
    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        interests: true,
        careerPaths: true,
        mentorshipOfferings: true,
        mentorshipNeeds: true,
        universityGroups: true,
      },
    });

    if (!dbUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    // Only students can search for matches
    if (dbUser.role !== 'student') {
      return c.json({ error: 'Only students can search for matches' }, 403);
    }

    // Get potential matches (alumni)
    const potentialMatches = await db.query.users.findMany({
      where: and(
        eq(users.role, 'alumni'),
        sql`${users.graduationYear} < ${dbUser.graduationYear ?? 0}`
      ),
      with: {
        interests: true,
        careerPaths: true,
        mentorshipOfferings: true,
        mentorshipNeeds: true,
        universityGroups: true,
      },
    });

    // Calculate match scores
    const matches = await Promise.all(
      potentialMatches.map(async (match) => {
        const score = await calculateMatchScore(dbUser.id, match.id);
        const response: MatchResponse = {
          userId: match.id,
          score: score.score,
          profile: {
            firstName: match.firstName ?? '',
            lastName: match.lastName ?? '',
            profileImage: match.profileImage,
            major: match.major ?? '',
            graduationYear: match.graduationYear ?? 0,
            currentRole: match.currentRole,
            company: match.company,
            location: match.location ?? '',
          },
          explanation: score.explanation,
        };
        return response;
      })
    );

    // Sort matches by score (highest first)
    const sortedMatches = matches.sort((a, b) => b.score - a.score);

    return c.json({ matches: sortedMatches });
  } catch (error) {
    console.error('Error in matches API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
