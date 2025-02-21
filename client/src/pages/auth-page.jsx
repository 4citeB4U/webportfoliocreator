import { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema } from "@shared/schema";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { useLocation } from "wouter";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [, setLocation] = useLocation();

  const loginForm = useForm({
    resolver: zodResolver(
      insertUserSchema.pick({ username: true, password: true })
    ),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
    },
  });

  // Use useEffect for navigation
  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  // If user is logged in, render nothing while redirect happens
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-black to-slate-900">
      {/* Content */}
      <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center p-4 gap-8">
        {/* Form Section */}
        <div className="w-full max-w-md">
          <Card className="w-full bg-black/70 border border-cyan-500/50 shadow-xl backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-cyan-400">Welcome to AgentLee.com</CardTitle>
              <CardDescription className="text-gray-300">
                Your AI-powered business coach and personal advisor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="username"
                                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                autoComplete="current-password"
                                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                        disabled={loginMutation.isPending}
                      >
                        {loginMutation.isPending ? "Logging in..." : "Login"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>

                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Username</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                autoComplete="username"
                                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Email</FormLabel>
                            <FormControl>
                              <Input
                                type="email"
                                {...field}
                                autoComplete="email"
                                placeholder="your@email.com"
                                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-gray-200">Password</FormLabel>
                            <FormControl>
                              <Input
                                type="password"
                                {...field}
                                autoComplete="new-password"
                                className="bg-black/50 border-cyan-500/30 text-white placeholder:text-gray-500 focus:border-cyan-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="submit"
                        className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold"
                        disabled={registerMutation.isPending}
                      >
                        {registerMutation.isPending ? "Creating account..." : "Register"}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="text-center text-sm text-gray-400">
              By signing up, you agree to our Terms of Service and Privacy Policy
            </CardFooter>
          </Card>
        </div>

        {/* Hero Section */}
        <div className="w-full max-w-lg">
          <div className="backdrop-blur-md bg-black/70 p-8 rounded-lg border border-cyan-500/30 shadow-xl">
            <h1 className="text-3xl lg:text-4xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Transform Your Business with AI-Powered Insights
            </h1>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <span className="h-2 w-2 bg-cyan-500 rounded-full" />
                <span className="text-gray-300">Personal AI business coach available 24/7</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="h-2 w-2 bg-cyan-500 rounded-full" />
                <span className="text-gray-300">Advanced voice interaction capabilities</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="h-2 w-2 bg-cyan-500 rounded-full" />
                <span className="text-gray-300">Real-time business insights and analytics</span>
              </li>
              <li className="flex items-center space-x-3">
                <span className="h-2 w-2 bg-cyan-500 rounded-full" />
                <span className="text-gray-300">Secure note-taking and organization tools</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
