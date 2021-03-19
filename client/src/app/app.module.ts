import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BinaryDataComponent } from './binary-data/binary-data.component';
import { PlotlyComponent } from './plotly/plotly.component';
import { RouterModule, Routes } from '@angular/router';
import { GetColorDirective } from './binary-data/get-color.directive';



const appRoutes: Routes = [
  { path: '', redirectTo: 'binary', pathMatch: 'full' },
  { path : 'binary' , component : BinaryDataComponent },
  { path : 'plotly' , component : PlotlyComponent },
];


@NgModule({
  declarations: [
    AppComponent,
    BinaryDataComponent,
    PlotlyComponent,
    GetColorDirective
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
