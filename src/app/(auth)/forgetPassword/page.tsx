"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { forgetPasswordSchema } from "@/schemas/forgotPasswordSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { apiResponse } from "@/types/apiResponse";
import { CircleArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

const RecoverPassword = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const submitHandler = async (data: z.infer<typeof forgetPasswordSchema>) => {
    setloading(true);
    try {
      const response = await axios.post("/api/forgetPassword", {
        ...data,
      });
      console.log(response.data.message);
      router.push("/feedback");
    } catch (error) {
      console.error("Error ", error);
      const axiosError = error as AxiosError<apiResponse>;
      let errorMessage = axiosError.response?.data.message;
      toast({
        title: "Password recovery email failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
    setloading(false);
  };
  const form = useForm<z.infer<typeof forgetPasswordSchema>>({
    resolver: zodResolver(forgetPasswordSchema),
  });
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-full max-w-sm shadow-lg p-10 space-y-10 bg-gray-300 rounded-lg">
        <div className="-ml-2">
        <Link href='/sign-in'>
          <CircleArrowLeft/>
        </Link>
        </div>
        <div className="text-center">
          <h1 className="text-3xl">Recover Password</h1>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-6"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Username *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your username or email"
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
                style={{
                  textTransform: "none",
                  fontWeight: "600",
                  borderRadius: "0rem",
                }}
              >
                {loading ? (
                  <div>
                    <Loader2 className="animate-spin" />
                  </div>
                ) : (
                  <div>Send me a Password Recovery Email</div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RecoverPassword;
