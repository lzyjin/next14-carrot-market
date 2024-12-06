import {ForwardedRef, forwardRef, InputHTMLAttributes} from "react";

interface FormInputProps {
  errors?: string[];
  name: string;
}

const _Input = (
  {errors = [], name, ...rest}: FormInputProps & InputHTMLAttributes<HTMLInputElement>,
  ref: ForwardedRef<HTMLInputElement>
) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        ref={ref}
        name={name}
        className="bg-transparent rounded-md w-full h-10 border-none transition
          ring-1 ring-neutral-200 focus:ring-4 focus:ring-orange-500 focus:outline-none
          placeholder:text-neutral-400"
        {...rest}
      />
      {
        errors.map((error, index) => (
          <span key={index} className="text-red-500 font-medium">{error}</span>
        ))
      }
    </div>
  );
}

export default forwardRef(_Input);