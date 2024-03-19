import {NgModule} from "@angular/core";
import {RouterModule} from "@angular/router";
import {NewTaskComponent} from "./new-task.component";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";


@NgModule({
  imports: [RouterModule.forChild([{path: '', component: NewTaskComponent}]), IonicModule, FormsModule],
  declarations: [NewTaskComponent],
  exports: [NewTaskComponent],
})
export class NewTaskModule {}
