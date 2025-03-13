import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
  boolean,
  type PgTableWithColumns,
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

// Define types
export type User = InferModel<typeof users>;
export type Interest = InferModel<typeof interests>;
export type CareerPath = InferModel<typeof careerPaths>;
export type MentorshipArea = InferModel<typeof mentorshipAreas>;
export type UniversityGroup = InferModel<typeof universityGroups>;

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
