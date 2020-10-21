import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { Game } from '../../interfaces/interfaces';
import Swal from 'sweetalert2/dist/sweetalert2.js'

@Component({
  selector: 'app-goty',
  templateUrl: './goty.component.html',
  styleUrls: ['./goty.component.css']
})
export class GotyComponent implements OnInit {

  games: Game[] = [];
  constructor(
    private gameService:GameService
  ) { }

  ngOnInit(): void {

    this.gameService.getNominados().subscribe(res => {
      
      this.games = res;
      console.log(this.games);
    },
      error => {
        console.log(error);
        
      }
    );

  }

  votar(juego: Game) {
    this.gameService.votarJuego(juego).subscribe((res:any) => {
      
      if (res.ok) {
        Swal.fire('Gracias',res.mensaje,'success')
      } 
     

    }, err => {
        if(!err.ok){
          Swal.fire('Error',err.mensaje,'error')
        }
    });
  }

}
