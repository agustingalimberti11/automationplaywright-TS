import { DataTable } from "playwright-bdd";
import { DatosRegistro, DatosVuelo } from "../types/dominio";

function requerido(datos: Record<string, string>, clave: string): string {
  const valor = datos[clave];
  if (valor === undefined || valor === "") {
    throw new Error(`Falta la columna: ${clave}`);
  }
  return valor;
}

export function datosRegistroDesdeTabla(tabla: DataTable): DatosRegistro {
  const datos = tabla.rowsHash();
  return {
    nombre: requerido(datos, "nombre"),
    apellido: requerido(datos, "apellido"),
    telefono: requerido(datos, "telefono"),
    mailContacto: requerido(datos, "mailContacto"),
    direccion: requerido(datos, "direccion"),
    ciudad: requerido(datos, "ciudad"),
    provincia: requerido(datos, "provincia"),
    codigoPostal: requerido(datos, "codigoPostal"),
    pais: requerido(datos, "pais"),
    usuario: requerido(datos, "usuario"),
    clave: requerido(datos, "clave"),
  };
}

export function datosVueloDesdeTabla(tabla: DataTable): DatosVuelo {
  const datos = tabla.rowsHash();
  return {
    tipo: requerido(datos, "tipo"),
    pasajeros: requerido(datos, "pasajeros"),
    origen: requerido(datos, "origen"),
    mesIda: requerido(datos, "mesIda"),
    diaIda: requerido(datos, "diaIda"),
    destino: requerido(datos, "destino"),
    mesVuelta: requerido(datos, "mesVuelta"),
    diaVuelta: requerido(datos, "diaVuelta"),
    clase: requerido(datos, "clase"),
    aerolinea: requerido(datos, "aerolinea"),
  };
}
