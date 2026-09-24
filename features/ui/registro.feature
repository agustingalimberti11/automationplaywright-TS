# language: es
Característica: Registro de New Tours
  Como visitante
  Quiero crear una cuenta
  Para poder usar Mercury Tours

  @smoke
  Escenario: Se puede registrar un usuario nuevo
    Dado que el usuario abre la pagina de registro
    Cuando completa el registro con:
      | nombre        | Ana            |
      | apellido      | Tester         |
      | telefono      | 1144556677     |
      | mailContacto  | ana@mail.com   |
      | direccion     | Calle Falsa 123|
      | ciudad        | Buenos Aires   |
      | provincia     | CABA           |
      | codigoPostal  | 1001           |
      | pais          | ARGENTINA      |
      | usuario       | qa             |
      | clave         | Pass123!       |
    Entonces ve el mensaje "Thank you for registering"
    Y ve el nombre de usuario creado
