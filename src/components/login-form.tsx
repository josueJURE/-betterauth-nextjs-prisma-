// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Field,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSeparator,
// } from "@/components/ui/field";
// import { Input } from "@/components/ui/input";

// import {
//   Card,
//   CardAction,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { useRouter } from "next/navigation";

// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";

// import { zodResolver } from "@hookform/resolvers/zod";
// import {authClient} from "@/lib/auth-client"

// import { signInFormSchema } from "@/lib/validation-schemas";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { toast } from "sonner";

// export default function LoginForm({
//   className,
//   ...props
// }: React.ComponentProps<"form">) {
//   const form = useForm<z.infer<typeof signInFormSchema>>({
//     resolver: zodResolver(signInFormSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const router = useRouter()

//   function handleRouting() {
//     router.push("/recipe")
//   }

//   async function onSubmit(values: z.infer<typeof signInFormSchema>) {
//     const { email, password } = values;
//     const { data, error } = await authClient.signIn.email(
//       {
//         email,
//         password,
//         callbackURL: "/recipe-iu",
//       },
//       {
//         onRequest: () => {
//           toast("Please wait.");
//         },
//         onSuccess: () => {
//           form.reset();
//         },
//         onError: (ctx) => {
//           toast(ctx.error.message);
//         },
//       }
//     );
//   }

//   return (
//     <Card className="w-full max-w-md mx-auto">
//       <CardHeader className="text-center items-center justify-center">
//         <CardTitle >Login to your account</CardTitle>
//         <CardDescription className="whitespace-nowrap text-1xl">
//           <h1>Enter your email below to login to your account.</h1>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className={cn("flex flex-col gap-6", className)}
//             {...props}
//           >
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="john@mail.com" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FieldGroup>
// {/*
//               <Field>
//                 <FieldLabel htmlFor="email">Email</FieldLabel>
//                 <Input
//                   id="email"
//                   type="email"
//                   placeholder="m@example.com"
//                   required
//                 />
//               </Field> */}
//               <Field>
//                 <div className="flex items-center">
//                   <FieldLabel htmlFor="password">Password</FieldLabel>
//                   <a
//                     href="#"
//                     className="ml-auto text-sm underline-offset-4 hover:underline"
//                   >
//                     Forgot your password?
//                   </a>
//                 </div>
//                 <Input id="password" type="password" required />
//               </Field>
//               <Field>
//                 <Button  type="submit">Login</Button>
//               </Field>
//               <FieldSeparator>Or continue with</FieldSeparator>
//               <Field>
//                 <Button variant="outline" type="button">
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
//                     <path
//                       d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
//                       fill="currentColor"
//                     />
//                   </svg>
//                   Login with GitHub
//                 </Button>
//                 <FieldDescription className="text-center">
//                   Don&apos;t have an account?{" "}
//                   <a href="/sign-up" className="underline underline-offset-4">
//                     Sign up
//                   </a>
//                 </FieldDescription>
//               </Field>
//             </FieldGroup>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { signInFormSchema } from "@/lib/validation-schemas";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

export default function SignIn() {
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    console.log("this is called!!");
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/recipe-ui",
      },
      {
        onRequest: () => {
          toast("Please wait.");
        },
        onSuccess: () => {
          form.reset();
        },
        onError: (ctx) => {
          toast(ctx.error.message);
        },
      }
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center items-center justify-center">
        {/* <CardTitle>Sign In</CardTitle> */}
        <CardDescription className="whitespace-nowrap">
          Welcome back! Please sign in to continue.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          {/* <form onSubmit={form.handleSubmit( onSubmit)} className="space-y-4"> */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="john@mail.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account yet?{" "}
          <Link href="/sign-up" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
