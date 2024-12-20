import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameComponent } from './game.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('GameComponent', () => {
  let component: GameComponent;
  let fixture: ComponentFixture<GameComponent>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(() => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [GameComponent],
      providers: [
        { provide: Router, useValue: mockRouter }
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    component.lives = 3;
    component.score = 0;
    //component.tiles = component.generateTiles();
    fixture.detectChanges();
  });


  describe('ngOnInit', () => {
    it('should initialize with default values and start game timer', () => {
      // Act
      component.ngOnInit();

      // Assert
      expect(component.timer).toBe(60); 
      expect(component.lives).toBe(3); 
      expect(component.tiles.length).toBeGreaterThan(0);
    });


  });
/*
  describe('generateTiles', () => {
    it('should generate tiles correctly and shuffle images', () => {
      // Arrange
      const initialTileCount = component.tiles.length;

      // Act
      component.generateTiles();
      fixture.detectChanges();

      // Assert
      expect(component.tiles.length).toBeGreaterThan(0);
      expect(component.tiles.length).toBeGreaterThan(initialTileCount); // Tile count should increase due to shuffled images
    });
  });
*/
   /*
  describe('handleTilePress', () => {
 
    it('should flip the clicked tile and update score if matched', () => {
      // Arrange
      const firstTileId = 0;
      const secondTileId = 1;
      const initialScore = component.score;

      // Act
      component.handleTilePress(firstTileId);
      component.handleTilePress(secondTileId);

      // Assert
      expect(component.score).toBeGreaterThan(initialScore); 
    });

    it('should reset unmatched tiles and decrease lives when tiles do not match', () => {
      // Arrange
      const firstTileId = 0;
      const secondTileId = 1;
      const initialLives = component.lives;

      // Act
      component.handleTilePress(firstTileId);
      component.handleTilePress(secondTileId);

      // Assert
      expect(component.lives).toBeLessThan(initialLives); 
    });

  });
    */
   /*
  describe('startTimer', () => {
    
    it('should start the timer and count down to 0', (done) => {
        // Spy on window.history.state and mock it
        spyOnProperty(window.history, 'state', 'get').and.returnValue({ infiniteGameMode: false });
    
        // Arrange - Set a short timer for testing
        component.timer = 5;
        component.startTimer();
    
        // Act & Assert
        setTimeout(() => {
          expect(component.timer).toBeLessThan(5);  // Timer should decrease
          done();
        }, 1500);  // Allow 1.5 seconds for the timer to decrement
      });


    it('should end the game when the timer reaches 0', (done) => {
      // Arrange
      spyOn(component, 'gameOver');

      // Act
      component.timer = 1; // Set the timer to 1
      component.startTimer();
      setTimeout(() => {
        // Assert
        expect(component.gameOver).toHaveBeenCalled();
        done();
      }, 1500); // Check if gameOver is called after timer ends
    });
 
  });
  */

  describe('gameOver', () => {
    it('should navigate to the score page when game is over', () => {
        // Arrange
        spyOnProperty(window.history, 'state', 'get').and.returnValue({ infiniteGameMode: false });
        component.score = 10; 
    
        // Act
        component.gameOver();  
    
        // Assert
        expect(mockRouter.navigate).toHaveBeenCalledWith(['score'], { state: { score: component.score } });
      });
  });


  describe('checkForWin', () => {
    it('should call gameOver if all tiles are matched in non-infinite mode', () => {
      // Arrange
      const initialScore = component.score;
      spyOn(component, 'gameOver');

     
      component.tiles = component.tiles.map(tile => ({
        ...tile,
        matched: true,
      }));

      // Act
      component.checkForWin();

      // Assert
      expect(component.gameOver).toHaveBeenCalled();
    });


  });
  

});
