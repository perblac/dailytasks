import { Component, OnInit } from '@angular/core';
import {Task} from "../interfaces/task.interface";
import {TaskService} from "../tasks/task.service";

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent{
  public tasksarray: Task[] = this.taskservice.getTasks();
  constructor(private taskservice: TaskService) {
  }
  removeTask(id:string) {
    this.taskservice.removeTask(id);
    this.tasksarray = this.taskservice.getTasks();
  }
}
