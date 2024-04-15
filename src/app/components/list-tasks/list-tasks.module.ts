import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {IonicModule} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EditTaskComponent} from "../edit-task/edit-task.component";
import {ExportToPdfComponent} from "../export-to-pdf/export-to-pdf.component";
import {FormComponent} from "../form/form.component";
import {ListTasksComponent} from "./list-tasks.component";
import {NewTaskComponent} from "../new-task/new-task.component";
import {TranslocoDirective} from "@jsverse/transloco";
import {OptionsComponent} from "../options/options.component";

@NgModule({
    imports: [RouterModule.forChild([{
        path: '',
        component: ListTasksComponent
    }]), IonicModule, NgForOf, FormsModule, NgIf, ReactiveFormsModule, TranslocoDirective],
  declarations: [ListTasksComponent, NewTaskComponent, EditTaskComponent, ExportToPdfComponent, FormComponent, OptionsComponent],
  exports: [ListTasksComponent],
})

export class ListTasksModule {
}
