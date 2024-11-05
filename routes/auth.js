const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/ControllerAuth');

router.post('/register', (req, res) => AuthController.registerUser(req, res));

router.post('/login', (req, res) => AuthController.loginUser(req, res));

module.exports = router;
