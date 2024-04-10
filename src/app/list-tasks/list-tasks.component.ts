import { Component, OnDestroy } from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import { User } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { FormComponent } from "../form/form.component";
import { NewTaskComponent } from "../new-task/new-task.component";
import { EditTaskComponent } from "../edit-task/edit-task.component";
import { ExportToPdfComponent } from "../export-to-pdf/export-to-pdf.component";
import { Task } from "../interfaces/task.interface";
import { DataService } from "../services/data.service";
import { AuthService } from "../services/auth.service";
import { UserService } from "../services/user.service";
import { MonthService } from "../services/month.service";

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

  public tasksArray: Task[] = [];
  public groupedArray:WeekGroup[] = [];

  public authorized = false;

  private sortList = 1;

  protected readonly parseInt = parseInt;

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    public monthService: MonthService,
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private platform: Platform,
  ) {
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      this.authorized = !!aUser;
      if (this.authorized) {
        this.dataSubscription.unsubscribe();
        this.dataSubscription = this.dataService.data$.subscribe(()=> {
          // this.tasksArray = data.tasksArray;
          this.updateTasksArray();
        })
      }
    });
    this.dataSubscription = this.dataService.data$.subscribe(data => {
      console.log('list data',data);
    });
  }

  /**
   * Handles task edition
   * @param id {string} Id of task to edit
   */
  async handleClick(id:any) {
    const copyTask = {...this.dataService.getTaskById(id)};
    const modal = await this.modalCtrl.create({
      component: EditTaskComponent,
      componentProps: {
        'task': copyTask
      }
    });
    modal.onWillDismiss().then((res) => {
      console.log(res);
      if (res.role === 'confirm') {
        this.dataService.updateTask(res.data);
      }
      this.updateTasksArray();
    });
    console.log(id);
    await modal.present();
  }

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
    let list = this.dataService.getTasks();
    list?.sort((a,b)=>(new Date(a.date) > new Date(b.date) ? 1 * this.sortList : -1 * this.sortList));
    this.tasksArray = list;
    this.setGroupedArray();
  }

  public toggleDateOrder() {
    this.sortList = -1 * this.sortList;
    this.updateTasksArray();
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
    return Math.ceil(((delta / millisInDay) + 1) / 7);
  }

  /**
   * Groups tasks array by weeks
   */
  setGroupedArray () {
    this.groupedArray = this.tasksArray.slice().reduce((acc: WeekGroup[], task: Task) => {
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
  }

  onClickLogOut() {
    if (this.platform.is('hybrid')) {
      this.userService.logoutMobile()
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(err => console.log(err));
    } else {
      this.userService.logout()
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(err => console.log(err));
    }
  }

  onClickNavigateToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.authStateSubscription.unsubscribe();
    this.dataSubscription.unsubscribe();
  }
}
