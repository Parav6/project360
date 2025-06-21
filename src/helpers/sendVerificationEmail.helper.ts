import {resend} from "../lib/resend";
import {EmailTemplate} from "../../emails/verificationEmail";

export async function sendVerificationEmail(
    email:string,
    name:string,
    verifyCode:string
): Promise<void>{
    try {
        const emailTemplate = await EmailTemplate({ name, otp: verifyCode });
        await resend.emails.send({                      //domian problem
        to: email,
        from: 'parav_k@ece.iitr.ac.in',
        subject: "Mystery message | Verification Code",
        react: emailTemplate
        });
        console.log("email sent successfully")
    } catch (error) {
        console.error("error in sending verification email",error)
    }
}