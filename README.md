# Project #3: Identity Server Phase II 
**CS 455/555 Distributed Systems**  
**Spring 2018**  
**Authors:** Jake Carns, Luke Bosse  
*A Simple, Fault Tolerant RPC Identity System*
# [&rarr;Demonstration Video&larr;](https://drive.google.com/open?id=18DIwTFmexB_2xLem7aU2Qii7kGrP73EP)
# Setup

## Dependencies

### Technology dependencies

The following are needed for the project to build and run:  
[Docker](https://www.docker.com/community-edition) >= v.17.07.0  
[Node (Windows)](https://nodejs.org/en/download/) >= v.8.5.0  
[Node (*nix)](https://nodejs.org/en/download/package-manager/) >= v.8.5.0  

### Installing project dependencies

Run `npm install` to install the project dependencies.  

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

# Building and Deploying Replica Set Containers

**If building for the first time:**  
1. Run `npm start:mongo <number>` where `<number>` is the number of replica set secondaries you'd like to spin up.  
2. Run `npm stop:all` to temporarily stop the running containers. This is a necessary measure because unfortunately, on the first build, the primary node of the replica set attempts to connect to the MongoDB daemon before it finishes starting.  
3. Run `npm start:mongo <number>` again.  
4. Run `npm start:rs` to start the replica set secondaries.  
5. You are now ready to proceed to the "Running and Usage" section below.  

**If rebuilding:**  
1. Run `npm start:mongo <number>` where `<number>` is the number of replica set secondaries you'd like to spin up.  
2. Run `npm start:rs` to start the replica set secondaries.
3. You are now ready to proceed to the "Running and Usage" section below.

**CAUTION:** `npm run stop:all` stops ALL running Docker containers.  

# Running and Usage

## Identity Server
To run the and use the Identity system, you must first start the server by
running:  
`npm run start:server`

## Identity Client

### REPL

**To connect to and use the server**, start the client by running:  
`npm run start:client -- https://localhost:8443[,<server-host-url>, ...]`  
**Note:** to specify additional replica servers to fall back on if a connection fails, add the urls in a comma-separated list (no spaces): `npm run start:client -- https://localhost:8443[,<server-host-url>, ...]`  
**This will start a repl** where commands can be issued.  

### One-off commands

**Commands may also be pre-issued** by passing them as arguments after the
hostname when starting the client. Pre-issued commands are one off, and the 
program will exit after exicuting the pre-issued command. See below for an 
example:  
`npm run start:client -- https://localhost:8443 --create testing123 "Jake Carns" --password Testing1234!`  
A list of commands is available below, or by running the command `help` 
through the client.  
**Note:** to specify additional replica servers to fall back on if a connection fails, add the urls in a comma-separated list (no spaces): `npm run start:client -- https://localhost:8443[,<server-host-url>, ...] --create testing123 "Jake Carns" --password Testing1234!`  

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
To configure testing options, please see the `testing` object in the server configuration file.  
To run the tests, start the server and and simply run `npm test`.  
**Note:** To avoid breaking test assertions (which assume testing users do not yet exist), it is best to run the tests with an empty database collection, although not necessary.

# Discussion

On this project work was split up evenly between team members, and pair programming was used heavily throughout the development process. We learned several things from the last project about what worked and what didn't, as during the Chat Sever project Node sockets were a relatively new technology to us. In particular the use of Docker and [Sticky Sessions](https://www.npmjs.com/package/sticky-cluster) from the beginning of this project made our lives a whole lot easier.  
With this project, we have a much more formal test suite than we did on the chat server, and we utitlize a popular Node testing framework and dynamically generated tests using JSON to represent our tests.  
