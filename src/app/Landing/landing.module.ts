import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LandingComponent } from './landing.component';
import { landingRoutes } from './landing.routes';

@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(landingRoutes)
  ]
})
export class LandingModule { }
