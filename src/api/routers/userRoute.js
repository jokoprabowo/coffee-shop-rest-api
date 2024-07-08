const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const authorization = require('../middlewares/authorization');

router.get('/profile', authorization.cookiesAuth, userController.whoAmI);
router.get('/login', authController.login);
router.post('/registration', authController.register);
router.put('/update', authorization.cookiesAuth, userController.update);

module.exports = router;