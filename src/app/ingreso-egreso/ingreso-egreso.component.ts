import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit {

  ingresoForm: FormGroup;
  tipo: string = 'ingreso';

  constructor(private fb: FormBuilder) {

    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    })

  }

  ngOnInit() {
  }

  guardar(): void{
    if (this.ingresoForm.invalid) {
      return
    }
    console.log(this.ingresoForm);
    
  }

}
