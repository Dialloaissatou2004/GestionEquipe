const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/control.admin');

router.post('/register', authCtrl.register);
router.post('/login', authCtrl.login);

module.exports = router;