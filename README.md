<p align="center">
    <a href="https://bitbucket.org/learning-ionic/dailytasks/src/angular-fire/" target="_blank">
        <img src="src/assets/icon/logo.svg" alt="logo DailyTasks" height="100px"/>
    </a>
    <h1 align="center">DailyTasks</h1>
    <br>
</p>

Desplegada en [diariopracticasgrado.web.app](https://diariopracticasgrado.web.app)
***
## Getting Started
¡Bienvenido a nuestra aplicación para llevar el diario de actividades de las prácticas del ciclo! Con esta herramienta, podrás registrar y editar fácilmente tus actividades diarias, el número de horas empleadas y toda la información relevante sobre tus prácticas.

Para empezar, simplemente inicia sesión con tu cuenta o regístrate si eres un nuevo usuario. Una vez dentro de la aplicación, encontrarás una interfaz intuitiva que te permitirá agregar, editar y eliminar tus actividades diarias de forma sencilla.

Además, nuestra aplicación te facilitará el proceso de rellenar y descargar los documentos en PDF que la Junta de Andalucía proporciona para cada semana de prácticas. De esta manera, podrás mantener un registro organizado y completo de todas tus actividades y horas de prácticas.

No pierdas más tiempo con métodos manuales y poco eficientes para llevar el seguimiento de tus prácticas. ¡Descarga nuestra aplicación y simplifica tu vida académica!

## Instalación
#### Requisitos:
- [_Node.js_](https://nodejs.org): Se debe tener instalado Node.js en el servidor donde se realizará el despliegue de la aplicación. Además, es necesario tener npm (Node Package Manager) para instalar las dependencias del proyecto.
- [_Git_](https://git-scm.com/): Es necesario tener Git instalado en el servidor para poder clonar el repositorio de la aplicación desde un repositorio remoto.
- [_Apache_](https://httpd.apache.org/download.cgi) _(opcional)_: En caso de que se quiera utilizar Apache como servidor web para el despliegue de la aplicación, se debe tener instalado y configurado correctamente en el servidor. Apache es una opción común para servir aplicaciones web.

#### Despliegue:
Para **desplegar** DailyTasks, se han de seguir los siguientes pasos:
- Clonar repositorio

`git clone https://perblac@bitbucket.org/learning-ionic/dailytasks.git`
- Entrar en el directorio

`cd dailytasks`
- Cambiar a la rama 'angular-fire'

`git checkout angular-fire`

- Instalar paquetes npm
`npm install`

- Hacer build para producción
`ionic build --prod`

> Esto generará la carpeta www que contiene la web lista para su despliegue, por ejemplo en Apache copiándola a htdocs/www con un VirtualHost semejante a este:

```
<VirtualHost *:80>
  ServerName dailytasks.test
  DocumentRoot "${SRVROOT}/htdocs/www"   
  <Directory "${SRVROOT}/htdocs/www">
    Options Indexes FollowSymLinks
    AllowOverride None
    Require all granted
  </Directory>
  ErrorLog "logs/dailytasks-error.log"
  CustomLog "logs/dailytasks-access.log" common
</VirtualHost>
```

#### Pasos opcionales para generar aplicaciones *android* e *ios* (requiere [Android Studio](https://developer.android.com/studio) para android, y [Xcode](https://developer.apple.com/xcode/) para ios):

- Sincronizar los proyectos android e ios

`ionic capacitor sync`
- Cargar el proyecto en la IDE nativa (Android Studio/ Xcode)

`ionic capacitor build android`
`ionic capacitor build ios`

Una vez abierta la IDE nativa, se sigue el proceso normal para generar la aplicación.
