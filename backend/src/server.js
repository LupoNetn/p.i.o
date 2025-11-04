import express from 'express'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import './lib/autoCompleteBookingsCron.js'


import authRoute from './routes/authRoute.js'
import userRoute from './routes/userRoute.js'
import bookingRoute from './routes/bookingRoute.js'

import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = process.env.PORT


//middlewares
app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,             
}));
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//routes
//http:localhost:8080/api/
app.use('/api/auth', authRoute)
app.use('/api/user',userRoute)
app.use('/api/booking', bookingRoute)



app.listen(port,(err) => {
    if(err) return console.error('something went wrong', err)
    console.log(`server running on port: ${port}`)
})