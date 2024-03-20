import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ListTasksComponent} from "./list-tasks.component";
import {IonicModule} from "@ionic/angular";
import {NgForOf} from "@angular/common";
import {NewTaskComponent} from "../new-task/new-task.component";
import {FormsModule} from "@angular/forms";

@NgModule({
  imports: [RouterModule.forChild([{path: '', component: ListTasksComponent}]), IonicModule, NgForOf, FormsModule],
  declarations: [ListTasksComponent, NewTaskComponent],
  exports: [ListTasksComponent],
})

export class  ListTasksModule {}
