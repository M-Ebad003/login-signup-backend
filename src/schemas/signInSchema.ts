import { z } from "zod";

export const signInSchema = z.object({
    identifier: z.string().nonempty({message: 'Please fill the input field'}),
    password: z.string().nonempty({message: 'Please fill the password field'}),
})