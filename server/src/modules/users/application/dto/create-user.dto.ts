import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { UserRole } from '../../../../shared/domain/enums/user-role.enum.js';
import { CreateProfileDto } from './create-profile.dto.js';

export class CreateUserDto {
  @ApiProperty({ example: 'recepcion@hotelatenas.com' })
  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: 'Recepcion123!' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ enum: UserRole, example: UserRole.RECEPTIONIST })
  @IsEnum(UserRole, { message: 'El rol debe ser un valor válido' })
  role: UserRole;

  @ApiProperty({ type: CreateProfileDto })
  @ValidateNested()
  @Type(() => CreateProfileDto)
  profile: CreateProfileDto;
}
