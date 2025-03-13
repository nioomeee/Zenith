import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';

const app = new Hono().basePath('/api/courses');

// Get all unique courses (majors)
app.get('/', async (c) => {
  try {
    const courses = await db.query.users.findMany({
      columns: {
        major: true,
      },
      where: sql`${users.major} IS NOT NULL`,
    });

    // Get unique majors
    const uniqueMajors = [
      ...new Set(courses.map((course) => course.major)),
    ].filter(Boolean);

    return c.json({ courses: uniqueMajors });
  } catch (error) {
    console.error('Error fetching courses:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get students by course and year
app.get('/:course/students', async (c) => {
  try {
    const course = decodeURIComponent(c.req.param('course'));
    const year = c.req.query('year');

    const query = {
      where: and(
        eq(users.major, course),
        year ? eq(users.graduationYear, parseInt(year)) : undefined
      ),
      orderBy: [users.firstName, users.lastName],
    };

    const students = await db.query.users.findMany({
      ...query,
      columns: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profileImage: true,
        graduationYear: true,
        major: true,
        location: true,
      },
      with: {
        interests: {
          columns: {},
          with: {
            interest: true,
          },
        },
        universityGroups: {
          columns: {},
          with: {
            group: true,
          },
        },
      },
    });

    // Get all graduation years for the course
    const years = await db.query.users.findMany({
      columns: {
        graduationYear: true,
      },
      where: eq(users.major, course),
      orderBy: users.graduationYear,
    });

    const uniqueYears = [...new Set(years.map((y) => y.graduationYear))].filter(
      Boolean
    );

    return c.json({
      students,
      years: uniqueYears,
      totalCount: students.length,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
