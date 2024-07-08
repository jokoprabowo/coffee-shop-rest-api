const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const middleware = require('../middlewares/authorization');

router.get('/profile', middleware.authorize, userController.whoAmI);
router.get('/login', authController.login);
router.post('/registration', authController.register);
router.put('/update', middleware.authorize, userController.update);

module.exports = router;