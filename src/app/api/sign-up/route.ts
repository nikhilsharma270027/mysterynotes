import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';

export async function POST(request: Request) {
    await dbConnect()// before any action we firstly check db connection

    try { // in UI, we have 3 fields
        // always use await with request.json
        const {username, email, password} = await request.json();
        
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