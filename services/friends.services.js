const db = require('../models/index');

async function sendFriendRequest({user_id, friend_id}){
    const friend = await db.Friend.create({
        user_id : user_id,
        friend_id : friend_id,
        accept : false,
        counter : 1
    })
    return friend
}

async function acceptFriendRequest({user_id, friend_id}){
    await db.Friend.update({
        accept : true
    },{
        where: {
            user_id : user_id,
            friend_id: friend_id
        }
    })
}

module.exports = {
    sendFriendRequest,
    acceptFriendRequest
}