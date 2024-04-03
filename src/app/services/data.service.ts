import { inject, Injectable } from '@angular/core';
import { User } from "@angular/fire/auth";
import { collection, doc, docData, Firestore, setDoc } from "@angular/fire/firestore";
import { DocumentData } from "@angular/fire/compat/firestore";
import { Observable, of, Subscription } from "rxjs";
import { Task } from "../interfaces/task.interface";
import { FormObject } from "../interfaces/form-object.interface";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private tasksArray: Task[] = [];
  private formData: FormObject = {};

  data$: Observable<DocumentData | DocumentData[] | undefined>;
  dataSubscription: Subscription;
  userSubscription: Subscription;
  firestore: Firestore = inject(Firestore);
  usersCollection = collection(this.firestore, 'usersData');
  userDataDocRef: any;

  private logged = false;

  constructor(private authService: AuthService) {
    this.userSubscription = this.authService.user$.subscribe((aUser: User|null) => {
      if (aUser) {
        this.logged = true;
        // when user is logged, redo data subscription
        this.userDataDocRef = doc(this.usersCollection, this.authService.getUserUid());
        this.data$ = docData(this.userDataDocRef);
        this.dataSubscription.unsubscribe();
        this.dataSubscription = this.data$.subscribe((data:any) => {
          console.log('data w/user:',data);
          this.tasksArray = data.tasksArray;
          this.formData = data.formData;
        });
      } else {
        this.logged = false;
      }
    })
    // no data if no user logged
    this.data$ = this.logged ? docData(doc(this.usersCollection, this.authService.getUserUid())) : of(undefined);
    this.userDataDocRef = this.logged  ? doc(this.usersCollection, this.authService.getUserUid()) : undefined;
    // temporal data subscription
    this.dataSubscription = this.data$.subscribe((data) => {
      console.log('data:',data);
    })
  }

  addTask(task: Task) {
    this.tasksArray.push(task);
    this.saveState();
  }

  updateTask(task: Task) {
    this.tasksArray = this.tasksArray.map((originalTask) => {
      if (originalTask.id === task.id) return task;
      return originalTask;
    });
    console.log('update:',this.tasksArray);
    this.saveState();
  }

  getTasks(): Task[] {
    return this.tasksArray;
  }

  getWeekTasks(week:string[]):Task[]|null {
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

  removeTask(date: string) {
    this.tasksArray = this.tasksArray.filter(task => task.date.substring(0,10) !== date.substring(0,10));
    this.saveState();
  }

  getTaskById(idTask:string): Task|undefined {
    let task = this.tasksArray.filter(task => task.id === idTask);
    return task.length > 0 ? task[0] : undefined;
  }

  getTaskByDate(date:string): Task|undefined {
    let task = this.tasksArray.filter((task) => task.date.substring(0,10) === date.substring(0,10));
    return task.length > 0 ? task[0] : undefined;
  }

  existsTask(date:string): boolean {
    return !!this.getTaskByDate(date);
  }

  getFormData() {
    return this.formData;
  }

  setFormData(formdata:any) {
    this.formData = formdata;
    this.saveState();
  }

  saveState() {
    setDoc(this.userDataDocRef, {
      formData: this.formData,
      tasksArray: this.tasksArray
    });
  }

  generateId(): string {
    let idElems = [];
    idElems.push(new Date().getTime().toString(36).substring(4,8));
    idElems.push(new Date().getTime().toString(16).substring(7,11));
    idElems.push((Math.random()*1000).toString(24).substring(6));
    return idElems.join('-');
  }
}
