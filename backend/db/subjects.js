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

const tablename = 'subjects';
let fields = [`subjcode`,`subjdesc`,`units`]

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

router.get("/:subjcode",(req,res)=>{
	let subjcode = req.params.subjcode
	let sql = "SELECT * FROM `"+tablename+"` WHERE `subjcode`=?";
	connect();
	conn.query(sql,[subjcode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:subjcode",(req,res)=>{
	let subjcode = req.params.subjcode
	let sql = "DELETE FROM `"+tablename+"` WHERE `subjcode`=?";
	connect();
	conn.query(sql,[subjcode],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let subjcode = req.body.subjcode;
	let subjdesc = req.body.subjdesc;
	let units = req.body.units;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?)";
	connect();
	conn.query(sql,[subjcode,subjdesc,units],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.put("/:subjcode",(req,res)=>{
	let subjcode = req.params.subjcode;
	let subjdesc = req.body.subjdesc;
	let units = req.body.units;
	
	let flds = [];
	for(let i=1;i<fields.length;i++)
		flds.push(fields[i]+"=?")
	
	let fldstr = flds.join(",");
	
	let sql = "UPDATE `"+tablename+"` SET "+fldstr+" WHERE "+fields[0]+"=?";
	connect();
	conn.query(sql, [subjdesc, units, subjcode], (err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

module.exports = router;