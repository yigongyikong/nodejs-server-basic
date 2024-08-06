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