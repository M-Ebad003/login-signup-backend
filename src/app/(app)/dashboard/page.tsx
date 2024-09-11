'use client'
import MessageCard from '@/components/MessageCard'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/user.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const page = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);
  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id! == messageId))
  }

  // session : gives you the current logged in user
  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema)
  })

  const { register, watch, setValue } = form;

  const acceptMessages = watch('acceptMessages');

  //  checking the status of user if he is accepting messages or not
  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get('/api/acceptMessages')
      setValue('acceptMessages', response.data.isAcceptingMessages)

    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  //  fetching messages from database
  const fetchMessages = useCallback(async (refresh: boolean) => {
    setLoading(true)
    setIsSwitchLoading(false);
    try {
      const response = await axios.get<apiResponse>('/api/getMessages')
      setMessages(response.data?.messages || [])
      if (refresh) {
        toast({
          title: 'Refresing Messages',
          description: 'Showing latest messages',
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
      setIsSwitchLoading(false);
    }
  }, [setLoading, setMessages])


  useEffect(() => {
    if (!session || !session.user) return
    fetchMessages();
    fetchAcceptMessage();

  }, [session, setValue, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<apiResponse>('/api/acceptMessages', {
        acceptMessages: !acceptMessages
      })
      setValue('acceptMessages', acceptMessages)
      toast({
        title: response.data.message,
        variant: 'default'
      })
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    }
  }

  // const { username } = session?.user as User;
  // // TODO: 
  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  // const profileUrl = `${baseUrl}/u/${username}`

  // const copyToClipboard = ()=>{
  //   navigator.clipboard.writeText(profileUrl)
  //   toast({
  //     title : 'URL copied',
  //     description: 'Profile URL has been copied to clipboard'
  //   })
  // }
  if (!session || !session.user) {
    return <div>Please log in</div>
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1>User dashboard</h1>
    </div>

  )
}

export default page