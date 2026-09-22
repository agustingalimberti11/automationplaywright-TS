# language: es
Característica: Navegacion del menu de New Tours
  Como usuario
  Quiero usar el menu
  Para llegar a cada seccion

  Antecedentes:
    Dado que el usuario abre la home de New Tours

  @smoke
  Escenario: El menu REGISTER abre el formulario
    Cuando va al menu "REGISTER"
    Entonces el titulo de la pagina es "Register: Mercury Tours"
    Y el campo nombre del registro es visible

  @regresion
  Escenario: El menu Flights abre el buscador de vuelos
    Cuando va al menu "Flights"
    Entonces el titulo de la pagina es "Find a Flight: Mercury Tours:"
    Y el buscador de vuelos es visible

  @regresion
  Escenario: SUPPORT muestra la pagina en construccion
    Cuando va al menu "SUPPORT"
    Entonces el titulo de la pagina es "Under Construction: Mercury Tours"
