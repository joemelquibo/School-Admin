require('dotenv').config();
const port = process.env.PORT || 5000
const express = require('express');
const cors = require('cors');
const students = require("./db/students")
const subjects = require("./db/subjects")
const course = require("./db/course")
const subjectoffered = require("./db/subjectoffered")
const enrollment = require("./db/enrollment")
const enrollment_details = require("./db/enrollment_details")
const teachers = require("./db/teachers")

const app = express();
app.use(express.urlencoded({'extended':false}));
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use('/students',students);
app.use('/subjects',subjects);
app.use('/course',course);
app.use('/subjectoffered',subjectoffered);
app.use('/enrollment',enrollment);
app.use('/enrollment_details',enrollment_details);
app.use('/teachers',teachers);

app.get("/",(req,res)=>{
	return res.json('hellow world')
});

const server = app.listen(port,()=>{
	require('dns').lookup(require('os').hostname(),(err,addr,fam)=>{
		console.log(`listening at http://${addr}:${port}`);
	});
});