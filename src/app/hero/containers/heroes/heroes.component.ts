import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, throwError } from "rxjs";
import { Hero } from "../../hero.model";
import { HeroService } from "../../hero.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError, tap } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: "app-heroes",
  templateUrl: "./heroes.component.html",
  styleUrls: ["./heroes.component.css"]
})
export class HeroesComponent implements OnInit, OnDestroy {
  heroes: Hero[];
  isLoading: boolean = false;
  itemForm: FormGroup;
  editedForm: FormGroup;
  sub: Subscription;
  editingTracker: string = "0";

  constructor(
    private heroService: HeroService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.formBuilderInit();
    this.sub = this.heroService
      .getHeroes()
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.message);
        })
      )
      .subscribe(data => {
        this.heroes = data;
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  removeHero(id: string) {
    this.isLoading = true;
    this.sub = this.heroService
      .deleteHeroById(id)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.message);
        })
      )
      .subscribe(() => {
        this.heroes = this.heroes.filter(h => h.id !== id);
        this.isLoading = false;
      });
  }

  onSave() {
    this.isLoading = true;
    this.heroService
      .postHero(this.itemForm.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.message);
        })
      )
      .subscribe(data => {
        this.heroes.push(data);
        this.isLoading = false;
      });
  }

  onUpdate() {
    this.isLoading = true;
    this.heroService
      .putHero(this.editedForm.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(err.message);
        })
      )
      .subscribe(() => {
        const index = this.heroes.findIndex(
          h => h.id === this.editedForm.value.id
        );
        this.heroes[index] = this.editedForm.value;
        this.isLoading = false;
      });
  }

  goToHeroDetail(id: string) {
    this.router.navigateByUrl("/heroes/hero-detail/" + id);
  }

  private formBuilderInit(): void {
    this.itemForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      house: [""],
      knownAs: [""]
    });

    this.editedForm = this.fb.group({
      id: [""],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      house: [""],
      knownAs: [""]
    });
  }
}
