# kanban_front-app

First steps with **API REST** concept.

This project is in two parts:

- Back side : **API REST** ([repo](https://github.com/AgathePons/kanban_API-REST))
- Front side : **JS front app**

The full project is available in the `master` branch, as **monolithic application** in the **[kanban_API-REST](https://github.com/AgathePons/kanban_API-REST)** repo.

## How to run **[kanban_API-REST](https://github.com/AgathePons/kanban_API-REST)**

### Run the API

Install dependencies

```cmd
npm i
```

Create DB (with postgres superuser)

```cmd
createdb <dbname>
```

Seed DB

```cmd
psql -U <user> -d <dbname> -f data/create_tables.sql
```

Create `.env`

```cmd
PORT=3000
PGURL="postgresql://user:mdp@localhost:5432/db"
```

Start server

```cmd
npm start
```

Check if the API (back side) works: `localhost:3000/lists` (should return a json)

### Run the front app

Check if your apache localhost is running  
(Ubuntu)

```cmd
sudo service apache2 status
```

if not (Ubuntu)

```cmd
sudo service apache2 start
```

Then, go to the folder, for example: `localhost/<yourFolder>/kanban_front-app/assets`.