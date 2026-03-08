import {
    Controller,
    Post,
    Get,
    Patch,
    Body,
    Param,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { CurrentUser } from '../../../../shared/decorators/current-user.decorator.js';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import type { JwtPayload } from '../../../auth/domain/interfaces/jwt-payload.interface.js';
import { RegisterPaymentUseCase } from '../../application/use-cases/register-payment.use-case.js';
import { VoidPaymentUseCase } from '../../application/use-cases/void-payment.use-case.js';
import { FindAllPaymentsUseCase } from '../../application/use-cases/find-all-payments.use-case.js';
import { FindPaymentByIdUseCase } from '../../application/use-cases/find-payment-by-id.use-case.js';
import { FindPaymentsByStayUseCase } from '../../application/use-cases/find-payments-by-stay.use-case.js';
import { CreatePaymentDto } from '../../application/dto/create-payment.dto.js';
import { VoidPaymentDto } from '../../application/dto/void-payment.dto.js';
import { FindAllPaymentsDto } from '../../application/dto/find-all-payments.dto.js';
import { PaymentResponseDto } from '../../application/dto/payment-response.dto.js';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly registerPaymentUseCase: RegisterPaymentUseCase,
        private readonly voidPaymentUseCase: VoidPaymentUseCase,
        private readonly findAllPaymentsUseCase: FindAllPaymentsUseCase,
        private readonly findPaymentByIdUseCase: FindPaymentByIdUseCase,
        private readonly findPaymentsByStayUseCase: FindPaymentsByStayUseCase,
    ) {}

    @Post()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Registrar un pago' })
    @ApiResponse({ status: 201, description: 'Pago registrado', type: PaymentResponseDto })
    async register(@Body() dto: CreatePaymentDto, @CurrentUser() user: JwtPayload) {
        return this.registerPaymentUseCase.execute(dto, user.id);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar pagos con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de pagos paginada' })
    async findAll(@Query() query: FindAllPaymentsDto) {
        return this.findAllPaymentsUseCase.execute(query);
    }

    @Get('by-stay/:stayId')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener pagos de una estadía con total pagado' })
    @ApiResponse({ status: 200, description: 'Pagos de la estadía' })
    async findByStay(@Param('stayId') stayId: string) {
        return this.findPaymentsByStayUseCase.execute(stayId);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener pago por ID' })
    @ApiResponse({ status: 200, description: 'Pago encontrado', type: PaymentResponseDto })
    @ApiResponse({ status: 404, description: 'Pago no encontrado' })
    async findById(@Param('id') id: string) {
        return this.findPaymentByIdUseCase.execute(id);
    }

    @Patch(':id/void')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Anular un pago' })
    @ApiResponse({ status: 200, description: 'Pago anulado', type: PaymentResponseDto })
    @ApiResponse({ status: 400, description: 'El pago ya fue anulado' })
    @ApiResponse({ status: 404, description: 'Pago no encontrado' })
    async voidPayment(
        @Param('id') id: string,
        @Body() dto: VoidPaymentDto,
        @CurrentUser() user: JwtPayload,
    ) {
        return this.voidPaymentUseCase.execute(id, dto.reason, user.id);
    }
}
