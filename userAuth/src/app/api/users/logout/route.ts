import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const response = NextResponse.json({
            message: "Logout Successful",
            success: true
        })
        
        //Delete the cookie
        response.cookies.delete("token");

        //Retrn back the response
        return response;
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}