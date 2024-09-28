import {z} from 'zod'


export const forgetPasswordSchema=z.object({
    email: z.string().email({ message: 'Invalid email address' }).nonempty({message: 'Please fill the input field'}),
})