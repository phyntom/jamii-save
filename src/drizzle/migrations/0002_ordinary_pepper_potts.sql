CREATE TABLE "jamii"."community" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"visibility" "jamii"."visibility" DEFAULT 'private' NOT NULL,
	"contribution_frequency" text DEFAULT 'weekly' NOT NULL,
	"contribution_amount" numeric(10, 2) NOT NULL,
	"current_member_count" integer DEFAULT 0 NOT NULL,
	"additional_member_count" integer DEFAULT 0 NOT NULL,
	"contribution_day" integer DEFAULT 1 NOT NULL,
	"loan_interest_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"max_loan_amount" numeric(10, 2),
	"late_fee_amount" numeric(10, 2) DEFAULT '0' NOT NULL,
	"grace_period_days" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"admin_id" text NOT NULL,
	"max_members" integer DEFAULT 30 NOT NULL,
	"plan_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jamii"."community_loan_term" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"loans_enabled" boolean DEFAULT false NOT NULL,
	"max_loan_amount" numeric(10, 2),
	"interest_rate" numeric(5, 2) DEFAULT '0',
	"late_fee_amount" numeric(10, 2) DEFAULT '0',
	"grace_period_days" integer DEFAULT 0,
	"max_loan_duration_days" integer,
	"min_loan_amount" numeric(10, 2),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jamii"."invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"invitation_type" "jamii"."invitation_type" DEFAULT 'email' NOT NULL,
	"email" text,
	"code" text,
	"token" text NOT NULL,
	"invited_by" text NOT NULL,
	"uses_count" integer DEFAULT 0,
	"metadata" text,
	"status" "jamii"."invitation_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "invitation_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "jamii"."member" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "jamii"."member_role" DEFAULT 'member' NOT NULL,
	"status" "jamii"."member_status" DEFAULT 'active' NOT NULL,
	"invited_at" timestamp,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DROP TABLE "jamii"."communities" CASCADE;--> statement-breakpoint
DROP TABLE "jamii"."invitations" CASCADE;--> statement-breakpoint
DROP TABLE "jamii"."members" CASCADE;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD CONSTRAINT "community_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD CONSTRAINT "community_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."community_loan_term" ADD CONSTRAINT "community_loan_term_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitation" ADD CONSTRAINT "invitation_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitation" ADD CONSTRAINT "invitation_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."member" ADD CONSTRAINT "member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;