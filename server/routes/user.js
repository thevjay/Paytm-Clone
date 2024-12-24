const express = require("express")
const router = express.Router();

const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {userModel,Account}=require('../models/UserModel');
const { authMiddleware } = require("../middleware");

router.post("/signup",async(req,res)=>{
    
    try{

        const { firstName, lastName, email, password }=req.body;

        if(!firstName || !lastName || !email || !password){
            return res.status(411).json({
                success:false,
                message:"Incorrect inputs"
            })
        }
        
        const existingUser = await userModel.findOne({ email: req.body.email });
    
        if(existingUser){
            return res.status(411).json({
                success:false,
                message:"User already exists",
            })
        }
    
        const saltRounds=10;
        const hash = await bcrypt.hash(password,saltRounds);
        if(!hash){
            return res.status(500).json({
                success:false,
                message: 'Internal server error'
            })
        }

        const user=await userModel.create({
            firstName,
            lastName,
            email,
            passwordHash:hash,
        })
    
        const userId=user._id;
    
        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000,
        })
    
        const token= jwt.sign({ userId },"fsd")
    
        res.status(200).json({
            success:true,
            message: "User Created Successfully ",
            user:user,
            token: token,
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'Error in Server'
        })
    }
})
    


router.post("/signin", async (req,res) => {

    try{
        const { email , password}=req.body;

        if(!email || !password){
            return res.status(404).json({
                success:false,
                message:"Incorrect inputs"
            })
        }

        const existingUser=await userModel.findOne({ email: email})
        if(!existingUser){
            return res.status(411).json({
                success:false,
                message:"Error while logging in"
            })
        }

        const match = await bcrypt.compare(password, existingUser.passwordHash);
        if(!match){
            return res.status(411).json({
                success:false,
                message:"Incorrect Password"
            })
        }

        const token = jwt.sign({ userId: existingUser._id},"fsd")

        res.status(200).json({
            success:true,
            message:"Login is Successfully",
            token: token
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:'Error in Server'
        })

    }
})


// router.get('/profile',authMiddleware,async(req,res)=>{
//     try{

//         const user=await userModel.findById(req.userId)
//         if(!user){
//             return res.status(404).json({
//                 success:false,
//                 message:'User not found'
//             })
//         }

//         res.status(200).json({
//             success:true,
//             message:"Successfully",
//             user
//         })
//     }
//     catch(error){
//         console.error("Error fetching user profile:", error);
//         res.status(500).json({ message: "Server error" });
//     }
// })
    
router.put('/', authMiddleware, async (req, res) => {
    try{

        const { firstName, lastName, password }=req.body;

        if(!firstName || !lastName || !password){
            return res.status(411).json({
                success:false,
                message:"Error while updating information"
            })
        }

        const user = await userModel.findById(req.userId);
        if(firstName){
            user.firstName = firstName;
        }
        if(lastName){
            user.lastName = lastName;
        }
        if(password){
            const saltRounds = 10;
            const hash = await bcrypt.hash( password, saltRounds);
            if(!hash){
                return res.status(500).json({
                    success: false,
                    message: 'Internal server error'
                })
            }

            user.passwordHash = hash;
        }
        
        await user.save();

        res.status(200).json({
            message:"Updated Successfully"
        })
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

router.get("/bulk", authMiddleware, async (req, res) => {
    const filter=req.query.filter || "";

    const users=await userModel.find({
        $or: [
            { firstName: { "$regex": filter, $options: "i"} },
            { lastName: { "$regex":filter, $options: "i"} }
        ],
    });

    return res.status(200).json({
        users: users
            .filter((user) => user._id != req.userId)
            .map((user) => ({
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id,
            })),
    })
})

router.get("/me", authMiddleware, async (req,res) => {
    const user = await userModel.findById(req.userId).select("-passwordHash -__v");
    res.json({
        user
    })
})


module.exports=router;