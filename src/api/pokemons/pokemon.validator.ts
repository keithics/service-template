import Joi from '@keithics/joi/lib/objectId';

const statesFields = {
  name: Joi.string().required(),
  type: Joi.string().required(),
};

export const pokemonValidator = {
  schema: Joi.object(statesFields),
};

export const pokemonUpdateValidator = {
  schema: Joi.object({
    ...statesFields,
    _id: Joi.objectId(),
  }),
};
