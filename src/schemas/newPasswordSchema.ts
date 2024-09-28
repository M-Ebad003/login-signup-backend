import { z } from "zod";

export const newPasswordSchema= z.object({
    password: z.string().nonempty({message: 'Please fill the password field'}),
})