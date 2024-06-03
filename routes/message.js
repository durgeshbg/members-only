const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAdmin } = require('./authMiddleware');

router.get('/', messageController.message_list);

router.get('/create', messageController.message_create_get);
router.post('/create', messageController.message_create_post);

router.post('/delete', isAdmin, messageController.message_delete);

module.exports = router;
