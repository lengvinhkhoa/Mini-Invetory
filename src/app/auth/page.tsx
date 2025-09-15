"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const SignInSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
type SignInValues = z.infer<typeof SignInSchema>;

const SignUpSchema = z.object({
  name: z.string().min(2, "Tên tối thiểu 2 ký tự"),
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu tối thiểu 6 ký tự"),
});
type SignUpValues = z.infer<typeof SignUpSchema>;

const ResetSchema = z.object({
  email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
});
type ResetValues = z.infer<typeof ResetSchema>;

export default function AuthPage() {
  const [tab, setTab] = useState("sign-in");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle, resetPassword, user } = useAuth();
  const router = useRouter();

  const signInForm = useForm<SignInValues>({
    resolver: zodResolver(SignInSchema),
    defaultValues: { email: "", password: "" },
  });
  const signUpForm = useForm<SignUpValues>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: { name: "", email: "", password: "" },
  });
  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(ResetSchema),
    defaultValues: { email: "" },
  });

  // Redirect nếu đã đăng nhập
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async (values: SignInValues) => {
    setLoading(true);
    try {
      await signIn(values.email, values.password);
      toast.success("Đăng nhập thành công!");
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (values: SignUpValues) => {
    setLoading(true);
    try {
      await signUp(values.email, values.password, values.name);
      toast.success("Đăng ký thành công!");
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
      toast.success("Đăng nhập Google thành công!");
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (values: ResetValues) => {
    setLoading(true);
    try {
      await resetPassword(values.email);
      toast.success("Email đặt lại mật khẩu đã được gửi!");
      resetForm.reset();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Xác thực</CardTitle>
          <CardDescription>Đăng nhập / Đăng ký / Quên mật khẩu</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="sign-in">Đăng nhập</TabsTrigger>
              <TabsTrigger value="sign-up">Đăng ký</TabsTrigger>
              <TabsTrigger value="reset">Quên mật khẩu</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              {tab === "sign-in" && (
                <TabsContent value="sign-in" className="mt-4" forceMount>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-3"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      Đăng nhập với Google
                    </Button>
                    <Form {...signInForm}>
                      <form
                        onSubmit={signInForm.handleSubmit(handleSignIn)}
                        className="space-y-4"
                      >
                        <FormField
                          control={signInForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signInForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <Input placeholder="••••••••" type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              )}

              {tab === "sign-up" && (
                <TabsContent value="sign-up" className="mt-4" forceMount>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mb-3"
                      onClick={handleGoogleSignIn}
                      disabled={loading}
                    >
                      Đăng ký nhanh với Google
                    </Button>
                    <Form {...signUpForm}>
                      <form
                        onSubmit={signUpForm.handleSubmit(handleSignUp)}
                        className="space-y-4"
                      >
                        <FormField
                          control={signUpForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tên</FormLabel>
                              <FormControl>
                                <Input placeholder="Nguyễn Văn A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={signUpForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu</FormLabel>
                              <FormControl>
                                <Input placeholder="••••••••" type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Đang đăng ký..." : "Đăng ký"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              )}

              {tab === "reset" && (
                <TabsContent value="reset" className="mt-4" forceMount>
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    <Form {...resetForm}>
                      <form
                        onSubmit={resetForm.handleSubmit(handleResetPassword)}
                        className="space-y-4"
                      >
                        <FormField
                          control={resetForm.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="you@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Đang gửi..." : "Gửi liên kết"}
                        </Button>
                      </form>
                    </Form>
                  </motion.div>
                </TabsContent>
              )}
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


