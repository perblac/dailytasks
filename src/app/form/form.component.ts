import { Component, OnInit } from '@angular/core';
import {ModalController, NavParams} from "@ionic/angular";
import {FormDataService} from "../services/form-data.service";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {
  formDataGroup = new FormGroup({
    alumno: new FormControl(''),
    ciclo: new FormControl(''),
    grado: new FormControl(''),
    centrodocente: new FormControl(''),
    profesor: new FormControl(''),
    centrotrabajo: new FormControl(''),
    tutor: new FormControl(''),
  })

  constructor(private modalCtrl:ModalController, private formDataService: FormDataService) {
    const { alumno, ciclo, grado, centrodocente, profesor, centrotrabajo, tutor } = this.formDataService.getData();
    this.formDataGroup.get('alumno')?.setValue(alumno);
    this.formDataGroup.get('ciclo')?.setValue(ciclo);
    this.formDataGroup.get('grado')?.setValue(grado);
    this.formDataGroup.get('centrodocente')?.setValue(centrodocente);
    this.formDataGroup.get('profesor')?.setValue(profesor);
    this.formDataGroup.get('centrotrabajo')?.setValue(centrotrabajo);
    this.formDataGroup.get('tutor')?.setValue(tutor);
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.formDataService.setData(this.getDataObject());
    return this.modalCtrl.dismiss('', 'confirm');
  }

  getDataObject() {
    const alumno = this.formDataGroup.get('alumno')?.value;
    const ciclo = this.formDataGroup.get('ciclo')?.value;
    const grado = this.formDataGroup.get('grado')?.value;
    const centrodocente = this.formDataGroup.get('centrodocente')?.value;
    const profesor = this.formDataGroup.get('profesor')?.value;
    const centrotrabajo = this.formDataGroup.get('centrotrabajo')?.value;
    const tutor = this.formDataGroup.get('tutor')?.value;
    return {
      alumno,
      ciclo,
      grado,
      centrodocente,
      profesor,
      centrotrabajo,
      tutor,
    }
  }
}
