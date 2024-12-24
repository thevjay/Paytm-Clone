const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()


exports.connect=()=>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlparser: true,
		useUnifiedTopology: true,
    })
    .then(console.log('DB Connection Success'))
    .catch((error)=>{
        console.log("DB Connection Failed")
        console.log(error)
        process.exit(1);
    })
}