import patientsData from './../../data/patients';
import {
  Patient,
  NewPatientEntry, 
  Entry,
  NewEntry
} from './../../types';
import { v4 as uuid } from 'uuid';


let patients: Array<Patient> = patientsData ;

const getEntries = (): Array<Patient> => {
  return patients;
};

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const getById = (id: any): Patient | undefined => {
  const patient = patients.find((p) => p.id === id);
  return patient;
};


const addEntries = ( newEntry: NewEntry, patient: Patient): Patient => {
    const entry: Entry = { ...newEntry, id: uuid() };
    const updPatient = { ...patient, entries: patient.entries.concat(entry) };
     patients = patients.map((p) => p.id === updPatient.id ? updPatient : p
    );
    return updPatient;
  };


const addPatient = (entry: NewPatientEntry): Patient => {
    
  const newPatientEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatientEntry);
  return newPatientEntry;
};

export default {
  getEntries,
  addPatient,
  getById,
  addEntries
  //getNonSensitiveEntries
};