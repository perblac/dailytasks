import { Component, OnInit } from '@angular/core';
import {TasksService} from "../services/tasks.service";
import {ModalController, Platform} from "@ionic/angular";
import {Task} from "../interfaces/task.interface";
import {FormDataService} from "../services/form-data.service";
import { PDFDocument } from 'pdf-lib';

const months = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]
@Component({
  selector: 'app-export-to-pdf',
  templateUrl: './export-to-pdf.component.html',
  styleUrls: ['./export-to-pdf.component.scss'],
})
export class ExportToPdfComponent {

  public week: string[] = [];
  public tasks: Task[] = [];
  constructor(
    private tasksService: TasksService,
    private modalCtrl: ModalController,
    private formDataService: FormDataService,
  ) {}

  public async generatePdf() {
    const { alumno, ciclo, grado, centrodocente, profesor, centrotrabajo, tutor } = this.formDataService.getData();

    const firstDate = new Date(this.week[0]);
    const lastDate = new Date(this.week[4]);
    const firstDay = firstDate.getDate().toString();
    const lastDay = lastDate.getDate().toString();
    const firstMonth = months[firstDate.getMonth()];
    const lastMonth = months[lastDate.getMonth()];
    const month = (firstMonth != lastMonth) ? `${firstMonth}/${lastMonth}` : firstMonth;
    const year = firstDate.getFullYear().toString().slice(2,4);

    const file = './assets/ficha.pdf'
    const formPdfBytes = await fetch(file).then(res => res.arrayBuffer());
    console.log('#'+firstDay+'#', firstDay.length);

    const pdfDoc = await PDFDocument.load(formPdfBytes);

    const form = pdfDoc.getForm();

    const dia1 = form.getTextField('dia1');
    const dia2 = form.getTextField('dia2');
    const mes = form.getTextField('mes');
    const año = form.getTextField('año');
    const centro_docente = form.getTextField('centro_docente');
    const profesorF = form.getTextField('profesor');
    const centro_trabajo = form.getTextField('centro_trabajo');
    const tutorF = form.getTextField('tutor');
    const alumnoF = form.getTextField('alumno');
    const cicloF = form.getTextField('ciclo');
    const gradoF = form.getTextField('grado');

    const actividad0 = form.getTextField('actividad.0');
    const actividad1 = form.getTextField('actividad.1');
    const actividad2 = form.getTextField('actividad.2');
    const actividad3 = form.getTextField('actividad.3');
    const actividad4 = form.getTextField('actividad.4');
    const tiempo0 = form.getTextField('tiempo.0');
    const tiempo1 = form.getTextField('tiempo.1');
    const tiempo2 = form.getTextField('tiempo.2');
    const tiempo3 = form.getTextField('tiempo.3');
    const tiempo4 = form.getTextField('tiempo.4');

    const actArr = [actividad0,actividad1,actividad2,actividad3,actividad4];
    const tiemArr = [tiempo0,tiempo1,tiempo2,tiempo3,tiempo4];

    dia1.setText(firstDay);
    dia2.setText(lastDay);
    mes.setText(month);
    año.setText(year);
    centro_docente.setText(centrodocente);
    profesorF.setText(profesor);
    centro_trabajo.setText(centrotrabajo);
    tutorF.setText(tutor);
    alumnoF.setText(alumno);
    cicloF.setText(ciclo);
    gradoF.setText(grado);
    actArr.forEach((field, index) => {
      field.setText(this.tasks[index].taskcontent);
    });
    tiemArr.forEach((field,index) => {
      field.setText(`${this.tasks[index].hours} horas`);
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `ficha_del_${firstDay}_al_${lastDay}_de_${month}.pdf`;
    downloadLink.click();
    // TODO: download in mobile devices
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
