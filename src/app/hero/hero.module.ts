import { NgModule } from "@angular/core";
import { HeroesComponent } from "./containers/heroes/heroes.component";
import { HeroDetailComponent } from "./containers/hero-detail/hero-detail.component";
import { RouterModule, Routes } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { HeroService } from "./hero.service";

const routes: Routes = [
  {
    path: "",
    component: HeroesComponent
  },
  {
    path: "hero-detail/:id",
    component: HeroDetailComponent
  }
];

@NgModule({
  declarations: [HeroesComponent, HeroDetailComponent],
  imports: [SharedModule, RouterModule.forChild(routes)],
  providers: [HeroService]
})
export class HeroModule { }
