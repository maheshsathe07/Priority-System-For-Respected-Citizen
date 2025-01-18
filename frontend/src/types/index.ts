import { ReactNode } from 'react';

export type ServiceCategory = 'civilian' | 'military_personnel' | 'jawan' | 'veteran';

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}