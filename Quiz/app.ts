var sqlite = require('sqlite3');
var express = require('express');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

let db = new sqlite.Database('quiz.db');


// Pobiera z bazy użytkownika o danym loginie.
function getUser(login) {
    return new Promise(function(resolve, reject){
      db.all(
          'SELECT login, password FROM Users WHERE login = "' + login + '"', [], 
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )}

// Pobiera z bazy wszystkie quizy.
function getQuizes() {
    return new Promise(function(resolve, reject){
      db.all(
          'SELECT id, quiz FROM Quizes', [],
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )}

// Pobiera z bazy quiz o danym id.
function getQuiz(id) {
    return new Promise(function(resolve, reject){
      db.all(
          'SELECT id, quiz FROM Quizes WHERE id = ' + id, [],
          function(err, rows){                                                
              if(rows === undefined){
                  reject(new Error("Error rows is undefined"));
              }else{
                  resolve(rows);
              }
          }
      )}
  )}

// Pobiera z bazy rozwiązania konkretnego quizu danego użytkownika.
function getSolutions(user, id) {
    return new Promise(function(resolve, reject){
        db.all(
            'SELECT quizId, times, penalties, total, user FROM Solutions WHERE user = "' + user +'" AND quizId = ' + id, [],
            function(err, rows){
                if(rows === undefined){
                    reject(new Error("Rows is undefined"));
                } else {
                    resolve(rows);
                }
            } 
        )
    })
}

// Pobiera z bazy 5 najlepszych rezultatów z danego quizu
function getTop5(id) {
    return new Promise(function(resolve, rejcet){
        db.all(
            'SELECT total, user FROM Solutions WHERE quizId = ' + id + ' ORDER BY total ASC LIMIT 5', [],
            function(err, rows){
                if (rows === undefined) {
                    rejcet(new Error("rows in undefined"))
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

// Pobiera czasy wszystkich rozwiązań z podziałem na zadania dla danego quizu.
function getTimes(id) {
    return new Promise(function(resolve, rejcet){
        db.all(
            'SELECT times FROM Solutions WHERE quizId = ' + id, [],
            function(err, rows){
                if (rows === undefined) {
                    rejcet(new Error("rows in undefined"))
                } else {
                    resolve(rows)
                }
            }
        )
    })
}

// Funkcja pomocnicza do obliczania średniej.
function arrayOfArraysAVG(arr) {
    if(!arr) {
        return undefined
    }
    let v1 = arr.length;
    let v2 = arr[0].length;
    let avgs = []
    for (var i = 0; i < v2; i++) {
        let sum = 0
        for(var j = 0; j < v1; j++) {
            sum += Math.round(arr[j][i])
        }
        avgs.push((sum / v1).toFixed(3))
    }
    return avgs
}

// Oblicza średnią czasu rozwiązywania dla każdego zadania.
function countAVG(times) {
    let res = []
    let i = 0
    while (times[i]) {
        let timesArray = times[i]["times"].split(",")
        res.push(timesArray)
        i++
    }
    return arrayOfArraysAVG(res)
}

/* Oblicza statystyki rozwiązania quizu na podstawie odpowiedzi, całkowitego czasu i %
 * czasu spędzonego nad każdym pytaniem, zapisuje podejście w bazie. */
function storeSolution(quizId, quiz, answers, percents, total, user) {
    let size = answers.length
    let penalties = 0
    let times = []
    for (var i = 0; i < size; i++) {
        if (parseInt(answers[i]) != parseInt(quiz[i]["solution"])) {
            penalties += quiz[i]["penalty"];
        }
        let time = (percents[i] * total).toFixed(3);
        times.push(time);
    }
    let insert = db.prepare('INSERT INTO Solutions VALUES (?,?,?,?,?)');
    insert.run(quizId, times.toString(), penalties, total + penalties, user);
    insert.finalize();
}


var app = express();

app.use(cookieParser());
app.use(bodyParser.urlencoded({
    extended: true
    }));
app.use(session({name: "sess", secret: "Shh, its a secret!"}));
app.set('view engine','pug')

app.get('/', function(req, res){
   res.render('index', {user: req.session.user});
});
app.post('/login', function(req, res){
    let login = req.body.login;
    let password = req.body.password;
    getUser(login).then((result) => {
        let row = result[0];
        if (row["password"] === password) {
            req.session.user = login;
            req.session.password = password;
        }
    }).catch(() => {
        req.session.user = login;
        req.session.password = password;
        let insert = db.prepare("INSERT INTO Users VALUES (?,?)");
        insert.run(login, password);
        insert.finalize();
    }).finally(() => {
        res.redirect("/");
    });
})
app.post('/logout', function(req, res){
    req.session.destroy((err) => {
        if (err) {
            return res.redirect("/");
        }
        res.clearCookie("sess");
        res.redirect("/");
    })
})
app.get('/change', function(req, res){
    if(req.session.user) {
        res.render('change');
    } else {
        res.redirect("/");
    }
})
app.post('/change', function(req, res){
    if(req.session.user) {
        let n1 = req.body.new1;
        let n2 = req.body.new2;
        if (n1 === n2) {
            console.log("changing")
            db.run("UPDATE Users SET password = '" + n1 + "' WHERE login = '" + req.session.user + "'");
            req.session.destroy((err) => {
                if (err) {
                    return res.redirect("/");
                }
                res.clearCookie("sess");
                res.redirect("/");
            })
        } else {
            res.redirect("/change");
        }
    } else {
        res.redirect("/");
    }
})

app.get('/menu', function(req, res) {
    if(req.session.user) {
        getQuizes().then((result) => {
            res.render('quiz', {quizes: result, user: req.session.user});
        }).catch(() => {
            res.redirect("/");
        })
    } else {
        res.redirect("/");
    }
})

app.get('/quiz/:id', function(req, res) {
    if(req.session.user) {
        getQuiz(req.params.id).then((result) => {
            getSolutions(req.session.user, req.params.id).then((result1) => {
                if(result1[0]) {
                    res.redirect("/menu");
                } else {
                    req.session.time = Date.now();
                    res.render('quiz', {quizes: [], quiz: result[0]["quiz"], user: req.session.user});
                }
            }).catch(() => {
                req.session.time = Date.now();
                res.render('quiz', {quizes: [], quiz: result[0]["quiz"], user: req.session.user});
            })
        }).catch(() => {
            res.redirect("/menu")
        })
    } else {
        res.redirect("/");
    }
})

app.post('/quiz/:id', function(req, res) {
    if(req.session.user && req.session.time) {
        getQuiz(req.params.id).then((result) => {
            let quizString = result[0]["quiz"];
            let quizJSON = JSON.parse(quizString.replace(/&quot;/g,'"'))
            let answersString = req.body.answers;
            let answersArray = answersString.split(",");
            let percentsString = req.body.percents;
            let percentsArray = percentsString.split(",");
            let total =  Math.round((Date.now() - req.session.time) / 1000)
            storeSolution(req.params.id, quizJSON, answersArray, percentsArray, total, req.session.user)
            res.render('results', {quiz: quizString, answers: answersString, total: total});
        }).catch(() => {
            res.redirect("/menu")
        })
    } else {
        res.redirect("/");
    }
})

app.get('/stats/:id', function(req, res) {
    if(req.session.user) {
        getTop5(req.params.id).then((result) => {
            getTimes(req.params.id).then((result1) => {
                let arr = countAVG(result1)
                res.render('stats', {results: result, user: req.session.user, avgs: arr})
            }).catch(() => {
                res.render('stats', {results: result, user: req.session.user})
            })
            
        })
    }
})
app.listen(3000);