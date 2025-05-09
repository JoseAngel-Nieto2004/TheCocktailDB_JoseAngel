import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./Landing/landing.module').then(m => m.LandingModule)
    }
];
