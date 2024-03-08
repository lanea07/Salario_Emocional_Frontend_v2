# <span style="color:#C8102E">Salario Emocional Frontend</span>

#### Interfaz front para seguimiento de los beneficios de Salario Emocional.

### Contenido
  - [Acerca](#acerca)
  - [Instalación](#instalación)

### Acerca
El programa de salario emocional consiste en un conjunto de beneficios que pueden ser utilizados por los colaboradores de la organización, quienes pueden registrar estos beneficios a través de la aplicación de Salario Emocional. Este componente corresponde a la aplicación frontend de la aplicación. La parte de la API de la aplicación puede encontrarse a través del repositorio Github [`Salario_Emocional_Backend`](https://github.com/lanea07/Salario_Emocional_Backend).

### Instalación
El frontend del salario emocional está basado en el framework Angular. Todos los paquetes necesarios están listados en el archivo `package.json`. Para instalarlos ejecute el comando

> npm install

Luego, se debe generar la distribución final del proyecto a través del comando

> ng build

##### Consideraciones pre-instalación :warning:
El proyecto trabaja de la mano con su parte backend la cuál provee la API a través de las url configuradas en el archivo `.env`. Una vez instalado y configurado el backend, se debe configurar las rutas correspondientes en el archivo de variables del frontend previo a ejecutar el comando `ng build` ya que una vez generado el proyecto las variables son incluidas en la distribución y no son tomadas aunque se modifique el archivo .env.