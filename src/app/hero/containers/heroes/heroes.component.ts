import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, throwError } from "rxjs";
import { Hero } from "../../hero.model";
import { HeroService } from "../../hero.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { catchError } from "rxjs/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";

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
    private heroService: HeroService,
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
    (this.sub = this.heroService
      .deleteHeroById(id)
      .subscribe(() => (this.heroes = this.heroes.filter(h => h.id !== id)))),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.message);
      },
      () => (this.isLoading = false);
  }

  onSave() {
    this.isLoading = true;
    this.heroService
      .postHero(this.itemForm.value)
      .pipe()
      .subscribe(
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
    this.isLoading = true;
    this.heroService.putHero(this.editedForm.value).subscribe(() => {
      const index = this.heroes.findIndex(
        h => h.id === this.editedForm.value.id
      );
      this.heroes[index] = this.editedForm.value;
    }),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.statusText);
      },
      () => (this.isLoading = false);
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
