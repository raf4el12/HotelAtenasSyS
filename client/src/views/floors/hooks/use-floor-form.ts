import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { floorSchema, type FloorFormData } from '../functions/floor.schema';
import type { Floor } from '../types';

export function useFloorForm(floor?: Floor) {
  return useForm<FloorFormData>({
    resolver: zodResolver(floorSchema),
    defaultValues: {
      name: floor?.name ?? '',
      number: floor?.number ?? 0,
    },
  });
}
