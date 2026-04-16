require('dotenv').config();
const express = require('express');
const router = express.Router()
const hostname = process.env.HOSTNAME
const username = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE
const mysql = require('mysql');

let conn = null;
function connect(){
		conn = mysql.createPool({
			host: hostname,
			user: username,
			password: password,
			database: database,
			connectionLimit: 10
		});
}

const tablename = 'subjectoffered';
let fields = [`edpcode`,`subjid`,`start_time`,`end_time`,`days`,`room`,`teacherid`]

function disconnect(){
	if(conn!=null){
		conn.destroy();
	}
}

router.get("/",(req,res)=>{
	let sql = "SELECT * FROM `"+tablename+"`";
	connect();
	conn.query(sql,(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.get("/:edpcode",(req,res)=>{
	let edpcode = req.params.edpcode
	let sql = "SELECT * FROM `"+tablename+"` WHERE `edpcode`=?";
	connect();
	conn.query(sql,[edpcode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:edpcode",(req,res)=>{
	let edpcode = req.params.edpcode
	let sql = "DELETE FROM `"+tablename+"` WHERE `edpcode`=?";
	connect();
	conn.query(sql,[edpcode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let edpcode = req.body.edpcode;
	let subjid = req.body.subjid;
	let start_time = req.body.start_time;
	let end_time = req.body.end_time;
	let days = req.body.days;
	let room = req.body.room;
	let teacherid = req.body.teacherid;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?,?,?,?,?)";
	connect();
	conn.query(sql,[edpcode,subjid,start_time,end_time,days,room,teacherid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:course_code",(req,res)=>{
	let edpcode = req.body.edpcode;
	let subjid = req.body.subjid;
	let start_time = req.body.start_time;
	let end_time = req.body.end_time;
	let days = req.body.days;
	let room = req.body.room;
	let teacherid = req.body.teacherid;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"="+course_code;
	connect();
	conn.query(sql,[edpcode,subjid,start_time,end_time,days,room,teacherid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;