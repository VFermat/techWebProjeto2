# techWebProjeto2
Repo dedicated to our Project 2 of the Web Technologies class.

## Starting the application

### BackEnd

You have to initialize every microservice and start the thread for all of them.

On terminal:
```shell
cd Back/<serviceName>
yarn
nodemon <fileName>
```

Nodemon is a watcher that makes sure the code that is running is the most recent one!

### FrontEnd

You have to initialize the application and start it. I altered the built in scrip for yarn to make sure everything is installed when code is initialized!

```shell
cd app
yarn start
```

## Linting code

By default our code is being linted by eslint. To ensure code pattern it's good practice to run eslint to fix any incorrection on the code (it does it by itself). Make sure you have eslint installed for this

```shell
npm install eslint -g
```

And then do the following

```shell
cd app
eslint src/**/*.js --fix
```

*If you only want to see what is wrong on the code please run:

```shell
cd app
eslint src/**/*.js
```
