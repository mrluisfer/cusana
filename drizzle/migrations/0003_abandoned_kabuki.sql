CREATE TYPE "public"."subscription_event_type" AS ENUM('created', 'updated', 'deleted', 'price_changed', 'cycle_changed', 'reactivated');--> statement-breakpoint
CREATE TABLE "subscription_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text,
	"event_type" "subscription_event_type" NOT NULL,
	"snapshot" jsonb NOT NULL,
	"changes" jsonb,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_events" ADD CONSTRAINT "subscription_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "sub_events_user_idx" ON "subscription_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sub_events_subscription_idx" ON "subscription_events" USING btree ("subscription_id");--> statement-breakpoint
CREATE INDEX "sub_events_type_idx" ON "subscription_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX "sub_events_created_idx" ON "subscription_events" USING btree ("created_at");