const Joi = require('joi');

// Validation schemas
const schemas = {
  provider: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().pattern(/^[+]?[\d\s\-\(\)]+$/).required(),
    email: Joi.string().email().required(),
    city: Joi.string().min(2).max(100).required()
  }),

  user: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid('admin', 'employee', 'customer').default('customer')
  }),

  product: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().max(500).optional(),
    price: Joi.number().positive().precision(2).required(),
    stock: Joi.number().integer().min(0).required(),
    providerId: Joi.number().integer().positive().required()
  }),

  sale: Joi.object({
    userId: Joi.number().integer().positive().required(),
    saleDetails: Joi.array().items(
      Joi.object({
        productId: Joi.number().integer().positive().required(),
        quantity: Joi.number().integer().positive().required()
      })
    ).min(1).required()
  })
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation error',
        details: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

module.exports = {
  schemas,
  validate
};
