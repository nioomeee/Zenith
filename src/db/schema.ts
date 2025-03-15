import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
  boolean,
  type PgTableWithColumns,
  jsonb,
  uuid,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations, type InferModel, type RelationConfig } from 'drizzle-orm';

export const users = pgTable('users', {
  id: text('id').primaryKey(), // Clerk user ID
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: varchar('first_name', { length: 255 }),
  lastName: varchar('last_name', { length: 255 }),
  profileImage: text('profile_image'),
  role: varchar('role', { length: 50 }).default('user'),
  graduationYear: integer('graduation_year'),
  major: varchar('major', { length: 255 }),
  currentRole: varchar('current_role', { length: 255 }),
  company: varchar('company', { length: 255 }),
  location: varchar('location', { length: 255 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Predefined interests that users can choose from
export const interests = pgTable('interests', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  category: varchar('category', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for user interests
export const userInterests = pgTable(
  'user_interests',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    interestId: text('interest_id')
      .notNull()
      .references(() => interests.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.interestId] }),
  })
);

// Career paths (hierarchical structure)
export const careerPaths = pgTable('career_paths', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  parentId: text('parent_id').references((): any => careerPaths.id),
  level: integer('level').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for user career paths
export const userCareerPaths = pgTable(
  'user_career_paths',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    careerPathId: text('career_path_id')
      .notNull()
      .references(() => careerPaths.id, { onDelete: 'cascade' }),
    isTarget: boolean('is_target').default(false), // true for career goals, false for current path
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.careerPathId] }),
  })
);

// Mentorship areas
export const mentorshipAreas = pgTable('mentorship_areas', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for mentorship offerings (alumni)
export const mentorshipOfferings = pgTable(
  'mentorship_offerings',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    areaId: text('area_id')
      .notNull()
      .references(() => mentorshipAreas.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.areaId] }),
  })
);

// Junction table for mentorship needs (students)
export const mentorshipNeeds = pgTable(
  'mentorship_needs',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    areaId: text('area_id')
      .notNull()
      .references(() => mentorshipAreas.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.areaId] }),
  })
);

// University involvement (clubs, societies)
export const universityGroups = pgTable('university_groups', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull().unique(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Junction table for user university involvement
export const userUniversityGroups = pgTable(
  'user_university_groups',
  {
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    groupId: text('group_id')
      .notNull()
      .references(() => universityGroups.id, { onDelete: 'cascade' }),
    role: varchar('role', { length: 100 }), // e.g., "member", "leader"
    startYear: integer('start_year'),
    endYear: integer('end_year'),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.userId, table.groupId] }),
  })
);

