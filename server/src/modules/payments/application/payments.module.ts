import { Module } from '@nestjs/common';
import { PrismaPaymentRepository } from '../infrastructure/persistence/prisma-payment.repository.js';
import { RegisterPaymentUseCase } from './use-cases/register-payment.use-case.js';
import { VoidPaymentUseCase } from './use-cases/void-payment.use-case.js';
import { FindAllPaymentsUseCase } from './use-cases/find-all-payments.use-case.js';
import { FindPaymentByIdUseCase } from './use-cases/find-payment-by-id.use-case.js';
import { FindPaymentsByStayUseCase } from './use-cases/find-payments-by-stay.use-case.js';
import { PaymentsController } from '../interfaces/controllers/payments.controller.js';

@Module({
    controllers: [PaymentsController],
    providers: [
        { provide: 'IPaymentRepository', useClass: PrismaPaymentRepository },
        RegisterPaymentUseCase,
        VoidPaymentUseCase,
        FindAllPaymentsUseCase,
        FindPaymentByIdUseCase,
        FindPaymentsByStayUseCase,
    ],
    exports: ['IPaymentRepository'],
})
export class PaymentsModule {}
