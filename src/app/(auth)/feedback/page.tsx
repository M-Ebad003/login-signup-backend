"use client";
import Link from "next/link";
import { useEffect } from "react";

const PasswordRecoveryEmailSent = () => {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", padding: "4rem 0" }}
    >
      <div>
          <h1>Check your email</h1>
          <p>
            An email has been sent to your email address to reset your password.
          </p>
          <Link
            href="/login"
            style={{
              fontSize: "0.875rem",
              color: "#000",
              textDecoration: "underline",
            }}
          >
            Back to login
          </Link>
      </div>
    </div>
  );
};

export default PasswordRecoveryEmailSent;