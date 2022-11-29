import { Injectable } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { TasksRepository } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(private tasksRepository: TasksRepository) {}

  async getAllTasks(filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksRepository.getTasks(filterDto);
  }

  async getTaskById(id: string): Promise<Task> {
    return this.tasksRepository.findById(id);
  }

  createTask(createTaskDto: createTaskDto): Promise<Task> {
    return this.tasksRepository.createTask(createTaskDto);
  }

  async deleteTaskById(id: string): Promise<void> {
    return this.tasksRepository.deleteById(id);
  }

  async updateTaskByID(id: string, status: TaskStatus): Promise<Task> {
    return this.tasksRepository.updateTaskStatus(id, status);
  }
}
