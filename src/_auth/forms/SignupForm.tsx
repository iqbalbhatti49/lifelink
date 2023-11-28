// Zod use for form validation and it's import from shadcn-ui
import { zodResolver } from "@hookform/resolvers/zod"
// useForm for creating form
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormMessage, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signupValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
// Toaster import
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"



const SignupForm = () => {

  // toast
  const { toast } = useToast();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // for useNavigate() from react router dom
  const navigate = useNavigate();

  // for loading
  // const isLoading = false;

  const { mutateAsync: createUserAccount, isPending: isCreatingUser } = useCreateUserAccount(); 

  const { mutateAsync: signInAccount, isPending: isSigningUser } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof signupValidation>>({
    resolver: zodResolver(signupValidation),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
  });
 
  // 2. Define a submit handler.
  const handleSignup = async (values: z.infer<typeof signupValidation>) => {
    
    try {
      // create the user
      const newUser = await  createUserAccount(values);

      if (!newUser) {
        return toast({
          title: "Sign up failed. Please try again.",
        });
        return;
      }

      const session = await signInAccount({
        email: values.email,
        password: values.password,
      });

      if (!session) {
        toast({ title: 'Something went wrong. Please login your new account.' });
        navigate('/sign-in');
        return;
      }

      const isLoggedIn = await checkAuthUser();

      if (isLoggedIn) {
        form.reset();

        navigate('/');
      } else {
        toast( { title: 'Sign up failed. Please try again.', });
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }


  return (
      <Form {...form}>
        {/* Logo and name show */}
        <div className="sm:w-420 flex-center flex-col">
          {/* <img src="/assets/images/logo.svg" alt="logo" /> */}
          <h1 className="h3-bold md:h2-bold" style={{fontFamily: 'Trebuchet MS'}}>LifeLink</h1>
          {/* Heading  */}
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Create a new account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">Enter your details and use LifeLink</p>
        
          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSignup)} className="flex flex-col gap-5 w-full mt-4">

            {/* for Full Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Full Name</FormLabel> */}
                  <FormControl>
                    <Input type="text" className="shad-input " placeholder="Full Name" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* for Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Username</FormLabel> */}
                  <FormControl>
                    <Input type="text" className="shad-input " placeholder="Username" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* for  */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl>
                    <Input type="email" className="shad-input " placeholder="Email" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* for Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl>
                    <Input type="password" className="shad-input " placeholder="Password" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Sign Up button */}
            <Button type="submit" className="shad-button_primary">
              {isCreatingUser || isSigningUser || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : "Sign Up"}</Button>

            {/* Login  */}
            <p className="text-small-regular text-light-2 text-center mt-2">
              Already have an account?
              <Link to='/sign-in' className="text-primary-500 text-small-semibold ml-1">Log In</Link>
            </p>
          </form>
        </div>
    </Form>
  )
}

export default SignupForm
