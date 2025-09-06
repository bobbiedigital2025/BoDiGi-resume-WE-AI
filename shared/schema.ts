import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  json,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  decimal,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  subscription: varchar("subscription").default("trial"), // trial, basic, pro
  trialStartDate: timestamp("trial_start_date"),
  trialEndDate: timestamp("trial_end_date"),
  stripeCustomerId: varchar("stripe_customer_id"),
  stripeSubscriptionId: varchar("stripe_subscription_id"),
  mcpTokens: text("mcp_tokens"), // Encrypted MCP tokens (replaces Stripe)
  mcpScopes: text("mcp_scopes").array(),
  mcpConnectedAt: timestamp("mcp_connected_at"),
  plan: varchar("plan").default("mcp_free"), // MCP-based free plan
  // Odds Calculator tracking
  oddsCalculatorUsage: integer("odds_calculator_usage").default(0), // Track total usage
  lastOddsCalculatorUse: timestamp("last_odds_calculator_use"),
  lastCalculatedOdds: integer("last_calculated_odds"), // Store latest odds percentage
  lastOddsAnalysisData: jsonb("last_odds_analysis_data"), // Store full analysis results
  // Authentication fields
  provider: varchar("provider").default("email"), // 'email', 'google', 'replit'
  googleId: varchar("google_id"),
  passwordHash: text("password_hash"),
  emailVerified: boolean("email_verified").default(false),
  verificationToken: text("verification_token"),
  resetPasswordToken: text("reset_password_token"),
  resetPasswordExpires: timestamp("reset_password_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Trial tracking for payment methods (before auth completion)
export const trials = pgTable("trials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  plan: varchar("plan").notNull(), // basic, pro
  stripePaymentMethodId: varchar("stripe_payment_method_id").notNull(),
  email: varchar("email"), // Optional - may be captured later
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date").notNull(),
  status: varchar("status").default("active"), // active, converted, cancelled, expired
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }), // Set after auth
  createdAt: timestamp("created_at").defaultNow(),
});

