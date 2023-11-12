const bcrypt = require('bcrypt');
const User = require('../schemas/user.js');
const { generateToken } = require('../middlewares/auth.js');

async function register(req, res) {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
        return res.status(400).send('Usuário já existe.');
    }

    const user = new User({ name, email, password: await bcrypt.hash(password, 10) });
    await user.save();

    res.status(201).send({ token: generateToken(user._id) });
}

async function login(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).send('Email ou senha inválidos.');
    }

    if (!await bcrypt.compare(password, user.password)) {
        return res.status(400).send('Email ou senha inválidos.');
    }

    res.send({ token: generateToken(user._id) });
}

module.exports = { register, login };