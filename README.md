# Peer Review System
## Steps to run the application:
### Client
```bash
cd client
npm install
npm run start
```
### API
```bash
cd api
npm run start
ctrl+c (stop the api to run the seed.ts)
npm run seed
npm run start
```
### Requirements
```bash
node
npm
mariadb or MySQL
```
### Create these files at: peer-review-system/api/

* .env

```
PORT=3000
JWT_SECRET=VerySecr3t!
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=password
DB_DATABASE_NAME=dev_db
```

* ormconfig.json

```
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "database": "dev_db",
  "username": "root",
  "password": "password",
  "synchronize": true,
  "logging": false,
  "entities": [
      "src/entities/**/*.ts"
  ],
  "migrations": [
      "src/migration/**/*.ts"
  ],
  "cli": {
      "entitiesDir": "src/entities",
      "migrationsDir": "src/migration"
  }
}
```
