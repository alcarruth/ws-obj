# credentials.coffee

fs = require('fs')

key_file = '/etc/letsencrypt/live/alcarruth.com/privkey.pem'
crt_file = '/etc/letsencrypt/live/alcarruth.com/fullchain.pem'

exports.key = fs.readFileSync(key_file, 'utf-8')
exports.cert = fs.readFileSync(crt_file, 'utf-8')
