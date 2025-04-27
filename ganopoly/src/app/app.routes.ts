import { Routes } from '@angular/router';
import { GameComponent } from './game/game.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },  // Redirection vers "game" par défaut
  { path: 'game', component: GameComponent },            // Route vers le composant "Game"
  { path: '**', component: PageNotFoundComponent }       // Page 404 si la route n'est pas définie
];

