import React from "react";
import axios from "axios";
import { AddEntryForm } from "./../AddPatientModal/AddEntryForm";
import { useParams } from "react-router-dom";
import { Icon, Button } from "semantic-ui-react";
import { apiBaseUrl } from "../constants";
import {
  Entry,
  EntryType,
  Patient,
  NewEntry,
  HospitalEntry,
  OccupationalHealthcareEntry,
  HealthCheckEntry
} from "../types";
import { useStateValue, setEntryAdd } from "../state";
import { assertNever } from "./../utils";

const PatientPage: React.FC = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [{ diagnosis }] = useStateValue();

  const { id } = useParams<{ id: string }>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const patient = patients[id];

  console.log('patient on:', patient);

  const HealthCheckNotes: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
    return (
      <div>
        {entry.date} <Icon name="user md" />
        <p>{entry.specialist}</p>
        <p>{entry.description}</p>
        <p>
          {entry.diagnosisCodes &&

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            entry.diagnosisCodes.map((code: any) => (
              <li key={code}>
                {code} {diagnosis[code].name}
              </li>))
          }
        </p>
        <p>Rating:{entry.healthCheckRating}</p>

      </div>
    );
  };

  const HospitalNotes: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
    return (
      <div>
        { entry.date} < Icon name="hospital" />
        <p>{entry.specialist}</p>
        <p>{entry.description}</p>
        <p>
          {entry.diagnosisCodes &&

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            entry.diagnosisCodes.map((code: any) => (
              <li key={code}>
                {code} {diagnosis[code].name}
              </li>))
          }
        </p>
        <p>{entry.discharge.date} {entry.discharge.criteria}</p>
      </div>
    );

  };

  const OccupationalHealthCareNotes: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
    return (
      <div>
        { entry.date} < Icon name="heartbeat" />
        <p>{entry.specialist}</p>
        <p>{entry.description}</p>
        <p>
          {entry.diagnosisCodes &&

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            entry.diagnosisCodes.map((code: any) => (
              <li key={code}>
                {code} {diagnosis[code].name}
              </li>))
          }
        </p>
        <p>{entry.employerName}</p>
        {entry.sickLeave && (

          <p> {entry.sickLeave.startDate}
            {entry.sickLeave.endDate}
          </p>)}
      </div>
    );

  };

  const EntryDetails: React.FC<{ entry: Entry }> = ({ entry }) => {
    switch (entry.type) {
      case EntryType.OccupationalHealthCare:
        // case "OccupationalHealthcare":
        return <OccupationalHealthCareNotes entry={entry} />;
      case EntryType.Hospital:
        return <HospitalNotes entry={entry} />;
      case EntryType.HealthCheck:
        return <HealthCheckNotes entry={entry} />;
      default:
        return assertNever(entry);
    }
  };

  const submitNewEntry = async (values: NewEntry) => {

    console.log(' serveriin values:', values);

    

    try {

      const { data: newEntryPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${patient.id}/entries`,
        values
      );

      dispatch(setEntryAdd(newEntryPatient));
      //dispatch({ type: "ADD_PATIENT", payload: newPatient });

     
      closeModal();
    } catch (e) {
      console.error(e.response.data);
      setError(e.response.data.error);
    }
  };

  return (
    <div>
      <h3>Patient </h3>

      <h1>{patient.name}
        {patient.gender === 'male' ? <Icon name='mars' /> : <Icon name='venus' />}

      </h1>

      <p> SSN: {patient.ssn} </p>
      <p> Birth date: {patient.dateOfBirth} </p>
      <p> Occupation: {patient.occupation} </p>

      <AddEntryForm
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onCancel={closeModal}
      />
      <Button onClick={openModal}>Add New Entry</Button>

      <h2> entries</h2>
      {patient.entries.map(patientEntry =>
        <li key={patientEntry.id}>{patientEntry.date} {patientEntry.description}
          {patientEntry.diagnosisCodes &&

            patientEntry.diagnosisCodes.map(code => (
              <li key={code}>
                {code} {diagnosis[code].name}
              </li>))

            // ( <Codes diagnosisCodes={patientEntry.diagnosisCodes} /> )
          }

          <EntryDetails key={patientEntry.id} entry={patientEntry} />
        </li>)}

    </div>

  );
};
export default PatientPage;