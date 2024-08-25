import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect()// before any action we firstly check db connection

    try { // in UI, we have 3 fields
        // always use await with request.json
        const { username, email, password } = await request.json();
        // checking if the user has username and is it verified
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingUserVerifiedByUsername) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: "Username is already taken"
                }),
                { status: 400 }
            );
        }

        // now we check new user from email
        const existingUserByEmail = await UserModel.findOne({ email })
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString()

        if (existingUserByEmail) {
            // true // TODO back here
            if(existingUserByEmail.isVerified){
                return Response.json({
                    success: false, 
                    message: "User already exists with this email"
                }, { status: 400 })
            } 
            else  // we user with existingemail but he is not verified
            {
                const hashedPassword = await bcrypt.hash(password, 10) ;
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserByEmail.save(); 
                //it will saveuser n jump to sendverification email
            }
        }

        else

        { //if the 1st condition that is by email not true that means the user is here first time we need to register it
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            //now we save user
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: [],

            })

            await newUser.save();
        }

        //send verification email
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        ) // here if the emailresponse fail it will return something and we console,log it 
        //and if success it will return .success
        console.log(emailResponse);

        if (!emailResponse.success) {
            return Response.json({
                success: false,
                // message: "Username is already taken" instead resend has its own message string
                message: emailResponse.message,
            }, { status: 400 })
        }

        // if all is success
        return Response.json({
            success: true,
            message: "User registered successfullly,. Please verify your email"
        }, { status: 201 })

    } catch (error) {
        console.log('Error registering user', error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }

        )
    }
}