// Single profile per user (updated from multi-profile system)
export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }).unique(), // One profile per user
  name: varchar("name").notNull(),
  email: varchar("email"),
  phone: varchar("phone"),
  location: varchar("location"),
  linkedIn: varchar("linkedin"),
  website: varchar("website"),
  summary: text("summary"),
  skills: text("skills").array(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Job-specific folders within a single profile
export const jobFolders = pgTable("job_folders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  jobTitle: varchar("job_title").notNull(),
  targetCompany: varchar("target_company"),
  customKeywords: text("custom_keywords").array(),
  templatePreferences: text("template_preferences"),
  analysisData: text("analysis_data"), // JSON string for analysis results
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Experience entries
export const experiences = pgTable("experiences", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  company: varchar("company").notNull(),
  position: varchar("position").notNull(),
  startDate: varchar("start_date"),
  endDate: varchar("end_date"),
  current: boolean("current").default(false),
  description: text("description"),
  bullets: text("bullets").array(),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Education entries
export const education = pgTable("education", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileId: varchar("profile_id").notNull().references(() => profiles.id, { onDelete: "cascade" }),
  institution: varchar("institution").notNull(),
  degree: varchar("degree"),
  field: varchar("field"),
  graduationDate: varchar("graduation_date"),
  gpa: varchar("gpa"),
  sortOrder: integer("sort_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications for tracking job applications (enhanced for workflow system)
export const applications = pgTable("applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => profiles.id),
  jobFolderId: varchar("job_folder_id").references(() => jobFolders.id),
  jobTitle: varchar("job_title").notNull(),
  company: varchar("company").notNull(),
  jobDescription: text("job_description"),
  jobUrl: text("job_url"),
  keywords: text("keywords").array(),
  atsScore: integer("ats_score"),
  status: varchar("status").default("draft"), // draft, applied, interview, offer, rejected, followup
  priority: varchar("priority").default("medium"), // low, medium, high
  salary: varchar("salary"),
  location: varchar("location"),
  notes: text("notes"),
  nextAction: text("next_action"),
  nextActionDate: timestamp("next_action_date"),
  resumeUrl: varchar("resume_url"),
  coverLetterUrl: varchar("cover_letter_url"),
  appliedAt: timestamp("applied_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Workflow stages enum
export const workflowStages = [
  'START_SOURCE', 'KEYWORDS', 'ATS_CHECK', 'COVER_LETTER', 
  'STYLE_DESIGN', 'INTEGRATIONS', 'REVIEW_APPROVAL', 'OUTREACH_PREP', 
  'TRACKER', 'INTERVIEW_PREP', 'DONE'
] as const;

export type WorkflowStage = typeof workflowStages[number];

// Workflow checkpoints for autosave
export const workflowCheckpoints = pgTable("workflow_checkpoints", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  stage: varchar("stage").$type<WorkflowStage>().notNull(),
  data: json("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cover letters
export const coverLetters = pgTable("cover_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  applicationId: varchar("application_id").references(() => applications.id, { onDelete: "cascade" }),
  jobTitle: varchar("job_title"),
  company: varchar("company"),
  content: json("content").notNull(),
  version: integer("version").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Integration connections (for paid features)
export const integrationConnections = pgTable("integration_connections", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  provider: varchar("provider").notNull(), // gmail, calendar, clickup, canva
  scopes: json("scopes").$type<string[]>().default([]),
  status: varchar("status").default("disconnected").notNull(), // disconnected, connected, error
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Resume export history
export const resumeExports = pgTable("resume_exports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  profileId: varchar("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  format: varchar("format").notNull(), // pdf, docx, txt, json
  size: varchar("size").default("letter").notNull(), // letter, a4, legal
  fileName: varchar("file_name").notNull(),
  downloadCount: integer("download_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Auto-generated resume templates by job title with versioning
export const resumeTemplates = pgTable("resume_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  jobTitle: varchar("job_title").notNull(),
  jobTitleSlug: varchar("job_title_slug").notNull(),
  version: integer("version").default(1),
  content: jsonb("content").notNull(), // { sections: [{label, fields: [{key, prompt, value, type}]}] }
  isPublic: boolean("is_public").default(true),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Templates for resume layouts
export const templates = pgTable("templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  isPremium: boolean("is_premium").default(false),
  config: jsonb("config"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertJobFolderSchema = createInsertSchema(jobFolders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertExperienceSchema = createInsertSchema(experiences).omit({
  id: true,
  createdAt: true,
});

export const insertEducationSchema = createInsertSchema(education).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertWorkflowCheckpointSchema = createInsertSchema(workflowCheckpoints).omit({
  id: true,
  createdAt: true,
});

export const insertCoverLetterSchema = createInsertSchema(coverLetters).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertIntegrationConnectionSchema = createInsertSchema(integrationConnections).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResumeExportSchema = createInsertSchema(resumeExports).omit({
  id: true,
  createdAt: true,
});

export const insertTrialSchema = createInsertSchema(trials).omit({
  id: true,
  createdAt: true,
});

// Video Generation Tables
export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  prompt: text("prompt").notNull(),
  description: text("description"),
  duration: integer("duration").notNull(), // in seconds (30, 60, 180)
  style: varchar("style").notNull(), // cinematic, animation, documentary, social, promotional
  resolution: varchar("resolution").notNull().default("1080p"), // 720p, 1080p, 4k
  fps: integer("fps").notNull().default(30), // 24, 30, 60
  aspectRatio: varchar("aspect_ratio").notNull().default("16:9"), // 16:9, 9:16, 1:1, 4:3
  status: varchar("status").notNull().default("pending"), // pending, processing, completed, failed
  progress: integer("progress").default(0), // 0-100
  filePath: varchar("file_path"),
  thumbnailPath: varchar("thumbnail_path"),
  fileSize: integer("file_size"), // in bytes
  metadata: jsonb("metadata"), // stores scenes, config, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const videoScenes = pgTable("video_scenes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id, { onDelete: "cascade" }),
  sceneIndex: integer("scene_index").notNull(),
  type: varchar("type").notNull(), // intro, main, outro, development, climax, etc.
  duration: integer("duration").notNull(), // in seconds
  description: text("description").notNull(),
  imagePath: varchar("image_path"),
  audioPath: varchar("audio_path"),
  effects: jsonb("effects"), // transitions, filters, etc.
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const videoEdits = pgTable("video_edits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id, { onDelete: "cascade" }),
  operation: varchar("operation").notNull(), // trim, add_text, add_overlay, add_audio, etc.
  parameters: jsonb("parameters").notNull(), // operation-specific parameters
  appliedAt: timestamp("applied_at").notNull().defaultNow(),
  resultPath: varchar("result_path"), // path to edited video file
});

export const videoTemplates = pgTable("video_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name").notNull(),
  description: text("description"),
  category: varchar("category").notNull(), // business, social, educational, entertainment
  duration: integer("duration").notNull(),
  style: varchar("style").notNull(),
  scenes: jsonb("scenes").notNull(), // template scene structure
  isPublic: boolean("is_public").default(true),
  createdBy: varchar("created_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usageCount: integer("usage_count").default(0),
});

export const videoShares = pgTable("video_shares", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  videoId: varchar("video_id").notNull().references(() => videos.id, { onDelete: "cascade" }),
  shareToken: varchar("share_token").unique().notNull(),
  expiresAt: timestamp("expires_at"),
  viewCount: integer("view_count").default(0),
  isPublic: boolean("is_public").default(false),
  allowDownload: boolean("allow_download").default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Validation schemas for videos
export const insertVideoSchema = createInsertSchema(videos, {
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  duration: z.number().refine(val => [30, 60, 180].includes(val), "Duration must be 30, 60, or 180 seconds"),
  style: z.enum(["cinematic", "animation", "documentary", "social", "promotional"]),
  resolution: z.enum(["720p", "1080p", "4k"]),
  fps: z.enum(["24", "30", "60"]),
  aspectRatio: z.enum(["16:9", "9:16", "1:1", "4:3"]),
});

export const insertVideoSceneSchema = createInsertSchema(videoScenes, {
  description: z.string().min(5, "Scene description must be at least 5 characters"),
  duration: z.number().min(1, "Scene duration must be at least 1 second"),
});

export const insertVideoEditSchema = createInsertSchema(videoEdits, {
  operation: z.enum(["trim", "add_text", "add_overlay", "add_audio", "add_transition", "adjust_speed"]),
});

export const insertVideoTemplateSchema = createInsertSchema(videoTemplates, {
  name: z.string().min(3, "Template name must be at least 3 characters"),
  category: z.enum(["business", "social", "educational", "entertainment"]),
});

export const insertVideoShareSchema = createInsertSchema(videoShares);

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
export type InsertJobFolder = z.infer<typeof insertJobFolderSchema>;
export type JobFolder = typeof jobFolders.$inferSelect;
export type InsertExperience = z.infer<typeof insertExperienceSchema>;
export type Experience = typeof experiences.$inferSelect;
export type InsertEducation = z.infer<typeof insertEducationSchema>;
export type Education = typeof education.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applications.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type ResumeTemplate = typeof resumeTemplates.$inferSelect;
export type InsertResumeTemplate = typeof resumeTemplates.$inferInsert;
export type InsertWorkflowCheckpoint = z.infer<typeof insertWorkflowCheckpointSchema>;
export type WorkflowCheckpoint = typeof workflowCheckpoints.$inferSelect;
export type InsertCoverLetter = z.infer<typeof insertCoverLetterSchema>;
export type CoverLetter = typeof coverLetters.$inferSelect;
export type InsertIntegrationConnection = z.infer<typeof insertIntegrationConnectionSchema>;
export type IntegrationConnection = typeof integrationConnections.$inferSelect;
export type InsertResumeExport = z.infer<typeof insertResumeExportSchema>;
export type ResumeExport = typeof resumeExports.$inferSelect;
export type InsertTrial = z.infer<typeof insertTrialSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type VideoScene = typeof videoScenes.$inferSelect;
export type InsertVideoScene = z.infer<typeof insertVideoSceneSchema>;
export type VideoEdit = typeof videoEdits.$inferSelect;
export type InsertVideoEdit = z.infer<typeof insertVideoEditSchema>;
export type VideoTemplate = typeof videoTemplates.$inferSelect;
export type InsertVideoTemplate = z.infer<typeof insertVideoTemplateSchema>;
export type VideoShare = typeof videoShares.$inferSelect;
export type InsertVideoShare = z.infer<typeof insertVideoShareSchema>;
export type Trial = typeof trials.$inferSelect;