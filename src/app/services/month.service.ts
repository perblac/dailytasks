import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MonthService {

  private months = [
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
  constructor() { }

  getMonth(index: number): string {
    // Months from Date.getMonth() start at 0, but in a
    // date string they start at 1. We use this second case
    return this.months[index - 1];
  }
}
