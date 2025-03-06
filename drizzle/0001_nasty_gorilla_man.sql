CREATE TYPE "public"."contact_type" AS ENUM('phone', 'email', 'whatsapp', 'telegram');--> statement-breakpoint
CREATE TABLE "rental-point-contacts" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rental-point-contacts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"rental_point_id" integer NOT NULL,
	"contact_type" "contact_type" NOT NULL,
	"value" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rental_points" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rental_points_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"lat" numeric,
	"lng" numeric,
	"phone" varchar(20),
	"website" varchar(255),
	"description" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "rental-point-contacts" ADD CONSTRAINT "rental-point-contacts_rental_point_id_rental_points_id_fk" FOREIGN KEY ("rental_point_id") REFERENCES "public"."rental_points"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rental_points" ADD CONSTRAINT "rental_points_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;