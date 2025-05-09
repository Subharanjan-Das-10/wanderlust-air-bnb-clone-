// schema.js
const Joi = require('joi');

const listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string()
      .min(3)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title should have at least 3 characters',
      }),

    description: Joi.string()
      .min(10)
      .max(500)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description should be at least 10 characters',
      }),

    location: Joi.string()
      .min(3)
      .max(100)
      .required(),

    country: Joi.string()
      .min(3)
      .max(100)
      .required(),

    image: Joi.object({
      url: Joi.string()
        .uri()
        .required()
        .messages({
          'string.uri': 'Image must be a valid URL',
        })
    }).required(),

    price: Joi.number()
      .min(0)
      .required()
  }).required()
});
const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required()
  }).required()
});

module.exports = { listingSchema,reviewSchema };