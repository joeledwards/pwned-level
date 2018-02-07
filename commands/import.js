module.exports = {
  command: 'import <hashes-file> <db-dir>',
  desc: 'import hashes into database',
  handler
}

function handler ({hashesFile, dbDir}) {
  const byline = require('byline')
  const {stopwatch} = require('durations')
  const fs = require('fs')
  const leveldown = require('leveldown')
  const levelup = require('levelup')
  const path = require('path')
  const throttle = require('@buzuli/throttle')
  const {blue, orange} = require('@buzuli/color')

  const databaseDir = path.resolve(dbDir)
  console.info(`Importing hashes from ${hashesFile} into ${databaseDir}`)

  let db = levelup(leveldown(databaseDir))

  let total = 0
  let count = 0
  let batch = db.batch()
  const watch = stopwatch().start()
  const notify = throttle({
    minDelay: 500,
    maxDelay: 1000,
    reportFunc
  })

  const rs = fs.createReadStream(hashesFile)
  const bl = byline(rs)
  bl.on('data', addHash)
  bl.on('end', () => {
    flush(() => {
      notify({force: true, halt: true})
      db.close()
      console.info('Done.')
    })
  })

  function flush (next) {
    bl.pause()
    batch.write(() => {
      batch = db.batch()
      bl.resume()
      next()
    })
  }

  function addHash (hash) {
    count++
    total++
    batch.put(hash, '0')

    if (count >= 1000) {
      flush(() => {
        notify()
        count = 0
      })
    }
  }

  function reportFunc () {
    console.info(`${orange(total)} written in ${blue(watch)}`)
  }
}
