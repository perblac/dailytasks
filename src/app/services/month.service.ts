import {Injectable, OnDestroy} from '@angular/core';
import {TranslocoService} from "@jsverse/transloco";
import {Subscription} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MonthService implements OnDestroy{

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

  private translationSubscription: Subscription;

  constructor(
    private translocoService:TranslocoService,
  ) {
    this.translationSubscription = this.translocoService.selectTranslation()
      .subscribe(() => {
        const lang = this.translocoService.getActiveLang();
        this.translateMonths(lang);
      });
  }

  /**
   * Returns the month name corresponding to the number
   * @param index number of the month, between 1 and 12
   */
  getMonth(index: number): string {
    return this.months[index - 1];
  }

  translateMonths(lang:string) {
    this.months= [
      this.translocoService.translate('month.jan',{}, lang),
      this.translocoService.translate('month.feb',{}, lang),
      this.translocoService.translate('month.mar',{}, lang),
      this.translocoService.translate('month.apr',{}, lang),
      this.translocoService.translate('month.may',{}, lang),
      this.translocoService.translate('month.jun',{}, lang),
      this.translocoService.translate('month.jul',{}, lang),
      this.translocoService.translate('month.aug',{}, lang),
      this.translocoService.translate('month.sep',{}, lang),
      this.translocoService.translate('month.oct',{}, lang),
      this.translocoService.translate('month.nov',{}, lang),
      this.translocoService.translate('month.dec',{}, lang),
    ];
  }

  ngOnDestroy() {
    this.translationSubscription.unsubscribe();
  }
}
