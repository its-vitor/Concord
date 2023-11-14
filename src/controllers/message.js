const mongoose = require("mongoose");
const Chats = require("../schemas/chats.js");
const { userFromToken } = require("../middlewares/auth.js");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");
const Errors = require("../errors/errors.js");

const sendMessage = async (userId, content, token) => {
  const author = await User.findById(userFromToken(token));
  userId = new mongoose.Types.ObjectId(userId);

  if (!author.friends.includes(userId)) {
    throw new Errors.NotFriends(
      "Você só pode enviar mensagens para seus amigos."
    );
  }

  let chat = await Chats.findOne({ members: { $all: [userId, author._id] } });

  if (!chat) {
    chat = new Chats({ members: [userId, author._id] });
  }

  chat.messages.push({ content, authorId: author._id });

  await chat.save();
};

const addFriend = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.body.userId);
  const user = await User.findById(userFromToken(req.headers.authorization));

  if (user.friends.includes(userId)) {
    res.status(405).send({ message: "Este usuário já é seu amigo." });
    return;
  }

  user.friends.push(userId);

  await user.save();

  res.status(200).send({ message: "Amigo adicionado com sucesso." });
};

module.exports = { sendMessage, addFriend };
