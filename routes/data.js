const _ = require('lodash')
const fs = require('fs')
const express = require('express')
const router = express.Router()

const render = require('../views/renderPage')

const path = require('path')
const dataPath = path.join(__dirname, '..', 'data')

// mark item as hidden
router.post('/:id/:method', (req, res) => {
  const { method, id} = req.params
  const validMethods = ['hide', 'unhide', 'mark', 'unmark']
  let errorMessage = ''

  if (validMethods.indexOf(method) < 0) {
    errorMessage =`${method} is an invalid method. Valid methods are ${_.map(validMethods, string => `"${string}"`).join(', ')}`
    console.error(errorMessage)
    return respondWithError(404)
  }
  const base36Regex = /^[0-9a-z]{6}$/
  if (!base36Regex.test(id)) {
    errorMessage = `Data id "${id}" is in the wrong format. Expected six Base36 characters [0-9a-z]. e.g. a6bc13`
    return respondWithError()
  }
  function respondWithError(statusCode = 400) {
    console.error(errorMessage)
    res.status(statusCode).send(errorMessage)
    return
  }
  console.log(`Request to ${method} data with id "${id}"`)
  fs.readFile(path.join(dataPath, 'raw.json'), 'utf8', (err, text) => {
    const data = JSON.parse(text)
    const itemIndex = _.findIndex(data, {id: req.params.id})
    if (data[itemIndex]) {
      switch (method) {
        case validMethods[0]:
          // hiding an item also sets marked to default value of false
          data[itemIndex].__hidden = true
          data[itemIndex].__marked = false
          console.log('Updated item as hidden in array')
          break
        case validMethods[1]:
          data[itemIndex].__hidden = false
          console.log('Updated item as NOT hidden in array')
          break
        case validMethods[2]:
          console.log('Updated item as marked in array')
          data[itemIndex].__marked = true
          break
        case validMethods[3]:
          data[itemIndex].__marked = false
          console.log('Updated item as NOT marked in array')
          break
      }
      fs.writeFile(path.join(dataPath, 'raw.json'), JSON.stringify(data), (err) => {
        if (err) {
          errorMessage = `Error saving data to disk.\nFull error message follows:\n${err}`
          console.error(errorMessage)
          res.status(500).send(errorMessage)
          return
        }
        console.log('Updated array saved to disk')
        res.status(200).send('Great success! Updated array saved to disk')
      })

    } else {
      errorMessage = `Object id "${id}" not found at index ${itemIndex} in array which contains ${data.length} items`
      console.error(errorMessage)
      res.status(400).send(errorMessage)
    }
  })
})

module.exports = router
