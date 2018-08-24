const path = require('path')
const express = require('express')
const app = express()

const publicDir = path.join(__dirname, 'public')

app.use('/public', express.static(publicDir))
app.get('/', function(req, res) {
      res.sendFile(path.join(publicDir, 'index.html'));
});


app.listen(process.env.PORT, () => console.log('Example app listening on port 3000!'))
