import {AlertController, IonModal, ModalController} from "@ionic/angular";
import {Component, Input, ViewChild, ChangeDetectorRef, AfterViewInit, OnInit} from '@angular/core';
import {Task} from "../../interfaces/task.interface";
import {DataService} from "../../services/data.service";
import {MonthService} from "../../services/month.service";
import {AvailableDaysService} from "../../services/available-days.service";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss'],
})
export class EditTaskComponent implements OnInit, AfterViewInit {
  @ViewChild(IonModal) modal!: IonModal;
  @Input() task!: Task;

  private newId: string = '';
  private newDate: string = '';
  private newTaskContent: string = '';
  private newHours: number = 0;

  public day: any = 0;
  public month: string = '-';

  public alertButtons = [
    {
      text: this.translocoService.translate('editTask.cancelButton'),
      role: 'cancel',
    },
    {
      text: this.translocoService.translate('editTask.acceptButton'),
      role: 'confirm',
    }
  ];
  public deleteAlertButtons = [
    {
      text: this.translocoService.translate('editTask.cancelButton'),
      role: 'cancel',
    },
    {
      text: this.translocoService.translate('editTask.yesDeleteButton'),
      role: 'confirm',
    }
  ];

  protected readonly parseInt = parseInt;

  constructor(
    private cdr: ChangeDetectorRef,
    private dataService: DataService,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    public monthService: MonthService,
    public availableDaysService: AvailableDaysService,
    private translocoService: TranslocoService,
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
    if (this.newDate.substring(0, 10) === this.task.date.substring(0, 10)) {
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

  setDate(date: string = this.task.date) {
    this.day = this.formatDayLang(parseInt(date.slice(8, 10)));
    this.month = this.monthService.getMonth(parseInt(date.slice(5, 7)));
  }

  formatDayLang(day:any): string {
    switch (this.translocoService.getActiveLang()) {
      case 'en':
        let suffix = (day === 1) ? 'st' : (day === 2) ? 'nd' : (day === 3) ? 'rd' : 'th';
        day = day + suffix;
        break;
      case 'fr':
        day = (day === 1) ? day + 'er' : day;
        break;
      default:
        break;
    }
    return day;
  }

  /**
   * Handles a change of date. Checks if the new date already exists in tasks.
   * @param event Event from the ion-datetime ionChange
   */
  async handleChangeDate(event: CustomEvent) {
    const selectedDate = event.detail.value;
    console.log(selectedDate, this.dataService.getTaskByDate(selectedDate));
    // check if date already exists
    const originalTask: Task | undefined = this.dataService.getTaskByDate(selectedDate);
    if (originalTask) {
      const alert = await this.alertController.create(
        {
          header: this.translocoService.translate('editTask.alertDateHeader'),
          message: this.translocoService.translate('editTask.alertDateMessage'),
          buttons: this.alertButtons,
        }
      );
      await alert.present();
      alert.onWillDismiss().then(async (res) => {
        console.log(res);
        // if user confirms, we take the original values as ours
        if (res.role === 'confirm') {
          this.newId = originalTask.id;
          this.newDate = originalTask.date;
          this.newTaskContent = originalTask.taskcontent;
          this.newHours = originalTask.hours;
          this.setDate(this.newDate);
        }
      });
    } else {
      this.newDate = selectedDate;
      this.setDate(selectedDate);
    }
  }

  /**
   * Determines showing the Delete task button. It only shows if the task exists.
   */
  showDelete(): boolean {
    return !!this.dataService.getTaskByDate(this.task.date);
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
        header: this.translocoService.translate('editTask.alertDeleteHeader'),
        message: this.translocoService.translate('editTask.alertDeleteMessage', {day: this.formatDayLang(day), month: month}),
        subHeader: `${this.translocoService.translate('editTask.alertDeleteSubHeader')}: ${this.task.taskcontent} (${this.task.hours} h.)`,
        buttons: this.deleteAlertButtons,
      }
    );
    alert.onWillDismiss().then(res => {
      if (res.role === 'confirm') {
        this.dataService.removeTask(this.task.date);
        this.modalCtrl.dismiss(null, 'delete', modalId!);
      }
    });
    await alert.present();
  }

  ngOnInit() {
    this.setDate(this.task.date);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
    console.log('task:', this.task);
  }
}
