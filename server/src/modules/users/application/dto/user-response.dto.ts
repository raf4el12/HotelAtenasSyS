import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProfileResponseDto } from '../../../auth/application/dto/profile-response.dto.js';

export class UserResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiPropertyOptional({ type: ProfileResponseDto })
  profile: ProfileResponseDto | null;
}
