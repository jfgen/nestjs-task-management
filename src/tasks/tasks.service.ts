import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  // Public by default
  getAllTasks(): Task[] {
    // Tasks is private and therefore unmutable outside this class, but it is
    // exposed in this method.
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;

    let tasks = this.getAllTasks();

    if (status) {
      return tasks.filter((task) => task.status === status);
    }
    if (search) {
      return tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }
  }

  getTaskById(id: string): Task {
    return this.tasks.find((task) => task.id === id);
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;

    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(task);

    return task;
  }

  deleteTask(id: string): void {
    const selectedTask = this.tasks.find((task) => task.id === id);
    const selectedTaskIndex = this.tasks.indexOf(selectedTask);
    this.tasks.splice(selectedTaskIndex, 1);
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);

    task.status = status;
    return task;
  }
}
