import {z} from 'zod'

const signupSchema = z.object({
    username: z
        .string({required_error: "Name is Required"})
        .trim()
        .min(3, {message: "Name must be at least 3 characters"})
        .max(30, {message: "Name must be at most 30 characters"}),
    email: z
        .string({required_error: "Email is Required"})
        .trim()
        .min(5, {message: "Email must be at least 5 characters"})
        .max(50, {message: "Email must be at most 50 characters"}),
    phone: z
        .string({required_error: "Phone Number is Required"})
        .trim()
        .min(10, {message: "Phone Number must be 10 characters"}),
    password: z
        .string({required_error: "Password is Required"})
        .trim()
        .min(5, {message: "Password must be at least 5 characters"})
        .max(50, {message: "Password must be at most 50 characters"}),
})

const loginSchema = z.object({
    username: z
        .string({required_error: "Username is Required"})
        .trim()
        .min(3, {message: "Username must be at least 3 characters"})
        .max(30, {message: "Username must be at least 30 characters"}),
    password: z
        .string({required_error: "Password is Required"})
        .trim()
        .min(5, {message: "Password must be at least 5 characters"})
        .max(20, {message: "Password must be at most 20 characters"})
})

const contactSchema = z.object({
    username: z
    .string({required_error: "Username is Required"})
    .trim()
    .min(3, {message: "Username must be at least 3 character"})
    .max(30, {message: "Username must be at most 30 character"}),
    email: z
    .string({required_error: "Email is Required"})
    .trim()
    .min(5, {message: "Email must be at least 5 character"})
    .max(50, {message: "Email must be at most 50 character"}),
    message: z
    .string({required_error: "Message cannot be Empty"})
    .trim()
    .max(1000, {message: "Message must be less than 1000 character"})
})

export {signupSchema, loginSchema, contactSchema}