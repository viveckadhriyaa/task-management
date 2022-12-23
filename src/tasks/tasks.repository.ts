import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/auth/user.entity";
import { Repository } from "typeorm";
import { createTaskDto } from "./dto/create-task.dto";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { TaskStatus } from "./task-status.enum";
import { Task } from "./task.entity";
import { Logger } from "@nestjs/common";
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';

@Injectable()
export class TasksRepository {
  private logger = new Logger("TasksRepository", { timestamp: true });
  constructor(
    @InjectRepository(Task)
    private taskEntityRepository: Repository<Task>
  ) {}

  async getTasks(filterDto: GetTasksFilterDto, user: User): Promise<Pagination<Task>> {
    const { status, search, limit, page } = filterDto;
    const options: IPaginationOptions = {
      limit,
      page,
    };    
    const query = this.taskEntityRepository.createQueryBuilder("task");
    query.where({ user });

    if (status) {
      query.andWhere("task.status = :status", { status });
    }

    if (search) {
      query.andWhere(
        "(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))",
        { search: `%${search}%` }
      );
    }

    try {
      query.getMany();
      query.orderBy("task.id", "DESC");
      return paginate<Task>(query, options);
    } catch (error) {
      this.logger.error(`Failed to get tasks for user ${user.email}`, error.stack);
      throw new InternalServerErrorException();
    }
  }

  // async paginate(options: IPaginationOptions): Promise<Pagination<Task>> {
  //   const query = this.taskEntityRepository.createQueryBuilder("task");
  //   query.orderBy("task.id", "DESC");

  //   return paginate<Task>(query, options);
  // }   

  async findById(id: string, user: User): Promise<Task> {
    const found = await this.taskEntityRepository.findOneBy({ id, user });
    if (!found) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    return found;
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = this.taskEntityRepository.create({
      title,
      description,
      status: TaskStatus.OPEN,
      user,
    });
    await this.taskEntityRepository.save(task);
    return task;
  }

  async deleteById(id: string, user: User): Promise<void> {
    const result = await this.taskEntityRepository.delete({ id, user });

    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }
  }

  async updateTaskStatus(
    id: string,
    status: TaskStatus,
    user: User
  ): Promise<Task> {
    const task = await this.findById(id, user);

    task.status = status;
    await this.taskEntityRepository.save(task);

    return task;
  }
}
