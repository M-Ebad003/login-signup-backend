import { connectToDb } from "@/lib/database";
import { UserModel } from "@/model/user.model";
import ResetPasswordEmail from "../../../../emails/ResetPasswordEmail";
import { sendPasswordForget } from "@/helpers/sendPasswordForget";

export const POST = async (request: Request) => {
  const { email } = await request.json();
  await connectToDb();

  try {
    const existingUser = await UserModel.findOne({email});

    if(!existingUser){
        return Response.json({
            success: false,
            message: 'Email does not exist'
        }, { status: 404 })
    }
    const username=existingUser.username
    const emailResponse = await sendPasswordForget(
        email,
        username
    )
    if (!emailResponse.success) {
        return Response.json({
            successs: false,
            message: emailResponse.message

        }, { status: 500 });
    }
    return Response.json(
        {
       success: false,
       message: 'Password recovery email send successfully'
    })
  } catch (error) {
    console.log("error ", error);
    return Response.json({
      success: false,
      message: "An unexpected error occured",
    });
  }
};
