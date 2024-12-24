const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    firstName: String,
	lastName: String,
	email: String,
	passwordHash: String,
})

const accountShema=new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true,
    },
    balance:{
        type:Number,
        required:true
    }
})


const Account=mongoose.model("Account",accountShema)
const userModel=mongoose.model("User",userSchema)

module.exports={userModel,Account};