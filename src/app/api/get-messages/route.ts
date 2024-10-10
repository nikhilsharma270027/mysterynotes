import dbConnect from "@/lib/dbConnect";
import { authOptions } from "../auth/[...nextauth]/options";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth";
// import { AuthOptions } from "next-auth";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const _user: User = session?.user as User;

    if (!session || !_user) {
        return Response.json({
            success: false,
            message: "Not Authenticated"
        },
            { status: 401 }
        )
    }


    //here _id is in string , we convert it to mongooose objetc
    const userId = new mongoose.Types.ObjectId(_user._id);

    // try {

    //      // First, verify that the user exists
    //      const userExists = await UserModel.findOne({ _id: userId });
    //      if (!userExists) {
    //          return new Response(
    //              JSON.stringify({
    //                  success: false,
    //                  message: "User not found, no no no",
    //              }),
    //              { status: 404, headers: { "Content-Type": "application/json" } }
    //          );
    //      }
    //      const user = await UserModel.aggregate([
    //         { $match: { _id: userId } }, // Match the user by ObjectId
    //         { 
    //             $project: {
    //                 _id: 1,
    //                 messages: { 
    //                     $ifNull: ['$messages', []] // Ensure messages is an array, even if empty
    //                 }
    //             }
    //         },
    //         { $unwind: '$messages' }, // Unwind the messages array to handle individual messages
    //         { $sort: { 'messages.createdAt': -1 } }, // Sort messages by createdAt in descending order
    //         { 
    //             $group: { 
    //                 _id: '$_id', 
    //                 messages: { $push: '$messages' } // Push the messages back into an array
    //             } 
    //         }
    //     ]);

    try {
        const user = await UserModel.aggregate([
          { $match: { _id: userId } },
          { $unwind: '$messages' },
          { $unwind: { path: '$messages', preserveNullAndEmptyArrays: true } }, // allowing empty array of messages. Without "preserveNullAndEmptyArrays: true", toast will show user not found which is not a correct message.
          { $sort: { 'messages.createdAt': -1 } },
          { $group: { _id: '$_id', messages: { $push: '$messages' } } },
        ]).exec();
        if(!user || user.length === 0){
            return Response.json({
                success: false,
                message: "User not found",
            },
                { status: 401 }
            )    
        }


        return Response.json({
            success: true,
            message: user[0].messages,
        },
            { status: 200 }
        )
    } catch (error) {
        console.log("An unexpected error", error)
        return Response.json({
            success: false,
            message: "'Internal server error",
        },
            { status: 500 }
        )    
    }
}
