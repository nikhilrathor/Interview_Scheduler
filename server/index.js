const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/key');
const Interviews = require('./routes/api/interviews');
const cron = require('node-cron');
const interviews = require('./models/Interview');
const mailer = require('./misc/mailer');

mongoose.connect(config.mongoURI,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/interviews', Interviews);

cron.schedule('* * * * * *', () => {
    var isoDate1 = new Date();
    var isoDate2 = new Date();
    isoDate1.setHours(isoDate1.getHours() + 7);
    isoDate1.setMinutes(isoDate1.getMinutes() - 30);
    isoDate1.setSeconds(isoDate1.getSeconds() - 1);
    isoDate2.setHours(isoDate2.getHours() + 7);
    isoDate2.setMinutes(isoDate2.getMinutes() - 30);
    interviews.findOne({ $and: [{ startTime: { $gte: isoDate1 } }, { startTime: { $lte: isoDate2 } }] })
        .then(user => {
            if (user) {
                const html = `
                        Interview is within next 60 minutes Scheduled on:
                        <br/>
                        <br/>
                        Start Time: ${user.startTime}
                        <br/>
                        End Time: ${user.endTime}
                        <br/>
                        Thank You.
                        `;
                mailer.sendEmail('nikhilrathor02@gmail.com', user.email, 'Interview Scheduled', html)
                mailer.sendEmail('nikhilrathor02@gmail.com', "nikhilrathor01@gmail.com", 'Interview Scheduled', html)
            }
        })
})

app.listen(8000);