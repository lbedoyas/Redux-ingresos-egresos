import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/app.reducer';
import * as ui from '../../shared/ui.actions';

import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  registroForm: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private router: Router,
              private store: Store<AppState>) { }

  ngOnInit() {

    this.registroForm = this.fb.group({
      nombre:   ['', Validators.required ],
      correo:   ['', [Validators.required, Validators.email ] ],
      password: ['', Validators.required ],
    });

    this.store.select('ui').subscribe((data) => {
      console.log(data);
      this.loading = data.isLoading;
    })

  }

  crearUsuario() {

    if ( this.registroForm.invalid ) { return; }

    this.store.dispatch(ui.isLoading())

    Swal.fire({
      title: 'Espere por favor',
      onBeforeOpen: () => {
        Swal.showLoading()
      }
    });




    const { nombre, correo, password } = this.registroForm.value;
    console.log(this.registroForm);


    this.authService.crearUsuario( nombre, correo, password )
      .then( credenciales => {
        console.log(credenciales);
        console.log('entro');


        Swal.close();
        
        this.router.navigate(['/']);
      })
      .catch( err => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        })
      });
  }

}
