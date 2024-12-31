const Joi = require('joi');
const AppError = require('../utils/AppError'); // Add this import

const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    userName: Joi.string().min(3).required(),
    profilePicture: Joi.string().uri().allow('')
  }),
  createPost: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(''),
    location: Joi.string().required(),
    images: Joi.array().items(Joi.string().uri()),
    videos: Joi.array().items(Joi.string().uri())
  }),
  createComment: Joi.object({
    content: Joi.string().required()
  })
};

const validate = (schemaName) => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    if (!schema) {
      throw new Error(`No validation schema for ${schemaName}`);
    }
    
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new AppError(error.details[0].message, 400));
    }
    next();
  };
};

module.exports = { validate };
