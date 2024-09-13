'use client'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'
import {
  Form,
  FormControl,
  FormDescription,
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

const page = () => {
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  })
  const params = useParams();
  const { toast } = useToast()

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    try {
      const response = await axios.post('/api/sendMessages', {
        username: params.username,
        content: data.content
      })
      if (!response.data.isAcceptingMessages) {
        toast({
          title: "Error",
          description: response.data.message,
          variant: 'destructive'
        })
      }
      toast({
        title: "Successfull",
        description: response.data.message,
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

  return (
    <div className='my-8 mx-4 md:mx-8 lg:mx-auto p-6'>
      <div className='flex justify-center items-center text-center'>
        <h1 className='mt-10 text-4xl font-bold'>Public Profile Link</h1>
      </div>
      <div className='mx-10 mt-5'>
        <h3 className='font-semibold mb-4'>Send anonymous message to @{params.username}</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input className='h-14 text-left' placeholder="Write your anonymous message here " {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex justify-center items-center'>
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default page