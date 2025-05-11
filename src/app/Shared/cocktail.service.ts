import { Injectable } from '@angular/core';
import { Cocktail } from '../models/cocktail.model';
import { ApiService } from '../Private/apiService.service';
import { map, Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@Injectable()
export class CocktailService {
  private selectedCocktail: Cocktail | null = null;

  constructor(private apiService: ApiService) {}

  /**
   * Guarda el cóctel seleccionado en el servicio para su uso posterior.
   *
   * @param cocktail El cóctel que se quiere guardar en el servicio.
   */
  setCocktail(cocktail: Cocktail) {
    this.selectedCocktail = cocktail;
  }

  /**
   * Obtiene el cóctel guardado en el servicio.
   *
   * @returns Cocktail | null
   */
  getCocktail(): Cocktail | null {
    return this.selectedCocktail;
  }

  /**
   * Elimina el cóctel seleccionado para liberar memoria.
   */
  clearCocktail() {
    this.selectedCocktail = null;
  }

  // INGREDIENTES

  /**
   * Loopea por todos los ingredientes de un cóctel y los devuelve en un array.
   *
   * @param cocktail El cóctel del que se quieren obtener los ingredientes.
   * @returns string[] Un array con los ingredientes del cóctel.
   */
  getIngredients(cocktail: Cocktail | any): any[] {
    const ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push({
          name: ingredient,
          measure: measure || 'Al gusto',
          strThumb: this.apiService.getIngredientThumbUrl(ingredient) || '',
        });
      }
    }
    return ingredients;
  }

  // LLAMADAS A LA API

  /**
   * Petición que busca por la primera letra del nombre
   *
   * @param letter Letra inicial del cóctel que se quiere buscar.
   * @returns Cocktail[]
   */
  public getCocktailByFirstLetter(letter: string): Observable<Cocktail[]> {
    return this.apiService
      .get('/search.php', new HttpParams().set('f', letter))
      .pipe(
        map((response: any) => {
          return response.drinks as Cocktail[];
        })
      );
  }

  /**
   * Petición que busca por el nombre del cóctel.
   *
   * @param name
   * @returns Observable<Cocktail[]>
   */
  public getCocktailByName(name: string): Observable<Cocktail[]> {
    const params = new HttpParams().set('s', name);
    return this.apiService.get('/search.php', params).pipe(
      map((response: any) => {
        return response.drinks as Cocktail[];
      })
    );
  }

  /**
   * Petición que busca por la categoría del cóctel.
   *
   * @param category
   * @returns Observable<Cocktail[]>
   */
  public getCocktailsByCategory(category: string): Observable<Cocktail[]> {
    return this.apiService
      .get('/filter.php', new HttpParams().set('c', category))
      .pipe(
        map((response: any) => {
          return response.drinks as Cocktail[];
        })
      );
  }

  /**
   * Petición que busca por el ID del cóctel.
   *
   * @param id
   * @returns Observable<Cocktail>
   */
  public getCocktailDetailsById(id: string): Observable<Cocktail> {
    return this.apiService
      .get('/lookup.php', new HttpParams().set('i', id))
      .pipe(
        map((response: any) => {
          return response.drinks[0] as Cocktail;
        })
      );
  }

  /**
   * Petición que busca un cóctel aleatorio.
   *
   * @returns Observable<Cocktail>
   */
  public getRandomCocktail(): Observable<Cocktail> {
    return this.apiService.get('/random.php').pipe(
      map((response: any) => {
        return response.drinks[0] as Cocktail;
      })
    );
  }
}
