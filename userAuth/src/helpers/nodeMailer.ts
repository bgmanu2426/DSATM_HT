import User from '@/models/user.model';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt'

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        //Create a hashed token
        const hashedToken = bcrypt.hashSync(userId.toString(), 10)

        if (emailType === 'VERIFY') {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 600000
            })
        }

        if (emailType === 'RESET') {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 600000
            })
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT || "587"),
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_MAIL,
                pass: process.env.SMTP_PASSWORD,
            },
        });


        const mailOptions = {
            from: process.env.SMTP_MAIL, // sender address
            to: email, // list of receivers
            subject: emailType === 'VERIFY' ? "Verify your E-mail" : "Reset your password", // Subject line
            html: `
                <p> Click 
                <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? "verifyEmail" : "resetPassword"}?token=${hashedToken}">
                ${process.env.DOMAIN}/${emailType === 'VERIFY' ? "verifyEmail" : "resetPassword"}?token=${hashedToken}
                </a> to ${emailType === 'VERIFY' ? "verify your E-mail address" : "reset your password"}
                . The above link expires in 10 minutes</p>`, // html body
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        return mailResponse;

    } catch (error: any) {
        throw new Error(error.message)
    }
}