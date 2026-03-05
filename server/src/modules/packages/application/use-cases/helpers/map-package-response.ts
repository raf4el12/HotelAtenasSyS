import type { PackageEntity, PackageItemEntity } from '../../../domain/entities/package.entity.js';
import { PackageResponseDto, PackageItemResponseDto } from '../../dto/package-response.dto.js';

function mapItem(item: PackageItemEntity): PackageItemResponseDto {
    const dto = new PackageItemResponseDto();
    dto.id = item.id;
    dto.productId = item.productId;
    dto.productName = item.product?.name ?? null;
    dto.productPrice = item.product?.price ?? null;
    dto.quantity = item.quantity;
    return dto;
}

export function mapToPackageResponse(pkg: PackageEntity): PackageResponseDto {
    const response = new PackageResponseDto();
    response.id = pkg.id;
    response.name = pkg.name;
    response.description = pkg.description;
    response.category = pkg.category;
    response.stayMode = pkg.stayMode;
    response.totalPrice = pkg.totalPrice;
    response.isActive = pkg.isActive;
    response.validFrom = pkg.validFrom;
    response.validTo = pkg.validTo;
    response.createdAt = pkg.createdAt;
    response.updatedAt = pkg.updatedAt;
    response.items = pkg.items?.map(mapItem) ?? [];
    return response;
}
