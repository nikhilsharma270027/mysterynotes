import { z } from "zod";

export const signInSchema = z.object({
    // identifier is just email or username for verfication
    // on production level we all it as identifier
    identifier: z.string(),
    password: z.string(),
})

// just telling user to provide his username/email and passoword