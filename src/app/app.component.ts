import {Component, Optional} from '@angular/core';
import {IonRouterOutlet, Platform} from "@ionic/angular"

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    // Initialize dark mode according to system preferences
    document.body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
  }
}
