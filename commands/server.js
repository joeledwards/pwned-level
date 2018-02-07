module.exports = {
  command: 'server',
  desc: 'run the pwned password server',
  builder,
  handler
}

function builder (yargs) {
  yargs
  .option('bind-port', {
    type: 'number',
    desc: 'port on which the server should listen',
    default: 8080,
    alias: ['p']
  })
  .option('bind-host', {
    type: 'string',
    desc: 'host on which the server should listen',
    default: '0.0.0.0',
    alias: ['h']
  })
  .option('db-dir', {
    type: 'string',
    desc: 'location of the pwned db directory',
    default: './pwned.dat',
    alias: ['d']
  })
}

function handler ({bindPort, bindHost, dbDir}) {
  const {stopwatch} = require('durations')
  const express = require('express')
  const levelup = require('levelup')
  const leveldown = require('leveldown')
  const r = require('ramda')

  let nextId = 1
  const db = levelup(leveldown(dbDir))
  const app = express()

  app.get('/:hash', (req, res) => {
    const id = nextId++
    const watch = stopwatch().start()

    db.get(r.toUpper(req.params.hash), (error, value) => {
      watch.stop()

      if (error) {
        if (error.notFound) {
          console.debug(`[${id}] Hash vetted in ${watch}`)
          res.status(404).json({pwned: false})
        } else {
          console.error(`[${id}] Error checking hash:`, error)
          res.status(500).json({error: error.message})
        }
      } else {
        console.warn(`[${id}] Hash found in ${watch}`)
        res.status(200).json({pwned: true})
      }
    })
  })

  app.listen(bindPort, bindHost, () => {
    console.info(`Listening on ${bindPort}:${bindHost}`)
  })
}
