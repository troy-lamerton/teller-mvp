const fs = require('fs')
const path = require('path')

module.exports = {
  "posts": JSON.parse(fs.readFileSync(path.join(__dirname, '../../data/raw.json'), 'utf8')),
  "count": 0
}
