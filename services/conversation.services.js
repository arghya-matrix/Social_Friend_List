const { Op } = require("sequelize");
const db = require("../models/index");

async function createConversation({ user_id, friend_id, message }) {
  const conversation = await db.Conversation.create({
    sender_id: user_id,
    receiver_id: friend_id,
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
    attributes: ["id", "sender_id", "receiver_id", "message"],
    include: [
      {
        model: db.User,
        attributes: ["Name"],
        as: "Receiver",
      },
      {
        model: db.User,
        attributes: ["Name"],
        as: "Sender",
      },
    ],
    where: {
      [Op.or]: [
        { sender_id: user_id, receiver_id: friend_id },
        { sender_id: friend_id, receiver_id: user_id },
      ],
    },
    order: [["createdAt", "ASC"]],
    limit: size,
    offset: index,
  });
  const jsonData = conversation.rows.map((data) => data.toJSON());
  // console.log(jsonData,"<--- JSON data");
  return { conversation, jsonData };
}

async function chatListing({ user_id, index, size }) {
  const chats = await db.Conversation.findAndCountAll({
    attributes: [
      [db.sequelize.fn("MAX", db.sequelize.col("id")), "id"],
      "receiver_id", "message"
    ],
    include: {
      model: db.User,
      attributes: ["Name"],
      as: "Receiver",
    },
    where: {
      sender_id: user_id,
    },
    group: ["receiver_id", 'message'],
    limit: size,
    offset: index,
  });
  const chatJson = chats.rows.map((chat) => chat.toJSON());
  // console.log(chatJson, "<---Chat Listing");
  return { chats, chatJson };
}

module.exports = {
  createConversation,
  deleteConversation,
  updateConversation,
  getConversation,
  chatListing,
};
