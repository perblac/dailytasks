import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {ListTasksComponent} from "./list-tasks.component";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import {NewTaskComponent} from "../new-task/new-task.component";
import {FormsModule} from "@angular/forms";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";

@NgModule({
  imports: [RouterModule.forChild([{path: '', component: ListTasksComponent}]), IonicModule, NgForOf, FormsModule, NgIf],
  declarations: [ListTasksComponent, NewTaskComponent, ExportToPdfComponent],
  exports: [ListTasksComponent],
})

export class  ListTasksModule {}
