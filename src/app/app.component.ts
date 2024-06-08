import {Component, Optional} from '@angular/core';
import {IonRouterOutlet, Platform} from "@ionic/angular"
import {Subscription} from "rxjs";
import {TranslocoService} from "@jsverse/transloco";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  private translationSubscription: Subscription;

  constructor(
    private platform: Platform,
    private translocoService: TranslocoService,
    private title: Title,
    @Optional() private routerOutlet?: IonRouterOutlet
  ) {
    // Initialize dark mode according to system preferences
    document.body.classList.toggle('dark', window.matchMedia('(prefers-color-scheme: dark)').matches);
    // Subscribe to translation changes to change page tittle according
    this.translationSubscription = this.translocoService.selectTranslation().subscribe(() => {
      this.title.setTitle(this.translocoService.translate('headTitle'));
    })
  }
}
