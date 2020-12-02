var express = require('express');
var app = express();
var path = require('path');
var qs = require('querystring');

var bodyParser = require('body-parser');

// 환경변수 설정
var dotenv = require( 'dotenv');

dotenv.config();

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

// DB 연동
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : process.env.host, 
  user     : process.env.user, 
  password : process.env.password,
  database : process.env.db, 
  multipleStatements : true
});
 
db.connect(function(err){
  if(err) throw err;
  console.log("You are connect to DB!\n");
});

app.get('/api/diary', function(req, res){
  var q = req.query;
  var month = q.month;
  var year = q.year;
  db.query(`SELECT DAY(written_date) AS day FROM contents WHERE YEAR(written_date) = ? AND MONTH(written_date) = ?`, [year, month], function(error, date){
      res.json(date);
    }
  );
});

app.get('/api/diary/:diary_date', function(req,res){
  var filtered_date = path.parse(req.params.diary_date).base;
  db.query(`SELECT contents.content, sayings.saying_content, sayings.saying_author FROM contents LEFT JOIN sayings ON contents.saying_id = sayings.saying_id WHERE contents.written_date = ? `, [filtered_date], 
    function(error, result){
      if(error) throw error;
      console.log( result);
      res.json(result);
    }
  );
});

var PythonShell = require('python-shell');

//route, routing
app.post('/api/create_diary', function(req, res){
    
    var post = req.body;
    var date = post.date;
    var content = post.content;
    
    /*
    var content = "hello";

    // AI 통신 code 들어갈 곳 
    var options = {
      mode: 'text',
      pythonPath: '',
      pythonOptions: ['-u'],
      scriptPath: '',
      args: [content]
    };
    PythonShell.PythonShell.run('ai_predict.py', options, function (err, results) {
      if (err) throw err;
    
      console.log('results: %j', results);
    
    });
    */
    var feeling = 1;
    
    var insert_query = `INSERT INTO contents(user_id, written_date, content) VALUES(0,?,?);`;
    var select_query = `SELECT saying_id, saying_content, saying_author FROM sayings WHERE feeling = ? ORDER BY rand() LIMIT 6 ;`;
    var total_query = insert_query + select_query;
    db.query( total_query, [date, content, feeling],
      function(error, result){
        if(error)throw error;
        res.json(result[1]);
      }
    );
});

app.post('/api/rating', function(req, res){
  var post = req.body;
  var date = post.date;
  var saying_id = post.saying_id;
  var pass = post.pass;
  var total_query = `INSERT INTO ratings(content, saying_id, pass) VALUES((SELECT content FROM contents WHERE written_date = ?), ?, ?);`;
  if(pass == '1'){
    total_query = total_query + `UPDATE contents SET saying_id = ? WHERE written_date = ?;`;
    db.query(total_query, [date, saying_id, pass, saying_id, date],
      function(error, result){
        if(error)throw error;
      }
    );
  } else{
    db.query(total_query, [date, saying_id, pass],
      function(error, result){
        if(error)throw error;
      }
    );
  }
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});