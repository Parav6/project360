import {resend} from "../lib/resend";
import { DeliveryEmailTemplate } from "../../emails/deliveryEmail";

export async function sendDeliveryOtpEmail(
    email:string,
    name:string,
    otp:string
): Promise<void>{
    try {
        const emailTemplate = await DeliveryEmailTemplate({ name, otp });
        await resend.emails.send({                      //domian problem
        to: email,
        from: 'parav_k@ece.iitr.ac.in',
        subject: "Mystery message | Delivery OTP",
        react: emailTemplate
        });
        console.log("email sent successfully")
    } catch (error) {
        console.error("error in sending verification email",error)
    }
}