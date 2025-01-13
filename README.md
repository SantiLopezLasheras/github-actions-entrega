<img src="https://img.shields.io/badge/tested%20with-Cypress-04C38E.svg" />
# Introducción teórica

En esta práctica vamos a trabajar con GitHub Actions. Antes de empezar, tenemos que conocer qué engloban las siglas CI/CD.

## ¿Qué es CI/CD?

<img src="/assets/images/image2.png" width="500" />

Son las siglas de integración continua y distribución y despliegue continuos y representan los siguientes 3 conceptos:

- Continuous Integration (CI)

  En el proceso de desarrollo de software, los desarrolladores se enfrentan a la tarea diaria de integrar el código que están escribiendo (por ejemplo, nuevas features, correciones de errores, etc.) en un repositorio compartido con el resto del equipo. Con cada integración de nuevo código en el repositorio, se ejecutan tests para detectar errores en el código (por ejemplo, pruebas de linter y tests de la funcionalidad del código) y ayudar así en la detección de errores en una etapa temprana que permite una corrección rápida de errores y problemas. Esta tarea que es bastante frecuente resta tiempo a los desarrolladores para dedicar a tareas más importantes.

- Continuous Delivery (CD)

  Se trata del proceso que se asegura de que el código integrado en un repositorio esté listo para ser implementado en producción. Cada vez que se produce una integración de código y se realizan con éxito los tests de la fase de CI, el proceso de CD prepara y deja el código en un estado listo para ser desplegado, de manera que los desarrolladores puedan liberar nuevas versiones con mayor rapidez.

- Continuous Deployment (CD)

  La fase de continuous delivery prepara el código y lo deja listo para el despliegue, pero lo despliega automáticamente. El proceso de continuous deployment es una práctica avanzada del continuous delivery que se encarga de desplegar automáticamente cada integración de código que haya sido verificada y validada en las fases anteriores (CI y CD).

## ¿Qué es GitHub Actions?

<img src="/assets/images/image1.png" width="500" />

GitHub Actions es una plataforma que nos ofrece GitHub para automatizar las fases de integración y despliegue continuos (CI/CD) de nuestro proyecto. Gracias a esta plataforma, podemos crear archivos personalizados para automatizar nuestras pruebas del código (linting, testing), la compilación y el despliegue del mismo.

### GitHub Actions realiza la automatización gracias a los siguientes componentes:

- workflow

  Se trata de un procedimiento (workflow) automatizado que agregamos a nuestro repositorio y que contiene una lista de instrucciones (jobs) para que la plataforma de GitHub Actions realice la automatización de CI/CD. Los workflow se activan mediante un evento que nosotros le indiquemos, por ejemplo, cuando hagamos un push a una determinada rama de nuestro repositorio.

- Jobs

  Es cada una de las instrucciones de nuestro workflow y que contiene una serie de pasos o steps a realizar. Por defecto, los jobs de un workflow se ejecutan en paralelo, pero podemos indicar que se ejecuten uno después de otro mediante la directiva requires.

- Steps

  Se trata de cada tarea individual que se ejecuta dentro un un job. Los steps pueden ser dos tipos, o bien un action (por ejemplo uses: actions/checkout@v4), o bien un comando shell (por ejemplo sh “npm install”).

- Actions

  Las actions son comandos independientes formados por steps. Se trata del bloque de construcción portátil más pequeño de un flujo de trabajo. En GitHub Actions encontramos diversas actions ya disponibles para hacer uso de ellas (por ejemplo, Actions/checkout@v4), pero también podemos crear nuestras actions personalizadas en una carpeta actions y utilizarlas en nuestro workflow.

- Runner

  Se trata del servidor que tiene instalada la aplicación de ejecución de GitHub actions

A la hora de crear nuestro workflow, deberemos crear un archivo con el nombre de nuestro workflow y almacenarlo en la carpeta .github/workflows de nuestro repositorio. Es importante que nuestro workflow sea un fichero .yml que utilice la sintaxis YAML

## Para la práctica se requiere:

- Linter_job
  - se encargará de ejecutar el linter del proyecto para verificar la sintaxis utilizada
  - si existen errores, se deberán corregir hasta que el linter se ejecute sin problemas
- Cypress_job
  - se encargará de ejecutar los tests de cypress que contiene el proyecto mediante la action oficial de Cypress
  - Estará compuesto de los siguientes steps:
    - checkout del código
    - ejecución de tests cypress que continuará también en caso de error
    - creación de un artefacto (result.txt) con el output del step anterior
- Add_badge_job
  - se encargará de publicar en el README.md del proyecto una insignia que indicará el resultado de los tests cypress
  - Estará compuesto de los siguientes steps:
    - checkout del código
    - obtención de los artefactos almacenados en el job anterior
    - generación de un output a partir de la lectura del artefacto anterior (result.txt)
    - action personalizada que recibirá el output anterior como parámetro de entrada(‘failure’ o ‘success’) y modificará el REAMDE.md
    - publicación del README.md en el repositorio
