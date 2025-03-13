import { eq, and, lt } from 'drizzle-orm';
import { db } from '@/db';
import {
  users,
  interests,
  userInterests,
  careerPaths,
  userCareerPaths,
  mentorshipAreas,
  mentorshipOfferings,
  mentorshipNeeds,
  universityGroups,
  userUniversityGroups,
} from '@/db/schema';
import { MatchScore, MatchWeights, DEFAULT_WEIGHTS } from '@/types/matching';

export async function calculateMatchScore(
  studentId: string,
  alumnusId: string,
  weights: MatchWeights = DEFAULT_WEIGHTS
): Promise<MatchScore> {
  const explanation: string[] = [];

  // Get user profiles
  const [student, alumnus] = await Promise.all([
    db.select().from(users).where(eq(users.id, studentId)).limit(1),
    db.select().from(users).where(eq(users.id, alumnusId)).limit(1),
  ]);

  if (!student[0] || !alumnus[0]) {
    throw new Error('User not found');
  }

  // Calculate interest match score
  const interestScore = await calculateInterestScore(studentId, alumnusId);
  if (interestScore.count > 0) {
    explanation.push(`You share ${interestScore.count} interests`);
  }

  // Calculate career path match score
  const careerPathScore = await calculateCareerPathScore(studentId, alumnusId);
  if (careerPathScore.level > 0) {
    explanation.push(
      `Your career paths align up to level ${
        careerPathScore.level
      } (${careerPathScore.paths.join(' > ')})`
    );
  }

  // Calculate mentorship match score
  const mentorshipScore = await calculateMentorshipScore(studentId, alumnusId);
  if (mentorshipScore.count > 0) {
    explanation.push(
      `Mentor offers guidance in ${mentorshipScore.count} areas you're interested in`
    );
  }

  // Calculate university involvement match score
  const universityScore = await calculateUniversityScore(studentId, alumnusId);
  if (universityScore.count > 0) {
    explanation.push(
      `You were both involved in ${universityScore.count} university groups`
    );
  }

  // Calculate location match score
  const locationScore =
    student[0].location &&
    alumnus[0].location &&
    student[0].location.toLowerCase() === alumnus[0].location.toLowerCase()
      ? 1
      : 0;
  if (locationScore > 0) {
    explanation.push('You are in the same location');
  }

  // Calculate weighted scores
  const subscores = {
    interests: interestScore.normalized * weights.interests,
    careerPath: careerPathScore.normalized * weights.careerPath,
    mentorship: mentorshipScore.normalized * weights.mentorship,
    universityInvolvement:
      universityScore.normalized * weights.universityInvolvement,
    location: locationScore * weights.location,
  };

  // Calculate total score
  const score = Object.values(subscores).reduce((sum, score) => sum + score, 0);

  return {
    userId: alumnusId,
    score,
    subscores,
    explanation,
  };
}

async function calculateInterestScore(studentId: string, alumnusId: string) {
  // Get shared interests
  const sharedInterests = await db
    .select()
    .from(userInterests)
    .where(
      and(
        eq(userInterests.userId, studentId),
        eq(userInterests.userId, alumnusId)
      )
    );

  const count = sharedInterests.length;
  const normalized = count / 10; // Normalize assuming max 10 shared interests

  return { count, normalized: Math.min(normalized, 1) };
}

async function calculateCareerPathScore(studentId: string, alumnusId: string) {
  // Get career paths for both users
  const [studentPaths, alumnusPaths] = await Promise.all([
    db
      .select()
      .from(userCareerPaths)
      .where(eq(userCareerPaths.userId, studentId)),
    db
      .select()
      .from(userCareerPaths)
      .where(eq(userCareerPaths.userId, alumnusId)),
  ]);

  let maxLevel = 0;
  const matchingPaths: string[] = [];

  // Compare paths and find the deepest match
  for (const studentPath of studentPaths) {
    for (const alumnusPath of alumnusPaths) {
      if (studentPath.careerPathId === alumnusPath.careerPathId) {
        const paths = await db
          .select()
          .from(careerPaths)
          .where(eq(careerPaths.id, studentPath.careerPathId))
          .limit(1);

        if (paths[0] && paths[0].level > maxLevel) {
          maxLevel = paths[0].level;
          matchingPaths.push(paths[0].name);
        }
      }
    }
  }

  return {
    level: maxLevel,
    paths: matchingPaths,
    normalized: maxLevel / 3, // Normalize assuming max 3 levels
  };
}

async function calculateMentorshipScore(studentId: string, alumnusId: string) {
  // Find overlap between student needs and alumni offerings
  const studentNeeds = await db
    .select()
    .from(mentorshipNeeds)
    .where(eq(mentorshipNeeds.userId, studentId));

  const alumnusOfferings = await db
    .select()
    .from(mentorshipOfferings)
    .where(eq(mentorshipOfferings.userId, alumnusId));

  const matches = studentNeeds.filter((need) =>
    alumnusOfferings.some((offering) => offering.areaId === need.areaId)
  );

  const count = matches.length;
  const normalized = count / 5; // Normalize assuming max 5 mentorship matches

  return { count, normalized: Math.min(normalized, 1) };
}

async function calculateUniversityScore(studentId: string, alumnusId: string) {
  // Find shared university groups
  const sharedGroups = await db
    .select()
    .from(userUniversityGroups)
    .where(
      and(
        eq(userUniversityGroups.userId, studentId),
        eq(userUniversityGroups.userId, alumnusId)
      )
    );

  const count = sharedGroups.length;
  const normalized = count / 3; // Normalize assuming max 3 shared groups

  return { count, normalized: Math.min(normalized, 1) };
}

export async function findMatches(
  studentId: string,
  limit: number = 10,
  weights: MatchWeights = DEFAULT_WEIGHTS
): Promise<MatchScore[]> {
  // Get all alumni (users with graduationYear in the past)
  const currentYear = new Date().getFullYear();
  const alumni = await db
    .select()
    .from(users)
    .where(
      and(eq(users.role, 'alumni'), lt(users.graduationYear, currentYear))
    );

  // Calculate match scores for each alumnus
  const scores = await Promise.all(
    alumni.map((alumnus) => calculateMatchScore(studentId, alumnus.id, weights))
  );

  // Sort by score and return top matches
  return scores.sort((a, b) => b.score - a.score).slice(0, limit);
}
