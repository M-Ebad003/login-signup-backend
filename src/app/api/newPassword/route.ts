import { connectToDb } from "@/lib/database";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
  const { password, userId } = await request.json();
  await connectToDb();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser = await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
    if (!updateUser) {
      return Response.json(
        {
          success: false,
          message: "password not updated",
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: "Password updated successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.log("error", error);
    return Response.json(
      {
        success: false,
        message: "unexpected error occured while updating password",
      },
      { status: 400 }
    );
  }
};
