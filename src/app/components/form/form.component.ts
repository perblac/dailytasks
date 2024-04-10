import {Subscription} from "rxjs";
import {ModalController} from "@ionic/angular";
import {FormControl, FormGroup} from "@angular/forms";
import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../services/data.service";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent implements OnInit, OnDestroy {
  dataSubscription: Subscription;

  formDataGroup = new FormGroup({
    alumno: new FormControl(''),
    ciclo: new FormControl(''),
    grado: new FormControl(''),
    centrodocente: new FormControl(''),
    profesor: new FormControl(''),
    centrotrabajo: new FormControl(''),
    tutor: new FormControl(''),
  })

  constructor(
    private modalCtrl: ModalController,
    private dataService: DataService,
  ) {
    this.dataSubscription = this.dataService.data$.subscribe((data) => {
      this.loadFormData();
    })
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm() {
    this.dataService.setFormData(this.getDataObject());
    return this.modalCtrl.dismiss('', 'confirm');
  }

  /**
   * Returns an object with the form data
   */
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

  /**
   * Loads form data values
   */
  loadFormData() {
    if (this.dataService.getFormData()) {
      const {
        alumno,
        ciclo,
        grado,
        centrodocente,
        profesor,
        centrotrabajo,
        tutor
      } = this.dataService.getFormData();
      this.formDataGroup.get('alumno')?.setValue(alumno!);
      this.formDataGroup.get('ciclo')?.setValue(ciclo!);
      this.formDataGroup.get('grado')?.setValue(grado!);
      this.formDataGroup.get('centrodocente')?.setValue(centrodocente!);
      this.formDataGroup.get('profesor')?.setValue(profesor!);
      this.formDataGroup.get('centrotrabajo')?.setValue(centrotrabajo!);
      this.formDataGroup.get('tutor')?.setValue(tutor!);
    }
  }

  ngOnInit() {
    this.loadFormData();
  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }
}
