import { TaskStatus } from "../task-status.enum";
import { IsOptional, IsEnum, IsString } from 'class-validator';

export class getTasksFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsString()
    @IsOptional()
    search?: string;
}