import {Component, Input, ViewChild} from '@angular/core';
import {TasksService} from "../tasks/tasks.service";
import {AlertController, IonModal, ModalController} from "@ionic/angular";
import {Task} from "../interfaces/task.interface";
import { OverlayEventDetail } from '@ionic/core/components';

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent{
  @ViewChild(IonModal) modal!: IonModal;
  @Input() task!: Task;

  private newId: string = '';
  private newDate: string = '';
  private newTaskcontent: string = '';
  private newHours: number = 0;

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Aceptar',
      role: 'confirm',
    }
  ];
  constructor(private tasksService: TasksService, private modalCtrl: ModalController, private taskservice: TasksService, private alertController: AlertController) {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  cancelDate() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.task, 'confirm');
  }

  confirmDate() {
    if (this.newDate.substring(0,10) === this.task.date.substring(0,10)) {
      // no change in date, so nothing to do
      console.log('same date');
    } else {
      if (this.newId === '') {
        // only a date change
        console.log('date change');
        this.task.date = this.newDate;
      } else {
        // existing task overwrite
        this.task = {
          id: this.newId,
          date: this.newDate,
          taskcontent: this.newTaskcontent,
          hours: this.newHours,
        }
      }
    }
    return this.modal.dismiss('', 'confirm');
  }

  async handleChangeDate(event: CustomEvent) {
    const selectedDate = event.detail.value;
    console.log(selectedDate,this.taskservice.getTaskByDate(selectedDate));
    // check if date already exists
    const originalTask: Task|undefined = this.taskservice.getTaskByDate(selectedDate);
    if (originalTask) {
      const alert = await this.alertController.create(
        {
          header: '¡Atención!',
          message: 'Ya existe una entrada para esa fecha. La información se sobreescribirá.',
          buttons: this.alertButtons,
        }
      );
      await alert.present();
      alert.onWillDismiss().then(async (res)=> {
        if (res.role === 'confirm') {
          this.newId = originalTask.id;
          this.newDate = originalTask.date;
          this.newTaskcontent = originalTask.taskcontent;
          this.newHours = originalTask.hours;
        }
      });
    } else {
      this.newDate = selectedDate;
    }
  }

  showDelete():boolean {
    return this.taskservice.existsTask(this.task.date);
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

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<OverlayEventDetail<string>>;
    if (ev.detail.role === 'confirm') {
      return this.task;
    }
    return undefined;
  }
}
