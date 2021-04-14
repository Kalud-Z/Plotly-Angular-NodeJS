import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BinaryDataComponent } from './binary-data/binary-data.component';
import { PlotlyComponent } from './plotly/plotly.component';
import { RouterModule, Routes } from '@angular/router';
import { GetColorDirective } from './binary-data/get-color.directive';
import { HeatmapJSComponent } from './heatmap-js/heatmap-js.component';



const appRoutes: Routes = [
  { path: '', redirectTo: 'binary', pathMatch: 'full' },
  { path : 'binary' , component : BinaryDataComponent },
  { path : 'plotly' , component : PlotlyComponent },
  { path : 'heatmapjs' , component : HeatmapJSComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    BinaryDataComponent,
    PlotlyComponent,
    GetColorDirective,
    HeatmapJSComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
