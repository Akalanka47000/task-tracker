import * as React from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import { Select, Textarea } from '@heroui/react';
import { Input } from './input';

const Form = FormProvider;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> = {
  name: TName;
};

const FormFieldContext = React.createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }
  return {
    name: fieldContext.name,
    ...fieldState
  };
};

const FormInput = React.forwardRef<HTMLInputElement, React.ComponentProps<typeof Input>>((props, ref) => {
  const { error } = useFormField();
  return <Input ref={ref} errorMessage={error?.message} isInvalid={!!error?.message} {...props} />;
});

const FormSelect = React.forwardRef<HTMLSelectElement, React.ComponentProps<typeof Select>>((props, ref) => {
  const { error } = useFormField();
  return <Select ref={ref} errorMessage={error?.message} isInvalid={!!error?.message} {...props} />;
});

const FormTextArea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<typeof Textarea>>((props, ref) => {
  const { error } = useFormField();
  return <Textarea ref={ref} errorMessage={error?.message} isInvalid={!!error?.message} {...props} />;
});

export { useFormField, Form, FormInput, FormSelect, FormTextArea, FormField };
