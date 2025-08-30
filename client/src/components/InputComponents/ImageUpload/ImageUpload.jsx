import classNames from 'classnames';
import { useField, useFormikContext } from 'formik';

const ImageUpload = props => {
  const [field, meta, helpers] = useField(props.name);
  const { setFieldValue } = useFormikContext();
  const { uploadContainer, inputContainer, imgStyle } = props.classes;

  const onChange = e => {
    const file = e.target.files[0];
    if (!file) {
      console.error('No file selected');
      return;
    }

    const imageType = /image.*/;
    if (!file.type.match(imageType)) {
      console.error('Invalid file type');
      return;
    }

    setFieldValue(field.name, file);
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          name={field.name}
          id='fileInput'
          type='file'
          accept='.jpg, .png, .jpeg'
          onChange={onChange}
        />
        <label htmlFor='fileInput'>Choose file</label>
      </div>
      {field.value && field.value instanceof File ? (
        <img
          src={URL.createObjectURL(field.value)}
          id='imagePreview'
          className={classNames({ [imgStyle]: !!field.value })}
          alt='user'
          onLoad={e => URL.revokeObjectURL(e.target.src)} 
        />
      ) : null}
    </div>
  );
};

export default ImageUpload;
