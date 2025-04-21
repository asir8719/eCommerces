import { User } from "../models/user-model.js";
import { Contact } from "../models/contact-model.js";
import bcrypt from 'bcryptjs'
import { Service } from "../models/service-model.js";
// import Stripe from "stripe";
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

const home = async(req, res) =>{
    try{
        res.send('Welcome to home page')
    } catch (error) {
        console.log(error);
    }
}

const register = async(req, res) =>{
    try {
        const { username, email, phone, password } = req.body

        const userExist = await User.findOne({ email: email})
        
        if(userExist) {
            return res.status(400).json({error: "Email Already Exists"})
        }

        const userCreate = await User.create({ username, email, phone, password })

        res.status(201).json({
            message: "Registration Successful",
            token: await userCreate.generateToken(),
            userId: userCreate._id.toString(),
        })
    } catch (error) {
        res.status(400).json({error: "Internal Server Error"})
    }
}

const login = async(req, res) =>{
    try {
        const { username, password } = req.body

        const userExist = await User.findOne({ username: username })

        if(!userExist) {
            return res.status(400).json({ error: "User not found"})
        }

        const user = await bcrypt.compare(password, userExist.password)

        if(user) {
            res.status(200).json({
                message: "Login Successful",
                token: await userExist.generateToken(),
                userId: userExist._id.toString(),
                isAdmin: userExist.isAdmin ? 'true' : 'false',
            })
        } else{
            res.status(401).json({ error: "Invalid Email or Password" })
        }
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
}

const contact = async(req, res) =>{
    try{
        const { username, email, message } = req.body

        const feedbackCreate = await Contact.create({username, email, message})
        
        res.status(200).json({
            msg: "Feedback Received",
            token: await feedbackCreate.generateToken(),
            userId: feedbackCreate._id.toString(),
        })
    } catch (error){
        res.status(500).json({error: "Invalid Username"})
    }
}

const user = async(req, res) =>{
    try {
        const userData = req.user
        res.status(200).json({msg: userData})
    } catch (error) {
        res.status(500).json({error: "Internal Server Error"})
    }
}

const services = async(req, res) =>{
    try {
        const serviceData = await Service.find() 
        res.status(200).json({msg: serviceData})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminUser = async(req, res) =>{
    try {
        const user = await User.find({}).select('-password')
        if(!user || user.length === 0) {
            return res.status(404).json({error: 'No User Found'})
        }
        res.status(200).json({msg: user})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const getUserById = async(req, res) => {
    try {
        const id = req.params.id
        const user = await User.findOne({_id: id}).select('-password')
        if(!user) {
            return res.status(404).json({error: 'User not found'})
        } else {
            res.status(200).json({msg: user})
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminUserUpdate = async(req, res) => {
    try {
        const id = req.params.id
        const { username, email, phone, isAdmin } = req.body
        const user = await User.findOneAndUpdate({_id: id}, {username, email, phone, isAdmin}, {new: true})
        if(!user) {
            return res.status(404).json({error: 'User not found'})
        } else {
            res.status(200).json({msg: user})
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminUserDelete = async(req, res) => {
    try {
        const id = req.params.id
        const result = await User.deleteOne({_id: id})
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminContact = async(req, res) =>{
    try {
        const contact = await Contact.find()
        if(!contact || contact.length === 0) {
            return res.status(404).json({error: 'No Contact Found'})
        }
        res.status(200).json({msg: contact})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminContactDelete = async(req, res) => {
    try {
        const id = req.params.id
        const result = await Contact.deleteOne({_id: id})
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: 'Contact not found' });
        } else {
            res.status(200).json({ msg: 'Contact deleted successfully' });
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminServices = async(req, res) =>{
    try {
        const service = await Service.find()
        if(!service || service.length === 0) {
            return res.status(404).json({error: 'No Service Found'})
        }
        res.status(200).json({msg: service})
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminServicesUpdate = async(req, res) => {
    try {
        const id = req.params.id
        const {name, price, description, provider} = req.body
        const service = await Service.findOneAndUpdate({_id: id}, {name, price, description, provider}, {new: true})
        if(!service) {
            return res.status(404).json({error: 'Service not found'})
        } else {
            res.status(200).json({msg: service})
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const adminServicesDelete = async (req, res) => {
    try {
        const id = req.params.id
        const result = await Service.deleteOne({_id: id})
        if(result.deletedCount === 0) {
            return res.status(404).json({error: 'Service not found'})
        } else {
            res.status(200).json({msg: 'Service deleted successfully'})
        }
    } catch (error) {
        res.status(500).json({error: 'Internal Server Error'})
    }
}

const payment = async(req, res) =>{
    // try {
    //     const { amount, currency, description } = req.body

    //     const session = await stripe.checkout.sessions.create({
    //         payment_method_types: ['card'],
    //         line_items: [
    //             {
    //                 price_data: {
    //                     currency: currency,
    //                     product_data: {
    //                         name: description,
    //                     },
    //                     unit_amount: amount,
    //                 },
    //                 quantity: 1,
    //             },
    //         ],
    //         mode: 'payment',
    //         success_url: `${process.env.CLIENT_URL}/success`,
    //         cancel_url: `${process.env.CLIENT_URL}/cancel`,
    //     })
    //     res.status(200).json({url: session.url})

    //     // const paymentIntent = await stripe.paymentIntents.create({
    //     //     amount: amount,
    //     //     currency: currency,
    //     //     description: description,
    //     //     payment_method_types: ['card'],
    //     // })
    //     // res.status(200).json({msg: paymentIntent})
    // } catch (error) {
    //     res.status(500).json({error: 'Internal Server Error'})
    // }
}

export {home, register, login, contact, user, services, payment, adminUser, adminUserUpdate, getUserById, adminUserDelete, adminContact, adminContactDelete, adminServices, adminServicesUpdate, adminServicesDelete}