import {Component, OnDestroy} from '@angular/core';
import {Task} from "../interfaces/task.interface";
import {TasksService} from "../services/tasks.service";
import {ModalController} from "@ionic/angular";
import {NewTaskComponent} from "../new-task/new-task.component";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";
import {FormComponent} from "../form/form.component";
import {EditTaskComponent} from "../edit-task/edit-task.component";
import {MonthService} from "../services/month.service";
import {AuthService} from "../services/auth.service";
import {Subscription} from "rxjs";
import {User} from "@angular/fire/auth";

interface WeekGroup {
  weekNumber?: number,
  items?: Task[],
}

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnDestroy{
  authStateSubscription: Subscription;
  dataSubscription: Subscription;

  // public tasksArray: Task[] = this.tasksService.getTasks();
  public tasksArray: Task[] = [];

  /**
   * Returns tasks array grouped by weeks
   */
  private getGroupedArray = () => this.tasksArray.reduce((acc:WeekGroup[], task:Task) => {
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

  public groupedArray = this.getGroupedArray();

  public authorized = false;

  constructor(
    private tasksService: TasksService,
    private modalCtrl: ModalController,
    public monthService: MonthService,
    public authService: AuthService,
  ) {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      this.authorized = !!aUser;
      if (this.authorized) {
        this.dataSubscription.unsubscribe();
        this.dataSubscription = this.tasksService.data$.subscribe((data:any)=> {
          this.tasksArray = data.tasksArray;
          console.log(this.tasksArray);
          this.groupedArray = this.getGroupedArray();
          this.getGroupedArray();
          console.log('list data',data);
        })
      }
      // this.updateTasksArray();
    });
    this.dataSubscription = this.tasksService.data$.subscribe(data => {
      // this.tasksArray = data?.tasksArray;
      console.log('list data',data);
    })
  }

  /**
   * Handles task edition
   * @param id {string} Id of task to edit
   */
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

  // removeTask(date:string) {
  //   this.tasksService.removeTask(date);
  //   this.updateTasksArray();
  // }

  async openModalNewTask() {
    const modal = await this.modalCtrl.create({
      component: NewTaskComponent,
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      this.updateTasksArray();
    });
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

  /**
   * Sorts tasks array by date and groups tasks by week
   * @private
   */
  private updateTasksArray() {
    // let list = this.tasksService.getTasks();
    // list?.sort((a,b)=>(new Date(a.date) > new Date(b.date) ? 1 : -1));
    // this.tasksArray = list;
    // this.groupedArray = this.getGroupedArray();
  }

  /**
   * Method to get week number of the year from a date.
   * @param date {string} Date to get week number from
   * @private
   */
  private getWeekNumber(date: string):number {
    const taskDate = new Date(date);
    taskDate.setHours(0,0,0,0);
    const dayOfWeek = taskDate.getDay() || 7;
    const centerOfWeek = 4;
    taskDate.setDate(taskDate.getDate() + centerOfWeek - dayOfWeek);
    const firstDayOfYearDate = new Date(taskDate.getFullYear(), 0 , 1);
    const millisInDay = 24 * 60 * 60 * 1000;
    const delta = taskDate.getTime() - firstDayOfYearDate.getTime();
    const weekNumber = Math.ceil(((delta / millisInDay) + 1) / 7);
    return weekNumber;
  }

  protected readonly parseInt = parseInt;

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
