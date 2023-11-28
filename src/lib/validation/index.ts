// zod for form validation
import * as z from "zod"

 // for sign up form input fields 
export const signupValidation = z.object({
    name: z.string().min(2, { message: 'Name contain at least 2 characters' }).max(50, { message: 'Name should contain a maximum of 50 characters'}), 
    username: z.string().min(4, { message: 'Username must be at least 4 charactors' }).max(30, { message: 'Username should contain a maximum of 30 characters ' }),
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 charactors' }).max(24, { message: 'Password should contain a maximum of 24 characters' }),
})

 // for sign in form input fields 
 export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { message: 'Password must be at least 8 charactors' }),
})

// 
export const ProfileValidation = z.object({
    File: z.custom<File[]>(),
    name: z.string().min(2, { message: 'Name contain at least 2 characters' }), 
    username: z.string().min(4, { message: 'Username must be at least 4 charactors' }).max(30, { message: 'Username should contain a maximum of 30 characters ' }),
    email: z.string().email(),
    bio: z.string().min(0).max(100, { message: 'Bio should contain a maximum of 100 characters'}), 
});

 // for sign in form input fields 
 export const PostValidation = z.object({
    caption: z.string().min(0).max(3000),
    file: z.custom<File[]>(),
    location: z.string().min(0).max(100),
    tags: z.string(),
})