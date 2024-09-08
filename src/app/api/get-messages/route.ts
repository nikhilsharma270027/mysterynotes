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

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } }, // Correct field name is _id
            { $unwind: '$messages' },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }

        ])

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
            message: "Not authenticated",
        },
            { status: 500 }
        )    
    }
}
