import { integer, text, pgTable, json } from "drizzle-orm/pg-core";
import type { InterviewComment } from "@/types/interviews";
import { user } from "./auth";

export const paperTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull(),
  
});

export const staffTable = pgTable("staff", {
  paperID: integer().references(() => paperTable.id, { onDelete: "cascade" }),
  userID: text().references(() => user.id, { onDelete: "cascade" })
});

export const interviewTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  body: text().notNull(),
  comments: json().$type<InterviewComment>().array()
});