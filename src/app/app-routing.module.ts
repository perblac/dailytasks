import {NgModule} from '@angular/core';
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {RegisterComponent} from "./components/register/register.component";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list-tasks',
  },
  {
    path: 'list-tasks',
    loadChildren: () => import('./components/list-tasks/list-tasks.module').then(m => m.ListTasksModule),
    ...canActivate(() => redirectUnauthorizedTo(['/login']))
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
