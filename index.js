const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;

// middleware 
app.use(cors());
app.use(express());

app.get('/', (req,res)=>{
    res.send("jr-travelo server is running !");
})

app.listen(port, ()=>{
    console.log(`server listing on port ${port}`);
})