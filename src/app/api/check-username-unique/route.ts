import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod";
import { usernameValidation } from "@/Schemas/signUpSchema";
import { signUpSchema } from "@/Schemas/signUpSchema";

// query schema
const UsernameQuerySchema = z.object({
    username: usernameValidation
})
// assignment
const signInQuerySchema = z.object({
    signIn: signUpSchema
})

export async function GET(request: Request) {
    //TODO: use this in all other routes
    // if (request.method !== 'GET') {
    //     return Response.json({
    //         success: false,
    //         message: "Methid not allowed"
    //     }, { status: 405 })
    // }

    await dbConnect();

    try {
        // to check username we do from url , we get query from url with get request
        // we extract url using new url
        // suppose localhost:3000/api/cuu?username=nikhil
        const { searchParams } = new URL(request.url);
        // we need to get our query parameter
        const queryParam = { //object
            username: searchParams.get('username')
        }
        // now we validate with zod | 
        const result = UsernameQuerySchema.safeParse(queryParam);

        console.log(result)
        if (!result.success) {
            // using foramt() we can know what r the error
            const usernameErrors = result.error.format().username?._errors || []
            return new Response(JSON.stringify({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(', ') : "Invalid query parameters"
            }), { status: 400 });
            
        }

        const { username } = result.data

        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 })
        }

        return new Response(JSON.stringify({
            success: true,
            message: "Username is unique"//available
        }), { status: 200 })

    } catch (error) {
        console.error("Error checking username", error);
        return Response.json({
            success: false,
            message: "Error checking username"
        },
            { status: 500 }
        )
    }
}



