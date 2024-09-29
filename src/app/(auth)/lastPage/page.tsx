"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

const ResetPasswordSuccess = () => {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <div className="rounded-lg bg-gray-400 space-y-8 max-w-sm flex flex-col justify-center text-center items-center p-10 w-full">
        <h1 className="text-2xl">Password successfully reset!</h1>
        <p>Let&apos;s go! Your password has been changed successfully!</p>
        <Button>
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;
