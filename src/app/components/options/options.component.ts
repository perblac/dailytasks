import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {TranslocoService} from "@jsverse/transloco";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @Input() options: any;

  darkMode: boolean = true;
  selectedLang: string = 'en';
  sortList: number = 1;
  toggleSortList = false;

  constructor(
    private modalCtrl: ModalController,
    private translocoService: TranslocoService,
  ) {
  }

  dismiss() {
    this.modalCtrl.dismiss({
      'sortList': this.sortList,
      'selectedLang': this.selectedLang,
      'darkMode': this.darkMode,
    });
  }

  changeMode() {
    // toggle light/dark mode
    document.body.classList.toggle('dark', this.darkMode);
  }

  changeLang(event: any) {
    console.log(event);
    this.selectedLang = event.detail.value;
    this.translocoService.setActiveLang(this.selectedLang);
    console.log('lang:',this.selectedLang);
  }

  changeSortOrder() {
    this.sortList = this.toggleSortList ? -1 : 1;
  }

  handleButton(lang:string) {
    this.translocoService.setActiveLang(lang);
    this.selectedLang = lang;
  }
  ngOnInit() {
    this.darkMode = this.options.darkMode;
    this.selectedLang = this.options.selectedLang;
    this.sortList = this.options.sortList;
    this.toggleSortList = (this.sortList === -1);
  }

}
