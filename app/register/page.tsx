"use client";

import { useFormState } from "react-dom";

import Link from "next/link";

import { registerUser } from "./actions";
import SubmitBtn from "@/app/components/submit-btn";

const Register = () => {
  const [state, formAction] = useFormState(registerUser, {});

  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full bg-cover blur-sm"
        style={{ backgroundImage: `url('/background.jpg')` }}
      />
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 h-screen">
        <p className="text-center text-4xl">Register!</p>
        {state.error && (
          <div className="text-center px-1 py-2 bg-red-50 border rounded-md my-4 border-red-100 drop-shadow-sm">
            <p>There has been an error registering you. Please try again!</p>
            <p className="italic text-sm">
              If you are tech savvy, check the console and report the error!
            </p>
          </div>
        )}
        {!state.uuid && (
          <form
            action={formAction}
            className="flex flex-col py-4 items-center gap-y-2 w-full"
          >
            <input
              required
              type="text"
              className="w-2/3 border border-indigo-100 px-2 py-1 rounded-md"
              maxLength={32}
              placeholder="Full Name"
              name="name"
            />
            <input
              required
              type="text"
              className="w-2/3 border border-indigo-100 px-2 py-1 rounded-md"
              maxLength={32}
              placeholder="Squad"
              name="squad"
            />
            <SubmitBtn text="Register!" textSubmitting="Registering!" />
          </form>
        )}
        {
          state.uuid && (
            <div className="text-center px-1 py-2 bg-lime-50 border rounded-md my-4 border-lime-100 drop-shadow-sm">
              <p>Registration complete - below is a identifier you will use to sign-in.</p>
              <p><b>Save this somewhere, like in Slack or Notes</b></p>
              <p>{state.uuid}</p>
              <Link href="/" className="text-blue-500 hover:underline">Lets Play!</Link>
            </div>
          )
        }
      </div>
    </main>
  );
};

export default Register;
