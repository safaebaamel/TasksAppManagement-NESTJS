import { EntityRepository, Repository } from "typeorm";
import { CreateTaskDto } from "./dto/create-task.dto";
import { getTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {

    async getTasks(filterDto: getTasksFilterDto): Promise<Task[]> {

        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');
        
        if (status) {
            query.andWhere('task.status = :status', {status: 'OPEN'});
        }
        if (search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                { search: `%${search}%` },
            );
        }
        const tasks = await query.getMany();
        return tasks;
    }
    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        // destructuring ..
        const {title, description} = createTaskDto;
        const task = this.create({
            title,
            description,
            status: TaskStatus.OPEN,
        });

        await this.save(task);
        return task;
    }

}