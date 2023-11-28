// Zod use for form validation and it's import from shadcn-ui
import { zodResolver } from "@hookform/resolvers/zod"
// useForm for creating form
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SigninValidation } from "@/lib/validation"
import { z } from "zod"
import { Loader } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
// Toaster import
import { useToast } from "@/components/ui/use-toast"
// import { useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"
import { useSignInAccount } from '@/lib/react-query/queriesAndMutations'



const SigninForm = () => {

  // toast
  const { toast } = useToast();

  const { checkAuthUser, isLoading: isUserLoading } = useUserContext();

  // for useNavigate() from react router dom
  const navigate = useNavigate();

  // Query
  const { mutateAsync: signInAccount, isPending: isLoading } = useSignInAccount();

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: '',
    },
  });
 
  // 2. Define a submit handler.
  const handleSignin = async (user: z.infer<typeof SigninValidation>) => {

    const session = await signInAccount(user);

    if (!session) {
      toast({ title: 'Login failed. Please try again.' });
      return;
    }

    const isLoggedIn = await checkAuthUser();

    if (isLoggedIn) {
      form.reset();

      navigate('/');
    } else {
      toast( { title: 'Login failed. Please try again.' });
      return;
    }
  };


  return (
      <Form {...form}>
        {/* Logo and name show */}
        <div className="sm:w-420 flex-center flex-col">
          {/* <img src="/assets/images/logo.svg" alt="logo" /> */}
          <h1 className="h3-bold md:h2-bold" style={{fontFamily: 'Trebuchet MS'}}>LifeLink</h1>
          {/* Heading  */}
          <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">Log in to your account</h2>
          <p className="text-light-3 small-medium md:base-regular mt-2">Wellcome back in LifeLink!</p>
        
          {/* Form */}
          <form onSubmit={form.handleSubmit(handleSignin)} className="flex flex-col gap-5 w-full mt-4">

            {/* for email  */}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" className="shad-input " placeholder="your.user@gmail.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" className="shad-input " placeholder="********" {...field} />
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
              {isLoading || isUserLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Signing 
              </div>
            ) : (
              "Log In"
            )}</Button>

            {/* Login  */}
            <p className="text-small-regular text-light-2 text-center mt-2">
              Don't have an account?
              <Link to='/sign-up' className="text-primary-500 text-small-semibold ml-1">Sign Up</Link>
            </p>
          </form>
        </div>
    </Form>
  )
}

export default SigninForm
