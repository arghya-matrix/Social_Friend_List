// const { where } = require('sequelize');
const db = require("../models/index");

async function sendFriendRequest({ user_id, friend_id }) {
  const friend = await db.Friend.create({
    user_id: user_id,
    friend_id: friend_id,
    accept: false,
    counter: 1,
  });
  return friend;
}

async function friendDetails({ friend_id }) {
  const friend = await db.Friend.findOne({
    include: {
      model: db.User,
      attributes : ['uuid', 'Name']
    },
    where: {
      friend_id: friend_id,
    },
  });
  return friend;
}

async function findByFriendId({ user_id, friend_id }) {
  const friend = await db.Friend.findAndCountAll({
    where: {
      user_id: user_id,
      friend_id: friend_id,
    },
    raw: true,
  });
  return friend;
}

async function checkAcceptReject({ user_id, friend_id }) {
  const friend = await db.Friend.findOne({
    where: {
      user_id: user_id,
      friend_id: friend_id,
    },
  });
  return friend;
}

async function sendFriendRequestAgain({ user_id, friend_id }) {
  await db.Friend.update(
    {
      counter: db.sequelize.literal(`counter + ${1}`),
    },
    {
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
    }
  );
  await db.Friend.update(
    {
      blocked: true,
    },
    {
      where: {
        counter: 3,
      },
    }
  );
  const friend = await db.Friend.findOne({
    include: db.User,
    where: {
      user_id: user_id,
      friend_id: friend_id,
    },
  });
  // console.log(friend, " <<<------Friend Data");
  return friend;
}

async function acceptFriendRequest({ user_id, friend_id }) {
  const [numUpdatedRows, updatedRows] = await db.Friend.update(
    {
      accept: true,
    },
    {
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
    }
  );
  if (numUpdatedRows > 0) {
    const friend = await friendDetails({
      friend_id: friend_id,
    });
    return friend;
  } else {
    return `Friend Request cannot be accepted`;
  }
}

async function deleteFriend({ user_id, friend_id }) {
  await db.Friend.destroy({
    where: {
      user_id: user_id,
      friend_id: friend_id,
    },
  });
}

async function getAllFriend({
  whereOptions,
  orderOptions,
  searchTerm,
  size,
  index,
}) {
  const friend = await db.Friend.findAndCountAll({
    attributes : ['user_id', 'accept', 'blocked', 'counter'],
    include:{
      model: db.User,
      where: searchTerm,
      attributes : ['uuid','Name']
    },
    where: whereOptions,
    order: orderOptions,
    limit: size,
    offset: index,
  });
  // console.log(friend,"<-----Friend data");
  return friend;
}

async function rejectRequest({user_id,friend_id}){
  const [numUpdatedRows, updatedRows] = await db.Friend.update(
    {
      accept: false,
    },
    {
      where: {
        user_id: user_id,
        friend_id: friend_id,
      },
    }
  );
  if (numUpdatedRows > 0) {
    const friend = await friendDetails({
      friend_id: friend_id,
    });
    // console.log(friend.User.dataValues,'<===REject req');
    return friend.User.dataValues;
  } else {
    return `Friend Request cannot be accepted`;
  }
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  deleteFriend,
  sendFriendRequestAgain,
  checkAcceptReject,
  findByFriendId,
  friendDetails,
  getAllFriend,
  rejectRequest
};