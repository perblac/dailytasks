import {App} from '@capacitor/app';
import {Dialog} from '@capacitor/dialog';
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
    this.platform.backButton.subscribe(() => {
      if (!this.routerOutlet?.canGoBack()) {
        this.showConfirm()
          .then(res => {
            if (res) App.exitApp();
          })
          .catch(err => console.error(err));
      }
    });
  }

  async showConfirm() {
    const {value} = await Dialog.confirm({
      title: 'Confirme salida',
      message: '¿Está seguro de que quiere salir de la aplicación?',
      okButtonTitle: 'Sí, salir',
      cancelButtonTitle: 'Cancelar',
    });
    return value;
  }
}
