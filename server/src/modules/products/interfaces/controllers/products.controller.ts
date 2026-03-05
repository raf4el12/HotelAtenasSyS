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
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { CreateProductUseCase } from '../../application/use-cases/create-product.use-case.js';
import { FindAllProductsUseCase } from '../../application/use-cases/find-all-products.use-case.js';
import { FindProductByIdUseCase } from '../../application/use-cases/find-product-by-id.use-case.js';
import { UpdateProductUseCase } from '../../application/use-cases/update-product.use-case.js';
import { UpdateStockUseCase } from '../../application/use-cases/update-stock.use-case.js';
import { FindLowStockUseCase } from '../../application/use-cases/find-low-stock.use-case.js';
import { CreateProductDto } from '../../application/dto/create-product.dto.js';
import { UpdateProductDto } from '../../application/dto/update-product.dto.js';
import { UpdateStockDto } from '../../application/dto/update-stock.dto.js';
import { FindAllProductsDto } from '../../application/dto/find-all-products.dto.js';
import { ProductResponseDto } from '../../application/dto/product-response.dto.js';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(
        private readonly createProductUseCase: CreateProductUseCase,
        private readonly findAllProductsUseCase: FindAllProductsUseCase,
        private readonly findProductByIdUseCase: FindProductByIdUseCase,
        private readonly updateProductUseCase: UpdateProductUseCase,
        private readonly updateStockUseCase: UpdateStockUseCase,
        private readonly findLowStockUseCase: FindLowStockUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo producto' })
    @ApiResponse({ status: 201, description: 'Producto creado', type: ProductResponseDto })
    async create(@Body() dto: CreateProductDto) {
        return this.createProductUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar productos con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de productos paginada' })
    async findAll(@Query() query: FindAllProductsDto) {
        return this.findAllProductsUseCase.execute(query);
    }

    @Get('low-stock')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Productos con stock bajo (stock <= minStock)' })
    @ApiResponse({ status: 200, description: 'Productos con stock bajo', type: [ProductResponseDto] })
    async findLowStock() {
        return this.findLowStockUseCase.execute();
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener producto por ID' })
    @ApiResponse({ status: 200, description: 'Producto encontrado', type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async findById(@Param('id') id: string) {
        return this.findProductByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar producto' })
    @ApiResponse({ status: 200, description: 'Producto actualizado', type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
        return this.updateProductUseCase.execute(id, dto);
    }

    @Patch(':id/stock')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar stock del producto' })
    @ApiResponse({ status: 200, description: 'Stock actualizado', type: ProductResponseDto })
    @ApiResponse({ status: 404, description: 'Producto no encontrado' })
    async updateStock(@Param('id') id: string, @Body() dto: UpdateStockDto) {
        return this.updateStockUseCase.execute(id, dto);
    }
}
