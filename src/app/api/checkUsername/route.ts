import { connectToDb } from "@/lib/database";
import { UserModel } from "@/model/user.model";
import { userValidation } from "@/schemas/signUpSchema";
import { z } from "zod";

const UsernameQuerySchema = z.object({
    username: userValidation
})

export async function GET(request: Request) {

    await connectToDb();

    try {
        const { searchParams } = new URL(request.url);

        const queryParams = {
            username: searchParams.get('username')
        }
        const result = UsernameQuerySchema.safeParse(queryParams);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(', ') : 'Invalid query parameters'
            }, { status: 400 })
        }
        const { username } = result.data;
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })
        const existingUser = await UserModel.findOne({ username, isVerified: false })

        if (existingVerifiedUser || existingUser) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }
        return Response.json({
            success: true,
            message: 'Username is unique'
        }, { status: 400 })

    } catch (error) {
        console.error('Error checking username', error)
        return Response.json(
            {
                success: false,
                message: 'Error checking username'
            }, { status: 500 }
        )
    }
}