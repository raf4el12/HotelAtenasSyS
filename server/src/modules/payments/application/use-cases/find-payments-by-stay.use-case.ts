import { Inject, Injectable } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';
import { mapToPaymentResponse } from './helpers/map-payment-response.js';

@Injectable()
export class FindPaymentsByStayUseCase {
    constructor(
        @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
    ) {}

    async execute(stayId: string): Promise<{ payments: PaymentResponseDto[]; totalPaid: number }> {
        const [payments, totalPaid] = await Promise.all([
            this.paymentRepository.findByStayId(stayId),
            this.paymentRepository.sumByStayId(stayId),
        ]);

        return {
            payments: payments.map(mapToPaymentResponse),
            totalPaid,
        };
    }
}
