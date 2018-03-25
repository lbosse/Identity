# Project #2: Identity Server  
**CS 455/555 Distributed Systems**  
**Spring 2018**  
**Authors:** Jake Carns, Luke Bosse  

# Setup

## Dependencies

### Technology dependencies

The following are needed for the project to build and run:  
[Docker](https://www.docker.com/community-edition)  
[Node (Windows)](https://nodejs.org/en/download/)  
[Node (*nix)](https://nodejs.org/en/download/package-manager/)  

### Installing project dependencies

Run `npm install` to install the project dependencies  

## Build and start Mongo Docker container

Run `npm run start:mongo` to start the docker container.  

**CAUTION:**  
To stop ALL running docker containers run `npm run stop:all`.  

## Generating SSL Certs

There are pre-generated certs in the ssl folder as an example and for grading
purposes.  

Follow the guide below exactly to generate your own:  
[Generating SSL for express](https://matoski.com/article/node-express-generate-ssl/)  

## Creating configuration file

Copy the sample configuration file to create a new config by running the
following in the project root:  
`cp sample-server.config.js server.config.js`  
Go through the config file and set values accordingly. Likely you will only need 
to change your mongo connection config.  

# Running and Usage

## Identity Server
To run the and use the Identity system, you must first start the server by
running:  
`npm run start:server`

## Identity Client

### REPL

**To connect to and use the server**, start the client by running:  
`npm run start:client -- https://localhost:8443`  
**This will start a repl** where commands can be issued.  

### One-off commands

**Commands may also be pre-issued** by passing them as arguments after the
hostname when starting the client. Pre-issued commands are one off, and the 
program will exit after exicuting the pre-issued command. See below for an 
example:  
`npm run start:client -- https://localhost:8443 --create testing123 "Jake Carns" --password Testing1234!`  
A list of commands is available below, or by running the command `help` 
through the client.  

## Available Commands

| Command        | Alias            | Usage                                                           | Description                    |
|----------------|------------------|-----------------------------------------------------------------|--------------------------------|
| createUser     | --create         | `createUser <login Name> ["real-name"] [--password <password>]` | Create a new user              |
| lookup         | --lookup         | `lookup <login-name>`                                           | Lookup a user by name          |
| reverseLookup | --reverse-lookup | `reverse-lookup <uuid>`                                         | Lookup a user by uuid          |
| delete         | --delete         | `delete <loginName> [--password <password>]`                    | Delete a user by login name    |
| modify         | --modify         | `modify <oldLoginName> <newLoginName> [--password <password>]`  | Modify a users login name      |
| get            | --get            | `get <users \| uuids \| all>`                                   | Get all names, uuids, or users |
| help           |                  | `help`                                                          | Print the help prompt          |
| exit           |                  | `exit`                                                          | Exit the client                |

# Manifest 
```
README.md - Need I say more?  
server.js - RPC identity server               
client.js - RPC identity client                        
test.js - Testing suite for RPC identity client/server interaction  
commands.js - Command parsing and dispatching for client              
sample-server.config.js - Sample server configuration file  
package.json - Directives for npm package manager      
yarn.lock - Prefer Yarn over npm? This file helps with package versioning  
ssl/  
.... ca.crt - Signed certificate for certificate authority              
.... forceSSL.js - Redirects HTTP requests to HTTPS        
.... server.csr - Certificate signing request for server  
.... ca.csr - Certificate signing request for certificate authority                 
.... passphrase - Passphrase used to generate certificate authority              
.... server.key - Private key used for server  
.... ca.key - Private key for certificate authority                 
.... server.crt Signed certificate for server              
.... server.key.passphrase - Server private key with passphrase  
controllers/  
.... user.js - Controller for user model  
models/  
.... user.js - MongoDB schema (model) for user  
```

# Testing

# Discussion

