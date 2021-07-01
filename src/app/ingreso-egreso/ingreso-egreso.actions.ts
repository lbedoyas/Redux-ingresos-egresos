import { createAction, props } from "@ngrx/store";
import { IngresoEgreso } from "../models/ingreso-egrodo.model";

export const setItems = createAction(
  '[IngresoEgreso] set Items',
  props<{items: IngresoEgreso[]}>()
  );



export const unSetItems = createAction('[IngresoEgreso] Unset Items');
