# pwned-level

LevelDB-backed Node.js REST API for checking hashes against the [haveibeenpwned.com data set](https://haveibeenpwned.com/Passwords).

## Setup

```shell
npm i -g pwned-level
```

## Importing data

```shell
pwned-level import <password-data> <level-db-path>
```

## Running the server
```shell
pwned-level server -d <level-db-path>
```

## Testing
```shell
npx aqui get http://localhost:8080/<some-hash>
```
