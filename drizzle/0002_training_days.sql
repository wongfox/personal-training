ALTER TABLE "xp_transactions" ADD COLUMN "counts_as_training" boolean DEFAULT true NOT NULL;--> statement-breakpoint
UPDATE "xp_transactions" SET "counts_as_training" = false WHERE "reason" IN ('onboarding_completed', 'achievement_earned', 'weekly_review_completed', 'checkpoint_completed', 'review_completed', 'reflection_completed');
