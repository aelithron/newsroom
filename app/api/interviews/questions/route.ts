import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { interviewQuestionTable } from "@/utils/schema/main";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized", message: "You aren't authenticated! Please pass your auth cookies." }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "malformed", message: "Your request body isn't properly formatted JSON!" }, { status: 400 });
  }
  if (!body.question || (body.question as string).trim().length < 1) return NextResponse.json({ error: "invalid_question", message: "Your question is missing/invalid!" }, { status: 400 });
  if (!body.paperID || Number.isNaN(parseInt(body.paperID))) return NextResponse.json({ error: "invalid_paper", message: "Your paper ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  const result = await db.insert(interviewQuestionTable).values({ question: body.question, paperID: paper.id }).returning({ id: interviewQuestionTable.id });
  return NextResponse.json({ id: result[0].id });
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized", message: "You aren't authenticated! Please pass your auth cookies." }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "malformed", message: "Your request body isn't properly formatted JSON!" }, { status: 400 });
  }
  if (!body.paperID || Number.isNaN(parseInt(body.paperID))) return NextResponse.json({ error: "invalid_paper", message: "Your paper ID is missing/invalid!" }, { status: 400 });
  if (!body.questionID || Number.isNaN(parseInt(body.questionID))) return NextResponse.json({ error: "invalid_question", message: "Your question ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true, questions: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  const question = paper.questions.find((q) => q.id === parseInt(body.questionID));
  if (!question || question.paperID !== parseInt(body.paperID)) return NextResponse.json({ error: "not_found_question", message: "That question ID doesn't exist on that paper." });
  const changes = { question: ((body.question && (body.question as string).trim().length > 1) ? body.question as string : undefined), enabled: ((body.enabled === true || body.enabled === false) ? body.enabled as boolean : undefined) };
  if (Object.keys(changes).length < 1) return NextResponse.json({ success: true, message: "No valid changes were requested.", changeFlag: true }); 
  await db.update(interviewQuestionTable).set(changes).where(and(eq(interviewQuestionTable.id, parseInt(body.questionID)), eq(interviewQuestionTable.paperID, parseInt(body.paperID))));
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized", message: "You aren't authenticated! Please pass your auth cookies." }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "malformed", message: "Your request body isn't properly formatted JSON!" }, { status: 400 });
  }
  if (!body.paperID || Number.isNaN(parseInt(body.paperID))) return NextResponse.json({ error: "invalid_paper", message: "Your paper ID is missing/invalid!" }, { status: 400 });
  if (!body.questionID || Number.isNaN(parseInt(body.questionID))) return NextResponse.json({ error: "invalid_question", message: "Your question ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true, questions: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  const question = paper.questions.find((q) => q.id === parseInt(body.questionID));
  if (!question || question.paperID !== parseInt(body.paperID)) return NextResponse.json({ error: "not_found_question", message: "That question ID doesn't exist on that paper." });
  await db.delete(interviewQuestionTable).where(and(eq(interviewQuestionTable.id, parseInt(body.questionID)), eq(interviewQuestionTable.paperID, parseInt(body.paperID))));
  return NextResponse.json({ success: true });
}