import {Schema, model} from "mongoose";
import jwt from 'jsonwebtoken'

const contactSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true},
})

contactSchema.methods.generateToken = async function() {
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

const Contact = new model("Contact", contactSchema)

export {Contact}