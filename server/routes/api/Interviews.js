const express = require('express');
const router = express.Router();
const mailer = require('../../misc/mailer');
const interviews = require('../../models/Interview');

router.get('/getAll', (req, res) => {
    interviews.find({})
        .then(interview => res.json(interview));
})


router.post('/addInterview', (req, res) => {
    var { name, email, startTime, endTime } = req.body;
    var newstartTime = new Date(startTime);
    var newendTime = new Date(endTime);
    newstartTime.setHours(newstartTime.getHours() + 5);
    newstartTime.setMinutes(newstartTime.getMinutes() + 30);
    newendTime.setHours(newendTime.getHours() + 5);
    newendTime.setMinutes(newendTime.getMinutes() + 30);
    interviews.findOne({ $or: [{ startTime: { $lte: newstartTime }, endTime: { $gte: newstartTime } }, { startTime: { $lte: newendTime }, endTime: { $gte: newendTime } }] })
        .then(user => {
            if (!user) {
                const interview = new interviews({
                    name: name,
                    email: email,
                    startTime: newstartTime,
                    endTime: newendTime
                });
                interview.save()
                    .then(data => {
                        const html = `
                        Interview is Scheduled on:
                        <br/>
                        <br/>
                        Start Time: ${newstartTime}
                        <br/>
                        End Time: ${newendTime}
                        <br/>
                        Thank You.
                        `;
                        mailer.sendEmail('nikhilrathor02@gmail.com', data.email, 'Interview Scheduled', html)
                        mailer.sendEmail('nikhilrathor02@gmail.com', "nikhilrathor01@gmail.com", 'Interview Scheduled', html)
                        return res.json({ msg: "Done" })
                    })
                    .catch(err => res.status(400));
            }
            else {
                return res.json({ msg: "Busy" });
            }
        })
        .catch(err => res.status(400));
})

router.post('/updateInterview', (req, res) => {
    var { id, startTime, endTime } = req.body;
    var newstartTime = new Date(startTime);
    var newendTime = new Date(endTime);
    newstartTime.setHours(newstartTime.getHours() + 5);
    newstartTime.setMinutes(newstartTime.getMinutes() + 30);
    newendTime.setHours(newendTime.getHours() + 5);
    newendTime.setMinutes(newendTime.getMinutes() + 30);
    interviews.findOne({ $or: [{ startTime: { $lte: newstartTime }, endTime: { $gte: newstartTime } }, { startTime: { $lte: newendTime }, endTime: { $gte: newendTime } }] })
        .then(user => {
            if (!user) {
                interviews.findById(id)
                    .then(user1 => {
                        if (!user1) return res.status(400).json({ msg: "Something went wrong!" });
                        user1.startTime = newstartTime;
                        user1.endTime = newendTime;
                        user1.save()
                            .then(data => {
                                const html = `
                        UPDATED Interview is Scheduled on:
                        <br/>
                        <br/>
                        Start Time: ${newstartTime}
                        <br/>
                        End Time: ${newendTime}
                        <br/>
                        Thank You.
                        `;
                                mailer.sendEmail('nikhilrathor02@gmail.com', data.email, 'Interview Scheduled', html)
                                mailer.sendEmail('nikhilrathor02@gmail.com', "nikhilrathor01@gmail.com", 'Interview Scheduled', html)
                                res.status(200).json({ msg: "Done" })
                            })
                            .catch(res.status(400));
                    })
                    .catch(err => res.status(400))
            }
            else {
                return res.json({ msg: "Busy" });
            }
        })
        .catch(err => res.status(400));
})

router.get('/getById/:id', (req, res) => {
    interviews.findById(req.params.id)
        .then(interview => res.json(interview));
})

router.delete('/delete/:id', (req, res) => {
    interviews.findByIdAndDelete(req.params.id)
        .then(data => {
            const html = `
                        Interview is Postponed:
                        <br/>
                        <br/>
                        New Date and timing will be communicated soon.
                        <br/>
                        Thank You.
                        `;
            mailer.sendEmail('nikhilrathor02@gmail.com', data.email, 'Interview Scheduled', html)
            mailer.sendEmail('nikhilrathor02@gmail.com', "nikhilrathor01@gmail.com", 'Interview Scheduled', html)
            res.json({ success: true })
        })
        .catch(err => res.status(404).json({ success: false }))
})

module.exports = router;