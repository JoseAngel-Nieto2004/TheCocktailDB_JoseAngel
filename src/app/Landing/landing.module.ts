import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { landingRoutes } from './landing.routes';
import { ParallaxComponent } from './parallax/parallax.component';
import { CocktailTableComponent } from './cocktail-table/cocktail-table.component';
import { CocktailTableService } from './cocktail-table/cocktail-table.service';
import { CommonModule } from '@angular/common';


@NgModule({
  declarations: [
    LandingComponent,
    ParallaxComponent,
    CocktailTableComponent
  ],
  imports: [
    RouterModule.forChild(landingRoutes),
    CommonModule
  ],
  providers: [
    CocktailTableService
  ]
})
export class LandingModule { }
