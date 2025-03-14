import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { db } from '@/db';
import {
  jobs,
  companies,
  companyAlumni,
  users,
  jobApplications,
} from '@/db/schema';
import { eq, and, or, sql, desc } from 'drizzle-orm';
import { getAuth } from '@clerk/nextjs/server';

const app = new Hono().basePath('/api/jobs');

// Get all jobs with filters
app.get('/', async (c) => {
  try {
    // Get query parameters
    const searchQuery = c.req.query('search');
    const industry = c.req.query('industry');
    const type = c.req.query('type');
    const location = c.req.query('location');
    const experienceLevel = c.req.query('experienceLevel');
    const hasAlumni = c.req.query('hasAlumni') === 'true';
    const minSalary = parseInt(c.req.query('minSalary') || '0');

    // Build where clause
    let whereClause = and(
      eq(jobs.status, 'active'),
      searchQuery
        ? or(
            sql`${jobs.title} ILIKE ${`%${searchQuery}%`}`,
            sql`${jobs.description} ILIKE ${`%${searchQuery}%`}`
          )
        : undefined,
      type ? eq(jobs.type, type) : undefined,
      location ? eq(jobs.location, location) : undefined,
      experienceLevel ? eq(jobs.experienceLevel, experienceLevel) : undefined,
      minSalary ? sql`${jobs.salaryMin} >= ${minSalary}` : undefined
    );

    // Get jobs with company and alumni info
    const jobListings = await db.query.jobs.findMany({
      where: whereClause,
      with: {
        company: {
          columns: {
            id: true,
            name: true,
            industry: true,
            logo: true,
          },
          with: {
            alumni: {
              where: eq(companyAlumni.showAsConnection, true),
              with: {
                user: {
                  columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    currentRole: true,
                  },
                },
              },
            },
          },
        },
        poster: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
      orderBy: [desc(jobs.createdAt)],
    });

    // Filter by industry if specified
    const filteredJobs = industry
      ? jobListings.filter((job) => job.company.industry === industry)
      : jobListings;

    // Filter by alumni presence if specified
    const finalJobs = hasAlumni
      ? filteredJobs.filter((job) => job.company.alumni.length > 0)
      : filteredJobs;

    // Get unique industries for filters
    const industries = await db.query.companies.findMany({
      columns: {
        industry: true,
      },
      where: sql`${companies.industry} IS NOT NULL`,
    });

    const uniqueIndustries = [...new Set(industries.map((c) => c.industry))];

    // Format response
    const response = {
      jobs: finalJobs.map((job) => ({
        id: job.id,
        title: job.title,
        company: job.company.name,
        companyLogo: job.company.logo,
        location: job.location,
        type: job.type,
        isRemote: job.isRemote,
        salaryRange:
          job.salaryMin && job.salaryMax
            ? `$${job.salaryMin / 1000}k - $${job.salaryMax / 1000}k`
            : null,
        experienceLevel: job.experienceLevel,
        postedBy: {
          name: `${job.poster.firstName} ${job.poster.lastName}`,
          image: job.poster.profileImage,
        },
        alumni: job.company.alumni.map((a) => ({
          id: a.user.id,
          name: `${a.user.firstName} ${a.user.lastName}`,
          role: a.user.currentRole,
          image: a.user.profileImage,
        })),
        createdAt: job.createdAt,
      })),
      filters: {
        industries: uniqueIndustries,
        types: ['full-time', 'part-time', 'internship', 'contract'],
        experienceLevels: ['entry', 'mid', 'senior', 'lead'],
      },
      total: finalJobs.length,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error in jobs API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Get job by ID with company and alumni details
app.get('/:id', async (c) => {
  try {
    const jobId = c.req.param('id');
    const job = await db.query.jobs.findFirst({
      where: eq(jobs.id, jobId),
      with: {
        company: {
          with: {
            alumni: {
              where: eq(companyAlumni.showAsConnection, true),
              with: {
                user: {
                  columns: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    profileImage: true,
                    currentRole: true,
                    company: true,
                  },
                },
              },
            },
          },
        },
        poster: {
          columns: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
            currentRole: true,
          },
        },
      },
    });

    if (!job) {
      return c.json({ error: 'Job not found' }, 404);
    }

    return c.json({
      id: job.id,
      title: job.title,
      description: job.description,
      company: {
        id: job.company.id,
        name: job.company.name,
        description: job.company.description,
        industry: job.company.industry,
        website: job.company.website,
        logo: job.company.logo,
        size: job.company.size,
      },
      location: job.location,
      type: job.type,
      isRemote: job.isRemote,
      experienceLevel: job.experienceLevel,
      salary: {
        min: job.salaryMin,
        max: job.salaryMax,
      },
      requirements: job.requirements,
      responsibilities: job.responsibilities,
      postedBy: {
        id: job.poster.id,
        name: `${job.poster.firstName} ${job.poster.lastName}`,
        role: job.poster.currentRole,
        image: job.poster.profileImage,
      },
      alumni: job.company.alumni.map((a) => ({
        id: a.user.id,
        name: `${a.user.firstName} ${a.user.lastName}`,
        role: a.user.currentRole,
        company: a.user.company,
        image: a.user.profileImage,
      })),
      applicationDeadline: job.applicationDeadline,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    });
  } catch (error) {
    console.error('Error in job details API:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Create a new job posting (alumni only)
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const {
      title,
      description,
      companyId,
      type,
      location,
      isRemote,
      experienceLevel,
      salaryMin,
      salaryMax,
      requirements,
      responsibilities,
      applicationDeadline,
    } = body;

    // Validate required fields
    if (!title || !description || !companyId) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    // Create job posting
    const [job] = await db
      .insert(jobs)
      .values({
        id: `job_${Date.now()}`,
        title,
        description,
        companyId,
        posterId: 'alumni_1',
        type,
        location,
        isRemote,
        experienceLevel,
        salaryMin,
        salaryMax,
        requirements,
        responsibilities,
        applicationDeadline: applicationDeadline
          ? new Date(applicationDeadline)
          : null,
      })
      .returning();

    return c.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Apply for a job
app.post('/:id/apply', async (c) => {
  try {
    const userId = 'student_1';

    const jobId = c.req.param('id');
    const { coverLetter, resume, referrerId } = await c.req.json();

    // Check if user is a student
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user || user.role !== 'student') {
      return c.json({ error: 'Only students can apply for jobs' }, 403);
    }

    // Check if job exists and is active
    const job = await db.query.jobs.findFirst({
      where: and(eq(jobs.id, jobId), eq(jobs.status, 'active')),
    });

    if (!job) {
      return c.json({ error: 'Job not found or inactive' }, 404);
    }

    // Check if already applied
    const existingApplication = await db.query.jobApplications.findFirst({
      where: and(
        eq(jobApplications.jobId, jobId),
        eq(jobApplications.applicantId, userId)
      ),
    });

    if (existingApplication) {
      return c.json({ error: 'Already applied to this job' }, 400);
    }

    // Create application
    const [application] = await db
      .insert(jobApplications)
      .values({
        id: `app_${Date.now()}`,
        jobId,
        applicantId: userId,
        coverLetter,
        resume,
        referrerId,
      })
      .returning();

    return c.json(application);
  } catch (error) {
    console.error('Error applying for job:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

export const GET = handle(app);
export const POST = handle(app);
