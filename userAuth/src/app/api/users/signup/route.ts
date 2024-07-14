import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { sendEmail } from "@/helpers/nodeMailer";

connectToDB()

export async function POST(request: NextRequest) {
    try {
        //getting the data from request body
        const reqBody = await request.json()
        const { username, email, password } = reqBody;

        // check if user already exists
        const user = await User.findOne({ email })
        if (user) {
            return NextResponse.json({
                success: false,
                error: "User already exists"
            }, { status: 400 })
        }

        //hash the password entered by the user
        const saltPassword = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, saltPassword)

        //save user to the database
        const newUser = new User({
            username,
            email,
            password: hashedPassword
        })
        const savedUser = await newUser.save()

        //return a response to the user
        const response = NextResponse.json({
            success: true,
            message: "Signup Successful",
            savedUser
        })

        //send user verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id
        })
        
        return response;
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}