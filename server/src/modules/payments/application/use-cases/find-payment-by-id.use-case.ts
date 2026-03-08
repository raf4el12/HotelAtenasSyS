import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';
import { mapToPaymentResponse } from './helpers/map-payment-response.js';

@Injectable()
export class FindPaymentByIdUseCase {
    constructor(
        @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
    ) {}

    async execute(id: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) throw new NotFoundException('Pago no encontrado');
        return mapToPaymentResponse(payment);
    }
}
