import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/helpers/nodeMailer";

connectToDB()

export async function POST(request: NextRequest) {
    try {
        //getting the data from request body
        const reqBody = await request.json()
        const { email } = reqBody;

        const user = await User.findOne({ email })
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "No user found"
            }, { status: 400 })
        }

        //send user verification email
        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id
        })

        //return a response to the user
        const response = NextResponse.json({
            success: true,
            message: "E-mail sent successfully",
            user
        })
        return response;
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}