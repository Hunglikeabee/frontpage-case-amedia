import express from 'express';

import logger from '../logger.js';
// Import manifests
import preview from '../views/preview.view.js';
import manifest from '../manifests/manifests.js';

// Import Views
import theComponent from "../views/component.view.js"

// Initiate Router
const router = express.Router();

// Set up routes
router.get(
  '/manifest',
  (req, res) => {
    logger.info('Request /manifest route');
    return res.json(manifest);
  }
);

router.get('/component', async (req, res) => {
  logger.info('Request /component route');
  res.type('text/html');
  const html = await theComponent({ publication: req.query.publication });
  res.end(html);
});

router.get('/preview', async (req, res) => {
  logger.info('Request /preview route');
  res.type('text/html');

  // Kan vi ha publication som en query param til routen?
  // Ja det kan vi :)
  const html = await preview({ publication: req.query.publication });
  res.end(html);
});

// Legg inn

// Export application
export default router;
