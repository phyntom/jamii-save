CREATE TYPE "jamii"."contribution_type" AS ENUM('standard_contribution', 'loan_payment', 'social_activities', 'emergency_fund', 'other');--> statement-breakpoint
CREATE TYPE "jamii"."payment_method" AS ENUM('bank_deposit', 'mobile_money', 'cash', 'credit_card', 'interac', 'paypal');--> statement-breakpoint
CREATE TYPE "jamii"."status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "jamii"."contribution" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"community_id" text NOT NULL,
	"reference_number" text NOT NULL,
	"contribution_type" "jamii"."contribution_type" DEFAULT 'standard_contribution',
	"contribution_amount" numeric(10, 2) NOT NULL,
	"payment_method" "jamii"."payment_method" DEFAULT 'cash',
	"currency" "jamii"."currency" DEFAULT 'CAD',
	"contribution_date" date NOT NULL,
	"contribution_period" text NOT NULL,
	"status" "jamii"."status" DEFAULT 'pending',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);