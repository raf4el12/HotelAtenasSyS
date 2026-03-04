import { Module, forwardRef } from '@nestjs/common';
import { AuthModule } from '../../auth/application/auth.module.js';
import { PrismaUserRepository } from '../infrastructure/persistence/prisma-user.repository.js';
import { CreateUserUseCase } from './use-cases/create-user.use-case.js';
import { FindAllUsersUseCase } from './use-cases/find-all-users.use-case.js';
import { FindUserByIdUseCase } from './use-cases/find-user-by-id.use-case.js';
import { UpdateUserUseCase } from './use-cases/update-user.use-case.js';
import { DeleteUserUseCase } from './use-cases/delete-user.use-case.js';
import { UsersController } from '../interfaces/controllers/users.controller.js';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [UsersController],
  providers: [
    { provide: 'IUserRepository', useClass: PrismaUserRepository },
    CreateUserUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
  ],
  exports: ['IUserRepository'],
})
export class UsersModule {}
