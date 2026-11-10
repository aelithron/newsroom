import { integer, text, pgTable, json } from "drizzle-orm/pg-core";
import type { InterviewComment } from "@/types/interviews";

export const interviewTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  body: text().notNull(),
  comments: json().$type<InterviewComment>().array()
});