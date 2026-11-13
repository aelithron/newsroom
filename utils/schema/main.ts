import { integer, text, pgTable, json, primaryKey } from "drizzle-orm/pg-core";
import type { InterviewComment } from "@/types/interviews";
import { user } from "./auth";
import { defineRelations } from "drizzle-orm";

export const paperTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
});

export const staffTable = pgTable("staff", {
  paperID: integer().references(() => paperTable.id, { onDelete: "cascade" }),
  userID: text().references(() => user.id, { onDelete: "cascade" })
}, (t) => [primaryKey({ columns: [t.paperID, t.userID] })]);
export const relations = defineRelations({ staffTable, paperTable, user }, (r) => ({
  paperTable: {
    staff: r.many.user({
      from: r.paperTable.id.through(r.staffTable.paperID),
      to: r.user.id.through(r.staffTable.userID)
    })
  },
  user: {
    papers: r.many.paperTable({
      from: r.user.id.through(r.staffTable.userID),
      to: r.paperTable.id.through(r.staffTable.paperID)
    })
  }
}));

export const interviewTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text(),
  body: text().notNull(),
  comments: json().$type<InterviewComment>().array()
});