const db = require('../models')

async function signIn({ email_address }) {
    const user = await db.User.findAndCountAll({
        where: {
            email_address: email_address
        },
        raw: true
    })
    return user
}

async function createUser({Name, user_name, email_address, password}){
    const user = await db.User.create({
        Name: Name,
        user_name : user_name,
        email_address : email_address,
        password : password
    })
    const userData = { ...user.get(), password: undefined, user_id: undefined }
    return userData;
}

async function findUser({email_address}){
    const user = await db.User.findOne({
        where : {
            email_address : email_address
        }
    })
    console.log(user, "<----User service data");
    return user;
}

module.exports = {
    signIn,
    createUser,
    findUser
}