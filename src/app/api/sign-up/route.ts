import { sendVerificationEmail } from '@/helpers/sendVerificationEmail';
import { connectToDb } from '@/lib/database'
import { UserModel } from '@/model/user.model';
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    await connectToDb();
    
    try {
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        const { username, email, password } = await request.json();

        const existingUserVerification = await UserModel.findOne({
            username,
            isVerified: true
        });

        if (existingUserVerification) {
            return Response.json({
                success: false,
                message: 'Username is already taken'
            }, { status: 400 })
        }
        const existingUserVerificationByEmail = await UserModel.findOne({ email });

        if (existingUserVerificationByEmail) {
            if(existingUserVerificationByEmail.isVerified){
                return Response.json({
                    successs: false,
                    message: 'User already exist with this email'
    
                }, { status: 400 });
            }else{
                const hashedPassword= await bcrypt.hash(password,10);
                existingUserVerificationByEmail.password=hashedPassword;
                existingUserVerificationByEmail.verifyCode=verifyCode;
                existingUserVerificationByEmail.verifyCodeExpiry=new Date(Date.now()+ 3600000);
                await existingUserVerificationByEmail.save();
            }
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessage: true,
                messages: []
            })
            await newUser.save();
        }
        const emailResponse = await sendVerificationEmail(
            email,
            username,
            verifyCode
        )
        if (!emailResponse.success) {
            return Response.json({
                successs: false,
                message: emailResponse.message

            }, { status: 500 });
        }
        return Response.json({
            successs: true,
            message: 'User registered Successfully.Please verify your email'

        }, { status: 201 });

    } catch (error) { 
        console.error('Error while registering the user', error)
        return Response.json(
            {
                success: false,
                message: 'Error while registering the user'
            },
            {
                status: 500
            }
        )
    }
}