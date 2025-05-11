import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Cocktail } from '../../models/cocktail.model';
import { Router } from '@angular/router';
import { CocktailService } from '../../Shared/cocktail.service';
import { Subject, takeUntil } from 'rxjs';
import { Ingredient } from '../../models/ingredient.model';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-cocktail-table',
  standalone: false,
  templateUrl: './cocktail-table.component.html',
  styleUrl: './cocktail-table.component.css',
})
export class CocktailTableComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tooltip', { static: false }) tooltipRef!: ElementRef;
  // GENERACION DEL ALFABETO

  alphabet: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );

  // MANEJO DE SUBSCRIPCIONES
  private destroy$ = new Subject<void>();

  // VARAIABLES INICIO

  activeLetter: string = 'a';
  cocktails: Cocktail[] = [];
  cocktailsByCategory: Cocktail[] = [];
  alcoholicCount: number = 0;

  // VARIABLES MODALES

  showModal: boolean = false;
  showModalCategory: boolean = false;
  drinkId: string = '';

  // VARIABLES PAGINACION

  paginatedCocktails: Cocktail[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 10;

  // CONSTRUCTOR

  constructor(
    private router: Router,
    private cocktailService: CocktailService
  ) {}

  // CICLOS DE VIDA

  ngOnInit(): void {
    this.loadActiveLetter(this.activeLetter);
  }

  ngAfterViewInit(): void {
      this.adjustTooltipPosition();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // INCIO DEL COMPONENTE

  /**
   * Recibe la letra activa y realiza una llamada a la API
   * para obtener los cócteles que comienzan con esa letra.
   * A su vez, realiza otras funciones de lógica tanto para registrar las
   * bebidas alcohólicas como para la paginación.
   *
   * @param letter La letra activa
   */
  loadActiveLetter(letter: string): void {
    this.alcoholicCount = 0;
    this.activeLetter = letter;
    this.cocktailService
      .getCocktailByFirstLetter(letter)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        response.map((isAlcoholic: any) => {
          if (isAlcoholic.strAlcoholic === 'Alcoholic') {
            this.alcoholicCount++;
          }
        });
        this.cocktails = response;
        this.upadatePaginatedCocktails();
      });
  }

  // PAGINACION

  /**
   * Calcula los cócteles que se mostrarán por página.
   * Para eso startIndex recoge el primer valor de la página y endIndex el último valor.
   * Luego se hace un slice a la lista de cócteles para mostrar solo los que
   * corresponden a la página actual.
   */
  upadatePaginatedCocktails(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedCocktails = this.cocktails.slice(startIndex, endIndex);
  }

  /**
   * Comprueba que la siguiente página no supere el número total de páginas.
   * Si no lo supera, se incrementa la página actual y se actualizan los cócteles paginados.
   */
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
      this.upadatePaginatedCocktails();
    }
  }

  /**
   * Comprueba que la página anterior no sea menor a 1.
   * Si no lo es, se decrementa la página actual y se actualizan los cócteles paginados.
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.upadatePaginatedCocktails();
    }
  }

  /**
   * Calcula el número total de páginas que se pueden mostrar.
   * Para eso se divide el número total de cócteles entre el número de elementos por página.
   *
   * @returns El número total de páginas que se pueden mostrar.
   */
  totalPages(): number {
    return Math.ceil(this.cocktails.length / this.itemsPerPage);
  }

  // FILTROS

  /**
   * Cada vez que se introduce un valor en el input de búsqueda, se llama a esta función para
   * hacer una llamada a la API para obtener los cócteles que coincidan con el nombre.
   * Si el valor es vacía hay un guard para evitar que haga una petición vacía y devuelva
   * un error.
   *
   * @param event
   */
  onSearchByName(event: Event): void {
    const query = (event.target as HTMLInputElement).value.toLowerCase();
    if (query === '') {
      return;
    }
    this.alcoholicCount = 0;
    this.cocktailService
      .getCocktailByName(query)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: any) => {
        console.log(response);
        response.map((isAlcoholic: any) => {
          if (isAlcoholic.strAlcoholic === 'Alcoholic') {
            this.alcoholicCount++;
          }
        });
        this.cocktails = response;
        this.activeLetter = '';
        this.upadatePaginatedCocktails();
      });
  }

  /**
   * Se comprueba la longitud del array de ingredientes y se devuelve el número de ingredientes.
   *
   * @param cocktail El cóctel del que se quieren contar los ingredientes.
   * @returns La cantidad de ingredientes del cóctel.
   */
  countIngredients(cocktail: Cocktail): number {
    return this.getIngredients(cocktail).length;
  }

  /**
   * Llama a la funcion del servicio para obtener los ingredientes de un cóctel.
   *
   * @param cocktail El cóctel del que se quieren obtener los ingredientes.
   * @returns Los ingredientes y medidas del cóctel.
   */
  getIngredients(cocktail: Cocktail): Ingredient[] {
    return this.cocktailService.getIngredients(cocktail);
  }

  /**
   * Abre el modal de los ingredientes, para esto se comprueba el ID del cóctel
   * para evitar abrir uno distinto y se cambia el valor del modal a true.
   *
   * @param cocktail El cóctel del que se quiere abrir el modal.
   */
  opoenModal(cocktail: Cocktail): void {
    if (this.showModalCategory) return;
    this.showModal = true;
    this.drinkId = cocktail.idDrink;

    setTimeout(() => {
      this.adjustTooltipPosition();
    }, 50)
  }

  /**
   * Cierra el modal de los ingredientes, para esto se cambia el valor del modal a false
   * y se resetea el valor del ID del cóctel.
   */
  closeModal(): void {
    if (this.showModalCategory) return;
    this.showModal = false;
    this.drinkId = '';
  }

  /**
   * Comprueba la posicion del tooltip y ajusta su posición en la pantalla.
   */  
  private adjustTooltipPosition(): void {
    if (!this.tooltipRef) return;

    const tooltip = this.tooltipRef.nativeElement as HTMLElement;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Ajuste vertical
        if (tooltipRect.bottom > viewportHeight) {
          tooltip.style.top = 'auto';
          tooltip.style.bottom = '0%';
        } 
  }

  // CATEGORIAS

  /**
   * Maneja la lógica del evento para las categorías, permite abrir el modal de categorías
   * y a su vez obtiene el todos los cócteles de una categoría.
   *
   * @param cocktail El cóctel del que se quiere abrir el modal de categorías.
   */
  eventCategory(cocktail: Cocktail | any): void {
    this.getCategories(cocktail);
    this.drinkId = cocktail.idDrink;
    this.showModalCategory = true;
  }

  /**
   * Hace unaa llamada a la API para obtener los cócteles de una categoría.
   *
   * @param cocktail El cóctel del que se quieren obtener las categorías.
   */
  getCategories(cocktail: Cocktail | any): void {
    this.cocktailService
      .getCocktailsByCategory(cocktail.strCategory)
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
    this.drinkId = '';
  }

  /**
   * Comprueba la condición para abrir el modal de categorías.
   *
   * @param id El ID del cóctel que se quiere comprobar.
   * @returns Boolean, para abrir o cerrar el modal de categorías.
   */
  checkCategoryCondition(id: any): boolean {
    return this.showModalCategory && this.drinkId == id;
  }

  // CÓCTEL ALEATORIO

  /**
   * Llama al servicio para obtener un cocktail aleatorio y lo asigna a la variable cocktail.
   */
  getRandomCocktail(): void {
    this.cocktailService
      .getRandomCocktail()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cocktail: Cocktail) => {
        this.goToCocktailDetails(cocktail);
      });
  }

  // NAVEGACION

  /**
   * Navegación hacia los detalles del cóctel y guarda el cóctel seleccionado para su
   * posterior uso..
   *
   * @param cocktail El cóctel del que se quiere obtener el ID.
   */
  goToCocktailDetails(cocktail: Cocktail): void {
    this.cocktailService.setCocktail(cocktail);
    this.router.navigate(['/details', cocktail.idDrink]);
  }
}
