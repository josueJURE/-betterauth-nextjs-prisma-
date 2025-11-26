import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  email: z.string().min(2).max(50),
  password: z.string().min(2).max(50),
  confirmPassword: z.string().min(2).max(50).optional(),

});

export const signInFormSchema =  registerFormSchema.pick({
  email: true,
  password: true
})


export default signInFormSchema

