"use client";

import { useFormState } from "react-dom";
import Link from "next/link";

import Alert from "@/app/components/alert";
import SubmitBtn from "@/app/components/submit-btn";
import TextInput from "@/app/components/text-input";

import { registerUser } from "./actions";

const RegistrationOpen = () => {
  const [state, formAction] = useFormState(registerUser, {});
  
  return (
    <>
      <p className="text-center text-2xl font-bold">Registration</p>
      {
        state.error && (
          <div className="w-1/2 mx-auto">
            <Alert type="error">
              <p className="font-bold">Oh dear - there has been an error...</p>
              <p>
                Registration failed! Please try again. If you are tech savvy, check the console and report the error!
              </p>
            </Alert>
          </div>
        )
      }
      {
        !state.uuid && (
          <form
            action={formAction}
            className="flex flex-col py-4 items-center gap-y-2 w-full"
          >
            <TextInput
              required
              maxLength={32}
              placeholder="Full Name"
              name="name"
              data-1p-ignore
              data-lpignore
              autoComplete="off"
              data-form-type="other" />
            <TextInput
              required
              maxLength={32}
              placeholder="Squad"
              name="squad" />
            <SubmitBtn text="Register!" textSubmitting="Registering!" />
          </form>
          )
      }
      {
        state.uuid && (
          <div className="w-1/2 mx-auto">
            <Alert type="success">
              <p className="font-bold">Registration complete</p>
              <p>Below is a identifier you will use to sign-in. Save this somewhere safe, like in Slack or Notes</p>
              <p>{state.uuid}</p>
              <Link href="/" className="text-blue-500 hover:underline">Lets Play!</Link>
            </Alert>
          </div>
        )
      }
    </>
  );
};

export default RegistrationOpen;

