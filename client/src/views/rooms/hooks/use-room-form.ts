import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema, type RoomFormData } from '../functions/room.schema';
import type { Room } from '../types';

export function useRoomForm(room?: Room) {
  return useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      number: room?.number ?? '',
      category: room?.category ?? 'NORMAL',
      floorId: room?.floorId ?? '',
    },
  });
}
