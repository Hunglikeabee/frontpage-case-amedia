import express from 'express';

import logger from '../logger.js';
// Import manifests
import preview from '../views/preview.view.js';
import manifest from '../manifests/manifests.js';

// Import Views

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

router.get('/component', (req, res) => {
  logger.info('Request /component route');
  res.type('text/html');

  res.end('<amedia-frontpage> Her skal forsiden komme </amedia-frontpage>');
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
