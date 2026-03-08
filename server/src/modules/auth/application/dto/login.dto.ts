import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'admin@hotelatenas.com' })
  @IsEmail({}, { message: 'El email debe ser un correo válido' })
  @IsNotEmpty({ message: 'El email es obligatorio' })
  email: string;

  @ApiProperty({ example: 'Admin123!' })
  @IsString({ message: 'La contraseña debe ser un texto' })
  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  password: string;

  @ApiPropertyOptional({ example: 'device-abc-123' })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

