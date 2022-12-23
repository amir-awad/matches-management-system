FROM node:19

# Create app directory
WORKDIR /usr/src/app

COPY package*.json ./

RUN apt-get update && \
    apt-get install -y docker.io

# RUN apt-get install -y systemd
# RUN systemd start docker
RUN npm install
RUN docker cp ./database/tables.sql matches-management-system_db_1:tmp
RUN docker exec -it matches-management-system_db_1 sh -c 'mysql -u root -p"root" < /tmp/tables.sql'
RUN docker cp ./database/procedures.sql matches-management-system_db_1:tmp
RUN docker exec -it matches-management-system_db_1 sh -c 'mysql -u root -p"root" < /tmp/procedures.sql'


# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "npm", "start"]