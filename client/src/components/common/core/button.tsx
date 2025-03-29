import * as React from 'react';
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from '@heroui/react';

export interface ButtonProps extends HeroUIButtonProps { }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, ...props }, ref) => {
    return (
      <HeroUIButton
        radius="sm"
        color="primary"
        ref={ref}
        {...props}>
        {children}
      </HeroUIButton>
    );
  }
);

export default Button;
