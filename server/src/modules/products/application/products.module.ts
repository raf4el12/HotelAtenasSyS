import { Module } from '@nestjs/common';
import { PrismaProductRepository } from '../infrastructure/persistence/prisma-product.repository.js';
import { CreateProductUseCase } from './use-cases/create-product.use-case.js';
import { FindAllProductsUseCase } from './use-cases/find-all-products.use-case.js';
import { FindProductByIdUseCase } from './use-cases/find-product-by-id.use-case.js';
import { UpdateProductUseCase } from './use-cases/update-product.use-case.js';
import { UpdateStockUseCase } from './use-cases/update-stock.use-case.js';
import { FindLowStockUseCase } from './use-cases/find-low-stock.use-case.js';
import { ProductsController } from '../interfaces/controllers/products.controller.js';

@Module({
    controllers: [ProductsController],
    providers: [
        { provide: 'IProductRepository', useClass: PrismaProductRepository },
        CreateProductUseCase,
        FindAllProductsUseCase,
        FindProductByIdUseCase,
        UpdateProductUseCase,
        UpdateStockUseCase,
        FindLowStockUseCase,
    ],
    exports: ['IProductRepository'],
})
export class ProductsModule { }
