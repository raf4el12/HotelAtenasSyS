import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IStayRepository } from '../../domain/repositories/stay.repository.js';
import { StayResponseDto } from '../dto/stay-response.dto.js';
import { mapToStayResponse } from './helpers/map-stay-response.js';

@Injectable()
export class FindStayByIdUseCase {
    constructor(
        @Inject('IStayRepository') private readonly stayRepository: IStayRepository,
    ) { }

    async execute(id: string): Promise<StayResponseDto> {
        const stay = await this.stayRepository.findById(id);
        if (!stay) throw new NotFoundException('Estadía no encontrada');
        return mapToStayResponse(stay);
    }
}
