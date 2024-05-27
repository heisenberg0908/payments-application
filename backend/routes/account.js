const express=require('express')
const accountRouter=express.Router()
const {Account}=require('../db')
const {sign,verify}=require('jsonwebtoken')
const mongoose=require('mongoose')
accountRouter.get('/balance',async(req,res)=>{
    const account=await Account.findOne({
        userId:req.userId
    })
    res.json({
        balance:account.balance
    })
})
accountRouter.post('/transfer', async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
        const { amount, to } = req.body;
        const account = await Account.findOne({ userId: req.userId }).session(session);

        if (!account || account.balance < amount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(411).json({
                msg: 'Insufficient balance in your account.'
            });
        }

        const toAccount = await Account.findOne({ userId: to }).session(session);

        if (!toAccount) {
            await session.abortTransaction();
            session.endSession();
            return res.status(409).json({
                msg: 'Account mentioned not found. Retry.'
            });
        }

        await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
        await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

        await session.commitTransaction();
        session.endSession();
        return res.status(200).json({
            msg: 'Transferred successfully.'
        });

    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({
            msg: 'An error occurred during the transaction.',
            error: error.message
        });
    }
});


module.exports=accountRouter