require('dotenv').config();
const express = require('express');
const router = express.Router()
const hostname = process.env.HOSTNAME
const username = process.env.USER
const password = process.env.PASSWORD
const database = process.env.DATABASE
const mysql = require('mysql');

let conn = null;
const tablename = 'students';
let fields = [`idno`,`lastname`,`firstname`,`course_id`,`level`]

function connect(){
		conn = mysql.createPool({
			host: hostname,
			user: username,
			password: password,
			database: database,
			connectionLimit: 10
		});
}

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

router.get("/:idno",(req,res)=>{
	let idno = req.params.idno
	let sql = "SELECT * FROM `"+tablename+"` WHERE `idno`=?";
	connect();
	conn.query(sql,[idno],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:idno",(req,res)=>{
	let idno = req.params.idno
	let sql = "DELETE FROM `"+tablename+"` WHERE `idno`=?";
	connect();
	conn.query(sql,[idno],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let idno = req.body.idno;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let course_id = req.body.course_id;
	let level = req.body.level;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?,?,?)";
	connect();
	conn.query(sql,[idno,lastname,firstname,course_id,level],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:idno",(req,res)=>{
	let idno = req.params.idno;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let course_id = req.body.course_id;
	let level = req.body.level;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"="+idno;
	connect();
	conn.query(sql,[lastname,firstname,course_id,level],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;