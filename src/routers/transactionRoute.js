const express = require('express');
const transactionController = require('../controllers/transactionController');
const authorization = require('../middlewares/authorization');

const router = express.Router();

router.get('', transactionController.getAll);
router.get('/:id', transactionController.getOne);
router.post('', authorization.cookiesAuth, transactionController.create);
router.put('/:id', transactionController.update);

module.exports = router;
