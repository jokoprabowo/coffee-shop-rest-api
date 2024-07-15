const express = require('express');
const router = express.Router();
const cookieController = require('../controllers/cookieController');

router.get("", cookieController.getAll);
router.get("/:name", cookieController.getOne);
router.post("/add", cookieController.create);
router.put("/update", cookieController.update);

module.exports = router;