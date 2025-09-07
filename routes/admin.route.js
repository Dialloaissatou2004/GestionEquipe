const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/control.admin');
const authMiddleware = require('../muddlewares/admin');
const upload = require('../muddlewares/upload');

router.post('/register', upload.single('photo'), authCtrl.register);
router.post('/login', authCtrl.login);
router.get('/me', authMiddleware, authCtrl.getProfile);
router.get('/users', authMiddleware, authCtrl.getAllUsers);

module.exports = router;