//Define the variable 
const express = require('express');
const res = require('express/lib/response');
const bcrypt = require("bcrypt");


//const app = express();
const app = require('express')();
const port = process.env.PORT || 3000;
const fs = require("fs");
app.set('views','./views');
app.set('viewengine','ejs');
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true })); 
// Enable cookie parsing (and writing)
const cookieParser = require("cookie-parser");
app.use(cookieParser());


//Basic authentification
const basicAuth = require("express-basic-auth");


// Authentification section !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!



// Authentification with encrypted CSV
const encryptedPasswordAuthorizer = (username, password, cb) => {
  // Parse the CSV file: this is very similar to parsing students!
  parseCsvWithHeader("./users.csv", (err, users) => {
    // Check that our current user belong to the list
    const storedUser = users.find((possibleUser) => {
      // NOTE: a simple comparison with === is possible but less safe
      return basicAuth.safeCompare(possibleUser.username, username);
    });
    // NOTE: this is an example of using lazy evaluation of condition
    if (!storedUser) {
      // username not found
      cb(null, false);
    } else {
      // now we check the password
      // bcrypt handles the fact that storedUser password is encrypted
      // it is asynchronous, because this operation is long
      // so we pass the callback as the last parameter
      bcrypt.compare(password, storedUser.password, cb);
    }
  });
};

//Authentification with clear CSV
const clearPasswordAuthorizer = (username, password, cb) => {
  // Parse the CSV file: this is very similar to parsing students!
  parseCsvWithHeader("./users-clear.csv", (err, users) => {
    //console.log(users);
    // Check that our current user belong to the list
    const storedUser = users.find((possibleUser) => {
      // NOTE: a simple comparison with === is possible but less safe
      return basicAuth.safeCompare(username, possibleUser.username);
    });
    // NOTE: this is an example of using lazy evaluation of condition
    if (!storedUser || !basicAuth.safeCompare(password, storedUser.password)) {
      cb(null, false);
    } else {
      cb(null, true);
    }
  });
};

 // Validate the authentification, so you have to pass the right function that you want to use
app.use(basicAuth({
  authorizer: encryptedPasswordAuthorizer,
  authorizeAsync: true,
  challenge: true,
}))



// POST AND GET request without api !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




// Where you arrive when you connect to the local server (html file)
app.get('/', (req, res) => {
  const path = require("path");
  res.sendFile(path.join(__dirname, "./views/home.html"))
  console.log("Arriver sur localhost:3000")
  })

// Display information about create a student
app.get('/students/create', (req, res) => {
  res.render("create-students.ejs");
  
});
// Display information about D3 
app.get('/students/data', (req, res) => {
  console.log("/students/data");
  
  res.render("students_data.ejs");
  
});

//Create a student on the localserver
app.post("/students/create", (req, res) => {
  console.log(req.body);
  const student = req.body;
  storeStudentInCsvFile(student, (err, storeResult) => {
    if (err) {
      res.redirect("/students/create?error=1");
    } else {
      res.redirect("/students/create?created=1");
    }
  });
});

// Open the exel file where you can see all the informations 
app.get('/students', (req, res) => {
  const rowSeparator="\n";
  const cellSeparator=",";
  fs.readFile('./students.csv', 'utf8', function (err, data) {
    const rows = data.split(rowSeparator)
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);
    const students = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student
    })
    //console.log(students);
    res.render("students.ejs",{students: students})
  });
  })

//Controle section !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//Exercice 1 :

app.get("/students/:id", (req,res) =>{
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile("./students.csv", "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const student = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const student = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return student;
    });
    const One_student = student[req.params.id] 

    res.render("student_details.ejs",{One_student,} );
  });
}); 

