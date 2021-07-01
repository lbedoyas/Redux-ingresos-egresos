import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { AppState } from 'src/app/app.reducer';
import { IngresoEgreso } from 'src/app/models/ingreso-egrodo.model';
import { IngresoEgresoService } from 'src/app/services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: []
})
export class DetalleComponent implements OnInit, OnDestroy {

  ingresoEgresos: IngresoEgreso[] = [];
  ingresosSubs: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoServices: IngresoEgresoService) { }


  ngOnInit() {
    this.initState();
  }

  initState(): void {
    this.ingresosSubs = this.store.select('ingresoEgreso').subscribe(({items}) => {
      console.log(items)
      this.ingresoEgresos = items;
    })
  }

  ngOnDestroy(): void {
    this.ingresosSubs.unsubscribe();
  }


  borrar(uid: string){
    console.log(uid);
    this.ingresoEgresoServices.borrarIngresoEgreso(uid).then((resp) => {
      console.log(resp);
      Swal.fire('Borrado', 'Item Borrado', 'success')
    }).catch((err) => {
      Swal.fire('Error', err.message, 'error')
    })


  }
}
