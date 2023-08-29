import React from 'react'
import { Field } from 'formik'
export default function Input({ name, label, type='text', as='input', helperText='', ...rest }) {
  return (
      <div className={type === 'text' || as === 'textarea' ? 'input-field' : 'field'}>
      <Field id={name} name={name} type={type} as={as} validate={false} {...rest} />
      <label htmlFor={name}>{label}</label>
      {helperText && <span className="helper-text" >{helperText}</span>}
      </div>
  )
}
