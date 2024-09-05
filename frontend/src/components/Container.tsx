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



  
  return (
    <Card className="p-8 bg-black/80 overflow-hidden lg:w-[500px]">
      <CardHeader>
        <CardTitle className="text-2xl font-serif font-bold ">Hello</CardTitle>
        <CardDescription className=" text-wrap text-muted-foreground">
          /kllcht lets you create disposable communication channels, join or
          create one to begin.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MainForm />
      </CardContent>
      <CardFooter className="flex justify-center -mt-2">
        <p className="text-[0.8rem] text-muted-foreground text-center">
          Create and share your room with your friends
        </p>
      </CardFooter>
    </Card>
  );
}
