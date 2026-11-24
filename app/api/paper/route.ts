import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { paperTable, staffTable } from "@/utils/schema/main";
import { eq } from "drizzle-orm";
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
  if (!body.name || (body.name as string).trim().length < 1) return NextResponse.json({ error: "invalid_name", message: "Your name attribute is missing/invalid!" }, { status: 400 });
  const result = await db.insert(paperTable).values({ name: body.name as string }).returning({ id: paperTable.id });
  await db.insert(staffTable).values({ userID: session.user.id, paperID: result[0].id, role: "manager" });
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
  if (!body.paperID || (body.paperID as string).trim().length < 1) return NextResponse.json({ error: "invalid_paper", message: "Your paper ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { memberships: true } });
  if (!paper || !paper.memberships.find((e) => e.id === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  
  const changes = { name: (body.name && (body.name as string).trim().length >= 1) ? (body.name as string).trim() : undefined };
  await db.update(paperTable).set(changes).where(eq(paperTable.id, paper.id));
  return NextResponse.json({ success: true });
}