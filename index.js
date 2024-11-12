import express from "express";
import pg from "pg";
import bodyParser from "body-parser";
import bcrypt, { hash } from "bcrypt";
import passport from "passport";
import session from "express-session";
import { Strategy } from "passport-local";
import GoogleStrategy from "passport-google-oauth2";
import env from "dotenv";


const app = express();
const port = 3000;
const saltRounds = 12;
env.config();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database:"Booking",
    password:"408070",
    port:5432,
})
db.connect();

let location,fname,id1,lname,email,id,ph_no,passwd,user,hotel,mybooks,hname,USD,india,EUR,AED,GBP,CNY,price,email12,result12,
no_adult,no_children,check_in,check_out,no_rooms,checkin,checkout,day,currency;

app.get("/",async(req,res)=>{
  const result = await db.query("SELECT * FROM hotels LIMIT 9");
  hotel = result.rows;
    res.render('index.ejs',{hotels:hotel});
})
app.post("/paymentsuccessful",async(req,res)=>{
  const result = await db.query("SELECT * FROM hotels")
  let type = req.body.type;
  let check_in = result12.rows[0].check_in;
  let check_out = result12.rows[0].check_out;
  let no_rooms = result12.rows[0].no_of_rooms;
  var today = new Date();
  var year = today.getFullYear();
  var month = String(today.getMonth() + 1).padStart(2, '0');
  var day = String(today.getDate()).padStart(2, '0');
  let bd = year+"-"+month+'-'+day;
  if(id1 == 1){
  const result = await db.query("INSERT INTO booking (hotel_name,location,email,check_in,check_out,rooms,adults,child,booking_date)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) returning id",
  [hname,location,email,check_in,check_out,no_rooms,no_adult,no_children,bd]);
  id = result.rows[0].id;
  }
  id1 = 0;
  res.render("paymentsuccessful.ejs",{id:id,bd:bd,location:location,hotel:hname,type:type,price:price,USD:USD,india:india,EUR:EUR,AED:AED,GBP:GBP,CNY:CNY,user:user,check_in:check_in,check_out:check_out,rooms:no_rooms,email:email12});
})

app.get("/createaccount",(req,res)=>{
  res.render('createaccount.ejs');
})
app.get("/contact",(req,res)=>{
  res.render("contact.ejs",{user:user});
})
app.get("/home",async(req,res)=>{
  const result = await db.query("SELECT * FROM hotels LIMIT 9");
  hotel = result.rows;
    res.render('index.ejs',{user:user,hotels:hotel});
})

app.get("/auth/google/home",passport.authenticate("google",{
  successRedirect:"/home",
  failureRedirect:"/user",
}))

app.get("/user",(req,res)=>{
  res.render("login.ejs");
})

app.get("/auth/google",passport.authenticate("google",{
  scope: ["profile", "email"],

}))

app.get("/profile",async (req,res)=>{
  if(req.isAuthenticated()){
  const result = await db.query("SELECT * FROM users WHERE email_id = $1",[email])
  fname = result.rows[0].first_name;
  lname = result.rows[0].last_name;
  const name = fname+" "+lname;
  email = result.rows[0].email_id;
  ph_no = result.rows[0].phone_number;
  res.render("profile.ejs",{user:fname,name:name,email:email,phone:ph_no});
  user = fname;
  }
  else{
    res.redirect("/user");
  }
})
app.get("/about",(req,res)=>{
  res.render("aboutus.ejs",{user:user});
})
app.get("/hotel",async(req,res)=>{
  const result = await db.query("SELECT * FROM hotels");
  USD = "USD";
  india = "";
  EUR = "";
  AED = "";
  GBP = "";
  CNY = "";
  hotel = result.rows;
  res.render("hotel.ejs",{hotels:hotel,USD:USD});
})
app.get("/mybooking",async(req,res)=>{
  const result = await db.query("SELECT * FROM booking WHERE email = $1",[email]);
  mybooks=result.rows;
  res.render("mybooking.ejs",{price:price,USD:USD,india:india,EUR:EUR,AED:AED,GBP:GBP,CNY:CNY,user:user,mybooks:mybooks});
})

