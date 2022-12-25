# matches-management-system

- This is a web application for managing matches. It is built using Node.js, Express.js, and SQL server.
- We used docker to run the application.

## Installation

- You can install docker from [here](https://docs.docker.com/get-docker/).
- To get the power of docker-compose, we split the application into two parts: the database and the application itself.

## Usage

- First, create .env file in the root directory of the project and add the following environment variables:

```bash
DB_USER_ADMIN = "sa"
DB_PASS_ADMIN = "Amir@1234567"
```

- Make sure you are in the project directory, then copy the sql files to the database container by running the following command:

```bash
sudo docker cp ./database/tables.sql matches-management-system_db_1:tmp
sudo docker cp ./database/insertion.sql matches-management-system_db_1:tmp
sudo docker cp ./database/procedures.sql matches-management-system_db_1:tmp
```

- Then, enter the bash of the database container by running the following command:

```bash
sudo docker exec -it matches-management-system_db_1 bash
```

- Now, you can run the sql files by running the following commands:

```bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567' -i /tmp/tables.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567' -i /tmp/insertion.sql
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567' -i /tmp/procedures.sql
```

- To enter the the sql cmd of the database container, run the following command:

```bash
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P 'Amir@1234567'
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
