import * as React from 'react';
import { Button as HeroUIButton, ButtonProps as HeroUIButtonProps } from "@heroui/react";
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils';

export interface ButtonProps extends HeroUIButtonProps {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, loading, ...props }, ref) => {
    return (
      <HeroUIButton
        radius='sm'
        color='primary'
        className={cn(className, loading && 'pointer-events-none')}
        startContent={loading && <Loader2 className="animate-spin w-[1.2rem] h-[1.2rem] md:w-5 md:h-5 mr-2.5" />}
        ref={ref}
        {...props}>
        {children}
      </HeroUIButton>
    );
  }
);

export default Button;
