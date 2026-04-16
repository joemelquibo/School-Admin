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

const tablename = 'enrollment_details';
let fields = [`enroll_id`,`suboffid`]

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

router.get("/:enroll_id",(req,res)=>{
	let enroll_id = req.params.enroll_id
	let sql = "SELECT * FROM `"+tablename+"` WHERE `enroll_id`=?";
	connect();
	conn.query(sql,[enroll_id],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:enroll_id",(req,res)=>{
	let enroll_id = req.params.enroll_id
	let sql = "DELETE FROM `"+tablename+"` WHERE `enroll_id`=?";
	connect();
	conn.query(sql,[enroll_id],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let enroll_id = req.body.enroll_id;
	let suboffid = req.body.suboffid;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?)";
	connect();
	conn.query(sql,[enroll_id,suboffid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:enroll_id",(req,res)=>{
	let enroll_id = req.body.enroll_id;
	let suboffid = req.body.suboffid;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"="+enroll_id;
	connect();
	conn.query(sql,[enroll_id,suboffid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;