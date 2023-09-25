const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const userMiddleware = require("../middleware/validateUserData");
const tokenVerify = require("../middleware/tokenVerify");
const friendsController = require("../controllers/friends.controller");
const friendRequestMiddleware = require("../middleware/friend.request.middleware");

router.post(
  "/sign-up",
  [userMiddleware.validateEmail, userMiddleware.validateName],
  userController.signUp
);
router.post("/log-in", userController.signIn);
router.post("/log-out", tokenVerify.userProfile, userController.logOut);

router.get(
  "/get-all-friends",
  tokenVerify.userProfile,
  friendsController.getAllFriends
);
router.get("/get-user", tokenVerify.userProfile, userController.getUser)
router.put(
  "/send-friend-request",
  tokenVerify.userProfile,
  friendRequestMiddleware,
  friendsController.sendFriendRequest
);
router.put(
  "/accept-req",
  tokenVerify.userProfile,
  friendsController.acceptRequest
);
router.put("/reject-req",tokenVerify.userProfile,friendsController.rejectRequest)
router.delete("/delete-friend", tokenVerify.userProfile, friendsController.deleteFriend);

module.exports = router;
