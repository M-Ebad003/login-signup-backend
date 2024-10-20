"use client";
import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";
import { apiResponse } from "@/types/apiResponse";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCompletion } from "ai/react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const newMessages = [
  "What's your favorite TV show?",
  "If you could have any superpower, what would it be?",
  "What's the best vacation you've ever had?",
  "Who inspires you the most?",
  "What's your favorite type of music?",
  "If you could meet any historical figure, who would it be?",
  "What's the most interesting book you've ever read?",
  "If money were no object, what would you do all day?",
  "What skill would you like to learn the most?",
  "If you could live in any time period, which one would you choose?",
];

const page = () => {
  // const initialMessageString =
  //   "What's your favorite movie?||Do you have any pets?||What's your dream job?||Which game you love the most";
  const [messages, setMessages] = useState<string[]>([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
    "Which game you love the most",
  ]);

  const suggestMessages = () => {
    const shuffledMessages = newMessages.sort(() => 0.5 - Math.random());
    const selectedMessages = shuffledMessages.slice(0, 4);
    setMessages(selectedMessages);
  };
  const specialChar = "||";

  const parseStringMessages = (messageString: string): string[] => {
    return messageString.split(specialChar);
  };
  const params = useParams<{ username: string }>();
  const username = params.username;
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const watchMessage = form.watch("content");
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/sendMessages", {
        ...data,
        username,
      });
      toast({
        title: "Successful",
        description: response.data.message,
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      const axiosError = error as AxiosError<apiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ||
          "Failed to fetch message settings",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };
  // const {
  //   complete,
  //   completion,
  //   isLoading: isSuggestLoading,
  //   error,
  // } = useCompletion({
  //   api: "/api/suggestMessages",
  //   initialCompletion: initialMessageString,
  // });
  // const fetchMessages = async () => {
  //   try {
  //     complete("");
  //   } catch (error) {
  //     const axiosError = error as AxiosError<apiResponse>;
  //     toast({
  //       title: "Error",
  //       description: "Failed to suggest message",
  //       variant: "destructive",
  //     });
  //   }
  // };
  const handleClick = (message: string) => {
    form.setValue("content", message);
  };
  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className=" text-center mb-6 text-4xl font-bold">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send anonymous message to @{username}</FormLabel>
                <FormControl>
                  <Input
                    className="h-14 text-left"
                    placeholder="Write your anonymous message here "
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-center items-center">
            {isLoading ? (
              <Button disabled>
                <Loader2 className="animate-spin" />
                Please wait...
              </Button>
            ) : (
              <Button disabled={isLoading || !watchMessage} type="submit">
                Send Message
              </Button>
            )}
          </div>
        </form>
      </Form>
      <div className="space-y-4 my-8">
        <div className="space-y-2">
          <Button onClick={suggestMessages} disabled={isLoading}>
            Suggest Messages
          </Button>
          <p>Click on any message below to select it</p>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">Messages</h3>
          </CardHeader>
          <CardContent className="flex flex-col space-y-4">
            {messages.map((message, index) => (
              <Button
                key={index}
                variant="outline"
                className="mb-2"
                onClick={() => handleClick(message)}
              >
                {message}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
      <Separator className="my-6" />
      <div className="items-center text-center">
        <div className="mb-4">Get your Message Board</div>
        <Link target="_blank" href="/sign-up">
          <Button>Create your account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
