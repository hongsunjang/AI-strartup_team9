var express = require('express')
var app = express()
var path = require('path');
var qs = require('querystring');
// 환경변수 설정
var dotenv = require( 'dotenv');

dotenv.config();

app.get("/", (req,res)=>{
    res.send(`host: ${process.env.host} 비밀번호: ${process.env.password}`);
});

// DB 연동
var mysql      = require('mysql');
var db = mysql.createConnection({
  host     : process.env.host, 
  user     : process.env.user, 
  password : process.env.password,
  database : process.env.db 
});
 
db.connect(function(err){
  if(err) throw err;
  console.log("You are connect!\n");
});
 
// sql문으로 첫번째 인자를 주고, 두번째 인자로 callback function을 주면
db.query('SELECT * FROM sample', function (error, results, fields) {
  if (error) {
		console.log(error);	
	};
  console.log(results);
});

//route, routing
app.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    request.on('end', function(){
        console.log(body);
        var post = qs.parse(body);
        var name = post.name;
        var content = post.content;
        db.query(`INSERT INTO contents (name, content) VALUES(?, ?)`,[post.name, post.content],
          function(error, result){
            if(error)throw error;
            console.log(result);
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
        });
    });
});

app.listen(3000, function() {
  console.log('Example app listening on port 3000!')
});