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
