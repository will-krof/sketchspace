CREATE TABLE `wireframes` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`document` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `wireframes_user_updated_idx` ON `wireframes` (`user_id`,`updated_at`);