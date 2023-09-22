const express = require('express');
const server = express();
const port = 3000;
const userRouter = require('./router/user.router')

server.use((req,res,next)=>{
    console.log(`Method : ${req.method}, ip : ${req.ip}, path : ${req.path}`);
    next();
})

server.use(express.json());
server.use(express.urlencoded({ extended : true }));

server.use("/user",userRouter);

server.listen(port,()=>{
    console.log(`server started at ${port}`);
})