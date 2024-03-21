import {Component, Input, ViewChild} from '@angular/core';
import {TasksService} from "../tasks/tasks.service";
import {IonModal, ModalController} from "@ionic/angular";
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
  constructor(private tasksService: TasksService, private modalCtrl: ModalController) {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.task, 'confirm');
  }

  confirmDate() {
    return this.modal.dismiss('', 'confirm');
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
