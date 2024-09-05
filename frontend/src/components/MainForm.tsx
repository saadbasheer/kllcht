"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
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
import { RoomtIdInput } from "./RoomIdInput";
import { Separator } from "./ui/separator";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const FormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  roomId: z
    .string()
    .min(8, { message: "Room ID must be at least 8 characters." })
    .optional(),
});

export function MainForm() {
  const { toast } = useToast();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");
  const router = useRouter();

  function generateRoomID(length = 8) {
    return Math.random()
      .toString(36)
      .substring(2, 2 + length)
      .toUpperCase(); // Optional: Capitalize the room ID
  }

  function handleCreateRoom() {
    if (!username) {
      toast({
        title: "Error",
        description: "Please enter a username.",
      });
      return;
    }
    const newRoomId = generateRoomID();
    router.push(`chat/${newRoomId}?username=${username}`);
  }

  function handleJoinRoom() {
    if (!username || !roomId) {
      toast({
        title: "Error",
        description: "Please enter both username and room ID.",
      });
      return;
    }
    router.push(`chat/${roomId}?username=${username}`);
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      roomId: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // Optional: handle form submission if needed
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <>
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      field.onChange(e);
                    }}
                    placeholder="Enter your @username"
                    type="text"
                  />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>Enter Room ID</FormLabel>
                <div className="flex gap-2">
                  <RoomtIdInput roomId={roomId} setRoomId={setRoomId} />
                  <Button
                    onClick={handleJoinRoom}
                    className="rounded-lg w-full"
                  >
                    Join
                  </Button>
                </div>
                <FormDescription>
                  Create a room if you don{"'"}t have one yet.
                </FormDescription>
              </FormItem>
              <Separator className="my-4" />
            </>
          )}
        />
        <Button onClick={() => {handleCreateRoom()}} className="hover:drop-shadow-lg w-full">
          Create a Room
        </Button>
      </form>
    </Form>
  );
}
