
const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
    {
        name : {
            type : String,
            required : true,
        },
        email : {
            type : String,
            trim: true,
            lowercase: true,
            required : true,
            unique : true,
        },
        password : {
            type : String,
            required : true,
        },
        phone : {
            type : String,
        },
        tokenVersion: { type: Number, default: 0 },
        status : {
            type : String,
            enum : ["active", "suspended", "deactivate"],
        }
    },
    {
        timestamps : true
    }
);

const User = mongoose.model('User', userSchema);

module.exports = {User};
