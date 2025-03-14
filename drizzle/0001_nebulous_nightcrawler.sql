CREATE TABLE "interest_group_post_likes" (
	"post_id" uuid NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "interest_group_post_likes_post_id_user_id_pk" PRIMARY KEY("post_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "interest_group_posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"interest_id" text NOT NULL,
	"user_id" text NOT NULL,
	"content" text NOT NULL,
	"parent_id" uuid,
	"likes" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "organizer_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "interest_group_post_likes" ADD CONSTRAINT "interest_group_post_likes_post_id_interest_group_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."interest_group_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interest_group_post_likes" ADD CONSTRAINT "interest_group_post_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interest_group_posts" ADD CONSTRAINT "interest_group_posts_interest_id_interests_id_fk" FOREIGN KEY ("interest_id") REFERENCES "public"."interests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interest_group_posts" ADD CONSTRAINT "interest_group_posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "interest_group_posts" ADD CONSTRAINT "interest_group_posts_parent_id_interest_group_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."interest_group_posts"("id") ON DELETE no action ON UPDATE no action;