import { Router } from 'express';
import validator from '@keithics/joi/lib/validator';
import { pokemonUpdateValidator, pokemonValidator } from './pokemon.validator';
import { filterValidator, listPaginationValidator, objectIdValidator, searchValidator } from '@keithics/joi/lib/core.validator';
import pokemonController from './pokemon.controller';

const pokemonRouter = Router();

pokemonRouter.get('/:id', validator(objectIdValidator, true), pokemonController.read.bind(pokemonController));
pokemonRouter.post('/page', validator(listPaginationValidator), pokemonController.list);
pokemonRouter.post('/filter', validator(filterValidator(false, 'type')), pokemonController.filter.bind(pokemonController));
pokemonRouter.post('/search', validator(searchValidator(true, 'name')), pokemonController.search.bind(pokemonController));
pokemonRouter.post('/', validator(pokemonValidator), pokemonController.create);
pokemonRouter.put('/:id', validator(pokemonUpdateValidator), pokemonController.update);
pokemonRouter.delete('/:id', validator(objectIdValidator, true), pokemonController.delete);

export default pokemonRouter;
