'use server';

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import isValid from "@/app/utils/is-valid";
import getUser from "@/app/utils/get-user";
import AlreadyCompleted from "@/app/components/already-complete";
import NotUnlocked from "@/app/components/not-unlocked";

export default async function DayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const _headers = headers();
  const currentUrl = _headers.get("x-url")!;

  const day = currentUrl.split('/').pop();
  const parsed = parseInt(day!, 10);

  if (isNaN(parsed)) {
    return redirect('/');
  }

  const user = await getUser();
  const alreadyCompleted = user.daysComplete.includes(parsed);
  const isUnlocked = isValid(parsed);

  return (
    <>
      {!isUnlocked && <NotUnlocked />}
      {!alreadyCompleted && isUnlocked && children}
      {alreadyCompleted && <AlreadyCompleted day={parsed} daysToPoints={user.pointsToDays} />}
    </>  
  );
}
