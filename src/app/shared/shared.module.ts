import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { FormComponent } from "./components/form/form.component";

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: "never" })],
  exports: [
    FormComponent
  ]
})
export class SharedModule { }
