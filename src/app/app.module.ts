import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {getApp, initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {getAuth, initializeAuth, provideAuth, indexedDBLocalPersistence} from '@angular/fire/auth';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {environment} from "../environments/environment";
import {LoginComponent} from "./components/login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RegisterComponent} from "./components/register/register.component";
import {HttpClientModule} from '@angular/common/http';
import {TranslocoRootModule} from './transloco-root.module';
import {Capacitor} from "@capacitor/core";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    // provideAuth(() => getAuth()),
    provideAuth(() => {
      if (Capacitor.isNativePlatform()) {
        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence
        });
      } else {
        return getAuth();
      }
    }),
    provideFirestore(() => getFirestore()),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslocoRootModule,
  ],
  providers: [{provide: RouteReuseStrategy, useClass: IonicRouteStrategy}],
  bootstrap: [
    AppComponent
  ],
})
export class AppModule {
}
