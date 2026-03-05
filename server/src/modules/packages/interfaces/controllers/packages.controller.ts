import {
    Controller,
    Post,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Auth } from '../../../../shared/decorators/auth.decorator.js';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { CreatePackageUseCase } from '../../application/use-cases/create-package.use-case.js';
import { FindAllPackagesUseCase } from '../../application/use-cases/find-all-packages.use-case.js';
import { FindPackageByIdUseCase } from '../../application/use-cases/find-package-by-id.use-case.js';
import { UpdatePackageUseCase } from '../../application/use-cases/update-package.use-case.js';
import { DeletePackageUseCase } from '../../application/use-cases/delete-package.use-case.js';
import { ManagePackageItemsUseCase } from '../../application/use-cases/manage-package-items.use-case.js';
import { CreatePackageDto, PackageItemInputDto } from '../../application/dto/create-package.dto.js';
import { UpdatePackageDto } from '../../application/dto/update-package.dto.js';
import { FindAllPackagesDto } from '../../application/dto/find-all-packages.dto.js';
import { PackageResponseDto } from '../../application/dto/package-response.dto.js';

@ApiTags('Packages')
@Controller('packages')
export class PackagesController {
    constructor(
        private readonly createPackageUseCase: CreatePackageUseCase,
        private readonly findAllPackagesUseCase: FindAllPackagesUseCase,
        private readonly findPackageByIdUseCase: FindPackageByIdUseCase,
        private readonly updatePackageUseCase: UpdatePackageUseCase,
        private readonly deletePackageUseCase: DeletePackageUseCase,
        private readonly managePackageItemsUseCase: ManagePackageItemsUseCase,
    ) { }

    @Post()
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Crear un nuevo paquete' })
    @ApiResponse({ status: 201, description: 'Paquete creado', type: PackageResponseDto })
    async create(@Body() dto: CreatePackageDto) {
        return this.createPackageUseCase.execute(dto);
    }

    @Get()
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Listar paquetes con paginación y filtros' })
    @ApiResponse({ status: 200, description: 'Lista de paquetes paginada' })
    async findAll(@Query() query: FindAllPackagesDto) {
        return this.findAllPackagesUseCase.execute(query);
    }

    @Get(':id')
    @Auth(UserRole.ADMIN, UserRole.RECEPTIONIST)
    @ApiOperation({ summary: 'Obtener paquete por ID' })
    @ApiResponse({ status: 200, description: 'Paquete encontrado', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
    async findById(@Param('id') id: string) {
        return this.findPackageByIdUseCase.execute(id);
    }

    @Patch(':id')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Actualizar paquete' })
    @ApiResponse({ status: 200, description: 'Paquete actualizado', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
    async update(@Param('id') id: string, @Body() dto: UpdatePackageDto) {
        return this.updatePackageUseCase.execute(id, dto);
    }

    @Post(':id/items')
    @Auth(UserRole.ADMIN)
    @ApiOperation({ summary: 'Agregar producto al paquete' })
    @ApiResponse({ status: 201, description: 'Producto agregado', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
    async addItem(@Param('id') id: string, @Body() dto: PackageItemInputDto) {
        return this.managePackageItemsUseCase.addItem(id, dto);
    }

    @Delete(':id/items/:productId')
    @Auth(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Eliminar producto del paquete' })
    @ApiResponse({ status: 200, description: 'Producto eliminado del paquete', type: PackageResponseDto })
    @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
    async removeItem(@Param('id') id: string, @Param('productId') productId: string) {
        return this.managePackageItemsUseCase.removeItem(id, productId);
    }

    @Delete(':id')
    @Auth(UserRole.ADMIN)
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar paquete' })
    @ApiResponse({ status: 204, description: 'Paquete eliminado' })
    @ApiResponse({ status: 404, description: 'Paquete no encontrado' })
    async delete(@Param('id') id: string) {
        await this.deletePackageUseCase.execute(id);
    }
}
