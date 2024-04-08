import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {RegisterComponent} from "./register/register.component";
import {LoginComponent} from "./login/login.component";
import {canActivate, redirectUnauthorizedTo} from "@angular/fire/auth-guard";

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'list-tasks',
  },
  {
    path: 'list-tasks',
    loadChildren: () => import('./list-tasks/list-tasks.module').then(m => m.ListTasksModule),
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
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
