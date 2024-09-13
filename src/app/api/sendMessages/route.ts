import { connectToDb } from "@/lib/database";
import { Message, UserModel } from "@/model/user.model";

export async function POST(request: Request) {
    await connectToDb();
    const { username, content } = await request.json()

    try {
        const user = await UserModel.findOne({ username });
        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: 'User not found'
                }, { status: 404 }
            )
        }
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: 'User is not accepting messages'
                }, { status: 401 }
            )
        }
        const newMessage = { content, createdAt: new Date() }
        user.messages.push(newMessage as Message);
        console.log("user messages",user.messages)

        await user.save()
        return Response.json(
            {
                success: true,
                message: 'Message send successfully'
            }, { status: 401 }
        )
    } catch (error) {
        console.log("Error while adding messages")
        return Response.json(
            {
                success: false,
                message: 'Invalid Server Error'
            }, { status: 500 }
        )
    }
}