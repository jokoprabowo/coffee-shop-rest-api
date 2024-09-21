const express = require('express');
const router = express.Router();
const cookieController = require('../controllers/cookieController');

router.get("", cookieController.getAll);
router.get("/:id", cookieController.getOne);
router.post("", cookieController.create);
router.put("/:id", cookieController.update);

module.exports = router;