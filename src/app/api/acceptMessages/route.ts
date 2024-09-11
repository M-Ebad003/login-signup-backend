import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { User } from "next-auth";
import { connectToDb } from "@/lib/database";
import { UserModel } from "@/model/user.model";
import { revalidatePath } from "next/cache";


export async function POST(request: Request) {
    await connectToDb();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            }, { status: 401 }
        )
    }
    const userId = user._id;
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'failed to update user status'
                }, { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'Message status updated successfully',
                updatedUser
            }, { status: 200 }
        )
        
    } catch (error) {
        console.log('failed to update user status')
        return Response.json(
            {
                success: false,
                message: 'failed to update user status'
            }, { status: 500 }
        )
    }
}

export async function GET(request: Request) {
    await connectToDb();

    const session = await getServerSession(authOptions)

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: 'Not authenticated'
            }, { status: 401 }
        )
    }
    const userId = user._id;

    const foundUser = await UserModel.findById(userId)
    try {
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                }, { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage,
            }, { status: 200 }
        )
    } catch (error) {
        console.log('Error in getting message status')
        return Response.json(
            {
                success: false,
                message: 'Error in getting message status'
            }, { status: 500 }
        )
    }
}