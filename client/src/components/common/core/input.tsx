import * as React from 'react';
import { Input as HeroUIInput, InputProps as HeroUInputProps } from "@heroui/input";

export interface InputProps extends HeroUInputProps { }

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ ...props }, ref) => {
  return (
    <HeroUIInput
      radius='sm'
      labelPlacement='outside'
      ref={ref}
      {...props}
    />
  );
});

export { Input };
