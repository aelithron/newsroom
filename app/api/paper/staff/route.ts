import { auth } from "@/utils/auth";
import { db } from "@/utils/db";
import { staffTable } from "@/utils/schema/main";
import { and, eq } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";

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
  if (!body.userID || (body.userID as string).trim().length < 1) return NextResponse.json({ error: "invalid_user", message: "Your user ID is missing/invalid!" }, { status: 400 });
  const paper = await db.query.paperTable.findFirst({ where: { id: parseInt(body.paperID) }, with: { staff: true } });
  if (!paper || !paper.staff.find((e) => e.userID === session.user.id)) return NextResponse.json({ error: "not_found", message: "Either that paper ID doesn't exist, or you don't have permission to access it." }, { status: 404 });
  if (!paper.staff.find((i) => i.userID === (body.userID as string).trim())) return NextResponse.json({ error: "not_found_user", message: "That user ID doesn't exist or isn't staff on that paper." });
  if ((body.userID as string).trim() === session.user.id) return NextResponse.json({ error: "self_removal", message: "You cannot remove yourself using this page! Please use the user settings to resign this paper, have another manager remove you, or delete the paper." })
  await db.delete(staffTable).where(and(eq(staffTable.paperID, parseInt(body.paperID)), eq(staffTable.userID, (body.userID as string).trim())));
  return NextResponse.json({ success: true });
}