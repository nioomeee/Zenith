import {
  pgTable,
  text,
  timestamp,
  varchar,
  integer,
  primaryKey,
  boolean,
} from 'drizzle-orm/pg-core';

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
