# language: es
Característica: Login de New Tours
  Como usuario de Mercury Tours
  Quiero iniciar sesion
  Para acceder a las reservas

  @smoke
  Escenario: La home muestra el formulario de login
    Cuando el usuario abre la home de New Tours
    Entonces el titulo de la pagina es "Welcome: Mercury Tours"
    Y el formulario de login es visible
    Y el menu muestra el enlace "REGISTER"

  @smoke
  Escenario: Usuario valido inicia sesion
    Dado que el usuario abre la home de New Tours
    Cuando inicia sesion con el usuario de demo
    Entonces ve el mensaje "Login Successfully"
    Y el menu muestra el enlace "SIGN-OFF"

  @regresion
  Escenario: Usuario invalido no entra
    Dado que el usuario abre la home de New Tours
    Cuando inicia sesion con "usuario-falso" y "clave-falsa"
    Entonces ve el mensaje "Enter your userName and password correct"
