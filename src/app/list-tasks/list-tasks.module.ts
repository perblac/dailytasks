import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ListTasksComponent} from "./list-tasks.component";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";


@NgModule({
  imports: [RouterModule.forChild([{path: '', component: ListTasksComponent}]), IonicModule, NgForOf],
  declarations: [ListTasksComponent],
  exports: [ListTasksComponent],
})

export class  ListTasksModule {}
