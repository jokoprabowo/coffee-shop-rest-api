const express = require('express');
const cookieController = require('../controllers/cookieController');

const router = express.Router();

router.get('', cookieController.getAll);
router.get('/:id', cookieController.getOne);
router.post('', cookieController.create);
router.put('', cookieController.update);

module.exports = router;
