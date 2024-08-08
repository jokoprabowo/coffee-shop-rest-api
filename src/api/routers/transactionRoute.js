const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authorization = require('../middlewares/authorization');

router.get("", transactionController.getAll);
router.get("/:id", transactionController.getOne);
router.post("", authorization.cookiesAuth, transactionController.create);
router.put("/:id", transactionController.update);

module.exports = router;