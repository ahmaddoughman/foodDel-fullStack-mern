import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';


const createToken = (_id) =>{
    return jwt.sign({_id},process.env.JWT_SECRET,{expiresIn:"3d"});
}

// login user
const loginUser = async(req,res) =>{
    const {email,password} = req.body;
    try {
        const user = await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User not found"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.json({success:false,message:"Invalid credentials"});
        }
        const token = createToken(user._id);
        return res.json({success:true,message:"Login successful",token,user});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Something went wrong"});
    }

}

// register user
const registerUser = async(req,res) =>{
    const {name,email,password} = req.body;
    try {
        // checking is user already exists
        const exists = await userModel.findOne({email});
        if(exists){
            return res.json({success:false,message:"User already exists"});
        }

        // validating email format & strong password
        if(!validator.isEmail(email)){
            return res.json({success:false,message:"Invalid email format"});
        }
        if(!validator.isStrongPassword(password)){
            return res.json({success:false,message:"Password is not strong enough"});
        }

        // hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);
        const newUser = new userModel({
            name: name,
            email: email,
            password:hashedPassword
        });
        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success:true,message:"User created successfully",token});

    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Something went wrong"});
    }
}

export {loginUser,registerUser};