import React, { useState } from 'react'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
  import { Input } from "@/components/ui/input";
  import { useForm } from "react-hook-form";
  import { z } from "zod";
  import { zodResolver } from "@hookform/resolvers/zod";
  import axios, { AxiosError } from "axios";
  import { apiResponse } from "@/types/apiResponse";
  import { Loader2 } from "lucide-react";
  import { useRouter } from "next/navigation";
import { newPasswordSchema } from '@/schemas/newPasswordSchema';
import { Button } from '@/components/ui/button';

const newPassword = () => {
    const [loading, setloading] = useState(false)

    const submitHandler=async(data: z.infer<typeof newPasswordSchema>)=>{
        try {
            const response = await axios.post('/api/new-password',{
                password: data.password
            })
            
        } catch (error) {
            console.log('error updating password')
            const axiosError= error as AxiosError<apiResponse>
            return Response.json({
                success: false,
                message: axiosError.response?.data.message
            })
        }
    }
    const form=useForm<z.infer<typeof newPasswordSchema >>({
        resolver: zodResolver(newPasswordSchema)
    })
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm shadow-lg p-10 space-y-10 bg-gray-300 rounded-lg">
        <div className="text-center">
        <h1 className="text-3xl">Recover Password</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-6"
          >
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter your password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-center items-center">
              <Button
                type="submit"
              >
                Reset Password
                {loading && 
                <div>
                    <Loader2 className="animate-spin"/>
                    </div>}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default newPassword