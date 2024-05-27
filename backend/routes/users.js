const express=require('express')
const usersRouter=express.Router()
const {Users}=require('../db')
const jwt=require('jsonwebtoken')
const zod=require('zod')
const {JWT_SECRET}=require('../config')
const {authMiddleware}=require('../authmiddleware')
const {Account}=require('../db')
const {sign,verify} =require('jsonwebtoken')


const signupdata=zod.object({
    firstName:zod.string(),
    lastName:zod.string(),
    userName:zod.string().email(),
    password:zod.string().min(6)
})
usersRouter.post('/signup',async(req,res)=>{
    const {success}=signupdata.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:'wrong inputs'
        })
    }
    const existingUser=await Users.findOne({
        userName:req.userName
    })
    if(existingUser){
        res.status(411).json({
            msg:'user with this username already exists.'
        })
    }
    const user=await Users.create({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        userName:req.body.userName,
        password:req.body.password
    })
    const userId=user._id
    await Account.create({
        userId,
        balance: 1 + Math.random() * 10000
    })
    const token=jwt.sign({userId},JWT_SECRET)
    res.json({
        msg:'user signed up',
        userId:userId,
        token:token
    })
})

const signindata=zod.object({
    userName:zod.string().email(),
    password:zod.string().min(7)
})
usersRouter.post('/signin',async(req,res)=>{
    const {success}=signindata.safeParse(req.body)
    if(!success){
        return res.status(409).json({
            msg:'wrong inputs'
        })
    }
    const user=await Users.findOne({
        userName:req.body.userName,
        password:req.body.password
    })
    if(user){
        const token=jwt.sign({userId:user._id},JWT_SECRET)
        return res.status(200).json({
            msg:'signed in successfully',
            token:token,
            userId:user._id
        })
        return
    }
    
    res.status(411).json({
        message: "Error while logging in"
    })
})
const updatedata=zod.object({
    firstName:zod.string(),
    lastName:zod.string(),
    password:zod.string().min(6)
})
usersRouter.put('/',authMiddleware,async(req,res)=>{
    const {success}=updatedata.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            msg:'something went wrong please try again , wrong inputs ..'
        })
    }
    await Users.updateOne(req.body,{
        id: req.userId
    })
    res.status(200).json({
        msg:'info updated successfully..'
    })
})

usersRouter.get('/bulk',async(req,res)=>{
    const filter=req.query.filter || "";
    const users=await Users.find({
        $or:[{
            firstName:{
                "$regex":filter
            },
            lastName:{
                "$regex":filter
            }
        }]
    })
    res.json({
        user:users.map(user=>({
            userName:user.userName,
            firstName:user.firstName,
            lastName:user.lastName,
            _id:user._id
        }))
    })
})


module.exports=usersRouter