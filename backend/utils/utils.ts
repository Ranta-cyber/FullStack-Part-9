/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NewPatientEntry,
   Gender, 
   Entry, 
   NewEntry, 
   EntryType, 
   SickLeave, 
   Discharge, 
   HealthCheckRating,
   NewBaseEntry,
   Diagnose
  } from './../types';

  const isString = (text: any): text is string => {
    return typeof text === 'string' || text instanceof String;
  };
  
  //date
  const isDate = (date: string): boolean => {
    return Boolean(Date.parse(date));
  };

const toNewPatientEntry = (object:any): NewPatientEntry => {
  return {
    dateOfBirth: parseDateOfBirth(object.dateOfBirth),
    name: parseName(object.name),
    ssn: parseSsn(object.ssn),
    gender: parseGender(object.gender),
    occupation: parseOccupation(object.occupation),
    entries: parseEntries(object.entries)
  };
};

export const toNewEntry = (object: any): NewEntry => {
  
  const newObject = toNewBaseEntry(object) as NewEntry;


  console.log('object in toNewEntry', object);

  switch (newObject.type) {
    case EntryType.HealthCheck:
      return {
        ...newObject,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case EntryType.OccupationalHealthCare:
    
      const newEntry = {
        ...newObject,
        employerName: parseemployerName(object.employerName),
      };

      if (object.sickLeave) {
        newEntry.sickLeave = parseSickLeave(object.sickLeave);
      }

      return newEntry;
    case EntryType.Hospital:
    
      return { ...newObject, discharge: parseDischarge(object.discharge) };
    default:
      return assertNever(newObject);
  }
};


const toNewBaseEntry = (object: any): NewBaseEntry => {
  const newBaseEntry: NewBaseEntry = {
    type: object.type,
    description: parseName(object.description),
    specialist: parseName(object.specialist),
    date: parseDateOfBirth(object.date)
  };
  if (object.diagnosisCodes) {
    newBaseEntry.diagnosisCodes = parseDiagnosesCodes(object.diagnosisCodes);
  }
  return newBaseEntry;
};

const parseDiagnosesCodes = (diagnosisCodes: any): Array<Diagnose["code"]> => {
  if (!Array.isArray(diagnosisCodes) ) {
    throw new Error("Incorrect or missing diagnoses");
  }

  return diagnosisCodes;
};

const parseDischarge = (object: any): Discharge => {
  if (!object) throw new Error("Incorrect discharge");
  if (!object.date || !isString(object.date) || !isDate(object.date)) {
    throw new Error('Incorrect date: ');}
  return {
    date: object.date,
    criteria: parseName(object.criteria),
  };
};

const parseSickLeave = (object: any): SickLeave => {
  if (!object) throw new Error("Incorrect sick leave");
  if (!object.startDate || !isString(object.startDate) || !isDate(object.startDate)) {
    throw new Error('Incorrect  startDate: ');}
    if (!object.endDate || !isString(object.endDate) || !isDate(object.endDate)) {
      throw new Error('Incorrect endDate: ');}
  return {
    startDate:object.startDate,
    endDate: object.endDate
  };
};


const parseHealthCheckRating = (healthCheckRating: any): HealthCheckRating => {
  if (healthCheckRating === null || 
    healthCheckRating === undefined ) {
    throw new Error(
   'Incorrect healthCheckRating'
    );
  }
  return healthCheckRating;
};

//string
const parseemployerName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name ');
  }
  return name;
};
const parseName = (name: any): string => {
  if (!name || !isString(name)) {
    throw new Error('Incorrect or missing name ');
  }
  return name;
};
const parseSsn = (ssn: any): string => {
  if (!ssn || !isString(ssn)) {
    throw new Error('Incorrect or missing ssn ');
  }
  return ssn;
};
const parseOccupation = (occupation: any): string => {
  if (!occupation || !isString(occupation)) {
    throw new Error('Incorrect or missing occupation ');
  }
  return occupation;
};

const parseEntries = (entries: any): Entry[] => {
  if (!entries || !Array.isArray(entries)) {
    throw new Error('Incorrect or missing occupation ');
  }
  return entries;
};


const parseDateOfBirth = (dateOfBirth: any): string => {
  if (!dateOfBirth || !isString(dateOfBirth) || !isDate(dateOfBirth)) {
    throw new Error('Incorrect or missing dateOfBirth ');
  }
  return dateOfBirth;
};

//gender
const parseGender = (gender: any): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender ');
  }
  return gender;
};
//enum type
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

export default toNewPatientEntry;