import { Injectable } from '@angular/core';
import {Task} from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private tasksArray: Task[] = JSON.parse(localStorage.getItem('tasks') ?? '[]');
  constructor() {
  }

  addTask(task: Task) {
    this.tasksArray.push(task);
    this.saveState();
  }

  updateTask(task: Task) {
    this.tasksArray = this.tasksArray.map((originalTask) => {
      if (originalTask.id === task.id) return task;
      return originalTask;
    });
    console.log(this.tasksArray);
    this.saveState();
  }
  getTasks(): Task[] {
    return this.tasksArray;
  }

  removeTask(idTask: string) {
    this.tasksArray = this.tasksArray.filter(task => task.id !== idTask);
    this.saveState();
  }

  existsTask(idTask:string): boolean {
    return this.tasksArray.filter(task => task.id === idTask).length > 0;
  }

  saveState() {
    localStorage.setItem('tasks', JSON.stringify(this.tasksArray));
  }
}
