import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProfileResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  dni: string;

  @ApiPropertyOptional()
  phone: string | null;

  @ApiPropertyOptional()
  avatarUrl: string | null;

  @ApiPropertyOptional()
  birthDate: Date | null;

  @ApiPropertyOptional()
  address: string | null;

  @ApiPropertyOptional()
  district: string | null;

  @ApiPropertyOptional()
  city: string | null;

  @ApiPropertyOptional()
  province: string | null;

  @ApiPropertyOptional()
  emergencyContactName: string | null;

  @ApiPropertyOptional()
  emergencyContactPhone: string | null;

  @ApiPropertyOptional()
  emergencyContactRelation: string | null;

  @ApiPropertyOptional()
  shift: string | null;

  @ApiPropertyOptional()
  shiftNotes: string | null;
}
