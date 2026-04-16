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

const tablename = 'course';
let fields = [`course_code`,`course_desc`]

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

router.get("/:course_code",(req,res)=>{
	let course_code = req.params.course_code
	let sql = "SELECT * FROM `"+tablename+"` WHERE `course_code`=?";
	connect();
	conn.query(sql,[course_code],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:course_code",(req,res)=>{
	let course_code = req.params.course_code
	let sql = "DELETE FROM `"+tablename+"` WHERE `course_code`=?";
	connect();
	conn.query(sql,[course_code],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let course_code = req.body.course_code;
	let course_desc = req.body.course_desc;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?)";
	connect();
	conn.query(sql,[course_code,course_desc],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:course_code",(req,res)=>{
	let course_code = req.body.course_code;
	let course_desc = req.body.course_desc;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"="+course_code;
	connect();
	conn.query(sql,[course_code,course_desc],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;