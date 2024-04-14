import {Injectable} from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";

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
  ];

  constructor(
    private translocoService:TranslocoService,
  ) {
  }

  /**
   * Returns the month name corresponding to the number
   * @param index number of the month, between 1 and 12
   * @param lang language for name of the month
   */
  getMonth(index: number, lang: string = "en"): string {
    this.translocoService.setActiveLang(lang);
    this.months= [
      this.translocoService.translate('month.jan'),
      this.translocoService.translate('month.feb'),
      this.translocoService.translate('month.mar'),
      this.translocoService.translate('month.apr'),
      this.translocoService.translate('month.may'),
      this.translocoService.translate('month.jun'),
      this.translocoService.translate('month.jul'),
      this.translocoService.translate('month.aug'),
      this.translocoService.translate('month.sep'),
      this.translocoService.translate('month.oct'),
      this.translocoService.translate('month.nov'),
      this.translocoService.translate('month.dec'),
    ]
    // Months from Date.getMonth() start at 0, but in a
    // date string they start at 1. We use this second case
    return this.months[index - 1];
  }
}
