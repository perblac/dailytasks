import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formdata = JSON.parse(localStorage.getItem('formdata') ?? '{}');
  constructor() { }

  getData() {
    this.updateState();
    console.log('getData:', this.formdata);
    return this.formdata;
  }
  setData(formdata:any) {
    this.formdata = formdata;
    this.saveState();
  }
  private saveState() {
    localStorage.setItem('formdata', JSON.stringify(this.formdata));
  }

  private updateState() {
    this.formdata = JSON.parse(localStorage.getItem('formdata') ?? '{}');
  }
}
