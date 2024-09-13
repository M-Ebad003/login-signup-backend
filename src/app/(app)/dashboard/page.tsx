'use client'
import MessageCard from '@/components/MessageCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { Message } from '@/model/user.model'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { apiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { Loader2, RefreshCcw } from 'lucide-react'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
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
  const fetchMessages = useCallback(async (refresh: boolean=false) => {
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
  // TODO: 
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${session?.user.username}`

  const copyToClipboard = ()=>{
    navigator.clipboard.writeText(profileUrl)
    toast({
      title : 'URL copied',
      description: 'Profile URL has been copied to clipboard'
    })
  }
  if (!session || !session.user) {
    redirect('/')
    
  }

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl'>
      <h1 className='text-4xl font-bold mb-4'>User dashboard</h1>
      <div className='mb-4'>
        <h2 className='text-lg font-semibold mb-2'>Copy your Unique Link</h2>{' '}
        <div className='flex items-center'>
          <input 
          type='text'
          value={profileUrl}
          disabled
          className='input input-bordered w-full p-2 mr-2'/>
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className='mb-4'>
      <Switch
      {...register('acceptMessages')}
      checked={acceptMessages}
      onCheckedChange={handleSwitchChange}
      disabled={isSwitchLoading}
      />
      <span className='ml-2'>
        Accept Messages : {acceptMessages ? 'On': 'Off'}
      </span>
      </div>
      <Separator/>

      <Button className='mt-4' variant='outline' onClick={(e)=>{
        e.preventDefault();
        fetchMessages(true)
      }}>
        {loading ? (
          <Loader2 className='h-4 w-4 animate-spin'/>
        ): (
          <RefreshCcw className='h-4 w-4'/>
        )}
      </Button>
      <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-6'>
        {messages.length > 0 ?(
          messages.map((message,index)=>(
            <MessageCard
            key={message._id}
            message={message}
            onMessageDelete={handleDeleteMessage}/>
          ))
        ) : (
          <div>No messages to display.</div>
        )}
      </div>
    </div>

  )
}

export default page