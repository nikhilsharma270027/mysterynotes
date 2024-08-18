import { z } from "zod"

export const usernameValidation = z
    .string()
    .min(2, "Username must be aleast 2 charaactrs")
    .max(20, "Username must be no more thans 20 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: "Password must be atleast 6 characters" })
})




// without zod
// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "Username is required"],
//     minlength: [2, "Username must be at least 2 characters"],
//     maxlength: [20, "Username must be no more than 20 characters"],
//     match: [/^[a-zA-Z0-9_]+$/, "Username must not contain special characters"]
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     match: [/\S+@\S+\.\S+/, "Invalid email address"]
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//     minlength: [6, "Password must be at least 6 characters"]
//   }
// });

// const User = mongoose.model('User', userSchema);

// module.exports = User;
