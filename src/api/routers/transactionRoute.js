const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');

router.get("", transactionController.getAll);
router.get("/:id", transactionController.getOne);
router.post("", transactionController.create);
router.put("/:id", transactionController.update);

module.exports = router;