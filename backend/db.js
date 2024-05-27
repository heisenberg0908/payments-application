const mongoose=require('mongoose')
mongoose.connect('')//add ur mongodb connection string

const userSchema=new mongoose.Schema({
    firstName:String,
    lastName:String,
    userName:String,
    password:String
})

const accountSchema=new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'Users',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})

const Users=mongoose.model("Users",userSchema)
const Account=mongoose.model("payment",accountSchema)

module.exports={Users,Account}



