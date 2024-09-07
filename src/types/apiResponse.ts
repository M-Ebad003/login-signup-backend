import { Message } from "@/model/user.model";

export interface apiResponse{
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean
    messages?: Array<Message>
}