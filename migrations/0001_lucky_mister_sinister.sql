CREATE TABLE "renter_profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" integer NOT NULL,
	"type" text NOT NULL,
	"name" varchar(255) NOT NULL,
	"contact_phone" varchar(20) NOT NULL,
	"email" varchar(255) NOT NULL,
	"tax_id" varchar(13),
	"description" text,
	"created_at" timestamp with time zone DEFAULT now()
);

ALTER TABLE "renter_profiles" ADD CONSTRAINT "renter_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;