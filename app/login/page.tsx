'use client';

import { useFormState } from "react-dom";
import Link from "next/link";
import { RedirectType, redirect } from "next/navigation";

import SubmitBtn from "@/app/components/submit-btn";
import TextInput from "@/app/components/text-input";
import Alert from "@/app/components/alert";

import { signIn } from "./actions";

const Login = () => {
  const [state, formAction] = useFormState(signIn, {});

  if (state?.signedIn) {
    return redirect('/', RedirectType.push);
  }

  return (
    <>
      <p className="text-center text-2xl font-bold">Login!</p>
      {
        state?.error && (
          <div className="w-1/2 mx-auto">
            <Alert type="error">
              <p className="font-bold">Oh dear - there has been an error...</p>
              <p>
                Login failed! Please try again. If you are tech savvy, check the console and report the error!
              </p>
            </Alert>
          </div>
        )
      }
      {
        state?.notFound && (
          <div className="w-1/2 mx-auto">
            <Alert type="warning">
              <p className="font-bold">Oh dear - there has been an error...</p>
              <p>The ID provided is not valid - Please double check!</p>
            </Alert>
          </div>
        )
      }
      <div className="w-2/3 mx-auto">
        <form action={formAction} className="flex flex-col py-4 items-center gap-y-3 w-full">
          <TextInput required maxLength={38} placeholder="User UUID" name="uuid" />
          <SubmitBtn text="Sign In" textSubmitting="Signing In" />
        </form>
        <Alert type="info">
          <p className="font-bold">Want to play?</p>
          <p>Click <span><Link href="/register" className="text-blue-500 hover:underline">here</Link></span> to register!</p>
          <p className="text-sm italic">Please note previous years UUID will not work. If you have forgotten your UUID? Drop Jake a message</p>
        </Alert>
      </div>
    </>
  )
};

export default Login;
