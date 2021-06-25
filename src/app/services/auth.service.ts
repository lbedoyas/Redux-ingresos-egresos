import { Injectable } from '@angular/core';

import 'firebase/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { map } from 'rxjs/operators';
import { Usuario } from '../models/usuario.model';
import { AppState } from '../app.reducer';
import { Store } from '@ngrx/store';
import * as authActions from '../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService  {

  userSubscripcion: Subscription;

  constructor( public auth: AngularFireAuth,
              private firestore: AngularFirestore,
              private store: Store<AppState>) { }

  initAuthListener() {

    this.auth.authState.subscribe( fuser => {
      //console.log( fuser );
      console.log( fuser );
      //console.log( fuser?.email );
      if (fuser) {

        this.userSubscripcion = this.firestore.doc(`${fuser.uid}/usuario`)
        .valueChanges().subscribe(
          (fireStoreUser: any) =>{
            const user = Usuario.fromFirebase(fireStoreUser);
            this.store.dispatch(authActions.setUser({user}))
            console.log(fireStoreUser)
          }  
        )
      }else{
        this.userSubscripcion.unsubscribe();
        this.store.dispatch(authActions.unSetUser());
      }
    })

  }



  crearUsuario( nombre:string, email: string, password: string ) {
    console.log({ nombre, email, password });
    return this.auth.createUserWithEmailAndPassword( email, password )
            .then( ({ user }) => {
              console.log(user);
              const newUser = new Usuario( user.uid, nombre, user.email );
              console.log(newUser);
              let data = this.firestore.doc(`${ user.uid }/usuario`).set({ ...newUser });
              console.log(data);
              return data;
            });
  }

  loginUsuario( email:string, password:string) {
    return this.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }

}
