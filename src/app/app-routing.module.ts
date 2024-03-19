import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {MenuComponent} from "./menu/menu.component";

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    children: [
      {
        path: '',
        redirectTo: 'list-tasks',
        pathMatch: 'full'
      },
      {
        path: 'new-task',
        loadChildren: () => import('./new-task/new-task.module').then(m => m.NewTaskModule)
      },
      {
        path: 'list-tasks',
        loadChildren: () => import('./list-tasks/list-tasks.module').then(m => m.ListTasksModule)
      }
    ]
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
