import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from 'src/app/app.reducer';
import { Usuario } from 'src/app/models/usuario.model';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  Usuario: Usuario = {
    nombre: '',
    email: '',
    uid: ''
  };


  constructor( private authService: AuthService,
               private router: Router,
               private store: Store<AppState>) { }

  ngOnInit() {
    this.initState();
  }

  ngOnDestroy(): void {
    this.userSubs.unsubscribe();
  }


  initState(){
    this.userSubs = this.store.select('user')
    .pipe(
      filter(({user})=> user != null)
    )
    .subscribe(({user}) => {
      console.log(user);
      this.Usuario = user;
    })
  }

  logout() {
    this.authService.logout().then( () => {
      this.router.navigate(['/login']);
    })

  }

}
