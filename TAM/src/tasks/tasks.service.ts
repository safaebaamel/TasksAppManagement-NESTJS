import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { getTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './tasks.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {

    constructor(
        @InjectRepository(TaskRepository)
        private tasksRepository: TaskRepository)
    {}

    createtask(createTaskDto: CreateTaskDto): Promise<Task> {
        return this.tasksRepository.createTask(createTaskDto);
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne(id);
        if (!found) {
            throw new NotFoundException(`Task with ${id} is not found`);
        }
        return found;
    }
    

    getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {
        return this.tasksRepository.getTasks(filterDto);
    }

     async deletetask(id: string): Promise<void> {
        const result = await this.tasksRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Task with ${id} is not found`);
        }
    }

    async updateTaskStatus(id: string, status: TaskStatus ): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = status;
        await this.tasksRepository.save(task);
        return task;
    }
}
