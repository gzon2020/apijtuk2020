
const express = require("express");
const router = express.Router();
const mysql = require('mysql');
const cors = require("cors");
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')

const app = express();
const corsOptions = {};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = mysql.createConnection({   // config ค่าการเชื่อมต่อฐานข้อมูล
  host: '58.97.34.218',
  user: 'Jtukta',
  password: 'Password@9',
  database: 'jtukta'
});
db.connect(); 
router.get('/', (req, res) => {
    res.send('API Ok')
  });

router.post('/registration', cors(corsOptions), (req, res) => {
  const saltRounds = 10000
  bcrypt.genSalt(saltRounds, (err, getsalt) => {
      bcrypt.hash(req.body.password, getsalt, (err, gethash) => {
          salt = getsalt
          hash = gethash
          // res.send('ok : ' + req.body.email + ', ' + req.body.password + ' Salt : ' + salt + ' Hash : ' + hash)
          let sql = "INSERT INTO  members (username,password,loginname,hash,salt,member_id) values ('"+req.body.username+"','" + 
          req.body.password + "','" + req.body.loginname + "','" + hash + "','" + salt + "','"+req.body.member_id+"')"
          db.query(sql, (err, results) => { // สั่ง Query คำสั่ง sql
              console.log(results) // แสดงผล บน Console 
              if (err) {                  
                  res.json({ results: 'error' })
              } else {
                  res.json({ results: 'success' })                 
              }
          })
      })
  })
  bcrypt.compare()
})
router.post('/userlogin', cors(corsOptions), (req, res) => {
  let sql = `SELECT username,loginname,hash ,member_id From   members WHERE username = '${req.body.User_ID}'`
  let obj = {}
  // values ('541335','" + req.body.password + "','" + req.body.email + "','" + hash + "','" + salt + "')"
  db.query(sql, (err, results) => {
      if (err)
          console.log(err)
      if (results.length === 0) {
          console.log('email empty')
          res.json({ 'results': 'email empty' })
      } else {
          obj = results[0]
          bcrypt.compare(req.body.Pass_ID, obj.hash, (err, result) => {
              if (result) {
                  // ถ้า result == true รหัสผ่านตรง
                  // res.send('ยินดีด้วยคุณลงชื่อเข้าใช้งานได้แล้ว')
                  res.json({ 'results': 'success', 'datarow': obj })
                  //TODO: เก็บข้อมูลผู้ใช้ไว้บน session
              }
              else {               
                  res.json({ 'results': 'error'})
              }
          })
      }

  })
})
router.post('/ckeckzipcode', cors(corsOptions), (req, res) => {
    let sql = `SELECT districts.id, districts.zip_code, districts.name_th, districts.name_en, districts.amphure_id FROM districts WHERE   districts.zip_code='${req.body.zipcode}'`
    let obj = {}
    // values ('541335','" + req.body.password + "','" + req.body.email + "','" + hash + "','" + salt + "')"
    db.query(sql, (err, results) => {
        if (err)
            console.log(err)
        if (results.length === 0) {
            console.log('email empty')
            res.json({ 'results': 'email empty' })
        } else {
            obj = results;
            res.json({ 'results': 'success', 'datarow': obj })
            console.log(obj)
        }
  
    })
  })
module.exports = router;      