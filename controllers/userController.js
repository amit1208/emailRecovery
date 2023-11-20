import UserModel from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import checkUserAuth from "../middlewares/auth-middleware.js"
import transporter from "../config/emailconfig.js";


class UserController{
    static userRegistration =async (req,res)=>{
        const{ name,email,password,password_confirmation,tc}=req.body;
        const user=await UserModel.findOne({email:email})
        if(user){
            res.send({"status":"failed","message":"Email already exists"})
        }
        else{
            if(name && email && password && password_confirmation && tc ){
                if(password===password_confirmation){

                     try {
                        const salt =await bcrypt.genSalt(10)  
                        const hashPassword= await bcrypt.hash(password,salt)
         const doc= new UserModel({
             name:name,
             email:email,
             password:hashPassword,
             tc:tc
         })

             await doc.save()
             const saved_user =await UserModel.findOne({email:email})
            //  Generate JWt token
            const token =jwt.sign({userID:saved_user._id},"jwtsecrtekey",{expiresIn:'5d'})
            
             res.send({"status":"sucess","message":"Registration Successfully","token":token});

                        
                     } catch (error) {
                        console.log(error)
                        res.send({"status":"failed","message":"unable to register"});
                        }

                }else{
                    res.send({"status":"failed","message":"Password and confirm pass doesn't match"})
                }
            }
            else{
                res.send({"status":"failed","message":"All Fields requre"})
            }
        }

    }


    static userLogin =async (req,res)=>{
        try {
            const{email,password}=req.body;
            if(email && password){
                const user=await UserModel.findOne({email:email})
                if(user !=null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if( (user.email===email) && isMatch){

                        // generate JWt
                        const token =jwt.sign({userID:user._id},"jwtsecrtekey",{expiresIn:'5d'})

                        res.send({"status":"Sucess","message":"Login Sucess","token":token})
                    }
                    else{
                        res.send({"status":"failed","message":"Email/password Not valid"})
  
                    }
                }
                else{
                    res.send({"status":"failed","message":"Not registered User"})

                }
            }
            else{
                res.send({"status":"failed","message":"All Fields Required"})
            }


        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Unable to login"})
        }
    }


    static changeUserPassword = async (req,res,)=>{
        const {password,password_confirmation}=req.body ;

        if(password && password_confirmation){
            if(password !== password_confirmation){
                res.send({"status":"failed","message":"pw and pwc are not same"})

            }
            else{
                const salt = await bcrypt.genSalt(10);
                const newhashpassword = await bcrypt.hash(password,salt);
                    await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newhashpassword }})


                res.send({"status":"success","message":"Password changed Successfully"})

            }

        }
        else{
            res.send({"status":"failed","message":"All fields required"})
        }

        
    }

    static loggedUser =async(req,res)=>{
        res.send({"user":req.user})

    }

    static sendUserPasswordResetEmail =async(req,res)=>{

        const {email}=req.body;
        if(email){
            const user=await UserModel.findOne({email:email})
            if(user){
                const secret =user._id + "jwtsecrtekey"
                const token =jwt.sign({userID: user._id},secret,{expiresIn:'30m'})
                const link =`http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
                console.log(link);
                // send Email
                let info = await transporter.sendMail({
                    from : "shivarajput.chauhan1991@gmail.com",
                    to:user.email,
                    subject:"PassWord Reset link",
                    html:`<a href=${link}> Click Here </a> to reset Your PAssword`
                })

                res.send({"status":"Success","message":"password reset Email sent..plz check your Email","info":info})

            }
            else{
                res.send({"status":"Failed","message":"Email doesn't exists"})

            }

        }else{
            res.send({"status":"Failed","message":"Email is Required"})
        }

    }


    static userPasswordReset =async(req,res)=>{
        const {password,password_confirmation}=req.body;
        const{id,token}=req.params ;
        const user=await UserModel.findById(id)
        const new_secret =user._id + "jwtsecrtekey" ;

        try {
            jwt.verify(token,new_secret)
            if(password && password_confirmation){
                if(password !== password_confirmation){
                    res.send({"status":"failed","message":"New Pass & new Condirm Pass Doen't Match"})
                }
                else{
                    const salt =await bcrypt.genSalt(10)
                    const newHashpass =await bcrypt.hash(password,salt);
                    await UserModel.findByIdAndUpdate(user._id,{$set:{password:newHashpass
                    }});


                    res.send({"status":"failed","message":"Password Reset using NM Sucessfully"})
                }

            }
            else{
                res.send({"status":"failed","message":"All Fields Required"})

            }

        } catch (error) {
            console.log(error)
            res.send({"status":"failed","message":"Invalid Token"})
            
        }
    }

}

export default UserController; 