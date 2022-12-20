const router = require('express').Router();
const { response } = require('express');
const { google } = require('googleapis');

const GOOGLE_CLIENT_ID = '30809728936-n5qpj0m4450ql92ib4tg759ftqgbs5uj.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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' 

const REFRESH_TOKEN = 
'1//0fie9geT0TuWrCgYIARAAGA8SNwF-L9IrGGMlsP4_wEYVH4JdhmxL5_y2SDoePT3Q0bQMQcHzl37dcHe7sfk6shq8NtJwAVeZnhQ'

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  'http://localhost:3000'
)

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next) => {
  try {
    const { code } = req.body
    const {tokens} = await oauth2Client.getToken(code)  
    res.send(tokens)
  } catch (error) {
    next(error)
  }
})

router.post('/create-event', async (req, res, next) => {
  try {
    const {summary, description, location, startDateTime, endDateTime,} = 
      req.body 

    oauth2Client.setCredentials({refresh_token : REFRESH_TOKEN})
    const calendar = google.calendar('v3')
    const response = await calendar.events.insert({
      auth: oauth2Client,
      calendarId: 'primary',
      requestBody: {
        summary: summary,
        description: description,
        location: location,
        colorId: '7',
        start: {
          dateTime: new Date(startDateTime),
          },
        end: {
          dateTime: new Date(endDateTime),
        },
      },
    })
    res.send(response)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
