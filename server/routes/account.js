const express=require('express')
const {Account}=require('../models/UserModel')
const mongoose=require('mongoose');
const { authMiddleware } = require('../middleware');

const router=express.Router();


router.get('/balance', authMiddleware, async (req,res) => {

    const account=await Account.findOne({userId:req.userId});

    res.status(200).json({
        success: true,
        message: "Successfully",
        balance: account.balance,
    })
})


router.post("/transfer", authMiddleware, async (req, res) => {
  try{

    const session = await mongoose.startSession();
  
    session.startTransaction();
    const { amount, to } = req.body;
  
    console.log("amount",amount)
    console.log("ToUser",to)
    // Fetch the accounts within the transaction
    const account = await Account.findOne({ userId: req.userId }).session(
      session,
    );
  
    if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Insufficient balance",
      });
    }
  
    const toAccount = await Account.findOne({ userId: to }).session(session);
    if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
        message: "Invalid account",
      });
    }
  
    // Perform the transfer
    await Account.updateOne(
      { userId: req.userId },
      { $inc: { balance: -amount } }
    ).session(session);

    await Account.updateOne(
      { userId: to },
      { $inc: { balance: amount } }
    ).session(session);
  
    // Commit the transaction
    await session.commitTransaction();
    await session.endSession();
  
    res.json({
      message: "Transfer successful",
    });
  
  }
  catch(error){
    console.error(error)
    return res.status(500).json({
      success:false,
      message:"Internal Serever Error"
    })
  }
})
  
module.exports=router;