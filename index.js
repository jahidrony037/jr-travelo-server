const express = require('express');
const cors = require('cors')
const app = express();
const port = process.env.PORT || 5000;

app.get('/', (req,res)=>{
    res.send("jr-travelo server is running !");
})

app.listen(port, ()=>{
    console.log(`server listing on port ${port}`);
})