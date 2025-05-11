import { Routes } from "@angular/router";
import { LandingComponent } from "./landing.component";
import { CocktailTableComponent } from "./cocktail-table/cocktail-table.component";
import { CocktailDetailsComponent } from "./cocktail-details/cocktail-details.component";

export const landingRoutes: Routes = [
    {
        path: '',
        component: LandingComponent,
        children: [
            {
                path: '',
                component: CocktailTableComponent
            },
            {
                path: 'details/:id',
                component: CocktailDetailsComponent
            }
        ],
        data: { scrollPositionRestoration: 'disabled' }
    }
];