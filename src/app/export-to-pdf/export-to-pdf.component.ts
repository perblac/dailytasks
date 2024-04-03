import { Component } from '@angular/core';
import { ModalController, Platform } from "@ionic/angular";
import { FileSharer } from '@byteowls/capacitor-filesharer';
import { PDFDocument } from 'pdf-lib';
import { Task } from "../interfaces/task.interface";
import { DataService } from "../services/data.service";
import { MonthService } from "../services/month.service";
import { AvailableDaysService } from "../services/available-days.service";

@Component({
  selector: 'app-export-to-pdf',
  templateUrl: './export-to-pdf.component.html',
  styleUrls: ['./export-to-pdf.component.scss'],
})
export class ExportToPdfComponent {

  public week: string[] = [];
  public tasks: Task[] = [];
  private platform: Platform;

  constructor(
    platform: Platform,
    private dataService: DataService,
    private modalCtrl: ModalController,
    public monthService: MonthService,
    public availableDaysService: AvailableDaysService,
  ) {
    this.platform = platform;
  }

  /**
   * Converts blob to base64 data for using in file sharing. It takes the data and leaves the descriptor.
   * @param blob {Blob} Original blob to convert
   */
  async blobToBase64 (blob: Blob) {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64data = reader.result as string;
        resolve(base64data.split(',')[1]);
      };
      reader.onerror = error => reject(error);
      reader.readAsDataURL(blob);
    });
  };

  /**
   * Handles the pdf form filling and file downloading
   */
  public async generatePdf() {
    // data from the form
    const {
      alumno,
      ciclo,
      grado,
      centrodocente,
      profesor,
      centrotrabajo,
      tutor
    } = this.dataService.getFormData();

    // month(s) and year data
    const firstDate = new Date(this.week[0]);
    const lastDate = new Date(this.week[4]);
    const firstDay = firstDate.getDate().toString();
    const lastDay = lastDate.getDate().toString();
    const firstMonth = this.monthService.getMonth(1 + firstDate.getMonth());
    const lastMonth = this.monthService.getMonth(1 + lastDate.getMonth());
    const month = (firstMonth != lastMonth) ? `${firstMonth}/${lastMonth}` : firstMonth;
    const year = firstDate.getFullYear().toString().slice(2,4);

    // original pdf document
    const file = './assets/ficha.pdf'
    const formPdfBytes = await fetch(file).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(formPdfBytes);
    const form = pdfDoc.getForm();

    // pdf fields
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

    const firmaAlumno = form.getTextField('firma_alumno');
    const firmaProfe = form.getTextField('firma_profe');
    const firmaTutor = form.getTextField('firma_tutor');

    // setting data into fields
    dia1.setText(firstDay);
    dia2.setText(lastDay);
    mes.setText(month);
    año.setText(year);
    centro_docente.setText(centrodocente);
    profesorF.setText(profesor);
    centro_trabajo.setText(centrotrabajo);
    tutorF.setText(tutor);
    alumnoF.setText(alumno);
    firmaAlumno.setText(alumno);
    firmaProfe.setText(profesor);
    firmaTutor.setText(tutor);
    cicloF.setText(ciclo);
    gradoF.setText(grado);
    actArr.forEach((field, index) => {
      field.setText(this.tasks[index].taskcontent);
    });
    tiemArr.forEach((field,index) => {
      field.setText(`${this.tasks[index].hours} horas`);
    });

    // saving resulting pdf document
    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // downloading
    if (this.platform.is('hybrid')) {
      // download in mobile devices via share
      const base64data = await  this.blobToBase64(blob);
      FileSharer.share({
        filename: `ficha_del_${firstDay}_al_${lastDay}_de_${month}.pdf`,
        contentType: "application/pdf",
        base64Data: base64data,
      }).then(() => {
        console.log('pdf emitido');
      }).catch(error => {
        console.error("File sharing failed", error.message);
      });
    } else {
      // download in web via download link
      const downloadLink = document.createElement("a");
      downloadLink.href = url;
      downloadLink.download = `ficha_del_${firstDay}_al_${lastDay}_de_${month}.pdf`;
      downloadLink.click();
    }
  }

  /**
   * Handles week selection by clicking on a date. Loads tasks from chosen week
   * @param event Event from the ion-datetime ionChange
   */
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
    this.tasks = this.dataService.getWeekTasks(week) ?? [];
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  protected readonly parseInt = parseInt;
}
