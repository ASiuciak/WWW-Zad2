const sqlite = require('sqlite3').verbose();

let db = new sqlite.Database('quiz.db', (err)=>{
    if (err) {
        console.log('failed to create database')
    }
})

db.serialize(function(){
    db.run("CREATE TABLE Users (login TEXT, password TEXT)");
    db.run("CREATE TABLE Quizes(id NUMBER, quiz TEXT)");
    db.run("CREATE TABLE Solutions(quizId NUMBER, times TEXT, penalties NUMBER, total NUMBER, user TEXT)");
    let insertUsers = db.prepare("INSERT INTO Users VALUES (?,?)");
    insertUsers.run("user1", "user1");
    insertUsers.run("user2", "user2");
    insertUsers.finalize();
    let insertQuizes = db.prepare("INSERT INTO Quizes VALUES (?,?)");
    let q1 = [{ "task": "2 + 2 * 2 = ", "solution": 6, "penalty": 7 },
    { "task": "3 - (-6 : 2) = ", "solution": 6, "penalty": 15 },
    { "task": "14 - 4 + 6 * 2 - 91 : 13 = ", "solution": 15, "penalty": 50 },
    { "task": "4 * 6 : 8 + 10 = ", "solution": 13, "penalty": 25 },
    { "task": "12 + (111 - 8 * 7) = ", "solution": 67, "penalty": 30 }
    ];
    let q2 = [{ "task": "3 + 8 - 10 = ", "solution": 1, "penalty": 5 },
    { "task": "(18 + 19 * 3) : (5^2) = ", "solution": 3, "penalty": 20 },
    { "task": "13 * 14 - 15 * 7 = ", "solution": 77, "penalty": 45 }
    ];
    let q3 = [{ "task": "-8 - (-8 - (-8) * (-8)) = ", "solution": 64, "penalty": 45 },
    { "task": "2^10 - 24 = ", "solution": 1000, "penalty": 10 },
    { "task": "(144 - 5!) : 8 = ", "solution": 3, "penalty": 25 },
    { "task": "4 * 4 + 6 * 2 - 7 * 7 + 22 = ", "solution": 1, "penalty": 40 },
    { "task": "222 : 3 + 8 * 4 = ", "solution": 106, "penalty": 30 },
    { "task": "[-18 - (7 - 10)] ^ 2 = ", "solution": 225, "penalty": 50}
    ];
    insertQuizes.run(1, JSON.stringify(q1));
    insertQuizes.run(2, JSON.stringify(q2));
    insertQuizes.run(3, JSON.stringify(q3));
    insertQuizes.finalize();
})

db.close();