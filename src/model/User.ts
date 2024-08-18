import exp from "constants";
import mongoose, {Schema, Document} from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
})

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],// second arg show error message if its not provided
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        // match takes 1st arg as rejax & 2nd arg a message
        match: [/.+\@.+\..+/, 'please use a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "Verify Code Expiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: false,
    },
    messages: [MessageSchema],
})

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("user", UserSchema);

export default UserModel;

// "Let it be done because, look, in Next.js, most things run at runtime. Now, when your entire source code runs at runtime, see, when you create a dedicated backend using something like Express, we know that the app starts once, runs once, the entire schema is created, and now the app doesn't run repeatedly. Once the server is built, it keeps running always, and once the initialization is done, it's done.

// But that's not the case in Next.js. Because Next.js runs at the edge, it doesn't know whether this is the first time the application is booting up or if it has booted up many times before. So, this brings a bit of an issue, and that's why in Next.js, the way we export data is slightly different. So, the user model we will export will be of two types..."

// In Mongoose:

// mongoose.models: This is an object that stores all the models that have already been created. When you define a model using mongoose.model, it gets stored in mongoose.models. If you try to create a model with the same name again, it will retrieve the existing one from mongoose.models.

// mongoose.model: This is a function used to create a new model based on a schema. If the model already exists in mongoose.models, it won't create a new one unless you specify a different name.

// In short:
// mongoose.models checks if the model already exists.
// mongoose.model creates a new model if it doesn't exist.

