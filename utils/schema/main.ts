import { integer, text, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./auth";
import { defineRelationsPart } from "drizzle-orm";

export const paperTable = pgTable("papers", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: text().notNull()
});

export const staffTable = pgTable("staff", {
  paperID: integer("paper_id").references(() => paperTable.id, { onDelete: "cascade" }),
  userID: text("user_id").references(() => user.id, { onDelete: "cascade" })
}, (t) => [primaryKey({ columns: [t.paperID, t.userID] })]);

export const interviewQuestionTable = pgTable("interview_questions", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paperID: integer("paper_id").notNull().references(() => paperTable.id, { onDelete: "cascade" }),
  question: text().notNull()
});

export const interviewTable = pgTable("interviews", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  paperID: integer("paper_id").notNull().references(() => paperTable.id, { onDelete: "cascade" }),
  questionID: integer("question_id").notNull().default(0).references(() => interviewQuestionTable.id, { onDelete: "set default" }),
  name: text(),
  body: text().notNull()
});

export const relations = defineRelationsPart({ staffTable, paperTable, interviewTable, user }, (r) => ({
  paperTable: {
    staff: r.many.user({
      from: r.paperTable.id.through(r.staffTable.paperID),
      to: r.user.id.through(r.staffTable.userID)
    }),
    interviews: r.many.interviewTable({
      from: r.paperTable.id,
      to: r.interviewTable.paperID
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
  }
}));