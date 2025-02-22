import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    phone: {
        type: String,
        require: true,      
    },
    password: {
        type: String,
        require: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
})

userSchema.pre("save", async function(next) {
    const user = this
    if(!user.isModified('password')) {
        next()
    }

    try {
        const hash_password = await bcrypt.hash(user.password, 10)
        user.password = hash_password
    } catch (error) {
        next(error)
    }
})

userSchema.methods.generateToken = async function() {
    try {
        return jwt.sign(
        {
            userId: this._id.toString(),
            email: this.email,
            isAdmin: this.isAdmin,
        },
     process.env.JWT_SECRET_KEY,
     {
        expiresIn: "1d",
     })        
    } catch (error) {
        console.error(error)
    }
}

const User = new mongoose.model('User', userSchema)

export {User}