import { Injectable } from '@angular/core';
import { ApiService } from '../../Private/apiService.service';
import { HttpParams } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { Cocktail } from '../../models/cocktail.model';

@Injectable()
export class CocktailTableService {
  constructor(private apiService: ApiService) {}

  public getCocktailByFirstLetter(letter: string) {
    return this.apiService
      .get('/search.php', new HttpParams().set('f', letter))
      .pipe(
        map((response: any) => {
          return response.drinks as Cocktail[];
        })
      );
  }

  public getCocktailByName(name: string) {
    const params = new HttpParams().set('s', name);
    return this.apiService.get('/search.php', params).pipe(
      tap((response: any) => {
        return response;
      })
    );
  }

  public getCocktailsByCategory(category: string): Observable<Cocktail[]> {
    return this.apiService
      .get('/filter.php', new HttpParams().set('c', category))
      .pipe(
        map((response: any) => {
          return response.drinks as Cocktail[];
        })
      );
  }
}
