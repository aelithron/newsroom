import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { inviteTable, staffTable } from "@/utils/schema/main";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });
  if (!session) return NextResponse.json({ error: "unauthorized", message: "You aren't authenticated! Please pass your auth cookies." }, { status: 401 });
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "malformed", message: "Your request body isn't properly formatted JSON!" }, { status: 400 });
  }
  if (!body.inviteID || Number.isNaN(parseInt(body.inviteID))) return NextResponse.json({ error: "invalid_invite", message: "Your invite ID is missing/invalid!" }, { status: 400 });
  if (body.accepted === undefined || (body.accepted !== true && body.accepted !== false)) return NextResponse.json({ error: "invalid_status", message: "Your accepted parameter is missing/invalid!" }, { status: 400 });
  const invite = await db.query.inviteTable.findFirst({ where: { id: parseInt(body.inviteID) }, with: { paper: true } });
  if (!invite || invite.email.trim().toLowerCase() !== session.user.email.trim().toLowerCase()) return NextResponse.json({ error: "not_found", message: "The invite wasn't found, or didn't match your email address." });
  if (body.accepted) {
    await db.insert(staffTable).values({ paperID: invite.id, userID: session.user.id, role: invite.role });
    await db.update(inviteTable).set({ status: "accepted" }).where(eq(inviteTable.id, parseInt(body.inviteID)));
  } else await db.update(inviteTable).set({ status: "declined" }).where(eq(inviteTable.id, parseInt(body.inviteID)));
  return NextResponse.json({ success: true });
}