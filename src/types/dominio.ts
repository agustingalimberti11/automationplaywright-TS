export type DatosRegistro = {
  nombre: string;
  apellido: string;
  telefono: string;
  mailContacto: string;
  direccion: string;
  ciudad: string;
  provincia: string;
  codigoPostal: string;
  pais: string;
  usuario: string;
  clave: string;
};

export type DatosVuelo = {
  tipo: string;
  pasajeros: string;
  origen: string;
  mesIda: string;
  diaIda: string;
  destino: string;
  mesVuelta: string;
  diaVuelta: string;
  clase: string;
  aerolinea: string;
};
