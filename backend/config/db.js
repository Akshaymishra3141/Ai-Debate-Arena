const mongoose = require("mongoose");

const connectDb = async ()=>{

    try{
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected To Mongo DB");
    } catch(error){
        console.log(error, " While Connecting to MongoDB");
        process.exit(1);
    }

}

module.exports = connectDb;

