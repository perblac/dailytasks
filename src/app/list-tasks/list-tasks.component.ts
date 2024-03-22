import { Component, OnInit } from '@angular/core';
import {Task} from "../interfaces/task.interface";
import {TasksService} from "../services/tasks.service";
import {ModalController} from "@ionic/angular";
import {NewTaskComponent} from "../new-task/new-task.component";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";
import {FormComponent} from "../form/form.component";
import {FormDataService} from "../services/form-data.service";
import {EditTaskComponent} from "../edit-task/edit-task.component";

interface WeekGroup {
  weekNumber?: number,
  items?: Task[],
}

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent{
  public tasksArray: Task[] = this.tasksService.getTasks();
  public groupedArray = this.tasksArray.reduce((acc:WeekGroup[], task:Task) => {
    const weekNumber = this.getWeekNumber(task.date);
    const weekArray = acc.find(week => week.weekNumber === weekNumber);
    if (weekArray) {
      weekArray.items?.push(task);
    } else {
      acc.push({
        weekNumber,
        items: [task]
      })
    }
    return acc;
  }, []);

  constructor(private tasksService: TasksService, private modalCtrl: ModalController, private formDataService: FormDataService) {
    this.updateTasksArray();
  }

  async handleClick(id:any) {
    const copyTask = {...this.tasksService.getTaskById(id)};
    const modal = await this.modalCtrl.create({
      component: EditTaskComponent,
      componentProps: {
        'task': copyTask
      }
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      if (res.role === 'confirm') {
        this.tasksService.updateTask(res.data);
      }
      this.updateTasksArray();
    });
    console.log(id);
    await modal.present();
  }
  removeTask(date:string) {
    this.tasksService.removeTask(date);
    this.updateTasksArray();
  }

  async openModalNewTask() {
    const modal = await this.modalCtrl.create({
      component: NewTaskComponent,
    });
    modal.onDidDismiss().then(() => this.updateTasksArray());
    await modal.present();
  }

  async openModalExportToPdf() {
    const modal = await this.modalCtrl.create({
      component: ExportToPdfComponent,
    });
    await modal.present();
  }

  async openModalDataForm() {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
    });
    await modal.present();
  }

  private updateTasksArray() {
    let list = this.tasksService.getTasks();
    list?.sort((a,b)=>(new Date(a.date) > new Date(b.date) ? 1 : -1));
    this.tasksArray = list;
  }

  private getWeekNumber(date: string):number {
    const taskDate = new Date(date);
    console.log('origDate:',taskDate);
    taskDate.setHours(0,0,0,0);
    const dayOfWeek = taskDate.getDay() || 7;
    const centerOfWeek = 4;
    taskDate.setDate(taskDate.getDate() + centerOfWeek - dayOfWeek);
    const firstDayOfYearDate = new Date(taskDate.getFullYear(), 0 , 1);
    const millisInDay = 24 * 60 * 60 * 1000;
    const delta = taskDate.getTime() - firstDayOfYearDate.getTime();
    const weekNumber = Math.ceil(((delta / millisInDay) + 1) / 7);
    // console.log('week:', weekNumber);
    return weekNumber;
  }
}
