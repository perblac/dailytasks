import {Component} from '@angular/core';
import {AlertController, ModalController} from "@ionic/angular";
import {EditTaskComponent} from "../edit-task/edit-task.component";
import {Task} from "../../interfaces/task.interface";
import {DataService} from "../../services/data.service";
import {AvailableDaysService} from "../../services/available-days.service";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent {
  public id: string = this.dataService.generateId();
  public date: string = new Date().toISOString();
  public taskcontent: string = '';
  public hours: number = 0;

  public alertButtonsDateExists = [
    {
      text: this.translocoService.translate('newTask.cancelAlertButton'),
      role: 'cancel',
    },
    {
      text: this.translocoService.translate('newTask.acceptAlertButton'),
      role: 'confirm',
    }
  ]

  constructor(
    private dataService: DataService,
    private alertController: AlertController,
    private modalCtrl: ModalController,
    public availableDaysService: AvailableDaysService,
    private translocoService: TranslocoService,
  ) {
  }

  /**
   * Reset the form fields
   * @private
   */
  private resetFields() {
    this.id = this.dataService.generateId();
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
    console.log(selectedDate, this.dataService.getTaskByDate(selectedDate));
    // check if date already exists
    const originalTask: Task | undefined = this.dataService.getTaskByDate(selectedDate);
    if (originalTask) {
      const alert = await this.alertController.create(
        {
          header: this.translocoService.translate('newTask.alertHeader'),
          message: this.translocoService.translate('newTask.alertMessage'),
          buttons: this.alertButtonsDateExists,
        }
      );
      await alert.present();
      alert.onWillDismiss().then(async (res) => {
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
   * @param originalTask optional input Task object. If exists, we are updating this task
   */
  async callEditTask(originalTask: Task | undefined = undefined) {
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
        // if (!!originalTask) {
        if (this.dataService.getTaskById(res.data.id)) {
          this.dataService.updateTask(res.data);
        } else {
          this.dataService.addTask(res.data);
        }
        console.log('added task');
        this.resetFields();
        // close top modal after saving
        this.modalCtrl.dismiss('', 'confirm', modalId!);
      }
      if (res.role === 'cancel') {
        this.resetFields();
      }
    });
    await modal.present();
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
