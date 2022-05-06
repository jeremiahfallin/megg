This project contains three parts:

- keystone: The keystone server which handles creating the database schema as well as requests from the frontend.
- frontend: The frontend which handles the user interface.
- backend: The backend which handles the retrieval of data from Riot Games.

It also uses the postgres docker container to run the database.

## About

Me.gg is a personal League of Legends stats app meant to compile player stats and fill some of the void (i.e. it has some of the same statistics) left by legends.ai going down.

After you have the app running you should have something like this (UI is WIP):
![image](https://user-images.githubusercontent.com/18542660/167006363-453a4e02-9c36-4023-b922-6fd8e6b7b465.png)

## Getting Started

This project requires [Docker and docker-compose](docker.io) to be installed on your machine.

Inside the `docker-compose.yaml` file, you can change the Postgres database credentials if you wish. Afterwards, a `.env` file needs to be created with the following contents:

- DATABASE_URL: The URL to the database.
- RIOT_KEY: The API key to use for the Riot Games API.

Then, simply run `docker-compose up -d --build` to create and start the containers.

The frontend is reachable at [http://localhost:3000](http://localhost:3000) with your browser.

The keystone backend is reachable at [http://localhost:8000](http://localhost:8000) with your browser.

The graphql playground is reachable at [http://localhost:8000/api/graphql](http://localhost:8000/api/graphql).

Files in the frontend or backend folders should automatically update when you make changes to the code.
Files in the keystone folder will require the keystone container to be restarted.

## Pull Requests

Pull requests are welcome as I consider this project still in its infancy. The frontend is definitely the place where I have spent the least amount of time.

## TODO

- [ ] Add match timeline to keystone schema.
- [ ] Add match timeline retrieval to backend.
- [ ] Implement useful metrics from timeline to frontend.
- [ ] Pretty up the frontend.
- [ ] I am confident the data retrieval could be improved.
- [ ] Write own utilities for retrieving data from Riot Games.
- [ ] Write tests.
