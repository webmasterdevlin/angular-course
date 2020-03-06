import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { Hero } from "../../hero.model";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { HttpClientRxJSService } from "../../../core/services/httpClientRxJS.service";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit, OnDestroy {
  heroes: Hero[];
  isLoading = false;
  itemForm: FormGroup;
  editedForm: FormGroup;
  sub: Subscription;
  editingTracker = "0";

  constructor(
    private heroService: HttpClientRxJSService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.formBuilderInit();
    this.sub = this.heroService.getHeroes().subscribe(
      data => (this.heroes = data),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.statusText);
      },
      () => (this.isLoading = false)
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  removeHero(id: string) {
    this.isLoading = true;
    this.sub = this.heroService.deleteHeroById(id).subscribe(
      () => (this.heroes = this.heroes.filter(h => h.id !== id)),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.message);
      },
      () => (this.isLoading = false)
    );
  }

  // removeHero(id: string) {
  //   const prevData: Hero[] = [...this.heroes];
  //   this.heroes = this.heroes.filter(h => h.id !== id);
  //   this.sub = this.heroService
  //     .deleteHeroById(id + "x")
  //     .pipe(
  //       catchError((err: HttpErrorResponse) => {
  //         console.log(err.statusText);
  //         return (this.heroes = prevData);
  //       })
  //     )
  //     .subscribe();
  // }

  onSave() {
    this.isLoading = true;
    this.heroService.postHero(this.itemForm.value).subscribe(
      data => this.heroes.push(data),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.message);
      },
      () => {
        this.isLoading = false;
        this.itemForm.reset();
      }
    );
  }

  onUpdate() {
    const hero = this.editedForm.value;
    this.isLoading = true;
    this.heroService.putHero(hero).subscribe(
      () => {
        const index = this.heroes.findIndex(h => h.id === hero.id);
        this.heroes[index] = hero;
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.statusText);
      },
      () => (this.isLoading = false)
    );
  }

  goToHeroDetail(id: string) {
    this.router.navigateByUrl("/heroes/hero-detail/" + id);
  }

  private formBuilderInit(): void {
    this.itemForm = this.fb.group({
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""]
    });

    this.editedForm = this.fb.group({
      id: [""],
      firstName: ["", [Validators.required, Validators.minLength(4)]],
      lastName: ["", [Validators.required, Validators.minLength(4)]],
      house: [""],
      knownAs: [""]
    });
  }
}
