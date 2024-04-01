import {Component, Input, ViewChild} from '@angular/core';
import {TasksService} from "../services/tasks.service";
import {AlertController, IonModal, ModalController} from "@ionic/angular";
import {Task} from "../interfaces/task.interface";
import {MonthService} from "../services/month.service";

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
  private newTaskContent: string = '';
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

  public deleteAlertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
    },
    {
      text: 'Sí, Eliminar',
      role: 'confirm',
    }
  ];
  constructor(
    private tasksService: TasksService,
    private modalCtrl: ModalController,
    private taskservice: TasksService,
    private alertController: AlertController,
    public monthService: MonthService,
  ) {
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    return this.modalCtrl.dismiss(this.task, 'confirm');
  }

  cancelDate() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * Handles confirmation of a new date
   */
  confirmDate() {
    if (this.newDate.substring(0,10) === this.task.date.substring(0,10)) {
      // no change in date, so nothing to do
      console.log('same date');
    } else {
      if (this.newId === '') {
        // only a date change (no previous task in this date)
        console.log('date change');
        this.task.date = this.newDate;
      } else {
        // existing task overwrite
        console.log('task overwrite');
        this.task = {
          id: this.newId,
          date: this.newDate,
          taskcontent: this.newTaskContent,
          hours: this.newHours,
        }
      }
    }
    return this.modal.dismiss('', 'confirm');
  }

  /**
   * Handles a change of date. Checks if the new date already exists in tasks.
   * @param event Event from the ion-datetime ionChange
   */
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
        // if user confirms, we take the original values as ours
        if (res.role === 'confirm') {
          this.newId = originalTask.id;
          this.newDate = originalTask.date;
          this.newTaskContent = originalTask.taskcontent;
          this.newHours = originalTask.hours;
        }
      });
    } else {
      this.newDate = selectedDate;
    }
  }

  /**
   * Determines showing the Delete task button. It only shows if the task exists.
   */
  showDelete():boolean {
    return this.taskservice.existsTask(this.task.date);
  }

  /**
   * Deletes currents task after confirmation.
   */
  async handleDelete() {
    // get top modal id
    const topModal = await this.modalCtrl.getTop();
    const modalId = topModal ? topModal.id : null;

    // get day and month
    const dateToDelete = new Date(this.task.date);
    const day = dateToDelete.getDate();
    const monthNumber = dateToDelete.getMonth();
    const month = this.monthService.getMonth(1 + monthNumber);

    const alert = await this.alertController.create(
      {
        header: 'Esta acción es irreversible',
        message: `¿Está seguro de que desea eliminar la entrada del día ${day} de ${month}?`,
        subHeader: `Tarea: ${this.task.taskcontent} (${this.task.hours} h.)`,
        buttons: this.deleteAlertButtons,
      }
    );
    alert.onWillDismiss().then(res => {
      if (res.role === 'confirm') {
        this.tasksService.removeTask(this.task.date);
        this.modalCtrl.dismiss(null, 'delete', modalId!);
      }
    });
    await alert.present();
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

  protected readonly parseInt = parseInt;
}
