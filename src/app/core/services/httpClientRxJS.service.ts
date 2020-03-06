import { Injectable } from "@angular/core";

import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Hero } from "../../hero/hero.model";
import { environment } from "../../../environments/environment";

@Injectable()
export class HttpClientRxJSService {
  heroPath = environment.apiUrlBase + "heroes";

  constructor(private http: HttpClient) {}

  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroPath);
  }

  deleteHeroById(id: string): Observable<void> {
    return this.http.delete<void>(`${this.heroPath}/${id}`);
  }

  postHero(createdHero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroPath, createdHero);
  }

  putHero(updatedHero: Hero): Observable<void> {
    return this.http.put<void>(
      `${this.heroPath}/${updatedHero.id}`,
      updatedHero
    );
  }

  getHeroById(id: string): Observable<Hero> {
    return this.http.get<Hero>(`${this.heroPath}/${id}`);
  }
}
