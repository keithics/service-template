import CoreCrudController from '@signalyticsai/core/lib/core-crud.controller';
import { Model } from 'mongoose';
import Pokemon, { PokemonInterface } from './pokemon.model';

/**
 * Basic CRUD functions
 * we only use class when we want to extend the basic crud controller,
 * otherwise use functions
 */
class PokemonController extends CoreCrudController {
  protected model: Model<PokemonInterface> = Pokemon;
}

export default new PokemonController();
