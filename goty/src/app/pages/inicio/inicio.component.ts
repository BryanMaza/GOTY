import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { firestore } from 'firebase';
 
import { map } from 'rxjs/operators';
import { Game } from '../../interfaces/interfaces';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  games: any[] = [];
  constructor(
   private  firestore: AngularFirestore
  ) {
    
  }

  ngOnInit(): void {
    this.firestore.collection('goty').valueChanges().pipe(map((res: Game[]) => {
      return res.map(({ name, votos }) => ({
        name,value:votos
      }))
    })).subscribe(res => {
      this.games = res;
      
    });
  }

}
