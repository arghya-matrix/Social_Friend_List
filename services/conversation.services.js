const db = require("../models/index");

async function createConversation({ user_id, friend_id, message }) {
  const conversation = await db.Conversation.create({
    sender_id: friend_id,
    receiver_id: user_id,
    message: message,
  });
  return conversation;
}

async function deleteConversation({ user_id, con_id }) {
  const conversation = await db.Conversation.destroy({
    where: {
      id: con_id,
      user_id: user_id,
    },
  });
  console.log(conversation);
}

async function updateConversation({ user_id, con_id, message }) {
  const [numUpdatedRows] = await db.Conversation.update(
    { message: message },
    {
      where: {
        user_id: user_id,
        con_id: con_id,
      },
    }
  );
  if (numUpdatedRows > 0) {
    return await db.Conversation.findOne({
      where: {
        con_id: con_id,
      },
    });
  } else {
    return "Error updating the row";
  }
}

async function getConversation({ user_id, friend_id, index, size }) {
  const conversation = await db.Conversation.findAndCountAll({
    include: {
      model: db.User,
      attributes: ["Name"],
    },
    where: {
      user_id: user_id,
      friend_id: friend_id,
    },
    order: ["createdAt", "ASC"],
    limit : size,
    offset : index
  });
  return conversation;
}

module.exports = {
  createConversation,
  deleteConversation,
  updateConversation,
  getConversation
};
