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

const tablename = 'enrollment';
let fields = [`enroll_code`,`enroll_date`,`student_id`,`status`,`amt_paid`]

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

router.get("/:enroll_code",(req,res)=>{
	let enroll_code = req.params.enroll_code
	let sql = "SELECT * FROM `"+tablename+"` WHERE `enroll_code`=?";
	connect();
	conn.query(sql,[enroll_code],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.delete("/:enroll_code",(req,res)=>{
	let enroll_code = req.params.enroll_code
	let sql = "DELETE FROM `"+tablename+"` WHERE `enroll_code`=?";
	connect();
	conn.query(sql,[edpcoenroll_codede],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});

router.post("/",(req,res)=>{
	let enroll_code = req.body.enroll_code;
	let enroll_date = req.body.enroll_date;
	let student_id = req.body.student_id;
	let status = req.body.status;
	let amt_paid = req.body.amt_paid;
	
	let sql = "INSERT INTO `"+tablename+"` ("+fields+") VALUES(?,?,?,?,?)";
	connect();
	conn.query(sql,[enroll_code,enroll_date,student_id,status,amt_paid],(err,rows)=>{
		if(err) return res.status(500).json(err);
		return res.json(rows);
	});
});


router.put("/:enroll_code", (req, res) => {
    const enroll_code = req.params.enroll_code;
    
    const { enroll_date, student_id, status, amt_paid } = req.body;
    
    let flds = [];
    for(let i = 1; i < fields.length; i++) {
        flds.push(fields[i] + "=?");
    }
    
    let fldstr = flds.join(",");
    let sql = "UPDATE `" + tablename + "` SET " + fldstr + " WHERE " + fields[0] + "=?";

    connect();
    conn.query(sql, [enroll_date, student_id, status, amt_paid, enroll_code], (err, rows) => {
        if (err) return res.status(500).json(err);
        return res.json(rows);
    });
});

module.exports = router;