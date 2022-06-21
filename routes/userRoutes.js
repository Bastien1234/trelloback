const express = require('express');
const router = express.Router();

const UsersController = require('./../controllers/usersController');
const AuthController = require('./../controllers/authController');

const { testServer } = UsersController;
const { signup, login } = AuthController;

router.get('/testServer', testServer)
router.post('/signup', signup)
router.post('/login', login)

module.exports = router;