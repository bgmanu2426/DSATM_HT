import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt'

connectToDB()

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json()
        const { token, password } = reqBody;

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() }
        })

        if (!user) {
            return NextResponse.json({
                error: "Invalid Token"
            }, { status: 400 })
        }

        //hash the password entered by the user
        const saltPassword = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, saltPassword)

        user.password = hashedPassword;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({
            message: "Password reset success",
            success: true
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}