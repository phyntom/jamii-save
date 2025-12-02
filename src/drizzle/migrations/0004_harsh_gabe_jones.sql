CREATE TYPE "jamii"."currency" AS ENUM('USD', 'CAD', 'EUR', 'GBP', 'KES', 'NGN', 'ZAR', 'GHS', 'TZS', 'UGX', 'RWF');--> statement-breakpoint
ALTER TABLE "jamii"."community" DROP CONSTRAINT "community_plan_id_plan_id_fk";
--> statement-breakpoint
ALTER TABLE "jamii"."community" ALTER COLUMN "contribution_frequency" SET DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "currency" "jamii"."currency" DEFAULT 'CAD' NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "admin_email" text NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "plan_type" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "logo_url" text;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "contribution_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD COLUMN "community_start_date" timestamp;--> statement-breakpoint
ALTER TABLE "jamii"."community" ADD CONSTRAINT "community_plan_type_plan_id_fk" FOREIGN KEY ("plan_type") REFERENCES "jamii"."plan"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jamii"."community" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "jamii"."community" DROP COLUMN "contribution_day";--> statement-breakpoint
ALTER TABLE "jamii"."community" DROP COLUMN "plan_id";