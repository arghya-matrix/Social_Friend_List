const conversationServices = require("../services/conversation.services");

async function createConversation(req, res) {
  try {
    await conversationServices.createConversation({
      friend_id: req.body.friend_id,
      user_id: req.userdata.user_id,
      message: req.body.message,
    });
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    const { conversation, jsonData } =
      await conversationServices.getConversation({
        friend_id: req.body.friend_id,
        user_id: req.userdata.user_id,
        index: index,
        size: size,
      });
    const currentPage = page ? +page : 1;
    const totalPages = Math.round(conversation.count / size);
    res.json({
      currentPage: currentPage,
      totalPages: totalPages,
      data: jsonData,
    });
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function getMyConversation(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;
    const newJson = [];

    const { conversation, jsonData } =
      await conversationServices.getConversation({
        friend_id: req.query.friend_id,
        user_id: req.userdata.user_id,
        index: index,
        size: size,
      });
    // console.log(conversation.rows, "<---- my conversation");
    const currentPage = page ? +page : 1;
    const totalPages = Math.round(conversation.count / size);
    jsonData.map((obj) => {
      if (obj.sender_id == req.userdata.user_id) {
        obj.myMessage = true;
        newJson.push(obj);
      } else {
        obj.myMessage = false;
        newJson.push(obj);
      }
    });
    console.log(newJson, " <--- Updated json data");
    res.json({
      currentPage: currentPage,
      totalPages: totalPages,
      data: newJson,
    });
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function chatListing(req, res) {
  try {
    const page = req.query.page ? req.query.page : 1;
    const itemsInPage = req.query.size;
    const size = itemsInPage ? +itemsInPage : 3;
    const index = page ? (page - 1) * size : 0;

    const { chatJson, chats } = await conversationServices.chatListing({
      index: index,
      size: size,
      user_id: req.userdata.user_id,
    });
    if (chats.count == 0) {
      res.json({
        message: `Start new Conversations with your friends`,
      });
    } else {
      res.json({
        message: `Your chat list`,
        data: chatJson,
      });
    }
  } catch (error) {
    console.log(error, "<-----An error occured");
    res.status(500).json({
      message: `Server Error`,
      err: error,
    });
  }
}

async function deleteConversation() {}

module.exports = {
  createConversation,
  getMyConversation,
  chatListing,
};
