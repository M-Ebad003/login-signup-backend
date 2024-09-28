import { connectToDb } from "@/lib/database";
import { UserModel } from "@/model/user.model";
import bcrypt from "bcryptjs";

export const POST = async (request: Request) => {
  const { password } = await request.json();
  await connectToDb();
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const updateUser= await UserModel.findByIdAndUpdate(
        
        {password: hashedPassword},
        {new: true},
    )
  } catch (error) {}
};
