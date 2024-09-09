import { z } from "zod";


export const userValidation = z
  .string()
  .min(3, 'Username must be atleast 3 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Username must not contain special characters')


export const signUpSchema = z.object({
  username: userValidation,
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(6, { message: 'password must be atleast 6 digits' })
})