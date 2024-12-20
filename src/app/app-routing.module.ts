import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { routes } from './app.routes'; // Importuj definicję tras z pliku routes.ts

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Załaduj trasę w głównym module aplikacji
  exports: [RouterModule]                  // Udostępnij RouterModule w całej aplikacji
})
export class AppRoutingModule { }
