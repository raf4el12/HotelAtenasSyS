import { Module } from '@nestjs/common';
import { PrismaRateRuleRepository } from '../infrastructure/persistence/prisma-rate-rule.repository.js';
import { PrismaHotelConfigRepository } from '../infrastructure/persistence/prisma-hotel-config.repository.js';
import { CreateRateRuleUseCase } from './use-cases/create-rate-rule.use-case.js';
import { FindAllRateRulesUseCase } from './use-cases/find-all-rate-rules.use-case.js';
import { FindRateRuleByIdUseCase } from './use-cases/find-rate-rule-by-id.use-case.js';
import { UpdateRateRuleUseCase } from './use-cases/update-rate-rule.use-case.js';
import { DeleteRateRuleUseCase } from './use-cases/delete-rate-rule.use-case.js';
import { FindAllConfigUseCase } from './use-cases/find-all-config.use-case.js';
import { FindConfigByKeyUseCase } from './use-cases/find-config-by-key.use-case.js';
import { UpsertConfigUseCase } from './use-cases/upsert-config.use-case.js';
import { RateRulesController } from '../interfaces/controllers/rate-rules.controller.js';

@Module({
    controllers: [RateRulesController],
    providers: [
        { provide: 'IRateRuleRepository', useClass: PrismaRateRuleRepository },
        { provide: 'IHotelConfigRepository', useClass: PrismaHotelConfigRepository },
        CreateRateRuleUseCase,
        FindAllRateRulesUseCase,
        FindRateRuleByIdUseCase,
        UpdateRateRuleUseCase,
        DeleteRateRuleUseCase,
        FindAllConfigUseCase,
        FindConfigByKeyUseCase,
        UpsertConfigUseCase,
    ],
    exports: ['IRateRuleRepository'],
})
export class RateRulesModule { }
