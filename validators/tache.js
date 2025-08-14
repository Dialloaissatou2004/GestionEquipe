const Joi = require('joi');

module.exports = Joi.object({
  titre: Joi.string().min(2).required(),
  description: Joi.string().allow('').max(2000),
  assigne: Joi.string().allow('', null),
  priorite: Joi.string().valid('faible', 'moyenne', 'haute').default('moyenne'),
  statut: Joi.string().valid('a_faire', 'en_cours', 'termine').default('a_faire'),
  dateEcheance: Joi.date().optional(),
  creePar: Joi.string().optional()
});
