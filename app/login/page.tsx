'use client';

import { useFormState } from "react-dom";

import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";
import SubmitBtn from "@/app/components/submit-btn";
import TextInput from "@/app/components/text-input";

import { signIn } from "./actions";

const Login = () => {
  const [state, formAction] = useFormState(signIn, {});

  if (state?.signedIn) {
    return redirect('/', RedirectType.push);
  }

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div aria-hidden className="absolute inset-0 h-full w-full bg-cover" style={{ backgroundImage: `url('/background.png')`}} />
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 min-h-screen">
        <p className="text-center text-4xl">Login!</p>
        {state?.error && (
          <div className="text-center px-1 py-2 bg-red-50 border rounded-md my-4 border-red-100 drop-shadow-sm">
            <p>There has been an error signing you in. Please try again!</p>
            <p className="italic text-sm">
              If you are tech savvy, check the console and report the error!
            </p>
          </div>
        )}
        {state?.notFound && (
          <div className="text-center px-1 py-2 bg-red-50 border rounded-md my-4 border-red-100 drop-shadow-sm">
            <p>The ID provided is not valid - Please double check!</p>
          </div>
        )}
        <form action={formAction} className="flex flex-col py-4 items-center gap-y-3 w-full">
          <TextInput required maxLength={38} placeholder="User UUID" name="uuid" />
          <SubmitBtn text="Sign In" textSubmitting="Signing In" />
          <Link href="/register" className="text-blue-500 hover:underline">Need a UUID?</Link>
          <p className="text-center text-sm italic">Forgot your id, message Jake</p>
        </form>
      </div>
  </main>
  )
};

export default Login;
