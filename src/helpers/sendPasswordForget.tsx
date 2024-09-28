import { resend } from "@/lib/resend";
import { apiResponse } from "@/types/apiResponse";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";

export async function sendPasswordForget(
  email: string,
  username: string,
  verifyCode?: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Nextify Verification Code",
      react: ResetPasswordEmail({ username}),
    });
    return {
      success: true,
      message: "Verification email send successfully",
    };
  } catch (emailError) {
    console.log("Error while sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email",
    };
  }
}
