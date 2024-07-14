import connectToDB from "@/dbConfig/dbConfig";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

connectToDB();

export async function POST(request: NextRequest) {
    try {
        //getting the data from request body
        const reqBody = await request.json();
        const { email, password } = reqBody;

        // check if user exists in the database or not
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    error: "User does not exist",
                },
                { status: 400 }
            );
        }

        //check the password entered by the user is valid or not
        const validPassword = bcrypt.compareSync(password, user.password);
        if (!validPassword) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Invalid Password",
                },
                { status: 400 }
            );
        }

        //create jsonWebTokem with below given data
        const tokenData = {
            id: user._id,
            email: user.email,
            username: user.username,
        };
        const jwtToken = jwt.sign(tokenData, process.env.JWT_TOKEN_SECRET!, {
            expiresIn: "1d",
        });

        //return a response to the user
        const response = NextResponse.json({
            message: "Login Successful",
            success: true,
        });
        response.cookies.set("token", jwtToken, {
            httpOnly: true,
        });
        return response;
    } catch (error: any) {
        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            { status: 500 }
        );
    }
}
