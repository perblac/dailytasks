import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
      {
        path: '',
        redirectTo: 'list-tasks',
        pathMatch: 'full'
      },
      {
        path: 'list-tasks',
        loadChildren: () => import('./list-tasks/list-tasks.module').then(m => m.ListTasksModule)
      },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
