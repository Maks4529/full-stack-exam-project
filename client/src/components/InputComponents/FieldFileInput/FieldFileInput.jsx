import React from 'react';
import { useField, useFormikContext } from 'formik';

const FieldFileInput = ({ classes, name }) => {
  const { fileUploadContainer, labelClass, fileNameClass, fileInput } = classes;
  const { setFieldValue, values } = useFormikContext();
  const [field, meta] = useField(name);

  const handleChange = e => {
    setFieldValue(name, e.currentTarget.files[0]);
  };

  return (
    <div className={fileUploadContainer}>
      <label htmlFor={name} className={labelClass}>
        Choose file
      </label>
      <span id='fileNameContainer' className={fileNameClass}>
        {values[name]?.name || ''}
      </span>
      <input
        id={name}
        name={name}
        type='file'
        className={fileInput}
        onChange={handleChange}
      />
      {meta.touched && meta.error && <div className='error'>{meta.error}</div>}
    </div>
  );
};

export default FieldFileInput;
