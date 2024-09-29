"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect } from "react";

const PasswordRecoveryEmailSent = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}
    >
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-full max-w-sm shadow-lg p-10 space-y-10 bg-gray-300 rounded-lg items-center justify-center flex flex-col text-center">
          <h1 className="text-3xl font-semibold">Check your email</h1>
          <p>
            An email has been sent to your email address to reset your password.
          </p>
          <Button>
            <Link href="/sign-in">Back to login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecoveryEmailSent;
