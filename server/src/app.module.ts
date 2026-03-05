import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { RedisModule } from './shared/redis/redis.module.js';
import { AuthModule } from './modules/auth/application/auth.module.js';
import { UsersModule } from './modules/users/application/users.module.js';
import { FloorsModule } from './modules/floors/application/floors.module.js';
import { RoomsModule } from './modules/rooms/application/rooms.module.js';
import { GuestsModule } from './modules/guests/application/guests.module.js';
import { RateRulesModule } from './modules/rate-rules/application/rate-rules.module.js';
import { ProductsModule } from './modules/products/application/products.module.js';
import { PackagesModule } from './modules/packages/application/packages.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RedisModule,
    AuthModule,
    UsersModule,
    FloorsModule,
    RoomsModule,
    GuestsModule,
    RateRulesModule,
    ProductsModule,
    PackagesModule,
  ],
})
export class AppModule { }
