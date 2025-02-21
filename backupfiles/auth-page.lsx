import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { Redirect, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoadingDashboard from "@/components/dashboard/LoadingDashboard";

type LoginData = Pick<InsertUser, "username" | "password">;

export default function AuthPage() {
  const [location] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();

  const loginForm = useForm<LoginData>({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
    defaultValues: {
      username: "",
      password: ""
    }
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      role: "viewer"
    }
  });

  // If already logged in, redirect based on role
  if (user) {
    const redirectPath = user.role === 'admin' ? '/dashboard' : '/';
    return <Redirect to={redirectPath} />;
  }

  const searchParams = new URLSearchParams(location);
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";

  return (
    <>
      <LoadingDashboard />
      <div className="absolute inset-0 min-h-screen flex items-center justify-center p-4 z-10">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="glass backdrop-blur-sm border border-primary/20">
              <CardHeader>
                <CardTitle>Welcome to RWD</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue={defaultTab}>
                  <TabsList className="grid grid-cols-2 w-full">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="register">Create Account</TabsTrigger>
                  </TabsList>

                  <TabsContent value="login">
                    <Form {...loginForm}>
                      <form
                        onSubmit={loginForm.handleSubmit((data) => loginMutation.mutate(data))}
                        className="space-y-4"
                      >
                        <FormField
                          control={loginForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/80" />
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} className="bg-background/80" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                          disabled={loginMutation.isPending}
                        >
                          Sign In
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>

                  <TabsContent value="register">
                    <Form {...registerForm}>
                      <form
                        onSubmit={registerForm.handleSubmit((data) => registerMutation.mutate(data))}
                        className="space-y-4"
                      >
                        <FormField
                          control={registerForm.control}
                          name="username"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input {...field} className="bg-background/80" />
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
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input type="email" {...field} className="bg-background/80" />
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} className="bg-background/80" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600"
                          disabled={registerMutation.isPending}
                        >
                          Create Account
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block">
            <div className="h-full flex flex-col justify-center space-y-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 text-transparent bg-clip-text">
                  Why Choose Rapid Web Developer?
                </h2>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="glass p-2 rounded-lg">Quick and easy website creation</li>
                  <li className="glass p-2 rounded-lg">Professional templates and components</li>
                  <li className="glass p-2 rounded-lg">Real-time statistics and analytics</li>
                  <li className="glass p-2 rounded-lg">Secure user management</li>
                  <li className="glass p-2 rounded-lg">Full ownership options available</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}