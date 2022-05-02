## Supported API Endpoints
#### `GET /employees`
#### `POST /employees/upload`
#### `PUT /employees/:id`
#### `DELETE /employees/:id`

## Setup & Usage
1. clone this repository
    - `git clone https://github.com/minsoeaung/confusion-server`
2. in the project directory
    - Run `yarn install` and wait installing its dependencies
3. run a Mongodb Server by following its [guide](https://docs.mongodb.com/manual/tutorial/manage-mongodb-processes/)
    - example: `mongod --dbpath=path/to/db --bind_ip 127.0.0.1`
5. run `yarn start` to start the server
