const path = require('path')
const express = require('express')
const routes = require('./routes')
const handlebars = require('express-handlebars')
const app = express()
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('./config/passport')
const { getUser } = require('./helpers/auth-helpers')
const handlebarsHelpers = require('./helpers/handlebars-helpers')
const methodOverride = require('method-override')
const { PORT = 3000, LOCAL_ADDRESS = '0.0.0.0' } = process.env

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const SESSION_SECRET = 'secret'
app.use(express.urlencoded({ extended: true }))
app.engine('hbs', handlebars({ extname: '.hbs', helpers: handlebarsHelpers }))
app.set('view engine', 'hbs')
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride('_method'))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = getUser(req)
  next()
})
app.use(routes)

app.listen(PORT, LOCAL_ADDRESS, () => {
  console.info(`Example app listening on port ${PORT
}!`)
})

module.exports = app
