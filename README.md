# matches-management-system

- This is a simple web application for managing matches. It is built using Node.js, Express.js, and SQL server.
- We used docker to run the application.

## Installation

- You can install docker from [here](https://docs.docker.com/get-docker/).
- To get the power of docker-compose, we split the application into two parts: the database and the application itself.
- Before running the application, you need to create a separate container for SQL running server. Just follow the instructions described [here](https://learn.microsoft.com/en-us/sql/linux/quickstart-install-connect-docker?view=sql-server-2017&preserve-view=true&pivots=cs1-bash)

## Usage

- First, make sure that SQL server is running. You can check it by running the following command:

```bash
sudo docker ps -a
```

- You should see a container with status "Up".

- Also make sure that you have changed the configuration of your SQL server in both `docker-compose.yml` and `index.js` files.

- Then, enjoy the application by running the following command:

```bash
sudo docker-compose up --build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
