CREATE TYPE "public"."payment_source" AS ENUM('auto', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('paid', 'unpaid');--> statement-breakpoint
CREATE TABLE "subscription_payments" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"subscription_id" text NOT NULL,
	"due_date" date NOT NULL,
	"status" "payment_status" NOT NULL,
	"source" "payment_source" NOT NULL,
	"paid_on" date,
	"amount" numeric(10, 2) NOT NULL,
	"currency" "currency" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "sub_payments_subscription_due_idx" ON "subscription_payments" USING btree ("subscription_id","due_date");--> statement-breakpoint
CREATE INDEX "sub_payments_user_due_idx" ON "subscription_payments" USING btree ("user_id","due_date");