CREATE TABLE "career_paths" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"parent_id" text,
	"level" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "interests" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(100),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "interests_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "mentorship_areas" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mentorship_areas_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "mentorship_needs" (
	"user_id" text NOT NULL,
	"area_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mentorship_needs_user_id_area_id_pk" PRIMARY KEY("user_id","area_id")
);
--> statement-breakpoint
CREATE TABLE "mentorship_offerings" (
	"user_id" text NOT NULL,
	"area_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "mentorship_offerings_user_id_area_id_pk" PRIMARY KEY("user_id","area_id")
);
--> statement-breakpoint
CREATE TABLE "university_groups" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "university_groups_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "user_career_paths" (
	"user_id" text NOT NULL,
	"career_path_id" text NOT NULL,
	"is_target" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_career_paths_user_id_career_path_id_pk" PRIMARY KEY("user_id","career_path_id")
);
--> statement-breakpoint
CREATE TABLE "user_interests" (
	"user_id" text NOT NULL,
	"interest_id" text NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_interests_user_id_interest_id_pk" PRIMARY KEY("user_id","interest_id")
);
--> statement-breakpoint
CREATE TABLE "user_university_groups" (
	"user_id" text NOT NULL,
	"group_id" text NOT NULL,
	"role" varchar(100),
	"start_year" integer,
	"end_year" integer,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "user_university_groups_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"first_name" varchar(255),
	"last_name" varchar(255),
	"profile_image" text,
	"role" varchar(50) DEFAULT 'user',
	"graduation_year" integer,
	"major" varchar(255),
	"current_role" varchar(255),
	"company" varchar(255),
	"location" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "career_paths" ADD CONSTRAINT "career_paths_parent_id_career_paths_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."career_paths"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_needs" ADD CONSTRAINT "mentorship_needs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_needs" ADD CONSTRAINT "mentorship_needs_area_id_mentorship_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."mentorship_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_offerings" ADD CONSTRAINT "mentorship_offerings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mentorship_offerings" ADD CONSTRAINT "mentorship_offerings_area_id_mentorship_areas_id_fk" FOREIGN KEY ("area_id") REFERENCES "public"."mentorship_areas"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_paths" ADD CONSTRAINT "user_career_paths_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_career_paths" ADD CONSTRAINT "user_career_paths_career_path_id_career_paths_id_fk" FOREIGN KEY ("career_path_id") REFERENCES "public"."career_paths"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_interests" ADD CONSTRAINT "user_interests_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_university_groups" ADD CONSTRAINT "user_university_groups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_university_groups" ADD CONSTRAINT "user_university_groups_group_id_university_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."university_groups"("id") ON DELETE cascade ON UPDATE no action;