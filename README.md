# pwned-level

LevelDB-backed Node.js REST API for checking hashes against the [haveibeenpwned.com data set](https://haveibeenpwned.com/Passwords).

## Setup

```
$ npm i -g pwned-level
```

## Importing data

```
$ pwned-level import <password-data> <level-db-path>
```

## Running the server
```
$ pwned-level server -d <level-db-path>
```
