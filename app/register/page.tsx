"use client";

import Link from "next/link";

import SubmitBtn from "@/app/components/submit-btn";

const Register = () => {
  return (
    <main className="relative bg-black min-w-screen min-h-screen">
      <div
        aria-hidden
        className="absolute inset-0 h-full w-full bg-cover blur-sm"
        style={{ backgroundImage: `url('/background.jpg')` }}
      />
      <div className="py-2 z-10 relative w-full md:w-1/2 mx-auto bg-white p-4 min-h-screen text-center">
        <p className="text-4xl mb-6">Register!</p>
        <p className="italic">Registrations are now closed.</p>
        <Link href="/login" className="text-blue-500 hover:underline">Login!</Link>
      </div>
    </main>
  );
};

export default Register;
