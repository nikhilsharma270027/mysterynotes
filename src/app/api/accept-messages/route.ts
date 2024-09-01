// we need to make messages on user ui, toggle button to check wheather the user is accepting or not accepting the message
// we need to create one post request to update the state ,
// secondly get to tell us the state
// we need to know the user by session data
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            { status: 401 }
        )
    }

    const userId = user._id;

    // gettting data from client side
    const { acceptMessages } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )

        if (!updatedUser) {
            return Response.json({
                success: false,
                message: "failed to update user status to accept message"
            },
                { status: 401 }
            )
        }

        return Response.json({
            success: true,
            message: "Message acceptance  status updated successfull",
            updatedUser
        },
            { status: 201 }
        )


    } catch (error) {
        console.log("failed to update user status to accept message");
        return Response.json({
            success: false,
            message: "failed to update user status to accept message"
        },
            { status: 500 }
        )
    }

}


export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            { status: 401 }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            return Response.json({
                success: false,
                message: "User not found"
            },
                { status: 404 }
            )
        }

        return Response.json({
            success: true,
            isAcceptingMessage: foundUser.isAcceptingMessage
        },
            { status: 200 }
        )


        
    } catch (error) {
        console.log("Error in getting message acceptance status");
        return Response.json({
            success: false,
            message: "Error in getting message acceptance status"
        },
            { status: 500 }
        )
    }



}

// The `{ new: true }` option in your `findByIdAndUpdate` method is telling MongoDB to return the updated document rather than the original one.

// Here's how it works:

// - **Without `{ new: true }`**: If you don't include this option, `findByIdAndUpdate` will return the document as it was before the update.

// - **With `{ new: true }`**: By setting `new: true`, you're instructing MongoDB to return the document *after* the update is applied, so you'll get the latest version of the user document with the updated `isAcceptingMessages` value.

// This is useful if you want to immediately use or check the updated document after making changes.