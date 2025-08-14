const express = require('express');
const router = express.Router();
const memberCtrl = require('../controllers/control.memb');
const upload = require('../muddlewares/upload');
const auth = require('../muddlewares/admin');

router.get('/', memberCtrl.lister);
router.get('/:id', memberCtrl.detail);
router.post('/', auth, upload.single('photo'), memberCtrl.creer);
router.put('/:id', auth, upload.single('photo'), memberCtrl.modifier);
router.delete('/:id', auth, memberCtrl.supprimer);

module.exports = router;
