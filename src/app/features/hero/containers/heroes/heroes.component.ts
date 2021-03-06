import { Component, OnInit, OnDestroy } from "@angular/core";
import { Hero } from "../../hero.model";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { HttpClientRxJSService } from "../../../../core/services/httpClientRxJS.service";
import { SubSink } from "subsink";
import { catchError } from "rxjs/operators";

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
  editingTracker = "0";

  private subs = new SubSink();

  constructor(
    private dataService: HttpClientRxJSService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.formBuilderInit();
    this.fetchHeroes();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fetchHeroes() {
    this.isLoading = true;
    this.subs.sink = this.dataService.getHeroes().subscribe(
      data => (this.heroes = data),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.statusText);
      },
      () => (this.isLoading = false)
    );
  }

  removeHero(id: string) {
    this.isLoading = true;
    this.subs.sink = this.dataService.deleteHeroById(id).subscribe(
      () => (this.heroes = this.heroes.filter(h => h.id !== id)),
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        console.log(err.message);
      },
      () => (this.isLoading = false)
    );
  }

  // removeHeroById(id: string) {
  //   const prevData: Hero[] = [...this.heroes];
  //   this.heroes = this.heroes.filter(h => h.id !== id);
  //   this.subs.sink = this.dataService
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
    this.subs.sink = this.dataService.postHero(this.itemForm.value).subscribe(
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
    this.subs.sink = this.dataService.putHero(hero).subscribe(
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
