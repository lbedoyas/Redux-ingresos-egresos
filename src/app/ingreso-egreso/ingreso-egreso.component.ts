import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from '../models/ingreso-egrodo.model';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';
  cargando: boolean = false;
  loadingSubs: Subscription;

  constructor(private fb: FormBuilder,
              private ingresoEgresoService: IngresoEgresoService,
              private store: Store<AppState>) {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    })

  }

  ngOnInit() {
    this.initState();
  }


  ngOnDestroy(): void {
    this.loadingSubs.unsubscribe();
  }


  initState(){
    this.loadingSubs = this.store.select('ui')
                      .subscribe(({isLoading})=> this.cargando = isLoading);
  }

  guardar(): void{

    if (this.ingresoForm.invalid) {
      return
    }
    console.log(this.ingresoForm);
    console.log(this.tipo);



    this.store.dispatch( ui.isLoading() );

    const {descripcion, monto} = this.ingresoForm.value;

    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);

    this.ingresoEgresoService.crearIngresoEgreso(ingresoEgreso).then((ref) => {
      //console.log('exito!!!' , ref)
      this.ingresoForm.reset();
      Swal.fire('Registro creado', descripcion, 'success');
      this.store.dispatch(ui.stopLoading());
    })
    .catch((err) => {
      console.warn(err)
      Swal.fire('Error', err.message, 'error');
      this.store.dispatch(ui.stopLoading());
    });


  }

}
