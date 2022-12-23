# matches-management-system

- This is a web application for managing matches. It is built using Node.js, Express.js, and SQL server.
- We used docker to run the application.

## Installation

- You can install docker from [here](https://docs.docker.com/get-docker/).
- To get the power of docker-compose, we split the application into two parts: the database and the application itself.

## Usage

- First, copy the sql file to the database container by running the following command:

```bash
sudo docker cp ./database.sql matches-management-system_db_1:/database.sql
```

- Then, enter the bash of the database container by running the following command:

```bash
sudo docker exec -it matches-management-system_db_1 bash
```

- Now, you can run the sql files by running the following commands:

```bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567' -i /tmp/tables.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567' -i /tmp/procedures.sql
```

- Enjoy the application by running the following command:

```bash
sudo docker-compose up --build
```

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributers

- [Amir Tarek](https://github.com/amir-awad)
- [Ahmed Wael](https://github.com/ahmedwael216)