- Deploy_job
  - se encargará de desplegar el código en la plataforma de Vercel utilizando la action amondnet/vercel-action@v20
  - se ejecutará después del Cypress_job y estará compuesto por los siguientes steps:
    - checkout del código
    - despliegue de la aplicación en Vercel
- Notification_job
  - se encargará de enviar una notificación al usuario
    - destinatario: correo electrónico del usuario
    - asunto: resultado del workflow ejecutado
    - cuerpo del mensaje
      - nombre del contenedor: backend_contenidor
      - utilizará la imagen php:8.1-alpine
      - arrancará una vez el servicio de MySQL esté disponible (wait-for-it)
- Configuration_readme_job
  - se encargará de configurar el readme personal mediante una action que mostrará una métrica de los lenguajes más utilizados en los proyectos de nuestro perfil de GitHub.

# Documentación de la práctica

## Introducción

Partiendo del proyecto de Next.js del repositorio https://github.com/antoni-gimenez/nodejs-blog-practica.git, he creado un nuevo repositorio en mi cuenta de GitHub donde he clonado el proyecto.

<img src="/assets/images/image5.png" width="500" />

<img src="/assets/images/image6.png" width="500" />

El siguiente paso ha sido crear una carpeta .github/workflows con un archivo main_workflow.yml dentro, que será donde escribiré las instrucciones para Github Actions

<img src="/assets/images/image7.png" width="500" />

Está configurado para que se ejecute cada vez que se haga un push a la rama main:

<img src="/assets/images/image8.png" width="500" />

## Linter_job

Dentro del archivo main_workflow.yml he establecido los diferentes jobs necesarios para la práctica.

Para el linting, se ha utilizado el linter que viene instalado: "eslint-config-next": "12.0.7".

El comando para realizar el linting es "npm run lint", como viene especificado en el package.json.

<img src="/assets/images/image9.png" width="500" />

La configuración del Linter_job es la siguiente:

<img src="/assets/images/image10.png" width="500" />

- El comando runs-on indica que funcionará en una máquina de Ubuntu
- Cuenta con los siguientes steps:
  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Setup node version - utiliza la action actions/setup-node@v3 para establece la versión de Nodejs 20
  - Step 3: Instalación de dependencias necesarias (incluidas en el package.json) mediante el comando npm install
  - Step 4: Ejecuta el linter con el comando npm run lint

Hacemos commit de los cambios hasta ahora.

<img src="/assets/images/image11.png" width="500" />

En este paso, el linter nos lanza varios errores, que tendremos que corregir.

<img src="/assets/images/image12.png" width="500" />

Una vez corregidos los errores, hacemos commit y push al repositorio.

<img src="/assets/images/image13.png" width="500" />

Vemos que el linter ya no nos da más errores y el workflow termina con éxito.

<img src="/assets/images/image14.png" width="500" />

<img src="/assets/images/image15.png" width="500" />

## Cypress_job

Para los tests, vamos a utilizar Cypress, que correrá también en Ubuntu e indicaremos que necesita que termine el job anterior antes de ejecutarse mediante la keyword needs.

<img src="/assets/images/image16.png" width="500" />

- Cuenta con los siguientes steps:

  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Setup node version - utiliza la action actions/setup-node@v3 para establece la versión de Nodejs 20
  - Step 3: Instalación de dependencias necesarias mediante el comando npm install

  <img src="/assets/images/image17.png" width="500" />

  - Step 4: Ejecución de los tests de Cypress utilizando la action cypress-io/github-action@v6, para lo que primero haremos un build (npm run build) y arrancaremos el proyecto (npm start) para que se puedan realizar los tests.
    En caso de error en este job, indicamos a GitHub que continue al siguiente job mediante continue-on-error.
  - Step 5: Creación de un artefacto con los resultados de los test, para lo cual creamos una carpeta primero (mkdir -p artifacts) y después guardamos el resultado en un archivo texto result.txt con el comando echo
  - Step 6: Upload del artefacto - subimor el artefacto creado para poder descargarlo en próximo job. Utilizamos la action actions/upload-artifact@v4

  <img src="/assets/images/image18.png" width="500" />

  Al pasar los tests de cypress, en GitHub Actions veremos el siguiente mensaje:
  <img src="/assets/images/image40.png" width="500" />

## Add_badge_job

En este paso, queremos publicar en el README.md del proyecto una badge que dependerá del resultado del test del paso anterior (success o failure).

También necesitará que termine el job anterior (needs: Cypress_job) y correrá en Ubuntu (runs-on: ubuntu-latest).

<img src="/assets/images/image19.png" width="500" />

