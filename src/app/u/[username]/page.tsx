"use client";
import { messageSchema } from "@/schemas/messageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

const page = () => {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const params = useParams<{ username: string }>();
  const username = params.username;
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSendingMessage(true);
    try {
      const response = await axios.post(`/api/send-message`, {
        username,
        content: data.content,
      });
      const toastId = toast.success(response.data.message, {
        style: {
          height: "50px",
        },
        action: {
          label: <Trash2 className="w-4 h-4" />,
          onClick: () => toast.dismiss(toastId),
        },
      });
      form.reset({ ...form.getValues(), content: "" });
    } catch (error) {
      console.error("Error in sending message:", error);
      const axiosError = error as AxiosError<ApiResponse>;
      const toastId = toast.error(axiosError.response?.data.message, {
        style: {
          height: "50px",
        },
        action: {
          label: <Trash2 className="w-4 h-4" />,
          onClick: () => toast.dismiss(toastId),
        },
      });
    } finally {
      setIsSendingMessage(false);
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem className="w-full flex flex-col items-center space-y-3">
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Your anonymous message..."
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="cursor-pointer"
            disabled={isSendingMessage}
          >
            {isSendingMessage ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Message...
              </>
            ) : (
              "Send Message"
            )}
          </Button>
        </form>
      </Form>
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
