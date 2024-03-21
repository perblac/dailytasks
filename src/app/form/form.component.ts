import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {FormDataService} from "./form-data.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  public alumno: string = '';
  public ciclo: string = '';
  public grado: string = '';
  public centrodocente: string = '';
  public profesor: string = '';
  public centrotrabajo: string = '';
  public tutor: string = '';

  constructor(private modalCtrl:ModalController, private formDataService: FormDataService) {
    const { alumno, ciclo, grado, centrodocente, profesor, centrotrabajo, tutor } = this.formDataService.getData();
    this.alumno = alumno;
    this.ciclo = ciclo;
    this.grado = grado;
    this.centrodocente = centrodocente;
    this.profesor = profesor;
    this.centrotrabajo = centrotrabajo;
    this.tutor = tutor;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.formDataService.setData(this.getDataObject());
    return this.modalCtrl.dismiss('', 'confirm');
  }

  getDataObject() {
    return {
      alumno: this.alumno,
      ciclo: this.ciclo,
      grado: this.grado,
      centrodocente: this.centrodocente,
      profesor: this.profesor,
      centrotrabajo: this.centrotrabajo,
      tutor: this.tutor,
    }
  }
}
