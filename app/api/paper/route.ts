import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { paperTable, staffTable } from "@/utils/schema/main";
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
  await db.insert(staffTable).values({ userID: session.user.id, paperID: result[0].id });
  return NextResponse.json({ id: result[0].id });
}