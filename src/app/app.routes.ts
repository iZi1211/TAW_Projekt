import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { LeaderboardComponent } from './components/leaderboard/leaderboard.component';
import { ScoreComponent } from './components/score/score.component';
import { AuthService } from './services/auth.service';
import { ActivateComponent } from './components/activate/activate.component';

export const routes: Routes = [

    { path: 'login', component:  LoginComponent},
    { path: 'home', component: HomeComponent},
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'register', component: RegisterComponent },
    { path: 'about', component: AboutComponent },
    { path: 'game', component: GameComponent },
    { path: 'leaderboard', component: LeaderboardComponent },
    { path: 'score', component: ScoreComponent},
    { path: 'activate', component: ActivateComponent}

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}