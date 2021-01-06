import React from "react";
import { ErrorMessage, Field, FieldProps, FormikProps } from "formik";
import { Dropdown, DropdownProps, Form } from "semantic-ui-react";
import { HealthCheckRating } from './../types'


export type CheckOption = {
  value: HealthCheckRating;
  label: string;
};

type SelectFieldCheckProps = {
  name: string;
  label: string;
  options: CheckOption[];
};

export const SelectFieldCheck: React.FC<SelectFieldCheckProps> = ({
  name,
  label,
  options
}: SelectFieldCheckProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

