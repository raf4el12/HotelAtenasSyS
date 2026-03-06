import type { HotelConfigEntity } from '../entities/hotel-config.entity.js';

export interface IHotelConfigRepository {
    findAll(): Promise<HotelConfigEntity[]>;
    findByKey(key: string): Promise<HotelConfigEntity | null>;
    upsert(key: string, value: string): Promise<HotelConfigEntity>;
}
