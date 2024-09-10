import { connectToDb } from "@/lib/database";
import { getServerSession, User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/option";
import { UserModel } from "@/model/user.model";

export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
    const messageId = params.messageid;

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
    try {
        const updateResult = await UserModel.updateOne(
            { _id: user._id },
            { $pull: { messages: { _id: messageId } } }
        )
        console.log(user._id)
        console.log(messageId)
        if (updateResult.modifiedCount == 0) {
            return Response.json(
                {
                    success: false,
                    message: 'Message not found or already deleted'
                }, { status: 404 }
            )
        }
        return Response.json(
            {
                success: true,
                message: 'Message Deleted'
            }, { status: 200 }
        )

    } catch (error) {
        console.log('Error in deleting message routes', error)
        return Response.json({
            success: false,
            message: "Something went wrong!"
        }, { status: 500 })
    }

}