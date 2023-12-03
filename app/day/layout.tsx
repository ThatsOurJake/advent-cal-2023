'use server';

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import isValid from "@/app/utils/is-valid";
import getUser from "@/app/utils/get-user";
import AlreadyCompleted from "@/app/components/already-complete";
import NotUnlocked from "../components/not-unlocked";

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
  const alreadyCompleted = user.daysComplete.includes(parsed.toString());
  const isUnlocked = isValid(parsed);

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover blur-sm" style={{ backgroundImage: `url('/background.jpg')`}}>
      </div>
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 h-screen">
        {!isUnlocked && <NotUnlocked />}
        {!alreadyCompleted && isUnlocked && children}
        {alreadyCompleted && <AlreadyCompleted day={parsed.toString()} daysToPoints={user.pointsToDays} />}
      </div>
    </main>
  );
}
