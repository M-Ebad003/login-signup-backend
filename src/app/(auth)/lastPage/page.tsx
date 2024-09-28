"use client";

import Link from "next/link";
import { useEffect } from "react";

const ResetPasswordSuccess = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}
    >
      <div>
          <h1>Password successfully reset!</h1>
          <p>Let&apos;s go! Your password has been changed successfully!</p>
          <Link
            href="/sign-in"
          >
            Login
          </Link>
      </div>
    </div>
  );
};

export default ResetPasswordSuccess;