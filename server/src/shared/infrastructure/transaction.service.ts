import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class TransactionService {
    constructor(private readonly prisma: PrismaService) { }

    async run<T>(fn: (prisma: PrismaService) => Promise<T>): Promise<T> {
        return this.prisma.$transaction(async (tx) => {
            return fn(tx as unknown as PrismaService);
        }) as Promise<T>;
    }
}
