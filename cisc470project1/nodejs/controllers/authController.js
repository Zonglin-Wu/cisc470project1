const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { User } = require('../models');

exports.register = async (req, res) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });
    await User.create({
        email,
        password: password,
    });
    res.status(201).json({ message: 'User registered successfully' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user || !(user.password === password)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ user_id: user.id }, config.jwtSecret, { expiresIn: '1h' });
    res.json({ token });
};
