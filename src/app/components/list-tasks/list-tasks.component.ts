import {Subscription} from "rxjs";
import {Router} from "@angular/router";
import {User} from "@angular/fire/auth";
import {Component, OnDestroy} from '@angular/core';
import {ModalController, Platform} from "@ionic/angular";
import {FormComponent} from "../form/form.component";
import {NewTaskComponent} from "../new-task/new-task.component";
import {EditTaskComponent} from "../edit-task/edit-task.component";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";
import {Task} from "../../interfaces/task.interface";
import {DataService} from "../../services/data.service";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {MonthService} from "../../services/month.service";
import {TranslocoService} from "@jsverse/transloco";
import {OptionsComponent} from "../options/options.component";

interface WeekGroup {
  weekNumber?: number,
  items?: Task[],
}

@Component({
  selector: 'app-list-tasks',
  templateUrl: './list-tasks.component.html',
  styleUrls: ['./list-tasks.component.scss'],
})
export class ListTasksComponent implements OnDestroy {
  authStateSubscription: Subscription;
  dataSubscription: Subscription;

  public tasksArray: Task[] = [];
  public groupedArray: WeekGroup[] = [];

  public authorized: boolean = false;

  private sortList: number = 1;
  private darkMode: boolean = false;
  selectedLang: string = 'en';

  protected readonly parseInt = parseInt;

  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    public monthService: MonthService,
    public authService: AuthService,
    private userService: UserService,
    private router: Router,
    private platform: Platform,
    private translocoService: TranslocoService,
  ) {
    console.log('listTasks created');
    this.authStateSubscription = this.authService.authState$.subscribe((aUser: User | null) => {
      this.authorized = !!aUser;
      if (this.authorized) {
        this.dataSubscription.unsubscribe();
        this.dataSubscription = this.dataService.data$.subscribe((data) => {
          if (data) {
            this.loadOptions();
            this.updateTasksArray();
          }
        });
      }
    });
    this.dataSubscription = this.dataService.data$.subscribe();
  }

  /**
   * Handles task edition
   * @param id string with id of task to edit
   */
  async handleClick(id: any) {
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
    return await modal.present();
  }

  /**
   * Opens new task modal and updates task list after dismiss
   */
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

  /**
   * Opens export to pdf modal
   */
  async openModalExportToPdf() {
    const modal = await this.modalCtrl.create({
      component: ExportToPdfComponent,
    });
    return await modal.present();
  }

  /**
   * Opens form modal
   */
  async openModalDataForm() {
    const modal = await this.modalCtrl.create({
      component: FormComponent,
    });
    return await modal.present();
  }

  /**
   * Opens options modal
   */
  async openModalOptions() {
    const options = {
      sortList: this.sortList,
      selectedLang: this.selectedLang,
      darkMode: this.darkMode,
    }
    const modal = await this.modalCtrl.create({
      component: OptionsComponent,
      componentProps: {
        'options': options,
      }
    });
    modal.backdropDismiss = false;
    modal.onWillDismiss().then((res) => {
      console.log('res:',res);
      this.sortList = res.data.sortList;
      // if sort order changed, reorder the list
      if (this.sortList != options.sortList) this.updateTasksArray();
      this.selectedLang = res.data.selectedLang;
      this.darkMode = res.data.darkMode;
      // if something changed, save options
      if (
        this.sortList != options.sortList ||
        this.selectedLang != options.selectedLang ||
        this.darkMode != options.darkMode
      ) this.dataService.setOptions(res.data);
    })
    return await modal.present();
  }

  /**
   * Gets options from data service
   */
  loadOptions() {
    const options = this.dataService.getOptions();
    // set sort order from options, or default
    this.sortList = options.sortList ?? 1;
    // set dark mode from options, or system pref
    this.darkMode = options.darkMode ?? window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.classList.toggle('dark', this.darkMode);
    // set language from options, or active language
    this.selectedLang = options.selectedLang ?? this.translocoService.getActiveLang();
    this.selectedLang = (['en', 'es', 'fr', 'de', 'ru'].includes(this.selectedLang)) ? this.selectedLang : 'en';
    // this.translocoService.setActiveLang(this.selectedLang);
  }

  /**
   * Sorts tasks array by date and groups tasks by week
   * @private
   */
  private updateTasksArray() {
    let list = this.dataService.getTasks();
    list?.sort((a, b) => (new Date(a.date) > new Date(b.date) ? this.sortList : -1 * this.sortList));
    this.tasksArray = list;
    this.setGroupedArray();
  }

  /**
   * Changes sorting order
   */
  public toggleDateOrder() {
    this.sortList = -1 * this.sortList;
    const options = {
      sortList: this.sortList,
      selectedLang: this.selectedLang,
      darkMode: this.darkMode,
    }
    this.dataService.setOptions(options);
    this.updateTasksArray();
  }

  /**
   * Method to get week number of the year from a date
   * @param date string with date to get week number from
   * @private
   */
  private getWeekNumber(date: string): number {
    const taskDate = new Date(date);
    taskDate.setHours(0, 0, 0, 0);
    const dayOfWeek = taskDate.getDay() || 7;
    const centerOfWeek = 4;
    taskDate.setDate(taskDate.getDate() + centerOfWeek - dayOfWeek);
    const firstDayOfYearDate = new Date(taskDate.getFullYear(), 0, 1);
    const millisInDay = 24 * 60 * 60 * 1000;
    const delta = taskDate.getTime() - firstDayOfYearDate.getTime();
    return Math.ceil(((delta / millisInDay) + 1) / 7);
  }

  /**
   * Groups tasks array by weeks
   */
  setGroupedArray() {
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

  /**
   * Handles logout and redirects to login page
   */
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
