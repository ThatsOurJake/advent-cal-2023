"use client";

import Link from "next/link";
import Alert from "../components/alert";

const RegistrationClosed = () => {
  return (
    <>
      <p className="text-center text-2xl font-bold">Registration</p>
      <div className="w-1/2 mx-auto">
        <Alert type="warning">
          <p className="font-bold">Registrations are now closed.</p>
          <p>If you have an account login using the link below!</p>
          <Link href="/login" className="text-blue-500 hover:underline">Login!</Link>
        </Alert>
      </div>
    </>
  );
};

export default RegistrationClosed;
