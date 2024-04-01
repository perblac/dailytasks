import { Component } from '@angular/core';
import {TasksService} from "../services/tasks.service";
import {AlertController, ModalController} from "@ionic/angular";
import {EditTaskComponent} from "../edit-task/edit-task.component";
import {Task} from "../interfaces/task.interface";

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  public id: string = this.taskservice.generateId();
  public date: string = new Date().toISOString();
  public taskcontent: string = '';
  public hours: number = 0;

  public alertButtonsDateExists = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Aceptar',
      role: 'confirm',
    }
  ]
  constructor(private taskservice: TasksService, private alertController: AlertController, private modalCtrl: ModalController) {
  }

  /**
   * Reset the form fields
   * @private
   */
  private resetFields() {
    this.id = this.taskservice.generateId();
    this.date = new Date().toISOString();
    this.taskcontent = '';
    this.hours = 0;
  }

  /**
   * Handle the select day event. If date already exist, alert and optionally edit that date. If not, open modal with
   * empty values.
   * @param event Event from the ion-datetime ionChange
   */
  async handleSelectDay(event: CustomEvent) {
    const selectedDate = event.detail.value;
    console.log(selectedDate,this.taskservice.getTaskByDate(selectedDate));
    // check if date already exists
    const originalTask: Task|undefined = this.taskservice.getTaskByDate(selectedDate);
    if (originalTask) {
      const alert = await this.alertController.create(
        {
          header: '¡Atención!',
          message: 'Ya existe una entrada para esa fecha. La información se sobreescribirá.',
          buttons: this.alertButtonsDateExists,
        }
      );
      await alert.present();
      alert.onWillDismiss().then(async (res)=> {
        // if user confirms, we take the original values as ours before opening modal
        if (res.role === 'confirm') {
          this.id = originalTask.id;
          this.date = originalTask.date;
          this.taskcontent = originalTask.taskcontent;
          this.hours = originalTask.hours;
          await this.callEditTask(originalTask);
        }
      });
    } else {
      await this.callEditTask();
    }
  }

  /**
   * Opens EditTaskComponent as modal, and handles saving or updating according to response.
   * @param originalTask {Object} If exists, we are updating this task
   */
  async callEditTask(originalTask: Task|undefined = undefined) {
    // get top modal id
    const topModal = await this.modalCtrl.getTop();
    const modalId = topModal ? topModal.id : null;

    // call EditTaskComponent with our data
    const modal = await this.modalCtrl.create({
      component: EditTaskComponent,
      componentProps: {
        'task': {
          id: this.id,
          date: this.date,
          taskcontent: this.taskcontent,
          hours: this.hours,
        }
      }
    });
    // handle modal dismiss
    modal.onWillDismiss().then((res) => {
      if (res.role === 'confirm') {
        if (!!originalTask) {
          this.taskservice.updateTask(res.data);
        } else {
          this.taskservice.addTask(res.data);
        }
        console.log('added task');
        this.resetFields();
        // close top modal after saving
        this.modalCtrl.dismiss('', 'confirm',modalId!);
      }
      if (res.role === 'cancel') {
        this.resetFields();
      }
    });
    await modal.present();
  }

  /**
   * Cancel method for 'Volver' button
   */
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
