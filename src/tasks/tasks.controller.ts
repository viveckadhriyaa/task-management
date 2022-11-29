import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { createTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() filterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get('/:id')
  getTaskByID(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  createTask(@Body() createTaskDto: createTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Delete('/:id')
  deleteTaskByID(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTaskById(id);
  }

  @Patch('/:id/status')
  async updateTaskByID(
    @Param('id') id: string,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskByID(id, status);
  }
}
