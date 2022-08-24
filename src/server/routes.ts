import { Router } from 'express';
import config from './config';
import pokemonRouter from 'api/pokemons/pokemon.routes';
import { authenticate } from '@keithics/auth/lib/authenticate';

const routes = Router();

routes.use('/', authenticate({ token: config.TOKEN_SECRET, level: 'user', roles: ['my-custom-role'] }), pokemonRouter);

// 404 error
routes.use('*', (req, res) => {
  res.status(404).json({ error: true, message: '404 not found' });
});

export default routes;
