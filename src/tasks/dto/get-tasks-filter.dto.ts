import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsString()
  search?: string;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  page: number;

  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsOptional()
  limit: number;
}