app.post("/students/:id", (req,res) =>{

  fs.readFile("./students.csv", "utf-8", (err,data) =>{
    var list_student = data.toString().split("\n");
    let title_student = list_student[0].split(",")
    let jsonfile =[]

    for (let i = 1; i < list_student.length ; i++) {
      let dictionnary = {}  
      let properties = list_student[i].split(",")
      //console.log(properties)
      for (let j in title_student) {dictionnary[title_student[j]] = properties[j]} 
      jsonfile.push(dictionnary)
    }
    //console.log(jsonfile)
    const name = req.body.name   
    const school= req.body.school
    console.log(name,school,"with the id : ",req.params.id)
    //Change the name and the school at the right place thanks to the ID corresponding to the object in our json
    jsonfile[req.params.id].name = name
    jsonfile[req.params.id].school = school 
   //Change the json format into a CSV format btw my delimiter are , and not ; (usual case)
   
    const header = Object.keys(jsonfile[0])
    //console.log(header)
    const csv = [
      header.join(','), 
      ...jsonfile.map(row => header.map(fieldName => JSON.stringify(row[fieldName])).join(','))
    ].join('\n').replace(/"/g,'') 

  //Write in the csv W mode
  fs.writeFile("./students.csv", csv,{flag: 'w'},(err) =>{
    res.redirect("/students/")
  });
});
});

// API ssection !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!





// Not real login but just a demo of setting an auth token
// using secure cookies

/*
POUR INSOMNIA :
"Basic " + Buffer.from("admin:supersecret").toString("base64");
with admin = user
and  password = supersecret
Cela permet de s'idnetifier sur INSOMNIA cela marche aussi avec les users et les mtps du csv  

*/ 


app.post("/api/login", (req, res) => {
  console.log("current cookies:", req.cookies);
  // We assume that you check if the user can login based on "req.body"
  // and then generate an authentication token
  const token = "FOOBAR";
  const tokenCookie = {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
  };
  res.cookie("auth-token", token, tokenCookie);
  res.send("OK");
});





// Print csv file with the students 
app.get('/api/students',(req,res)=>{
  const rowSeparator="\n";
  const cellSeparator=",";
  fs.readFile('students.csv', 'utf8', function (err, data) {
  //var dataArray = data.split(/\r?\n/);
  const rows = data.split(rowSeparator)
  const [headerRow, ...contentRows] = rows;
  const header = headerRow.split(cellSeparator);
  const students = contentRows.map((row) => {
    const cells = row.split(cellSeparator);
    const student = {
      [header[0]]: cells[0],
      [header[1]]: cells[1],
    };
    return student
  })
  //console.log(students);
  res.send(students)
});

 // res.send([{ name: "Eric Burel", school: "EPF" }, { name: "HarryPotter", school: "Poudlard"}])
})
app.use(express.json())
app.post('/api/students/create', function (req, res, next) {
  console.log(req.body)
  const csvLine =  `\n${req.body.name},${req.body.school}`;
  console.log(csvLine)
  const write= fs.writeFile(
    "./students.csv",
    csvLine,
    { flag: "a"},
    (err) => {
      res.send("Tout est bon")
    }
  );
});

app.listen(port, () => {
  console.log(`Ouvrez http://localhost:3000`);
})



// Functionssss section !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!




const storeStudentInCsvFile = (student, cb) => {
  const csvLine = `\n${student.name},${student.school}`;
  console.log(csvLine);
  fs.writeFile("./students.csv", csvLine, { flag: "a" }, (err) => {
    cb(err, "ok");
  });
};




const parseCsvWithHeader = (filepath, cb) => {
  const rowSeparator = "\n";
  const cellSeparator = ",";
  // example based on a CSV file
  fs.readFile(filepath, "utf8", (err, data) => {
    const rows = data.split(rowSeparator);
    // first row is an header I isolate it
    const [headerRow, ...contentRows] = rows;
    const header = headerRow.split(cellSeparator);

    const items = contentRows.map((row) => {
      const cells = row.split(cellSeparator);
      const item = {
        [header[0]]: cells[0],
        [header[1]]: cells[1],
      };
      return item;
    });
    return cb(null, items);
  });
};