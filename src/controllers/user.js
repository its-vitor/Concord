const bcrypt = require("bcrypt");
const User = require("../schemas/user.js");
const Chats = require("../schemas/chats.js");
const { generateToken, userFromToken } = require("../middlewares/auth.js");

async function register(req, res) {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (await User.findOne({ email })) {
    return res.status(400).send("Usuário já existe.");
  }

  const user = new User({
    name,
    email,
    password: await bcrypt.hash(password, 10),
  });
  await user.save();

  return res.status(201).send({ token: generateToken(user._id) });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send("Email ou senha inválidos.");
  }

  if (!(await bcrypt.compare(password, user.password))) {
    return res.status(400).send("Email ou senha inválidos.");
  }

  return res.send({ token: generateToken(user._id) });
}

async function getFriends(req, res) {
  const token = req.headers.authorization;
  const user = await User.findById(userFromToken(token));
  return res.send(await User.find({ _id: { $in: user.friends } }, "name _id"));
}

async function getMessages(req, res) {
  const { start, size, userId } = req.body;

  if (!Number.isInteger(start) || !Number.isInteger(size)) {
    return res.status(400).send("Ops!");
  }

  const token = req.headers.authorization;

  try {
    const user = await User.findById(userFromToken(token)._id);

    if (!user) {
      return res.status(403).send("Usuário não autorizado.");
    }

    const chat = await Chats.findOne({ members: { $all: [userId, user._id] } });

    if (!chat) {
      return res.status(400).send("Chat não encontrado.");
    }

    const messages = chat.messages.slice(-start, -start + size).reverse();

    res.send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Serviço em manutenção! Por favor, aguarde.");
  }
}

module.exports = { register, login, getFriends, getMessages };