app.post("/home",async(req,res)=>{
  let currency = req.body.currency;
  res.render("index.ejs",{currency:currency,hotels:hotel});
});
app.post("/search",async(req,res)=>{
  var hotel1 = req.body.hotelname;
  var loc = req.body.location;
  if(req.body.USD){
    USD = "USD";
    india = "";
    EUR = "";
    AED = "";
    GBP = "";
    CNY = "";
    var pr = req.body.USD
  var left = parseFloat(pr.substring(0,4));
  var right = parseFloat(pr.substring(5,pr.length));
  console.log("USD");
  currency = USD;
} else if(req.body.INR){
  india = "INR";
  USD = "";
  EUR = "";
  AED = "";
  GBP = "";
  CNY = "";
  var pr = req.body.INR;
  var left = parseFloat(pr.substring(0,5));
  console.log(left);
  left = left/83;
  var right = parseFloat(pr.substring(6,pr.length));
  console.log(right);
  right = right/83;
  console.log(req.body.INR);
  console.log(left,right);
  currency = india;
} else if(req.body.EUR){
  EUR = "EUR";
  USD = "";
  india = "";
  AED = "";
  GBP = "";
  CNY = "";
  var pr = req.body.EUR;
  var left = parseFloat(pr.substring(0,4));
  left = left/0.85;
  var right = parseFloat(pr.substring(5,pr.length));
  right = right/0.85;
  currency = EUR;
} else if(req.body.AED){
  AED = "AED";
  USD = "";
  india = "";
  EUR = "";
  GBP = "";
  CNY = "";
  var pr = req.body.AED;
  var left = parseFloat(pr.substring(0,4));
  left = left/3.67;
  var right = parseFloat(pr.substring(5,pr.length));
  right = right/3.67;
  currency = AED;
} else if(req.body.GBP){
  GBP = "GBP";
  USD = "";
  india = "";
  EUR = "";
  AED = "";
  CNY = "";
  var pr = req.body.GBP;
  var left = parseFloat(pr.substring(0,4));
  left = left/0.72;
  var right = parseFloat(pr.substring(5,pr.length));
  right = right/0.72;
  currency = GBP;
} else if(req.body.CNY){
  CNY = "CNY";
  USD = "";
  india = "";
  EUR = "";
  AED = "";
  GBP = "";
  var pr = req.body.CNY;
  var left = parseFloat(pr.substring(0,4));
  left = left/6.45;
  var right = parseFloat(pr.substring(5,pr.length));
  right = right/6.45;
  currency = CNY;
}
  if(hotel1 && loc && pr){
  const result = await db.query("SELECT * FROM hotels WHERE LOWER(hotelname) LIKE '%' || $1 || '%' and UPPER(location) LIKE '%' || $2 || '%' and pricepernight >= $3 and pricepernight <= $4",[hotel1.toLowerCase(),loc.toUpperCase(),left,right]);
  hotel = result.rows;
  if(currency == "USD"){
    USD = "USD";
    india = "";
    EUR = "";
    AED = "";
    GBP = "";
    CNY = "";
    res.render("hotel.ejs",{hotels:hotel,USD:USD});
  } else if(currency == "INR"){
    india = "INR";
    USD = "";
    EUR = "";
    AED = "";
    GBP = "";
    CNY = "";
    res.render("hotel.ejs",{hotels:hotel,india:india});
  } else if(currency == "EUR"){
    EUR = "EUR";
    USD = "";
    india = "";
    AED = "";
    GBP = "";
    CNY = "";
    res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
  } else if(currency == "AED"){
    AED = "AED";
    USD = "";
    india = "";
    EUR = "";
    GBP = "";
    CNY = "";
    res.render("hotel.ejs",{hotels:hotel,AED:AED});
  } else if(currency == "GBP"){
    GBP = "GBP";
    USD = "";
    india = "";
    EUR = "";
    AED = "";
    CNY = "";
    res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
    } else {
      CNY = "CNY";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
    }
  }
  else if (hotel1 && loc){
    const result = await db.query("SELECT * FROM hotels WHERE (hotelname) LIKE '%' || $1 || '%' and UPPER(location) LIKE '%' || $2 || '%'",[hotel1,loc.toUpperCase()]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
  else if (hotel1 && pr){
    const result = await db.query("SELECT * FROM hotels WHERE LOWER(hotelname) LIKE '%' || $1 || '%' and pricepernight >= $2 and pricepernight <= $3",[hotel1.toLowerCase(),left,right]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
  else if (loc && pr){
    const result = await db.query("SELECT * FROM hotels WHERE UPPER(location) LIKE '%' || $1 || '%' and pricepernight >= $2 and pricepernight <= $3",[loc.toUpperCase(),left,right]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
  else if(hotel1){
    const result = await db.query("SELECT * FROM hotels WHERE LOWER(hotelname)LIKE '%' || $1 || '%';",[hotel1.toLowerCase()]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
  else if(loc){
    const result = await db.query("SELECT * FROM hotels WHERE UPPER(location) LIKE '%' || $1 || '%';",[loc.toUpperCase()]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
  else if(pr){
    const result = await db.query("SELECT * FROM hotels WHERE pricepernight >= $1 and pricepernight <= $2",[left,right]);
    hotel = result.rows;
    if(currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,USD:USD});
    } else if(currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,india:india});
    } else if(currency == "EUR"){
      EUR = "EUR";
      USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
    } else if(currency == "AED"){
      AED = "AED";
      USD = "";
      india = "";
      EUR = "";
      GBP = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,AED:AED});
    } else if(currency == "GBP"){
      GBP = "GBP";
      USD = "";
      india = "";
      EUR = "";
      AED = "";
      CNY = "";
      res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
      } else {
        CNY = "CNY";
        USD = "";
        india = "";
        EUR = "";
        AED = "";
        GBP = "";
        res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
      }
  }
})

app.post("/payment",async(req,res)=>{
  result12 = await db.query("INSERT INTO reservation values($1,$2,$3,$4,$5,$6,$7,$8) Returning *",[req.body.name,req.body.checkin,req.body.checkout,
  req.body.norooms,req.body.noadult,req.body.nochildren,req.body.email,req.body.phone]);
  let name = result12.rows[0].name;
  check_in = result12.rows[0].check_in;
  check_out = result12.rows[0].check_out;
  no_rooms = result12.rows[0].no_of_rooms;
  no_adult = result12.rows[0].no_of_adults;
  no_children = result12.rows[0].no_of_children;
  email12 = result12.rows[0].email;
  let phone1 = result12.rows[0].phone;
  id1=1;
  checkin = req.body.checkin;
  checkout = req.body.checkout;
  let day1 = parseInt(checkin.substring(8, 10));
  let day2 = parseInt(checkout.substring(8, 10));
  day = day2-day1;
  price = price*day;

  res.render("payment.ejs",{USD:USD,india:india,EUR:EUR,AED:AED,GBP:GBP,CNY:CNY,name:name,check_in:check_in,check_out:check_out,rooms:no_rooms,email:email12,phone:phone1,hotel:hname,price:price,user:user});
})
app.get("/forgot",(req,res)=>{
  res.render("forgotpassword.ejs");
})
app.post("/booking",(req,res)=>{
  if(req.isAuthenticated()){
      hname = req.body.hotelname;
      price = req.body.price;
      location = req.body.location;
    res.render("booking.ejs");
  }
  else{
    res.redirect("/user");
  }
})

app.post("/profile_edit",async(req,res)=>{
  res.render("profile-edit.ejs",{user:user});
})

app.post("/profile-edit",async(req,res)=>{
   fname = req.body.firstname;
   lname = req.body.lastname;
   const email1 = req.body.email;
   ph_no = req.body.phone;
  if(!fname){
   const result = await db.query("UPDATE users SET last_name=$1,email_id=$2,phone_number=$3 WHERE email_id = $4",[
    lname,email1,ph_no,email
   ])
   email = email1
  }
  else if(!ph_no ){
    const result = await db.query("UPDATE users SET first_name=$1,last_name=$2,email_id=$3 WHERE email_id = $4",[
     fname,lname,email1,email
    ])
    email = email1
   }
   else if(!lname){
    const result = await db.query("UPDATE users SET first_name=$1,email_id=$3,phone_number=$4 WHERE email_id = $4",[
     fname,email1,ph_no,email
    ])
    email = email1
   }
   if(!email1){
    const result = await db.query("UPDATE users SET first_name=$1,last_name=$2,phone_number=$4 WHERE email_id = $4",[
     fname,lname,ph_no,email
    ])
   }
   if(fname,lname,email1,ph_no){
    const result = await db.query("UPDATE users SET first_name=$1,last_name=$2,email_id=$3,phone_number=$4 WHERE email_id = $5",[
     fname,lname,email1,ph_no,email
    ])
    email = email1
   }
   res.redirect("/profile");
})

app.get("/logout",(req,res)=>{
  req.logout((err)=>{
    if(err)
      console.log(err);
    user='';
    email='';
    res.redirect("/");
  })
})

app.post("/create",(req,res)=>{
  res.render('createaccount.ejs');
})

app.post("/user",passport.authenticate('local',{
  successRedirect: '/home',
  failureRedirect: '/user',
})
);

app.post("/filter",async(req,res)=>{
  if(req.body.filter == "priceHighToLow"){
    if(req.body.currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
    hotel = result.rows;
    console.log(hotel)
    res.render("hotel.ejs",{hotels:hotel,USD:USD});
    }
    if(req.body.currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
    hotel = result.rows;
    res.render("hotel.ejs",{hotels:hotel,india:india});
    }
      if(req.body.currency == "EUR"){
        EUR = "EUR";
        USD = "";
        india = "";
        AED = "";
        GBP = "";
        CNY = "";
        const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
    hotel = result.rows;
    console.log(hotel)
    res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
      }
        if(req.body.currency == "AED"){
          AED = "AED";
          USD = "";
          india = "";
          EUR = "";
          GBP = "";
          CNY = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,AED:AED});
        }
        if(req.body.currency == "GBP"){
          GBP = "GBP";
          USD = "";
          india = "";
          EUR = "";
          AED = "";
          CNY = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
        }
        if(req.body.currency == "CNY"){
          CNY = "CNY";
          USD = "";
          india = "";
          EUR = "";
          AED = "";
          GBP = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight DESC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
        }
  }
  else if(req.body.filter == "priceLowToHigh"){
    if(req.body.currency == "USD"){
      USD = "USD";
      india = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
    hotel = result.rows;
    console.log(hotel)
    res.render("hotel.ejs",{hotels:hotel,USD:USD});
    }
    if(req.body.currency == "INR"){
      india = "INR";
      USD = "";
      EUR = "";
      AED = "";
      GBP = "";
      CNY = "";
      const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
    hotel = result.rows;
    console.log(hotel)
    res.render("hotel.ejs",{hotels:hotel,india:india});
    }
      if(req.body.currency == "EUR"){
        EUR = "EUR";
        USD = "";
      india = "";
      AED = "";
      GBP = "";
      CNY = "";
        const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
    hotel = result.rows;
    console.log(hotel)
    res.render("hotel.ejs",{hotels:hotel,EUR:EUR});
      }
        if(req.body.currency == "AED"){
          AED = "AED";
          USD = "";
          india = "";
          EUR = "";
          GBP = "";
          CNY = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,AED:AED});
        }
        if(req.body.currency == "GBP"){
          GBP = "GBP";
          USD = "";
          india = "";
          EUR = "";
          AED = "";
          CNY = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,GBP:GBP});
        }
        if(req.body.currency == "CNY"){
          CNY = "CNY";
          USD = "";
          india = "";
          EUR = "";
          AED = "";
          GBP = "";
          const result = await db.query("SELECT * FROM hotels ORDER BY pricepernight ASC");
          hotel = result.rows;
          console.log(hotel)
          res.render("hotel.ejs",{hotels:hotel,CNY:CNY});
        }
  }
})
app.post("/submit",async(req,res)=>{
    fname = req.body.firstname;
    lname = req.body.lastname;
    email = req.body.email;
    ph_no = req.body.phonenumber;
    passwd = req.body.password;
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email_id = $1", [
        email,
      ]);
    
      if (checkResult.rows.length > 0) {
        res.send("Email already exists. Try logging in.");
      } else {
        bcrypt.hash(passwd,saltRounds,async(err,hash)=>{
          if(err){
            console.log(err);
          }
          else{
          await db.query(
            "INSERT INTO users VALUES ($1,$2,$3,$4,$5)",
            [fname,lname,email,ph_no,hash]
          );
          user = fname;
          req.login(user, (err) => {
            console.log("success");
            res.redirect("/home");
          });
          }
        })
      }
      } catch (err) {
        console.log(err);
      }

})
passport.use('local',
  new Strategy(async function verify(username, password, cb) {
    try{
    const result = await db.query("SELECT * FROM users WHERE email_id = $1",[
      username
    ])
    if(result.rows.length > 0){
      user = result.rows[0].first_name;
      email = result.rows[0].email_id;
      const strpasswd = result.rows[0].password;
      bcrypt.compare(password,strpasswd,(err,result)=>{
        if (err) {
          return cb(err)
        } else {
          if (result) {
            return cb(null, user)
          } else {
            return cb(null, false);
          }
        }
      });
    } else {
      return cb("User not found");
    }
  } catch (err) {
  console.log(err);
  }
  }))

  passport.use("google",new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/home",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    }, 
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);
      user = profile.given_name;
      email = profile.email;
      try{
        const result = await db.query("SELECT * FROM users WHERE email_id = $1",[profile.email]);
        if(result.rows.length === 0){
          const newUser = await db.query("INSERT INTO users VALUES($1,$2,$3,$4,$5) Returning * ",[profile.given_name,profile.family_name,profile.email,"Not given","google"])
          console.log(newUser.rows);
          cb(null,newUser.rows[0])
        } else {
          cb(null,result.rows[0])
        }
      }catch (err){
        cb(err);
      }
  } 
  ))

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((user, cb) => {
  cb(null, user);
});

app.listen(port, ()=>{
    console.log(`Listening to server ${port}`);
});



