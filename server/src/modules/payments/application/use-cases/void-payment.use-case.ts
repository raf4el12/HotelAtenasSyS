import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';
import { mapToPaymentResponse } from './helpers/map-payment-response.js';

@Injectable()
export class VoidPaymentUseCase {
    constructor(
        @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
    ) {}

    async execute(id: string, reason: string, userId: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.findById(id);
        if (!payment) throw new NotFoundException('Pago no encontrado');
        if (!payment.canVoid()) throw new BadRequestException('El pago ya fue anulado');

        payment.markAsVoided(userId, reason);

        const updated = await this.paymentRepository.voidPayment(id, {
            voidedAt: payment.voidedAt!,
            voidedById: payment.voidedById!,
            voidReason: payment.voidReason!,
        });

        return mapToPaymentResponse(updated);
    }
}
