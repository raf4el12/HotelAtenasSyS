import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import { PaginationImproved } from '../../../../shared/utils/value-objects/pagination-improved.value-object.js';
import { FindAllUsersDto } from '../dto/find-all-users.dto.js';
import type { UserResponseDto } from '../dto/user-response.dto.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import { mapToUserResponse } from './helpers/map-user-response.js';

@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject('IUserRepository') private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: FindAllUsersDto): Promise<PaginatedResult<UserResponseDto>> {
    const pagination = new PaginationImproved(
      dto.searchValue,
      dto.currentPage,
      dto.pageSize,
      dto.orderBy,
      dto.orderByMode,
    );

    const { offset, limit } = pagination.getOffsetLimit();

    const result = await this.userRepository.findAllPaginated(
      { offset, limit, searchValue: dto.searchValue, orderBy: dto.orderBy, orderByMode: dto.orderByMode },
      dto.role,
    );

    return {
      ...result,
      rows: result.rows.map(mapToUserResponse),
    };
  }
}
