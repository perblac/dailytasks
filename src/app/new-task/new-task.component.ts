import { Component } from '@angular/core';
import {TasksService} from "../tasks/tasks.service";
import {AlertController, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  public date: string = new Date().toISOString();
  public taskcontent: string = '';
  public hours: number = 0;

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
  constructor(private taskservice: TasksService, private alertController: AlertController, private modalCtrl: ModalController) {
  }

  private getId() {
    const dateTask = new Date(this.date);
    const day = dateTask.getUTCDate();
    const month = dateTask.getUTCMonth() + 1;
    return `${day}-${month}`;
  }

  private resetFields() {
    this.date = new Date().toISOString();
    this.taskcontent = '';
  }

  handleSelectDay(event: CustomEvent) {
    const selectedDate = event.detail.value;
    console.log(selectedDate);
  }

  async handleSave() {
    if (this.taskservice.existsTask(this.getId())) {
      const alert = await this.alertController.create({
        header: '¡Atención!',
        message: 'Ya existe una entrada para esa fecha. La información se sobreescribirá.',
        buttons: this.alertButtons,
      });
      await alert.present();
    } else {
      await this.addTask();
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
      id: this.getId(),
      date: this.date,
      taskcontent: this.taskcontent,
      hours: this.hours,
    });
    console.log(this.taskservice.getTasks());
    this.resetFields();
    return this.modalCtrl.dismiss('', 'confirm');
  }
  updateTask() {
    this.taskservice.updateTask({
      id: this.getId(),
      date: this.date,
      taskcontent: this.taskcontent,
      hours: this.hours,
    });
    console.log(this.taskservice.getTasks());
    this.resetFields();
    return this.modalCtrl.dismiss('', 'confirm');
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  availableDays(dateString: string) {
    const date = new Date(dateString);
    const utcDay = date.getUTCDate();
    const utcMonth = date.getUTCMonth();
    const utcWeekDay = date.getUTCDay();
    let available = true;
    if (utcWeekDay == 0 || utcWeekDay == 6) available = false;
    // festivos de la localidad de Granada
    if (utcMonth == 4 && (utcDay == 3 || utcDay == 30 || utcDay == 31)) available = false;
    // semana santa
    if (utcDay >= 25 && utcDay <= 31 && utcMonth == 2) available = false;
    // fiesta del trabajo
    if (utcDay == 1 && utcMonth == 4) available = false;

    return available;
  }
}
