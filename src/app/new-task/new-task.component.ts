import { Component, OnInit } from '@angular/core';
import {TaskService} from "../tasks/task.service";
import {ListTasksComponent} from "../list-tasks/list-tasks.component";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent  implements OnInit {
  public day: number = 1;
  public month: number = 3;
  public taskcontent:string = '';

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('Operación cancelada');
      }
    },
    {
      text: 'Aceptar',
      role: 'confirm',
      handler: () => {
        this.updateTask();
        console.log('Operación realizada');
      }
    },
  ];
  constructor(private taskservice: TaskService, private alertController: AlertController) {
  }

  async handleSave() {
    if (this.taskservice.existsTask(this.day+'-'+this.month)) {
      const alert = await this.alertController.create({
        header: '¡Atención!',
        message: 'Ya existe una entrada para esa fecha. La información se sobreescribirá.',
        buttons: this.alertButtons,
      });
      await alert.present();
    } else {
      this.addTask();
      const alert = await this.alertController.create({
        header: 'Correcto',
        message: 'Entrada agregada con éxito.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }
  addTask() {
    this.taskservice.addTask({
      id: this.day+'-'+this.month,
      day: this.day,
      month: this.month,
      taskcontent: this.taskcontent,
    });
    console.log(this.taskservice.getTasks());
  }
  updateTask() {
    this.taskservice.updateTask({
      id: this.day+'-'+this.month,
      day: this.day,
      month: this.month,
      taskcontent: this.taskcontent,
    });
    console.log(this.taskservice.getTasks());
  }
  ngOnInit() {}

}
