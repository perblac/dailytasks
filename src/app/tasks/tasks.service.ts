import { Injectable } from '@angular/core';
import {Task} from "../interfaces/task.interface";

@Injectable({
  providedIn: 'root'
})
export class TasksService {

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

  getWeekTasks(week:string[]):Task[]|null {
    return week.map(dateString => {
      const dateTask = new Date(dateString);
      const day = dateTask.getUTCDate();
      const month = dateTask.getUTCMonth() + 1;
      const id = `${day}-${month}`;
      return this.getTaskById(id) ?? {
        id,
        date: dateString,
        taskcontent: '',
        hours: 0,
      };
    });
  }

  removeTask(idTask: string) {
    this.tasksArray = this.tasksArray.filter(task => task.id !== idTask);
    this.saveState();
  }

  getTaskById(idTask:string): Task|undefined {
    let task = this.tasksArray.filter(task => task.id === idTask);
    return task.length > 0 ? task[0] : undefined;
  }

  existsTask(idTask:string): boolean {
    return !!this.getTaskById(idTask);
  }

  saveState() {
    localStorage.setItem('tasks', JSON.stringify(this.tasksArray));
  }
}
