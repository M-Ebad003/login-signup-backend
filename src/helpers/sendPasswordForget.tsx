import { resend } from "@/lib/resend";
import { apiResponse } from "@/types/apiResponse";
import ResetPasswordEmail from "../../emails/ResetPasswordEmail";
import { Resend } from "resend";

export async function sendPasswordForget(
  email: string,
  username: string,
  userId: number | unknown,
  verifyCode?: string
): Promise<apiResponse> {
  try {
    await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: email,
      subject: "Nextify Password Code",
      react: ResetPasswordEmail({ userId, username}),
    });
    return {
      success: true,
      message: "password recovery email send successfully",
    };
  } catch (emailError) {
    console.log("Error while sending password recovery email", emailError);
    return {
      success: false,
      message: "Failed to send password recovery email",
    };
  }
}
