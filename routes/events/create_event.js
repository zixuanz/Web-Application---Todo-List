var express = require('express');
var router = express.Router();
var pool = require('../../dbConn.js');

router.post('/', function(req, res, next) {
  console.log(req.body);

  var newEvent = [
    req.body.title,
    req.body.detail,
    false,
    req.body.priority
  ];

  pool.getConnection((err, con) =>{
    if(err){
      res.json({
        "code": 100,
        "status": "ERROR: Failed to connect database."
      });
      return;
    }

    console.log('connected as id ' + con.threadId);

    con.query("INSERT INTO events (title, detail, completed, priority) VALUES (?, ?, ?, ?)", newEvent, (err,rows) =>{
      con.release();
      console.log("CREATE: " + newEvent);
      if(err) {
        res.status(400).end();
      }else{
        res.jsonp({"insertId": rows.insertId}).end();
      }

    });

    con.on("error", (err) =>{
      res.json({
        "code" : 100,
        "status" : "ERROR: Something wrong in connection database."
      });
      return;
    });
  });

});

module.exports = router;
