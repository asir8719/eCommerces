import 'dotenv/config'
import express from 'express'
import {router} from './router/auth-router.js'
import { connectDb } from './utils/db.js'
import cors from 'cors'
const app = express()
const PORT = 3000;

app.use(express.json())
app.use(cors())
app.use('/', router)

connectDb().then(() =>{  
    app.listen(PORT, ()=>{
        console.log(`server is running at port: ${PORT}`)
    })
})