- Cuenta con los siguientes steps:

  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Obtención del artefacto del Cypress_job con el resultado del test - utiliza la action actions/download-artifact@v4 para descargarse el artefacto
  - Step 3: Probamos que se haya descargado el artifact listando los archivos
  - Step 4: Instalación de dependencias necesarias mediante el comando npm install

  <img src="/assets/images/image20.png" width="500" />

  - Step 4: Leer el contenido del artefacto con el comando run: echo "::set-output name=resultado::$resultado"
  - Step 5: Generación del output con una custom action que hemos creado y que se encuentra en la carpeta ./.github/actions/badges (uses: ./.github/actions/badges) a la cual le pasamos el resultado del artefacto que hemos leído en el step anterior (resultado: ${{ steps.resultado_artefacto.outputs.resultado }})
  - Step 6: Commit and Push Changes para actualizar el README.md del repositorio con la badge creada

  <img src="/assets/images/image21.png" width="500" />

  He creado una carpeta badges para albergar el código de la action.yml y del index.js

  <img src="/assets/images/image22.png" width="500" />

  El contenido de la custom action es el siguiente:

  <img src="/assets/images/image23.png" width="500" />

  Y utiliza un archivo de JavaScript con el siguiente código:

  <img src="/assets/images/image24.png" width="500" />

  Para que el código del JavaScript funcione, he creado un archivo OldREADME.md en la raíz del proyecto.

  <img src="/assets/images/image25.png" width="500" />

## Deploy_Job

Finalmente, vamos a desplegar el proyecto en Vercel.

Primero tenemos que enlazar nuestro proyecto de Vercel mediante el CLI de Vercel, que nos crea una carpeta .vercel en el proyecto con el ORG_ID y el PROJECT_ID.

<img src="/assets/images/image26.png" width="500" />

Esto lo guardaremos junto al token personal de GitHub y el token de Vercel en los secrets del repositorio.

<img src="/assets/images/image27.png" width="500" />

- Cuenta con los siguientes steps:

  - Step 1: Checkout code - revisa el código del repositorio
  - Step 2: Creación del build a desplegar en Vercel mediante el comando npm install && npm run build

  <img src="/assets/images/image28.png" width="500" />

  - Step 3: Deploy Vercel - utilizamos la action de amondnet/vercel-action@v20 para desplegar la aplicación en Vercel. Para ellos tenemos que configurar el repositorio y linkearlo con Vercel, para lo cual guardaremos los tokens necesarios en los secrets del repositorio

  <img src="/assets/images/image29.png" width="500" />

## Notification_job

Una vez concluidos los jobs anteriores, enviaremos una notificación al usuario con los resultados de todos los jobs. Como no he conseguido encontrar un proveedor de Email que funcionase, he implementado esta parte con un bot de Telegram.

Los steps son los siguientes:

- Checkout del código mediante la action actions/checkout@v4
- Instalación de dependencias necesarias con npm install (donde se instalará la api del bot de telegram)

<img src="/assets/images/image30.png" width="500" />

- Enviar el mensaje a Telegram usando una custom action que he guardado en la carpeta ./.github/actions/telegram y a la que le paso las variables que contienen los resultados de los jobs anteriores, y otros parámetros necesarios como el token de telegram y el ID del usuario de telegram

<img src="/assets/images/image31.png" width="500" />

He creado una carpeta telegram con una custom action.yml con el siguiente código:

<img src="/assets/images/image32.png" width="500" />

El fichero de JavaScript que realiza la action primero recupera las variables necesarias:

<img src="/assets/images/image33.png" width="500" />

Y luego envía el mesanje por Telegram:

<img src="/assets/images/image34.png" width="500" />

A Telegram nos llega un mensaje con el resultado de los jobs:

<img src="/assets/images/image41.png" width="500" />

### Resultado de todos los jobs funcionando

Una vez se ejecuta el workflow con todos los jobs correctamente, se ve así en GitHub:

<img src="/assets/images/image42.png" width="500" />

## Personalización del repositorio con nuestro nombre para incluir estadísticas

Para personalizar el repositorio personal de GitHub he creado un repositorio con el mismo nombre de usuario.

<img src="/assets/images/image35.png" width="500" />

Después he creado un archivo .yml que se ejecute al hacer push:

<img src="/assets/images/image36.png" width="500" />

He utilizado la action lowlighter/metrics@latest:

<img src="/assets/images/image37.png" width="500" />

He añadido un secreto llamado metrics para dar acceso a la action a las estadísticas:

<img src="/assets/images/image38.png" width="500" />

Al final el perfil tiene la siguiente apariencia:

<img src="/assets/images/image39.png" width="500" />

Link al proyecto desplegado en Vercel:
https://entrega-santiago-lopez-lasheras-projects.vercel.app/
