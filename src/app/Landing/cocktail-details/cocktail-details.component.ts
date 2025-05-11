import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CocktailService } from '../../Shared/cocktail.service';
import { Cocktail } from '../../models/cocktail.model';
import { Ingredient } from '../../models/ingredient.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cocktail-details',
  standalone: false,
  templateUrl: './cocktail-details.component.html',
  styleUrl: './cocktail-details.component.css',
})
export class CocktailDetailsComponent implements OnInit, OnDestroy {
  // MANEJO DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // IDIOMA

  selectedLanguage: string = 'ES';

  // VARIABLES INICIO

  cocktail: Cocktail | null = null;
  ingredients: Ingredient[] = [];

  // CATEGORIA

  showModalCategory: boolean = false;
  cocktailsByCategory: Cocktail[] = [];

  // CONSTRUCTOR

  constructor(private cocktailService: CocktailService) {}

  // CICLOS DE VIDA

  ngOnInit(): void {
    this.cocktail = this.cocktailService.getCocktail();

    if (!this.cocktail) {
      this.goBack();
    }

    this.ingredients = this.getIngredients();

    if (!this.cocktail?.strCategory) {
      this.cocktailService
        .getCocktailDetailsById(this.cocktail!.idDrink)
        .pipe(takeUntil(this.destroy$))
        .subscribe((cocktail: Cocktail) => {
          this.cocktail = cocktail;
          this.ingredients = this.getIngredients();
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.cocktailService.clearCocktail();
  }

  // ACTUALIZACIÓN CONTENIDO

  /**
   * Llama al servicio para obtener un cocktail aleatorio y lo asigna a la variable cocktail.
   */
  getRandomCocktail(): void {
    this.cocktailService
      .getRandomCocktail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cocktail: Cocktail) => {
        this.cocktail = cocktail;
        this.showModalCategory = false;
        this.ingredients = this.getIngredients();
      });
  }

  /**
   * Llama al servicio para obtener un cocktail aleatorio y lo asigna a la variable cocktail.
   */
  getCocktailById(id: string): void {
    this.cocktailService
      .getCocktailDetailsById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cocktail: Cocktail) => {
        this.cocktail = cocktail;
        this.showModalCategory = false;
        this.ingredients = this.getIngredients();
      });
  }

  // INGREDIENTES

  /**
   * Devuelve los ingredientes de un cocktail, o un array vacío si no hay ninguno.
   * Tiene un guard para evitar errores si el cocktail es null.
   *
   * @returns {Ingredient[]}
   */
  getIngredients(): Ingredient[] {
    if (!this.cocktail) {
      return [];
    }

    return this.cocktailService.getIngredients(this.cocktail);
  }

  // INSTRUCCIONES

  getInstructions(): string {
    return this.cocktail
      ? this.cocktail[`strInstructions${this.selectedLanguage}`]
      : 'Sin traducción';
  }

  // CATEGORIA

  /**
   * Maneja la lógica del evento para las categorías, permite abrir el modal de categorías
   * y a su vez obtiene el todos los cócteles de una categoría.
   */
  eventCategory(): void {
    this.getCategories();
    this.showModalCategory = true;
  }

  /**
   * Hace unaa llamada a la API para obtener los cócteles de una categoría.
   */
  getCategories(): void {
    this.cocktailService
      .getCocktailsByCategory(this.cocktail!.strCategory as string)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        this.cocktailsByCategory = response;
      });
  }

  /**
   * Cierra el modal de categorías, para esto se cambia el valor del modal a false
   * y se resetea el valor del ID del cóctel.
   */
  closeModalCategory(): void {
    this.showModalCategory = false;
  }

  /**
   * Comprueba la condición para abrir el modal de categorías.
   *
   * @returns Boolean, para abrir o cerrar el modal de categorías.
   */
  checkCategoryCondition(): boolean {
    return this.showModalCategory;
  }

  // NAVEGACION

  /**
   * Navega a la página anterior.
   */
  goBack(): void {
    window.history.back();
  }
}
