import {User} from "@angular/fire/auth";
import {inject, Injectable} from '@angular/core';
import {Observable, of, Subscription} from "rxjs";
import {DocumentData} from "@angular/fire/compat/firestore";
import {collection, doc, docData, Firestore, setDoc} from "@angular/fire/firestore";
import {Task} from "../interfaces/task.interface";
import {FormObject} from "../interfaces/form-object.interface";
import {AuthService} from "./auth.service";
import {TranslocoService} from "@jsverse/transloco";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tasksArray: Task[] = [];
  private formData: FormObject = {};
  private options: any;
  private defaultOptions;

  data$: Observable<DocumentData | DocumentData[] | undefined>;
  dataSubscription: Subscription;
  userSubscription: Subscription;
  firestore: Firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'usersData');
  userDataDocRef: any;

  private logged = false;

  constructor(
    private authService: AuthService,
    private translocoService: TranslocoService,
  ) {
    this.defaultOptions = {
      sortList: 1,
      selectedLang: this.translocoService.getActiveLang(),
      darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    };
    this.options = this.defaultOptions;
    this.userSubscription = this.authService.user$.subscribe((aUser: User | null) => {
      if (aUser) {
        this.logged = true;
        // when user is logged, redo data subscription
        this.dataSubscription.unsubscribe();
        this.userDataDocRef = doc(this.usersCollection, this.authService.getUserUid());
        this.data$ = docData(this.userDataDocRef);
        this.dataSubscription = this.data$.subscribe((data: any) => {
          console.log('data w/user:', data);
          if (data) {
            this.tasksArray = data.tasksArray;
            this.formData = data.formData;
            this.options = {...this.defaultOptions, ...data.options};
          } else {
            this.tasksArray = [];
            this.formData = {};
            this.options = this.defaultOptions;
          }
        });
      } else {
        this.logged = false;
        this.options = this.defaultOptions;
        this.dataSubscription.unsubscribe();
      }
      this.defaultOptions = {
        sortList: 1,
        selectedLang: this.translocoService.getActiveLang(),
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
      };
      console.log('defOpt:',this.defaultOptions,'docRef:', this.userDataDocRef);
    })

    // no data if no user logged
    this.data$ = this.logged ? docData(doc(this.usersCollection, this.authService.getUserUid())) : of(undefined);
    this.userDataDocRef = this.logged ? doc(this.usersCollection, this.authService.getUserUid()) : undefined;
    // initialize data subscription
    this.dataSubscription = this.data$.subscribe((data) => {
      // console.log('initialize data:', data);
    })
  }

  /**
   * Adds a task to list and saves
   * @param task Task object to add
   */
  addTask(task: Task) {
    this.tasksArray.push(task);
    this.saveState();
  }

  /**
   * Update a task and saves
   * @param task updated Task object
   */
  updateTask(task: Task) {
    this.tasksArray = this.tasksArray.map((originalTask) => {
      if (originalTask.id === task.id) return task;
      return originalTask;
    });
    console.log('update:', this.tasksArray);
    this.saveState();
  }

  /**
   * Returns list of tasks
   */
  getTasks(): Task[] {
    return this.tasksArray;
  }

  /**
   * Returns an array of tasks for a given week. If no task is defined in any day, pushes an empty task fot that day
   * @param week array of strings with dates of requested week
   */
  getWeekTasks(week: string[]): Task[] | null {
    return week.map(dateString => {
      const id = this.generateId();
      return this.getTaskByDate(dateString) ?? {
        id,
        date: dateString,
        taskcontent: '',
        hours: 0,
      };
    });
  }

  /**
   * Removes a task by its date and saves
   * @param date string with date of task to remove
   */
  removeTask(date: string) {
    this.tasksArray = this.tasksArray.filter(task => task.date.substring(0, 10) !== date.substring(0, 10));
    this.saveState();
  }

  /**
   * Returns a task given its id, or undefined if not found
   * @param idTask string with id of requested task
   */
  getTaskById(idTask: string): Task | undefined {
    let task = this.tasksArray.filter(task => task.id === idTask);
    return task.length > 0 ? task[0] : undefined;
  }

  /**
   * Returns a task given its date, or undefined if not found
   * @param date string with date of requested task
   */
  getTaskByDate(date: string): Task | undefined {
    let task = this.tasksArray.filter((task) => task.date.substring(0, 10) === date.substring(0, 10));
    return task.length > 0 ? task[0] : undefined;
  }

  /**
   * Returns a FormObject with form data
   */
  getFormData() {
    return this.formData;
  }

  /**
   * Sets form values from a given FormObject, and saves
   * @param formdata FormObject with new form values
   */
  setFormData(formdata: any) {
    this.formData = formdata;
    this.saveState();
  }

  /**
   * Returns the options object
   */
  getOptions() {
    return this.options;
  }

  /**
   * Sets user options, and saves
   * @param options object with user options
   */
  setOptions(options: any) {
    this.options = options;
    this.saveState();
  }

  /**
   * Saves current data state to db
   */
  saveState() {
    setDoc(this.userDataDocRef, {
      formData: this.formData,
      tasksArray: this.tasksArray,
      options: this.options,
    });
  }

  /**
   * Generates an unique id
   */
  generateId(): string {
    let idElems = [];
    idElems.push(new Date().getTime().toString(36).substring(4, 8));
    idElems.push(new Date().getTime().toString(16).substring(7, 11));
    idElems.push((Math.random() * 1000).toString(24).substring(6));
    return idElems.join('-');
  }
}
