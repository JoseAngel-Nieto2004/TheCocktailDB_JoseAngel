import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { RouterModule } from '@angular/router';
import { landingRoutes } from './landing.routes';
import { ParallaxComponent } from './parallax/parallax.component';


@NgModule({
  declarations: [
    LandingComponent,
    ParallaxComponent
  ],
  imports: [
    RouterModule.forChild(landingRoutes)
  ],
  providers: []
})
export class LandingModule { }
