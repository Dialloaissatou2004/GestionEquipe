const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/control.tache');
const auth = require('../muddlewares/admin');
const validate = require('../muddlewares/validate');
const taskSchema = require('../validators/tache');

router.get('/', taskCtrl.lister);
router.get('/:id', taskCtrl.detail);
router.post('/', auth, validate(taskSchema), taskCtrl.creer);
router.put('/:id', auth, validate(taskSchema), taskCtrl.modifier);
router.delete('/:id', auth, taskCtrl.supprimer);

module.exports = router;
