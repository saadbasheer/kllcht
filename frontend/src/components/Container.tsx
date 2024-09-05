"use client"
import React from "react";
import {  MainForm } from "./MainForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";


export default function Container() {
  function generateRoomID(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
  }


  
  return (
    <div className="">
      
      <Card className="mx-auto max-w-md p-9">
        <CardHeader>
          <CardTitle className="text-2xl font-mono ">Hey there!</CardTitle>
          <CardDescription>
            Create or join chat rooms to begin chatting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <MainForm/>
        </CardContent>
        <CardFooter className="flex justify-center -mt-2">
          <p className="text-[0.8rem] text-muted-foreground text-center">Create and share your room with your friends</p>
        </CardFooter>
      </Card>
    </div>
  );
}
