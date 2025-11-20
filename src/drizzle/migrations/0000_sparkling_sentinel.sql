CREATE SCHEMA IF NOT EXISTS "jamii";
--> statement-breakpoint
CREATE TYPE "jamii"."country" AS ENUM('CANADA', 'UNITED_STATES', 'UNITED_KINGDOM', 'EUROZONE', 'KENYA', 'NIGERIA', 'SOUTH_AFRICA', 'GHANA', 'TANZANIA', 'UGANDA', 'RWANDA');--> statement-breakpoint
CREATE TYPE "jamii"."currency" AS ENUM('CAD', 'USD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS', 'TZS', 'UGX', 'RWF');--> statement-breakpoint
CREATE TYPE "jamii"."visibility" AS ENUM('public', 'private', 'unlisted');--> statement-breakpoint
CREATE TYPE "jamii"."role" AS ENUM('member', 'admin', 'owner');--> statement-breakpoint
CREATE TYPE "jamii"."subscription_billing_cycle" AS ENUM('monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "jamii"."subscription_status" AS ENUM('active', 'canceled', 'past_due', 'trial');--> statement-breakpoint
CREATE TABLE "jamii"."account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jamii"."session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "jamii"."user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "jamii"."verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
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
CREATE TABLE "jamii"."community" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"slug" text NOT NULL,
	"logo" text,
	"created_at" timestamp NOT NULL,
	"metadata" text,
	"visibility" "jamii"."visibility" DEFAULT 'private' NOT NULL,
	"contribution_frequency" text DEFAULT 'monthly' NOT NULL,
	"country" "jamii"."country" DEFAULT 'CANADA' NOT NULL,
	"currency" "jamii"."currency" DEFAULT 'CAD' NOT NULL,
	"contribution_amount" numeric(10, 2) NOT NULL,
	"current_member_count" integer DEFAULT 0 NOT NULL,
	"additional_member_count" integer DEFAULT 0 NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"admin_email" text NOT NULL,
	"max_members" integer DEFAULT 30 NOT NULL,
	"plan_type" integer NOT NULL,
	"contribution_start_date" timestamp,
	"community_start_date" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "community_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "jamii"."invitation" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"email" text NOT NULL,
	"role" "jamii"."role",
	"status" text DEFAULT 'pending' NOT NULL,
	"expires_at" timestamp NOT NULL,
	"inviter_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jamii"."member" (
	"id" text PRIMARY KEY NOT NULL,
	"community_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "jamii"."role" DEFAULT 'member' NOT NULL,
	"created_at" timestamp NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"updated_at" timestamp,
	"metadata" text
);
--> statement-breakpoint
CREATE TABLE "jamii"."plan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jamii"."plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"max_communities" integer NOT NULL,
	"base_members_per_community" integer NOT NULL,
	"max_members_per_community" integer NOT NULL,
	"additional_member_price" numeric(10, 2),
	"additional_member_batch_size" integer,
	"features" jsonb,
	"stripe_price_id_monthly" text,
	"stripe_price_id_yearly" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "plan_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "jamii"."subscription_type" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jamii"."subscription_type_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"multiplier" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "jamii"."subscription" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jamii"."subscription_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" text NOT NULL,
	"plan_id" integer NOT NULL,
	"stripe_subscription_id" text,
	"status" text DEFAULT 'active' NOT NULL,
	"subscription_type_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"current_period_start" timestamp NOT NULL,
	"current_period_end" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jamii"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."community_loan_term" ADD CONSTRAINT "community_loan_term_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD CONSTRAINT "community_plan_type_plan_id_fk" FOREIGN KEY ("plan_type") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitation" ADD CONSTRAINT "invitation_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitation" ADD CONSTRAINT "invitation_inviter_id_user_id_fk" FOREIGN KEY ("inviter_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."member" ADD CONSTRAINT "member_community_id_community_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."community"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."member" ADD CONSTRAINT "member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_subscription_type_id_subscription_type_id_fk" FOREIGN KEY ("subscription_type_id") REFERENCES "jamii"."subscription_type"("id") ON DELETE cascade ON UPDATE no action;