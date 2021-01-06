import express from 'express';
import diagnoseService from './../services/diagnoseService';

const router = express.Router();

router.get('/', (_req, res) => {
  //res.send('Fetching all diagnoses!');
  res.json(diagnoseService.getEntries());
});



/* router.post('/', (_req, res) => {
  res.send('Saving a diary!');
}); */

export default router;