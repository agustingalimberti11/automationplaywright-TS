# language: es
Característica: Busqueda de vuelos
  Como usuario
  Quiero buscar un vuelo
  Para ver disponibilidad

  @regresion
  Escenario: Se puede completar el buscador de vuelos
    Dado que el usuario abre el buscador de vuelos
    Entonces el titulo de la pagina es "Find a Flight: Mercury Tours:"
    Y el buscador de vuelos es visible
    Cuando busca un vuelo con:
      | tipo      | oneway           |
      | pasajeros | 2                |
      | origen    | London           |
      | mesIda    | 8                |
      | diaIda    | 15               |
      | destino   | Paris            |
      | mesVuelta | 8                |
      | diaVuelta | 20               |
      | clase     | Business         |
      | aerolinea | Unified Airlines |
    Entonces la url contiene "reservation2.php"
    Y ve el mensaje "After flight finder"
    Y ve el mensaje "No Seats Avaialble"
