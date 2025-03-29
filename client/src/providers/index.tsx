import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { useHref, useNavigate } from "react-router-dom";
import { default as QueryClientProvider } from './query-client';

export default function Providers({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  return (
    <QueryClientProvider>
      <HeroUIProvider navigate={navigate} useHref={useHref}>
        {children}
        <ToastProvider />
      </HeroUIProvider>
    </QueryClientProvider>
  );
}