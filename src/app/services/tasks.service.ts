import { Injectable } from '@angular/core';
import { Task } from "../interfaces/task.interface";

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
    console.log('update:',this.tasksArray);
    this.saveState();
  }
  getTasks(): Task[] {
    return this.tasksArray;
  }

  getWeekTasks(week:string[]):Task[]|null {
    return week.map(dateString => {
      const id = this.generateId();
      return this.getTaskByDate(dateString) ?? {
        id,
        date: dateString,
        taskcontent: '',
        hours: 0,
      };
    });
  }

  removeTask(date: string) {
    this.tasksArray = this.tasksArray.filter(task => task.date.substring(0,10) !== date.substring(0,10));
    this.saveState();
  }

  getTaskById(idTask:string): Task|undefined {
    let task = this.tasksArray.filter(task => task.id === idTask);
    return task.length > 0 ? task[0] : undefined;
  }

  getTaskByDate(date:string): Task|undefined {
    let task = this.tasksArray.filter((task) => task.date.substring(0,10) === date.substring(0,10));
    return task.length > 0 ? task[0] : undefined;
  }

  existsTask(date:string): boolean {
    return !!this.getTaskByDate(date);
  }

  saveState() {
    localStorage.setItem('tasks', JSON.stringify(this.tasksArray));
  }

  generateId(): string {
    let idElems = [];
    idElems.push(new Date().getTime().toString(36).substring(4,8));
    idElems.push(new Date().getTime().toString(16).substring(7,11));
    idElems.push((Math.random()*1000).toString(24).substring(6));
    return idElems.join('-');
  }
}