// Companies table
export const companies = pgTable('companies', {
  id: text('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  industry: varchar('industry', { length: 100 }),
  website: text('website'),
  logo: text('logo'),
  size: varchar('size', { length: 50 }), // e.g., "1-10", "11-50", "51-200", etc.
  founded: integer('founded'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Jobs table
export const jobs = pgTable('jobs', {
  id: text('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  companyId: text('company_id')
    .notNull()
    .references(() => companies.id, { onDelete: 'cascade' }),
  posterId: text('poster_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }), // Alumni who posted the job
  type: varchar('type', { length: 50 }), // "full-time", "part-time", "internship", etc.
  location: varchar('location', { length: 255 }),
  isRemote: boolean('is_remote').default(false),
  experienceLevel: varchar('experience_level', { length: 50 }), // "entry", "mid", "senior", etc.
  salaryMin: integer('salary_min'),
  salaryMax: integer('salary_max'),
  requirements: jsonb('requirements').default([]), // Array of requirements
  responsibilities: jsonb('responsibilities').default([]), // Array of responsibilities
  status: varchar('status', { length: 50 }).default('active'), // "active", "filled", "expired", etc.
  applicationDeadline: timestamp('application_deadline'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Job applications table
export const jobApplications = pgTable('job_applications', {
  id: text('id').primaryKey(),
  jobId: text('job_id')
    .notNull()
    .references(() => jobs.id, { onDelete: 'cascade' }),
  applicantId: text('applicant_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  status: varchar('status', { length: 50 }).default('pending'), // "pending", "reviewed", "interviewed", "accepted", "rejected"
  coverLetter: text('cover_letter'),
  resume: text('resume'),
  referrerId: text('referrer_id').references(() => users.id), // Alumni who referred the applicant
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Company alumni table (to track alumni at each company)
export const companyAlumni = pgTable(
  'company_alumni',
  {
    companyId: text('company_id')
      .notNull()
      .references(() => companies.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    position: varchar('position', { length: 255 }),
    startDate: timestamp('start_date'),
    endDate: timestamp('end_date'),
    isCurrent: boolean('is_current').default(true),
    showAsConnection: boolean('show_as_connection').default(true), // Privacy control
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.companyId, table.userId] }),
  })
);

// Interest group discussions
export const interestGroupPosts = pgTable('interest_group_posts', {
  id: uuid('id').primaryKey().defaultRandom(),
  interestId: text('interest_id')
    .notNull()
    .references(() => interests.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  parentId: uuid('parent_id').references((): any => interestGroupPosts.id),
  likes: integer('likes').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Interest group post likes
export const interestGroupPostLikes = pgTable(
  'interest_group_post_likes',
  {
    postId: uuid('post_id')
      .notNull()
      .references(() => interestGroupPosts.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.postId, table.userId] }),
  })
);

// Events table
export const events = pgTable('events', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  date: timestamp('date').notNull(),
  location: text('location').notNull(),
  isVirtual: boolean('is_virtual').default(false),
  virtualLink: text('virtual_link'),
  maxAttendees: integer('max_attendees'),
  organizerId: text('organizer_id')
    .references(() => users.id)
    .notNull(),
  image: text('image'),
  category: text('category').notNull(), // e.g., 'networking', 'workshop', 'seminar'
  status: text('status').notNull().default('upcoming'), // 'upcoming', 'ongoing', 'completed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Event RSVPs table
export const eventRsvps = pgTable(
  'event_rsvps',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    eventId: uuid('event_id')
      .references(() => events.id)
      .notNull(),
    userId: text('user_id')
      .references(() => users.id)
      .notNull(),
    status: text('status').notNull(), // 'attending', 'maybe', 'not_attending'
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => {
    return {
      eventUserUnique: uniqueIndex('event_user_unique').on(
        table.eventId,
        table.userId
      ),
    };
  }
);

// Flash mentoring requests table
export const flashMentoringRequests = pgTable('flash_mentoring_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  studentId: text('student_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  areaId: text('area_id')
    .notNull()
    .references(() => mentorshipAreas.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  duration: integer('duration').notNull(),
  preferredTime: text('preferred_time'),
  status: text('status').notNull().default('pending'),
  mentorId: text('mentor_id').references(() => users.id),
  scheduledFor: timestamp('scheduled_for'),
  meetingLink: text('meeting_link'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Define types
export type User = InferModel<typeof users>;
export type Interest = InferModel<typeof interests>;
export type CareerPath = InferModel<typeof careerPaths>;
export type MentorshipArea = InferModel<typeof mentorshipAreas>;
export type UniversityGroup = InferModel<typeof universityGroups>;
export type Company = InferModel<typeof companies>;
export type Job = InferModel<typeof jobs>;
export type JobApplication = InferModel<typeof jobApplications>;
export type CompanyAlumni = InferModel<typeof companyAlumni>;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type EventRsvp = typeof eventRsvps.$inferSelect;
export type NewEventRsvp = typeof eventRsvps.$inferInsert;
export type InterestGroupPost = typeof interestGroupPosts.$inferSelect;
export type NewInterestGroupPost = typeof interestGroupPosts.$inferInsert;
export type InterestGroupPostLike = typeof interestGroupPostLikes.$inferSelect;
export type NewInterestGroupPostLike =
  typeof interestGroupPostLikes.$inferInsert;
export type FlashMentoringRequest = typeof flashMentoringRequests.$inferSelect;
export type NewFlashMentoringRequest =
  typeof flashMentoringRequests.$inferInsert;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  interests: many(userInterests, {
    fields: [users.id],
    references: [userInterests.userId],
  }),
  careerPaths: many(userCareerPaths, {
    fields: [users.id],
    references: [userCareerPaths.userId],
  }),
  mentorshipOfferings: many(mentorshipOfferings, {
    fields: [users.id],
    references: [mentorshipOfferings.userId],
  }),
  mentorshipNeeds: many(mentorshipNeeds, {
    fields: [users.id],
    references: [mentorshipNeeds.userId],
  }),
  universityGroups: many(userUniversityGroups, {
    fields: [users.id],
    references: [userUniversityGroups.userId],
  }),
}));

export const interestsRelations = relations(interests, ({ many }) => ({
  users: many(userInterests, {
    fields: [interests.id],
    references: [userInterests.interestId],
  }),
}));

export const careerPathsRelations = relations(careerPaths, ({ many, one }) => ({
  users: many(userCareerPaths, {
    fields: [careerPaths.id],
    references: [userCareerPaths.careerPathId],
  }),
  parent: one(careerPaths, {
    fields: [careerPaths.parentId],
    references: [careerPaths.id],
  }),
}));

export const mentorshipAreasRelations = relations(
  mentorshipAreas,
  ({ many }) => ({
    offerings: many(mentorshipOfferings, {
      fields: [mentorshipAreas.id],
      references: [mentorshipOfferings.areaId],
    }),
    needs: many(mentorshipNeeds, {
      fields: [mentorshipAreas.id],
      references: [mentorshipNeeds.areaId],
    }),
  })
);

export const universityGroupsRelations = relations(
  universityGroups,
  ({ many }) => ({
    users: many(userUniversityGroups, {
      fields: [universityGroups.id],
      references: [userUniversityGroups.groupId],
    }),
  })
);

export const userInterestsRelations = relations(userInterests, ({ one }) => ({
  user: one(users, {
    fields: [userInterests.userId],
    references: [users.id],
  }),
  interest: one(interests, {
    fields: [userInterests.interestId],
    references: [interests.id],
  }),
}));

export const userCareerPathsRelations = relations(
  userCareerPaths,
  ({ one }) => ({
    user: one(users, {
      fields: [userCareerPaths.userId],
      references: [users.id],
    }),
    careerPath: one(careerPaths, {
      fields: [userCareerPaths.careerPathId],
      references: [careerPaths.id],
    }),
  })
);

export const mentorshipOfferingsRelations = relations(
  mentorshipOfferings,
  ({ one }) => ({
    user: one(users, {
      fields: [mentorshipOfferings.userId],
      references: [users.id],
    }),
    area: one(mentorshipAreas, {
      fields: [mentorshipOfferings.areaId],
      references: [mentorshipAreas.id],
    }),
  })
);

export const mentorshipNeedsRelations = relations(
  mentorshipNeeds,
  ({ one }) => ({
    user: one(users, {
      fields: [mentorshipNeeds.userId],
      references: [users.id],
    }),
    area: one(mentorshipAreas, {
      fields: [mentorshipNeeds.areaId],
      references: [mentorshipAreas.id],
    }),
  })
);

export const userUniversityGroupsRelations = relations(
  userUniversityGroups,
  ({ one }) => ({
    user: one(users, {
      fields: [userUniversityGroups.userId],
      references: [users.id],
    }),
    group: one(universityGroups, {
      fields: [userUniversityGroups.groupId],
      references: [universityGroups.id],
    }),
  })
);

export const companiesRelations = relations(companies, ({ many }) => ({
  jobs: many(jobs),
  alumni: many(companyAlumni),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  company: one(companies, {
    fields: [jobs.companyId],
    references: [companies.id],
  }),
  poster: one(users, {
    fields: [jobs.posterId],
    references: [users.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(
  jobApplications,
  ({ one }) => ({
    job: one(jobs, {
      fields: [jobApplications.jobId],
      references: [jobs.id],
    }),
    applicant: one(users, {
      fields: [jobApplications.applicantId],
      references: [users.id],
    }),
    referrer: one(users, {
      fields: [jobApplications.referrerId],
      references: [users.id],
    }),
  })
);

export const companyAlumniRelations = relations(companyAlumni, ({ one }) => ({
  company: one(companies, {
    fields: [companyAlumni.companyId],
    references: [companies.id],
  }),
  user: one(users, {
    fields: [companyAlumni.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  rsvps: many(eventRsvps),
}));

export const eventRsvpsRelations = relations(eventRsvps, ({ one }) => ({
  event: one(events, {
    fields: [eventRsvps.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [eventRsvps.userId],
    references: [users.id],
  }),
}));

export const interestGroupPostsRelations = relations(
  interestGroupPosts,
  ({ one, many }) => ({
    interest: one(interests, {
      fields: [interestGroupPosts.interestId],
      references: [interests.id],
    }),
    user: one(users, {
      fields: [interestGroupPosts.userId],
      references: [users.id],
    }),
    parent: one(interestGroupPosts, {
      fields: [interestGroupPosts.parentId],
      references: [interestGroupPosts.id],
    }),
    replies: many(interestGroupPosts, {
      fields: [interestGroupPosts.id],
      references: [interestGroupPosts.parentId],
    }),
    likes: many(interestGroupPostLikes),
  })
);

export const interestGroupPostLikesRelations = relations(
  interestGroupPostLikes,
  ({ one }) => ({
    post: one(interestGroupPosts, {
      fields: [interestGroupPostLikes.postId],
      references: [interestGroupPosts.id],
    }),
    user: one(users, {
      fields: [interestGroupPostLikes.userId],
      references: [users.id],
    }),
  })
);

export const flashMentoringRequestsRelations = relations(
  flashMentoringRequests,
  ({ one }) => ({
    student: one(users, {
      fields: [flashMentoringRequests.studentId],
      references: [users.id],
    }),
    mentor: one(users, {
      fields: [flashMentoringRequests.mentorId],
      references: [users.id],
    }),
    area: one(mentorshipAreas, {
      fields: [flashMentoringRequests.areaId],
      references: [mentorshipAreas.id],
    }),
  })
);
