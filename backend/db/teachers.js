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

const tablename = 'teachers';
let fields = [`teachercode`,`rfid`,`lastname`,`firstname`,`deptid`]

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

router.get("/:teachercode",(req,res)=>{
	let teachercode = req.params.teachercode
	let sql = "SELECT * FROM `"+tablename+"` WHERE `teachercode`=?";
	connect();
	conn.query(sql,[teachercode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:teachercode",(req,res)=>{
	let teachercode = req.params.teachercode
	let sql = "DELETE FROM `"+tablename+"` WHERE `teachercode`=?";
	connect();
	conn.query(sql,[teachercode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let teachercode = req.body.teachercode;
	let rfid = req.body.rfid;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let deptid = req.body.deptid;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?,?,?)";
	connect();
	conn.query(sql,[teachercode,rfid,lastname,firstname,deptid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:teachercode",(req,res)=>{
	let teachercode = req.params.teachercode;
	let rfid = req.body.rfid;
	let lastname = req.body.lastname;
	let firstname = req.body.firstname;
	let deptid = req.body.deptid;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"=?";
	connect();
	conn.query(sql,[rfid,lastname,firstname,deptid,teachercode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;