import { Component, OnInit } from '@angular/core';
import {TasksService} from "../tasks/tasks.service";
import {ModalController} from "@ionic/angular";
import {Task} from "../interfaces/task.interface";

@Component({
  selector: 'app-export-to-pdf',
  templateUrl: './export-to-pdf.component.html',
  styleUrls: ['./export-to-pdf.component.scss'],
})
export class ExportToPdfComponent {

  public week: string[] = [];
  public tasks: Task[] = [];
  constructor(private tasksService: TasksService, private modalCtrl: ModalController) {
  }

  public selectedWeek(event:any) {
    const dayDate = event.detail.value;
    const dateOfDay = new Date(dayDate);
    const weekDay = dateOfDay.getDay();
    dateOfDay.setDate(dateOfDay.getDate() + (1 - weekDay));
    let firstDay = dateOfDay;
    let week: string[] = [firstDay.toISOString()];
    for (let i = 1; i <= 4; i++) {
      week.push(new Date(firstDay.setDate(firstDay.getDate() + 1)).toISOString())
    }
    this.week = week;
    this.tasks = this.tasksService.getWeekTasks(week) ?? [];
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

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
