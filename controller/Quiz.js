const result = require('../models/Result');
const test = require('../models/Quiz');
const axios = require("axios");

// home 
exports.home = async (req, res) => {
    const testid = req.body.pin;
    const email = req.body.email.toLowerCase();
    const doc = await test.findOne({ pin: testid }).exec();
    if (!doc) {
        return res.status(400).send({ message: "Test doesn't exist!" });
    }
    if (Date.parse(doc.expiry) < Date.now()) {
        return res.status(400).send({ message: "Test has expired!! " });
    }
    const check = await result.findOne({ pin: testid, email }).exec();
    if (check) {
        return res.status(400).send({ message: "Test already taken!" });
    }
    const questions = await axios.get("https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple", {
        params: {
            amount: doc.amount,
            category: doc.topic,
        },
    });
    questions.data.time = doc.time;
    if (questions.data.response_code == 0) return res.send(questions.data);
    else
        return res.status(400)
            .send({ message: "Couldn't fetch test details. Try again!" });
};

// submittest
exports.submittest = async (req, res) => {
    const pin = req.body.pin;
    const email = req.body.email.toLowerCase();
    const answers = req.body.answers;
    const doc = await test.findOne({ pin }).exec();
    if (!doc) {
        return res.status(400).send({ message: "Test doesn't exist!" });
    }
    if (Date.parse(doc.expiry) < Date.now()) {
        return res.status(400).send({ message: "Test has expired!! " });
    }
    const check = await result.findOne({ pin, email }).exec();
    if (check) {
        return res.status(400).send({ message: "Test already taken!" });
    }
    const questions = await axios.get("https://opentdb.com/api.php?amount=10&category=12&difficulty=medium&type=multiple", {
        params: {
            amount: doc.amount,
            category: doc.topic,
        },
    });
    questions.data.time = doc.time;
    if (questions.data.response_code == 0) {
        let score = 0;
        for (let i = 0; i < doc.amount; i++) {
            if (answers[i] == questions.data.results[i].correct_answer) score++;
        }
        const newresult = new result({
            pin,
            email,
            score,
            answers,
        });
        newresult.save();
        return res.send({ score });
    } else
        return res.status(400)
            .send({ message: "Couldn't fetch test details. Try again!" });
}

// 
exports.submited = async (req, res) => {
    const score = parseInt(req.body.score);
    const email = req.body.email.toLowerCase();
    const name = req.body.name;
    const pin = req.body.pin;

    const resultEntry = new result({ email, name, pin, score });
    resultEntry
        .save()
        .then(() => res.send("result added!"))
        .catch((err) => res.status(400).json("error : " + err));
}

//   getquiz
exports.getquiz = async (req, res) => {
    const email = req.user.email;
    try {
        const doc = await test.find({ email }).sort("-created").exec();
        return res.send(doc);
    } catch (err) {
        console.log(err);
        return res.status(400).send();
    }
};

// getresults
exports.getresults=async (req, res) => {
    const pin = req.body.pin;
    try {
      const resultdoc = await result.find({ pin }).exec();
      return res.send(resultdoc);
    } catch (err) {
      return res.status(400).send();
    }
}

// addtest
exports.addtest = async (req, res) => {
    const pin = (await test.countDocuments({}).exec()) + 1000;
    const email = req.user.email.toLowerCase();
    const amount = req.body.amount;
    const topic = req.body.topic;
    const time = req.body.time;
    const expiry = Date.parse(req.body.expiry);
    const created = Date.parse(req.body.created);
  
    const newtest = new test({
      pin,
      email,
      amount,
      topic,
      time,
      expiry,
      created,
    });
    newtest
      .save()
      .then(() => res.send("test added!"))
      .catch((err) => res.status(400).json("error : " + err));
  }