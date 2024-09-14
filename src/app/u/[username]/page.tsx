'use client'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import axios, { AxiosError } from 'axios'
import { useToast } from '@/hooks/use-toast'
import { apiResponse } from '@/types/apiResponse'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const page = () => {
  const params = useParams<{username:string}>();
  const username=params.username;
  const { toast } = useToast();


  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })

  const watchMessage= form.watch('content')
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/sendMessages', {
        ...data,
        username
      })
        toast({
          title: "Successful",
          description: response.data.message,
        })   
        form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: 'Error',
        description: axiosError.response?.data.message || 'Failed to fetch message settings',
        variant: 'destructive'
      })
    }
    setIsLoading(false);
  }

  return (
    <div className='container mx-auto my-8 p-6 bg-white rounded max-w-4xl'>
        <h1 className=' text-center mb-6 text-4xl font-bold'>Public Profile Link</h1>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Send anonymous message to @{username}</FormLabel>
                  <FormControl>
                    <Input className='h-14 text-left' placeholder="Write your anonymous message here " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-center items-center'>
              {isLoading ? (
                <Button disabled>
                  <Loader2 className='animate-spin'/>
                  Please wait...
                </Button>
              ): (
                  <Button disabled={isLoading || !watchMessage} type='submit'>Send Message</Button>
              )}
            </div>
          </form>
        </Form>
    </div>
  )
}

export default page