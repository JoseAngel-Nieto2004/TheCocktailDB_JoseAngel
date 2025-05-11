import { Component, OnInit } from '@angular/core';
import { CocktailTableService } from './cocktail-table.service';
import { Cocktail } from '../../models/cocktail.model';

@Component({
  selector: 'app-cocktail-table',
  standalone: false,
  templateUrl: './cocktail-table.component.html',
  styleUrl: './cocktail-table.component.css',
})
export class CocktailTableComponent implements OnInit {
  
  // GENERACION DEL ALFABETO
  
  alphabet: string[] = Array.from({ length: 26 }, (_, i) =>
    String.fromCharCode(97 + i)
  );
  
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
    private cocktailTableService: CocktailTableService
  ) {}

  // CICLOS DE VIDA

  ngOnInit(): void {
    this.loadActiveLetter(this.activeLetter);
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
    this.cocktailTableService
      .getCocktailByFirstLetter(letter)
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
    this.cocktailTableService
      .getCocktailByName(query)
      .subscribe((response: any) => {
        this.cocktails = response.drinks;
        this.activeLetter = '';
      });
  }

  // INGREDIENTES

  /**
   * Loopea por todos los ingredientes de un cóctel y los devuelve en un array.
   * 
   * @param cocktail El cóctel del que se quieren obtener los ingredientes.
   * @returns string[] Un array con los ingredientes del cóctel.
   */
  getIngredients(cocktail: Cocktail | any): string[] {
    const ingredients: string[] = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = cocktail[`strIngredient${i}`];
      const measure = cocktail[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${ingredient} - ${measure}`);
      }
    }
    return ingredients;
  }

  /**
   * Se comprueba la longitud del array de ingredientes y se devuelve el número de ingredientes.
   * 
   * @param cocktail El cóctel del que se quieren contar los ingredientes.
   * @returns La cantidad de ingredientes del cóctel.
   */
  countIngredients(cocktail: Cocktail | any): number {
    return this.getIngredients(cocktail).length;
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
    this.cocktailTableService
      .getCocktailsByCategory(cocktail.strCategory)
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
}
