ALTER TABLE "jamii"."communities" ADD COLUMN "current_member_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."communities" ADD COLUMN "additional_member_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."plan" ADD COLUMN "max_communities" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."plan" ADD COLUMN "base_members_per_community" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."plan" ADD COLUMN "max_members_per_community" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "jamii"."plan" ADD COLUMN "additional_member_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "jamii"."plan" ADD COLUMN "additional_member_batch_size" integer;--> statement-breakpoint
ALTER TABLE "jamii"."plan" DROP COLUMN "max_groups";--> statement-breakpoint
ALTER TABLE "jamii"."plan" DROP COLUMN "max_members_per_group";