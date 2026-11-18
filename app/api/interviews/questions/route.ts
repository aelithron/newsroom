import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { interviewQuestionTable, paperTable, staffTable } from "@/utils/schema/main";
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
  if (!body.paperID || Number.isNaN(parseInt(body.paperID))) return NextResponse.json({ error: "invalid_question", message: "Your question is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { staff: true } });
  if (!paper || !paper.staff.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  const result = await db.insert(interviewQuestionTable).values({ question: body.question, paperID: paper.id }).returning({ id: interviewQuestionTable.id });
  return NextResponse.json({ id: result[0].id });
}