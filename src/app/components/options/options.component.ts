import { Component, OnInit } from '@angular/core';
import {ModalController} from "@ionic/angular";

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss'],
})
export class OptionsComponent  implements OnInit {

  lightMode: boolean = true;
  selectedLang: string = 'en';
  sortList: number = 1;

  constructor(
    private modalCtrl: ModalController,
  ) { }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  changeMode() {
    // toggle light/dark mode
    this.lightMode = !this.lightMode;
  }

  changeLang() {
    // something to do when changing lang?
  }

  changeSortOrder() {
    // something to do when changing order
  }
  ngOnInit() {}

}
