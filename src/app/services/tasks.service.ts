import {inject, Injectable, OnDestroy} from '@angular/core';
import { Task } from "../interfaces/task.interface";
import {Observable, of, Subscription} from "rxjs";
import {collection, doc, docData, Firestore, setDoc} from "@angular/fire/firestore";
import {AuthService} from "./auth.service";
import {DocumentData, DocumentReference} from "@angular/fire/compat/firestore";
import {User} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class TasksService{ // implements OnDestroy{
  // private tasksArray: Task[] = JSON.parse(localStorage.getItem('tasks') ?? '[]');
  private tasksArray: Task[] = [];

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
        this.userDataDocRef = doc(this.usersCollection, this.authService.getUserUid());
        this.data$ = docData(this.userDataDocRef);
        this.dataSubscription.unsubscribe();
        this.dataSubscription = this.data$.subscribe((data:any) => {
          console.log('data w/user:',data);
          this.tasksArray = data.tasksArray;
        });
      } else {
        this.logged = false;
      }
    })
    this.data$ = this.logged ? docData(doc(this.usersCollection, this.authService.getUserUid())) : of(undefined);
    this.userDataDocRef = this.authService.getUserUid() ? doc(this.usersCollection, this.authService.getUserUid()) : undefined;
    // this.data$ = userData ? docData(userData) : of(undefined);
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

  saveState() {
    // localStorage.setItem('tasks', JSON.stringify(this.tasksArray));
    setDoc(this.userDataDocRef, {tasksArray: this.tasksArray});
  }

  generateId(): string {
    let idElems = [];
    idElems.push(new Date().getTime().toString(36).substring(4,8));
    idElems.push(new Date().getTime().toString(16).substring(7,11));
    idElems.push((Math.random()*1000).toString(24).substring(6));
    return idElems.join('-');
  }
  //
  // ngOnDestroy() {
  //   this.dataSubscription.unsubscribe();
  // }
}
