CREATE SCHEMA IF NOT EXISTS "jamii";
--> statement-breakpoint
CREATE TYPE "jamii"."visibility" AS ENUM('public', 'private', 'unlisted');--> statement-breakpoint
CREATE TYPE "jamii"."invitation_status" AS ENUM('pending', 'declined', 'accepted');--> statement-breakpoint
CREATE TYPE "jamii"."invitation_type" AS ENUM('email', 'link', 'code');--> statement-breakpoint
CREATE TYPE "jamii"."member_role" AS ENUM('super_admin', 'admin', 'member');--> statement-breakpoint
CREATE TYPE "jamii"."member_status" AS ENUM('active', 'pending', 'removed');--> statement-breakpoint
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
CREATE TABLE "jamii"."communities" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"category" text,
	"visibility" "jamii"."visibility" DEFAULT 'private' NOT NULL,
	"contribution_frequency" text DEFAULT 'weekly' NOT NULL,
	"contribution_amount" numeric(10, 2) NOT NULL,
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
CREATE TABLE "jamii"."invitations" (
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
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "jamii"."members" (
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
CREATE TABLE "jamii"."plan" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "jamii"."plan_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text,
	"price" numeric(10, 2) NOT NULL,
	"max_groups" integer NOT NULL,
	"max_members_per_group" integer NOT NULL,
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
ALTER TABLE "jamii"."communities" ADD CONSTRAINT "communities_admin_id_user_id_fk" FOREIGN KEY ("admin_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."communities" ADD CONSTRAINT "communities_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitations" ADD CONSTRAINT "invitations_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."invitations" ADD CONSTRAINT "invitations_invited_by_user_id_fk" FOREIGN KEY ("invited_by") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."members" ADD CONSTRAINT "members_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "jamii"."communities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."members" ADD CONSTRAINT "members_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "jamii"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_plan_id_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."subscription" ADD CONSTRAINT "subscription_subscription_type_id_subscription_type_id_fk" FOREIGN KEY ("subscription_type_id") REFERENCES "jamii"."subscription_type"("id") ON DELETE cascade ON UPDATE no action;