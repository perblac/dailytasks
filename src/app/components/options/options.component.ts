import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from "@ionic/angular";
import {TranslocoService} from "@jsverse/transloco";
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent implements OnInit {
  @Input() options: any;
  @Input() submitDataToParent!: (optionsData: any) => void;

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
    this.modalCtrl.dismiss();
  }

  changeMode() {
    // toggle light/dark mode
    document.body.classList.toggle('dark', this.darkMode);
    this.setChanges();
  }

  changeLang(event: any) {
    this.selectedLang = event.detail.value;
    this.translocoService.setActiveLang(this.selectedLang);
    if (!environment.production) console.log('lang:', this.selectedLang);
    this.setChanges();
  }

  changeSortOrder() {
    this.sortList = this.toggleSortList ? -1 : 1;
    this.setChanges();
  }

  setChanges() {
    this.submitDataToParent({
      'sortList': this.sortList,
      'selectedLang': this.selectedLang,
      'darkMode': this.darkMode,
    });
  }

  ngOnInit() {
    this.darkMode = this.options.darkMode;
    this.selectedLang = this.options.selectedLang;
    this.sortList = this.options.sortList;
    this.toggleSortList = (this.sortList === -1);
  }

}
