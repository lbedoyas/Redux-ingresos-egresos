import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { IngresoEgreso } from '../models/ingreso-egrodo.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  constructor(private fireStore: AngularFirestore,
              private authService: AuthService) { }


  crearIngresoEgreso(ingresoEgreso: IngresoEgreso){
    const uid = this.authService.user.uid;

    delete ingresoEgreso.uid;

    return this.fireStore.doc(`${uid}/ingresos-egresos`)
    .collection('items')
    .add({...ingresoEgreso})
    // .then((ref) => {
    //   console.log('exito!!!' , ref)
    // }).catch(err => console.warn(err));
  }


  initIngresoEgresosListener(uid: string){
    return this.fireStore.collection(`${uid}/ingresos-egresos/items`)
    .snapshotChanges().pipe(
      map(snapshot => {
        console.log(snapshot);
        return snapshot.map(doc => {
          console.log(doc.payload.doc.data());
          // {} significa que es tipo object
          const data: {} = doc.payload.doc.data();

          return {
            uid: doc.payload.doc.id,
            ...data
          }
        })

      })
    )
    //.subscribe(data => console.log(data));
  }


  borrarIngresoEgreso(uidItem: string){
    const uid = this.authService.user.uid;
    console.log(`/${uid}/ingresos-egresos/${uidItem}`);
    return this.fireStore.doc(`/${uid}/ingresos-egresos/items/${uidItem}`).delete();
  }


}
