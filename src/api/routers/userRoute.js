const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.get('/profile', authorization.cookiesAuth, userController.whoAmI);
router.get('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/registration', authController.register);
router.put('/update', authorization.cookiesAuth, userController.update);

module.exports = router;
