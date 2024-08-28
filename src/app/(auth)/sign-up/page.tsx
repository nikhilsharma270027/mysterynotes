"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/Schemas/signUpSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const page = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  // to check where we have or we dont a unique username
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  // form submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // the usernmae usestate we take function setUsername from it
  // const debouncedUsername before
  const debounced = useDebounceCallback(setUsername, 500);// function //300 MILISECONDS
  const { toast } = useToast();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  // we use useEffect cuz i want when user type username then we debounce that ok but i send request to check wheather there is unique username
  useEffect(() => {
    const checkUsernameUnique = async () => {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage("");
        try {
          const response = await axios.get(
            `/api/check-username-unique?username=${username}`
          );
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(
            axiosError.response?.data.message ?? "Error checking username"
          );
        } finally {
          // below was too be mentioned in both try and catch so to gether we can write in finally, so in both case it will work
          setIsCheckingUsername(false);
        }
      }
    };
    checkUsernameUnique();
  }, [username]);

  // const onSubmit = async (data) => {
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true); // loader state
    // the data consist of username,email,password // apne app main object hai
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      // can use router.redirect cuz domain is as it is
      // now the user will get an email, user will go to verify
      // router.replace: This changes the current URL without adding a new entry to the browser's history. It replaces the current history entry, so when you navigate away and press the back button, the user won't be taken to the previous URL.
      router.replace(`/verify/${username}`);
      // we will create a verify route to capture usernmae for verify-code route
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error in signup of user", error);
      const axiosError = error as AxiosError<ApiResponse>;

      let errorMessage = axiosError.response?.data.message;

      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });

      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          {/* // form line 27 */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="username"
                      {...field}
                      onChange={(e) => {
                        // we dont need to add onchange react-hook-form automaticaaly handle inputs
                        // we used it became we are separately manageing username state
                        field.onChange(e);
                        // setUsername(e.target.value);
                        debounced(e.target.value);
                      }}
                    />
                  </FormControl>
                  {isCheckingUsername && <Loader2 className="animate-spin" />}
                  <p className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}>
                    test {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // Email */}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // Password */}
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* // */}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Signup"
              )}
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">
              Sign <input type="text" name="" id="" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
