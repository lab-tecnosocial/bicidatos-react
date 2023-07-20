import { useField } from "formik";

export const FileUpload = ({ field, form, ...props }) => {
  const [fieldInputProps, meta] = useField(field);

  const handleChange = (event) => {
    form.setFieldValue(field.name, event.currentTarget.files);
  };

  return (
    <div>
      <input type="file" {...fieldInputProps} {...props} onChange={handleChange} />
      {meta.touched && meta.error && (
        <div className="error">{meta.error}</div>
      )}
    </div>
  );
};

