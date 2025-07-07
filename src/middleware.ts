import { NextResponse ,NextRequest} from 'next/server';
import { RefreshToken } from './types/token';
import { jwtVerify } from 'jose';

const secret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET || "");
async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (error) {
    return error;
  }
}


export async function middleware(req:NextRequest){
    const path = req.nextUrl.pathname;

    const notLoggedInPath = path.startsWith("/auth") 
    const notLoggedInButUserPath = path.startsWith("/user/shop")
    const customerPath = path.startsWith("/user");
    const employeePath = path.startsWith("/employee");
    const adminPath = path.startsWith("/admin");

   
    const accessToken = req.cookies.get("accessToken")?.value || "";
        if(accessToken){
            //logged-in
            const decodedToken:RefreshToken = await verifyJWT(accessToken); 
            console.log(decodedToken);
 
            const role = decodedToken.role;  

            if(role==="customer"){
                //customer
                if(employeePath || adminPath || notLoggedInPath){
                    return NextResponse.redirect(new URL('/', req.url))
                }
            }else if(role==="employee"){
                //employee
                if(customerPath || adminPath || notLoggedInPath || notLoggedInButUserPath){
                    return NextResponse.redirect(new URL('/', req.url))
                }
            }else if(role==="admin"){
                //admin
                if(customerPath || employeePath || notLoggedInButUserPath || notLoggedInPath){
                    return NextResponse.redirect(new URL('/', req.url))
                }
            }
        }else{
            //not logged-in
            if(path.startsWith("/user/shop")){
                return 
            }else if(customerPath || employeePath || adminPath){
                return NextResponse.redirect(new URL('/auth/sign-in', req.url))
            };
        
        }

};

export const config={
    matcher:[
        "/",
        "/about",
        "/auth/:path*",
        "/user/:path*",
        "/employee/:path*",
        "/admin/:path*"
    ]
};

