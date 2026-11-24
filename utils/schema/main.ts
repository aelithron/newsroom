import { integer, text, jsonb, pgTable, primaryKey, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { defineRelationsPart } from "drizzle-orm";

export const paperTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
});

export const roleEnum = pgEnum("role", ["reader", "writer", "manager"]);
export const staffTable = pgTable("staff", {
  paperID: integer("paper_id").references(() => paperTable.id, { onDelete: "cascade" }),
  userID: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  role: roleEnum().notNull().default("reader")
}, (t) => [primaryKey({ columns: [t.paperID, t.userID] })]);

export const interviewQuestionTable = pgTable("interview_questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paperID: integer("paper_id").notNull().references(() => paperTable.id, { onDelete: "cascade" }),
  question: text().notNull(),
  enabled: boolean().notNull().default(true)
});

export const interviewTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paperID: integer("paper_id").notNull().references(() => paperTable.id, { onDelete: "cascade" }),
  name: text(),
  responses: jsonb().notNull().$type<{ q: number, a: string }[]>(),
  createdAt: timestamp("created_at", { mode: "date", withTimezone: true }).notNull().defaultNow()
});

export const relations = defineRelationsPart({ staffTable, paperTable, interviewTable, interviewQuestionTable, user }, (r) => ({
  paperTable: {
    memberships: r.many.user({
      from: r.paperTable.id.through(r.staffTable.paperID),
      to: r.user.id.through(r.staffTable.userID)
    }),
    staff: r.many.staffTable({
      from: r.paperTable.id,
      to: r.staffTable.paperID
    }),
    interviews: r.many.interviewTable({
      from: r.paperTable.id,
      to: r.interviewTable.paperID
    }),
    questions: r.many.interviewQuestionTable({
      from: r.paperTable.id,
      to: r.interviewQuestionTable.paperID
    })
  },
  staffTable: {
    user: r.one.user({
      from: r.staffTable.userID,
      to: r.user.id
    })
  },
  user: {
    papers: r.many.paperTable({
      from: r.user.id.through(r.staffTable.userID),
      to: r.paperTable.id.through(r.staffTable.paperID)
    })
  },
  interviewTable: {
    paper: r.one.paperTable({
      from: r.interviewTable.paperID,
      to: r.paperTable.id
    })
  },
  interviewQuestionTable: {
    paper: r.one.paperTable({
      from: r.interviewQuestionTable.paperID,
      to: r.paperTable.id
    })
  }
}));