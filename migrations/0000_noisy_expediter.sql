CREATE TYPE "public"."role" AS ENUM('super_admin', 'admin', 'manager', 'user');
CREATE TABLE "refresh_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"token" text NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" timestamp NOT NULL,
	"is_revoked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "refresh_tokens_token_unique" UNIQUE("token")
);

CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(128) NOT NULL,
	"email" varchar(128) NOT NULL,
	"role" "role" DEFAULT 'user' NOT NULL,
	"password" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;