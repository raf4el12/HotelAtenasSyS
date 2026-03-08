import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.js';
import { FindAllPaymentsDto } from '../dto/find-all-payments.dto.js';
import { mapToPaymentResponse } from './helpers/map-payment-response.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';

@Injectable()
export class FindAllPaymentsUseCase {
    constructor(
        @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
    ) {}

    async execute(dto: FindAllPaymentsDto) {
        const pagination = new PaginationImproved(
            dto.searchValue,
            dto.currentPage,
            dto.pageSize,
            dto.orderBy,
            dto.orderByMode,
        );

        const { limit, offset } = pagination.getOffsetLimit();

        const result = await this.paymentRepository.findAllPaginated(
            { limit, offset, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
            {
                method: dto.method,
                type: dto.type,
                stayId: dto.stayId,
                reservationId: dto.reservationId,
                voided: dto.voided,
            },
        );

        return {
            ...result,
            rows: result.rows.map(mapToPaymentResponse),
        };
    }
}
