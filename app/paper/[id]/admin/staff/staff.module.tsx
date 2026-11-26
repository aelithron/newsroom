"use client";
import { faSave, faUserMinus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type Dispatch, type SetStateAction, type SubmitEvent, useState } from "react";
import crypto from "crypto";

export default function StaffList({ paperID, origStaff, memberships }: { paperID: number, origStaff: { userID: string, role: string }[], memberships: { id: string, name: string, email: string, image: string | null }[] }) {
  const [staff, setStaff] = useState<{ userID: string, role: string }[]>(origStaff);
  return (
    <div className="flex flex-col gap-2">
      {staff.filter((staffUser) => staffUser.role === "manager").map((staffUser) => <StaffCard key={staffUser.userID} paperID={paperID} user={memberships.find((entry) => entry.id === staffUser.userID)} role={staffUser.role} staffList={staff} setStaffList={setStaff} />)}
      {staff.filter((staffUser) => staffUser.role === "writer").map((staffUser) => <StaffCard key={staffUser.userID} paperID={paperID} user={memberships.find((entry) => entry.id === staffUser.userID)} role={staffUser.role} staffList={staff} setStaffList={setStaff} />)}
      {staff.filter((staffUser) => staffUser.role === "reader").map((staffUser) => <StaffCard key={staffUser.userID} paperID={paperID} user={memberships.find((entry) => entry.id === staffUser.userID)} role={staffUser.role} staffList={staff} setStaffList={setStaff} />)}
    </div>
  )
}
function StaffCard({ paperID, user, role, staffList, setStaffList }: { paperID: number, user: { id: string, name: string, email: string, image: string | null } | undefined, role: string, staffList: { userID: string, role: string }[], setStaffList: Dispatch<SetStateAction<{ userID: string, role: string }[]>> }) {
  if (!user) return null;
  const gravatarURL = `https://gravatar.com/avatar/${crypto.createHash("sha256").update(user.email.toLowerCase().trim()).digest("hex")}`;
  return (
    <div className="flex gap-2 p-2 rounded-lg bg-slate-300 dark:bg-slate-800 w-full md:w-fit">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={user.image || gravatarURL} alt="User Profile Picture" width={90} height={90} className="rounded-lg" referrerPolicy="no-referrer" />
      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <h2 className="font-semibold text-lg">{user.name}</h2>
          <RemoveStaff paperID={paperID} userID={user.id} userName={user.name} staffList={staffList} setStaffList={setStaffList} />
        </div>
        <p>Email: {user.email}</p>
        <StaffEditor paperID={paperID} user={user} currentRole={role} staffList={staffList} setStaffList={setStaffList} />
      </div>
    </div>
  )
}
function StaffEditor({ paperID, user, currentRole, staffList, setStaffList }: { paperID: number, user: { id: string, name: string, email: string, image: string | null }, currentRole: string, staffList: { userID: string, role: string }[], setStaffList: Dispatch<SetStateAction<{ userID: string, role: string }[]>> }) {
  const [edited, setEdited] = useState<boolean>(false);
  const [role, setRole] = useState<string>(currentRole);
  function handleRoleChange(newVal: string) {
    setRole(newVal);
    setEdited(true);
  }
  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    if (!edited) return;
    let body;
    try {
      const res = await fetch("/api/paper/staff", { method: "PATCH", body: JSON.stringify({ paperID, userID: user.id, role }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error editing user's role!\n${e}`);
      alert(`Error editing user's role: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error editing user's role: ${body.message} (${body.error})`);
      return;
    }
    if (body.changeFlag) {
      setEdited(false);
      return;
    }
    setEdited(false);
    const base = [...staffList].filter((entry) => entry.userID !== user.id);
    base.push({ userID: user.id, role });
    setStaffList(base);
  }
  return (
    <form className="flex flex-col gap-1" onSubmit={handleSubmit}>
      <div className="flex gap-1 items-center">
        <p>Role:</p>
        <select value={role} onChange={(e) => handleRoleChange(e.target.value)} className="bg-slate-400 dark:bg-slate-900 rounded-lg p-2 w-30">
          <option value="reader">Reader</option>
          <option value="writer">Writer</option>
          <option value="manager">Manager</option>
        </select>
        {edited && <button type="submit" className="p-1 rounded-lg bg-violet-300 dark:bg-violet-800 ml-1 hover:text-sky-500"><FontAwesomeIcon icon={faSave} /></button>}
      </div>
    </form>
  )
}
function RemoveStaff({ paperID, userID, userName, staffList, setStaffList }: { paperID: number, userID: string, userName: string, staffList: { userID: string, role: string }[], setStaffList: Dispatch<SetStateAction<{ userID: string, role: string }[]>> }) {
  async function handleDelete() {
    const result = confirm(`Are you sure you want to remove ${userName}?\nThey will immediately lose access to the paper, and won't be able to access it again unless re-added by a manager.`);
    if (!result) return;
    let body;
    try {
      const res = await fetch("/api/paper/staff", { method: "DELETE", body: JSON.stringify({ paperID, userID }) });
      body = await res.json();
    } catch (e) {
      console.error(`Error removing user!\n${e}`);
      alert(`Error removing user: unknown (check browser console)`);
      return;
    }
    if (body.error) {
      alert(`Error removing user: ${body.message} (${body.error})`);
      return;
    }
    const base = [...staffList].filter((entry) => entry.userID !== userID);
    setStaffList(base);
  }
  return (<button type="button" onClick={handleDelete} className="hover:text-sky-500"><FontAwesomeIcon icon={faUserMinus} /></button>);
}