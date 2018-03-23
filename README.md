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
To connect to and use the server, start the client by running:  
`npm run start:client -- https://localhost:8443`  
This will start a repl where commands can be issued. Commands may also be
pre-issued by passing them as arguments after the hostname when starting the
client. pre-issued commands are one off, and the program will exit after
exicuting the pre-issued command. See below for an example:  
`npm run start:client -- https://localhost:8443 --createUser testing123 "Jake Carns" --password Testing1234`  
A list of commands is available below, or by running the command `help` through
the client.  

## Available Commands

# Manifest

# Testing

# Discussion

