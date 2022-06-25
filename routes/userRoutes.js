const express = require('express');
const router = express.Router();

const UsersController = require('./../controllers/usersController');
const AuthController = require('./../controllers/authController');

const { testServer, addWorkspace, deleteWorkspace, addContainer, deleteContainer } = UsersController;
const { signup, login } = AuthController;

router.get('/testServer', testServer)
router.post('/signup', signup)
router.post('/login', login)
router.post('/addWorkspace', addWorkspace)
router.post('/deleteWorkspace', deleteWorkspace)
router.post('/addContainer', addContainer)
router.post('/deleteContainer', deleteContainer)

module.exports = router;