const conversationServices = require('../services/conversation.services');

async function createConversation(req,res){
    await conversationServices.createConversation({
        friend_id: req.body.friend_id,
        user_id : req.userdata.user_id,
        message : req.body.message
    })
}

module.exports = {
    createConversation
}