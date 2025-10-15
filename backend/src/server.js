import express from 'express'

import dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = process.env.PORT






app.listen(port,(err) => {
    if(err) return console.error('something went wrong', err)
    console.log(`server running on port: ${port}`)
})