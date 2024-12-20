import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

const animalImages = [
  '/Imgs/bear.jpg',
  '/Imgs/bird.jpg',
  '/Imgs/cat.jpg',
  '/Imgs/chinchilla.jpg',
  '/Imgs/dog.jpg',
  '/Imgs/elephant.jpg',
  '/Imgs/kangaroo.jpg',
  '/Imgs/sealion.jpg',
  '/Imgs/shark.jpg',
  '/Imgs/whale.jpg'
];



@Component({
  selector: 'app-game',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})




export class GameComponent implements OnInit, OnDestroy {
  score: number = 0;
  timer: number = 60;  // Domyślny czas
  lives: number = 3; // Liczba żyć
  tiles: any[] = [];
  infiniteGameMode: boolean = false;
  gameInterval: any;

  backImg: string = '/Imgs/zoo.jpg';   // Tło obrazka na kafelek

  // Inicjacja obrazu za kafelkami
  constructor(private router: Router) {}

  ngOnInit(): void {
   // this.infiniteGameMode = history.state.infiniteGameMode || false; // Możliwość odczytania trybu w nieskończoność
    this.generateTiles();
    this.startTimer();
  }

  ngOnDestroy(): void {
    
    clearInterval(this.gameInterval);
  }

  
  generateTiles(): void {
    const animalImagesCopy = [...animalImages, ...animalImages]; // Podwajamy liczbę obrazków
    const shuffledImages = this.shuffleArray(animalImagesCopy); // Potasowanie obrazków
    this.tiles = shuffledImages.map((image, index) => ({
      id: index,
      image,
      isFlipped: false,
      matched: false,
    }));
  }

  
  shuffleArray(array: any[]): any[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  
  handleTilePress(id: number): void {
    const flippedTiles = this.tiles.filter(tile => tile.isFlipped && !tile.matched);
    const currentTile = this.tiles.find(tile => tile.id === id);

    if (flippedTiles.length === 0) {
      this.flipTile(id);
    } else if (flippedTiles.length === 1) {
      const matchingTile = flippedTiles[0];

      if (currentTile.image === matchingTile.image) {
        // Dopasowanie kafelków
        this.updateMatchedTiles(id, matchingTile.id);
        this.score++;
      } else {
        this.flipTile(id);
        setTimeout(() => {
          this.resetUnmatchedTiles(id, matchingTile.id);
          this.lives--;
          if (this.lives <= 0) {
            this.gameOver();
          }
        }, 1000);
      }
    }

    this.checkForWin();
  }

  flipTile(id: number): void {
    this.tiles = this.tiles.map(tile => 
      tile.id === id ? { ...tile, isFlipped: true } : tile
    );
  }

  updateMatchedTiles(id1: number, id2: number): void {
    this.tiles = this.tiles.map(tile =>
      tile.id === id1 || tile.id === id2
        ? { ...tile, isFlipped: true, matched: true }
        : tile
    );
  }

  resetUnmatchedTiles(id1: number, id2: number): void {
    this.tiles = this.tiles.map(tile =>
      (tile.id === id1 || tile.id === id2) && !tile.matched
        ? { ...tile, isFlipped: false }
        : tile
    );
  }

  checkForWin(): void {
    const matchedPairs = this.tiles.filter(tile => tile.matched).length / 2;
    if (matchedPairs === animalImages.length) {
      if (this.infiniteGameMode) {
        this.lives += 3;
        this.generateTiles();
      } else {
        this.gameOver();
      }
    }
  }

  
  startTimer(): void {
    this.gameInterval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.gameInterval);
        this.gameOver();
      }
    }, 1000);
  }

  gameOver(): void {
    console.log('Game Over - Final Score:', this.score); 
    this.router.navigate(['score'], { state: { score: this.score } });
  }
}
