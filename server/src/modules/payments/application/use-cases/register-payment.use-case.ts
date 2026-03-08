import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IPaymentRepository } from '../../domain/repositories/payment.repository.js';
import { CreatePaymentDto } from '../dto/create-payment.dto.js';
import { PaymentResponseDto } from '../dto/payment-response.dto.js';
import { mapToPaymentResponse } from './helpers/map-payment-response.js';

@Injectable()
export class RegisterPaymentUseCase {
    constructor(
        @Inject('IPaymentRepository') private readonly paymentRepository: IPaymentRepository,
    ) {}

    async execute(dto: CreatePaymentDto, userId: string): Promise<PaymentResponseDto> {
        const payment = await this.paymentRepository.create({
            amount: dto.amount,
            method: dto.method,
            type: dto.type,
            stayId: dto.stayId,
            reservationId: dto.reservationId,
            saleId: dto.saleId,
            notes: dto.notes,
            referenceCode: dto.referenceCode,
            registeredById: userId,
        });

        return mapToPaymentResponse(payment);
    }
}
