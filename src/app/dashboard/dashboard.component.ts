import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AppState } from '../app.reducer';
import { setItems } from '../ingreso-egreso/ingreso-egreso.actions';
import { IngresoEgresoService } from '../services/ingreso-egreso.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit, OnDestroy {

  userSubs: Subscription;
  ingresosEgresosSubs: Subscription;

  constructor(private store: Store<AppState>,
              private ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.initState();
  }

  initState(){
    this.userSubs = this.store.select('user')
    .pipe(
      filter(auth => auth.user != null)
    )
    .subscribe(({user})=> {
      console.log(user);
      this.ingresosEgresosSubs = this.ingresoEgresoService.initIngresoEgresosListener(user.uid)
        .subscribe((ingresosEgresosFB: any) => {
        console.log(ingresosEgresosFB);

        this.store.dispatch( setItems({items: ingresosEgresosFB}) )

      })
    })
  }


  ngOnDestroy(): void {
  this.userSubs.unsubscribe();
  this.ingresosEgresosSubs.unsubscribe();
  }

}
