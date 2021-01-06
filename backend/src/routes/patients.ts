import express from 'express';
import patientService from './../services/patientService';
import toNewPatientEntry, { toNewEntry } from './../../utils/utils';

const router = express.Router();

router.get('/', (_req, res) => {
  //res.send('Fetching all diagnoses!');
  res.json(patientService.getEntries());
});

router.get("/:id", (req, res) => {
  const patient = patientService.getById(req.params.id);

  if (patient) {
    res.json(patient);
  } else {
    res.sendStatus(404);
  }
});

router.post("/:id/entries", (req, res) => {

  console.log('req.body:', req.body);

  const patient = patientService.getById(req.params.id);
  console.log('löytyi patient:', patient);

  if(patient) {
  try {
    const newEntry = toNewEntry(req.body);
    console.log('ja newEntry on:', newEntry);

    const updatedPatient = patientService.addEntries( newEntry, patient);

    console.log('updatepatient:', updatedPatient);
    
    res.json(updatedPatient);
  } catch (e) {
    res.status(400);
  } 
}

});

router.post('/', (req, res) => {
  try {
    const newPatientEntry = toNewPatientEntry(req.body);

    const addedEntry = patientService.addPatient(newPatientEntry);
    res.json(addedEntry);
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    res.status(400).send(e.message);
  }
});

/* router.post('/', (_req, res) => {
  res.send('Saving a diary!');
}); */

export default router;