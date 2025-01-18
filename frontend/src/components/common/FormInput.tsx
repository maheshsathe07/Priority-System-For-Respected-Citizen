import { Field, ErrorMessage } from 'formik';

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}

export const FormInput = ({ label, name, type = 'text', placeholder }: FormInputProps) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <Field
      type={type}
      name={name}
      placeholder={placeholder}
      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    />
    <ErrorMessage name={name} component="div" className="mt-1 text-sm text-red-600" />
  </div>
); 