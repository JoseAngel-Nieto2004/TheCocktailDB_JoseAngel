import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { landingRoutes } from './landing.routes';
import { ParallaxComponent } from './parallax/parallax.component';
import { CocktailTableComponent } from './cocktail-table/cocktail-table.component';
import { CocktailTableService } from './cocktail-table/cocktail-table.service';
import { CommonModule } from '@angular/common';
import { CocktailDetailsComponent } from './cocktail-details/cocktail-details.component';
import { CocktailService } from '../Shared/cocktail.service';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    LandingComponent,
    ParallaxComponent,
    CocktailTableComponent,
    CocktailDetailsComponent
  ],
  imports: [
    RouterModule.forChild(landingRoutes),
    CommonModule,
    FormsModule,
    
  ],
  providers: [
    CocktailTableService,
    CocktailService
  ]
})
export class LandingModule { }
