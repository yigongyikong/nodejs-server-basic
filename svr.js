const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // file path setting
const static = require('serve-static');
const dbConfig = require('./config/dbconfig.json')

// pool : db와 연결하기 위한 자원을 미리 생성해두기
const pool = mysql.createPool({
    connectionLimit: 10, // 연결 회선을 10개까지 제한
    host: dbConfig.host,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    debug: false
})

const app = express();
const PORT = 33000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json())


app.post('/process/login', (request, result) => {
    console.log('/process/login called : ' + Object.keys(request.body));
    const paramId = request.body.id;
    const paramPassword = request.body.password;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnection error. aborted", err);
            result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
            result.write('<h1>db-server connection failed</h1>');
            result.end();
            return;
        }

        const exec = conn.query('select `id`, `name` from `users` where `id`=? and `password`=sha1(?)',
            [paramId, paramPassword],
            (err, rows) => {
                conn.release();
                console.log("executed SQL : " + exec.sql);

                if (err) {
                    console.log("SQL exection failed")
                    console.dir(err)
                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h1>SQL query execute failed</h1>');
                    result.end();
                    return;
                }

                if (rows.length > 0) {
                    console.log('login id is [%s]', paramId);
                    console.log('Login success')

                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h2>Login success</h2>');
                    result.end();
                } else {
                    console.log('Re-Confirm login-id & password');
                    console.log('Login failed')

                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h1>Login failed</h1>');
                    result.end();
                }
            }
        )
    })



})

app.post('/process/adduser', /* callback-function */(request, result) => {
    console.log('/process/adduser called : ' + Object.keys(request.body));

    const paramId = request.body.id; // [setting-1], [setting-2]를 통해 req에 setting이 된다.
    const paramName = request.body.name;
    const paramAge = request.body.age;
    const paramPassword = request.body.password;

    pool.getConnection((err, conn) => {
        if (err) {
            conn.release();
            console.log("Mysql getConnection error. aborted", err);
            result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
            result.write('<h1>db-server connection failed</h1>');
            result.end();
            return;
        }

        console.log("getConnection Success");

        const exec = conn.query('insert into users (id, name, age, password) values (?,?,?,sha1(?));',
            [paramId, paramName, paramAge, paramPassword], /* callback-function */
            (err, res) => {
                conn.release();
                console.log("executed SQL : " + exec.sql);

                if (err) {
                    console.log("SQL exection failed")
                    console.dir(err)
                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h1>SQL query execute failed</h1>');
                    result.end();
                    return;
                }

                if (res) {
                    console.dir(res);
                    console.log('Inserted success')

                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h2>add user success</h2>');
                    result.end();
                } else {
                    console.log('Inserted failed')

                    result.writeHead('200', { 'Content-Type': 'text/html; charset=utf8' });
                    result.write('<h1>add user failed</h1>');
                    result.end();
                }
            }
        )
    })
})

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}...`);
});













/*
const express = require('express');
const app = express();
const PORT = 30003;

// pages 경로로 들어오는 요청에 대해서는
// 로컬 폴터 __dirname : main.js가 있는 폴더 위치
// __dirname + '/pages' 로 설정
app.use('/scripts', express.static(__dirname+'/scripts'));

app.listen(PORT, () => {
    console.log(`listening to ${PORT}...`);
});

// process routine
app.get('/', (req, res) => { // req는 browser로부터 오는 데이터, res는 browser로 전달하는 데이터
    console.log("===> comming root get request")
    // res.sendStatus(200);
    // res.sendFile(__dirname+'/pages/index.html');
    res.sendStatus(200).sendFile(__dirname+'/pages/index.html');
})

app.get('/about', (req, res) => {
    console.log("===> comming about route request")
    // res.sendFile(__dirname+'/pages/about.html');
    res.sendStatus(200);
})

app.get('/working', (req, res) => {
    console.log("about route request")
    res.sendFile(__dirname+'/pages/working.html');
})
*/