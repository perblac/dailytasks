import { Component, OnInit } from '@angular/core';
import {Task} from "../interfaces/task.interface";
import {TasksService} from "../tasks/tasks.service";
import {ModalController} from "@ionic/angular";
import {NewTaskComponent} from "../new-task/new-task.component";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";
import {FormComponent} from "../form/form.component";
import {FormDataService} from "../form/form-data.service";
import {EditTaskComponent} from "../edit-task/edit-task.component";

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent{
  public tasksarray: Task[] = this.taskservice.getTasks();
  constructor(private taskservice: TasksService, private modalCtrl: ModalController, private formDataService: FormDataService) {
    this.updateTasksArray();
  }

  async handleClick(id:any) {
    const copyTask = {...this.taskservice.getTaskById(id)};
    const modal = await this.modalCtrl.create({
      component: EditTaskComponent,
      componentProps: {
        'task': copyTask
      }
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      if (res.role === 'confirm') {
        this.taskservice.updateTask(res.data);
      } else {

      }
      this.updateTasksArray();
    });
    console.log(id);
    await modal.present();
  }
  removeTask(id:string) {
    this.taskservice.removeTask(id);
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
    let list = this.taskservice.getTasks();
    list?.sort((a,b)=>(new Date(a.date) > new Date(b.date) ? 1 : -1));
    this.tasksarray = list;
  }
}
