import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';
import { User } from 'src/auth/user.entity';
import { Pagination } from 'nestjs-typeorm-paginate';


@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async getAllTasks(filterDto: GetTasksFilterDto, user: User): Promise<Pagination<Task>> {
    return this.tasksRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    return this.tasksRepository.findById(id, user);
  }

  async createTask(createTaskDto: createTaskDto, user: User): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto, user);
  }

  async deleteTaskById(id: string, user: User): Promise<void> {
    return this.tasksRepository.deleteById(id, user);
  }

  async updateTaskByID(id: string, status: TaskStatus, user: User): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status, user);
  }
}
