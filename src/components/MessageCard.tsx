'use client'
import React from 'react'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from './ui/button'
import { X } from 'lucide-react'
import { Message } from '@/model/user.model'
import { useToast } from '@/hooks/use-toast'
import axios, { AxiosError } from 'axios'
import { apiResponse } from '@/types/apiResponse'
import dayjs from 'dayjs'

type MessageCardProps = {
    message: Message;
    onMessageDelete: (messageId: string) => void
}

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
    const { toast } = useToast()
    const handleDeleteConfirm = async () => {
        try {
            console.log('delete message id',message._id)
            const response = await axios.delete<apiResponse>(`/api/deleteMessage/${message._id}`)
            toast({
                title: response.data.message
            })
            onMessageDelete(message._id as string)
            
        } catch (error) {
            const axiosError = error as AxiosError<apiResponse>
            toast({
                title: "Error",
                description: axiosError.response?.data.message ?? 'Failed to delete messages',
                variant: 'destructive'
            })
        }
    }
    return (
        <Card className=''>
            <CardHeader>
                <div className='flex justify-between items-center'>
                    <CardTitle>{message.content}</CardTitle>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive"><X className='w-5 h-5' /></Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your
                                    account and remove your data from our servers.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className='text-sm'>
                    <CardDescription>{dayjs(message.createdAt).format('MM D,YYYY h:mm A')}</CardDescription>
                </div>
            </CardHeader>
        </Card >

    )
}

export default MessageCard