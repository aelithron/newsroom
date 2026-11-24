import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { interviewTable } from "@/utils/schema/main";
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
  if (!body.responses || !Array.isArray(body.responses)) return NextResponse.json({ error: "invalid_responses", message: "Your responses are missing/invalid!" }, { status: 400 });
  const responses: { q: number, a: string }[] = [];
  for (const item of body.responses) {
    if (!item.id || Number.isNaN(parseInt(item.id)) || !item.answer || (item.answer as string).trim().length < 1) return NextResponse.json({ error: "invalid_response_object", message: "At least one of your responses is malformed!" }, { status: 400 });
    responses.push({ q: parseInt(item.id), a: (item.answer as string).trim() });
  }
  if (!body.paperID || Number.isNaN(parseInt(body.paperID))) return NextResponse.json({ error: "invalid_paper", message: "Your paper ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  const result = await db.insert(interviewTable).values({ paperID: parseInt(body.paperID), name: body.name || undefined, responses }).returning({ id: interviewTable.id });
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
  if (!body.interviewID || Number.isNaN(parseInt(body.interviewID))) return NextResponse.json({ error: "invalid_interview", message: "Your interview ID is missing/invalid!" }, { status: 400 });
  const responses: { q: number, a: string }[] = [];
  if (body.responses && Array.isArray(body.responses)) {
    for (const item of body.responses) {
      if (!item.id || Number.isNaN(parseInt(item.id)) || !item.answer || (item.answer as string).trim().length < 1) return NextResponse.json({ error: "invalid_response_object", message: "At least one of your responses is malformed!" }, { status: 400 });
      responses.push({ q: parseInt(item.id), a: (item.answer as string).trim() });
    }
  }
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true, interviews: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  if (!paper.interviews.find((i) => i.id === parseInt(body.interviewID))) return NextResponse.json({ error: "not_found_interview", message: "That interview ID doesn't exist on that paper." });
  let sentName: string | null | undefined = body.name;
  if (body.name && body.name.trim().length < 1) sentName = null;
  if (sentName) sentName = sentName.trim();
  const changed = { name: sentName, responses: responses.length >= 1 ? responses : undefined };
  if (Object.keys(changed).length < 1) return NextResponse.json({ success: true, message: "No valid changes were requested.", changeFlag: true });
  await db.update(interviewTable).set(changed).where(and(eq(interviewTable.paperID, parseInt(body.paperID)), eq(interviewTable.id, parseInt(body.interviewID))));
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
  if (!body.interviewID || Number.isNaN(parseInt(body.interviewID))) return NextResponse.json({ error: "invalid_interview", message: "Your interview ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true, interviews: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  if (!paper.interviews.find((i) => i.id === parseInt(body.interviewID))) return NextResponse.json({ error: "not_found_interview", message: "That interview ID doesn't exist on that paper." });
  await db.delete(interviewTable).where(and(eq(interviewTable.paperID, parseInt(body.paperID)), eq(interviewTable.id, parseInt(body.interviewID))));
  return NextResponse.json({ success: true });
}