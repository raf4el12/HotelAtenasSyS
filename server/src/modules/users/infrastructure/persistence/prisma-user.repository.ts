import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service.js';
import type { IUserRepository } from '../../domain/repositories/user.repository.js';
import { UserEntity } from '../../domain/entities/user.entity.js';
import { ProfileEntity } from '../../domain/entities/profile.entity.js';
import type { CreateUserData } from '../../domain/interfaces/create-user-data.interface.js';
import type { UpdateUserData } from '../../domain/interfaces/update-user-data.interface.js';
import type { PaginatedResult } from '../../../../shared/domain/interfaces/paginated-result.interface.js';
import type { PaginationParams } from '../../../../shared/domain/interfaces/pagination-params.interface.js';
import type { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';

function mapToProfileEntity(prismaProfile: any): ProfileEntity {
  const profile = new ProfileEntity();
  profile.id = prismaProfile.id;
  profile.userId = prismaProfile.userId;
  profile.firstName = prismaProfile.firstName;
  profile.lastName = prismaProfile.lastName;
  profile.dni = prismaProfile.dni;
  profile.phone = prismaProfile.phone;
  profile.avatarUrl = prismaProfile.avatarUrl;
  profile.birthDate = prismaProfile.birthDate;
  profile.address = prismaProfile.address;
  profile.district = prismaProfile.district;
  profile.city = prismaProfile.city;
  profile.province = prismaProfile.province;
  profile.emergencyContactName = prismaProfile.emergencyContactName;
  profile.emergencyContactPhone = prismaProfile.emergencyContactPhone;
  profile.emergencyContactRelation = prismaProfile.emergencyContactRelation;
  profile.shift = prismaProfile.shift;
  profile.shiftNotes = prismaProfile.shiftNotes;
  profile.createdAt = prismaProfile.createdAt;
  profile.updatedAt = prismaProfile.updatedAt;
  return profile;
}

function mapToUserEntity(prismaUser: any): UserEntity {
  const user = new UserEntity();
  user.id = prismaUser.id;
  user.email = prismaUser.email;
  user.password = prismaUser.password;
  user.role = prismaUser.role;
  user.isActive = prismaUser.isActive;
  user.createdAt = prismaUser.createdAt;
  user.updatedAt = prismaUser.updatedAt;
  user.profile = prismaUser.profile ? mapToProfileEntity(prismaUser.profile) : null;
  return user;
}

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
    return user ? mapToUserEntity(user) : null;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
    });
    return user ? mapToUserEntity(user) : null;
  }

  async findByIdWithProfile(id: string): Promise<UserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, isActive: true },
      include: { profile: true },
    });
    return user ? mapToUserEntity(user) : null;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user !== null;
  }

  async existsByDni(dni: string): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({ where: { dni } });
    return profile !== null;
  }

  async createUser(data: CreateUserData): Promise<UserEntity> {
    const user = await this.prisma.$transaction(async (tx) => {
      return tx.user.create({
        data: {
          email: data.email,
          password: data.password,
          role: data.role,
          profile: { create: { ...data.profile } },
        },
        include: { profile: true },
      });
    });
    return mapToUserEntity(user);
  }

  async findAllPaginated(
    params: PaginationParams,
    role?: UserRole,
  ): Promise<PaginatedResult<UserEntity>> {
    const where: any = {
      isActive: true,
      ...(role && { role }),
      ...(params.searchValue && {
        OR: [
          { email: { contains: params.searchValue, mode: 'insensitive' } },
          { profile: { firstName: { contains: params.searchValue, mode: 'insensitive' } } },
          { profile: { lastName: { contains: params.searchValue, mode: 'insensitive' } } },
          { profile: { dni: { contains: params.searchValue } } },
        ],
      }),
    };

    const orderByField = params.orderBy ?? 'createdAt';
    const orderByMode = (params.orderByMode as 'asc' | 'desc') ?? 'desc';

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: params.offset,
        take: params.limit,
        orderBy: { [orderByField]: orderByMode },
        include: { profile: true },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      totalRows: total,
      rows: users.map(mapToUserEntity),
      totalPages: Math.ceil(total / params.limit),
      currentPage: Math.floor(params.offset / params.limit) + 1,
    };
  }

  async updateUser(id: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await this.prisma.$transaction(async (tx) => {
      const { profile: profileData, ...userData } = data;

      const updated = await tx.user.update({
        where: { id },
        data: userData,
        include: { profile: true },
      });

      if (profileData) {
        await tx.profile.update({
          where: { userId: id },
          data: profileData,
        });

        return tx.user.findUnique({
          where: { id },
          include: { profile: true },
        });
      }

      return updated;
    });

    return mapToUserEntity(user);
  }

  async updateProfile(userId: string, data: Partial<ProfileEntity>): Promise<UserEntity> {
    const { id, userId: _uid, createdAt, updatedAt, ...profileData } = data as any;

    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { profile: { update: profileData } },
      include: { profile: true },
    });
    return mapToUserEntity(user);
  }

  async softDelete(id: string): Promise<void> {
    await this.prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }
}
