const express= require("express");
const bodyParser=require("body-parser");
const app=express();
app.set("view engine" , "ejs");
app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname + "/dosyalar"));

const mongoose=require("mongoose");
const Schema=mongoose.Schema;


mongoose.connect("mongodb+srv://eferide:1234@cluster0.czbkz.mongodb.net/Cluster0?retryWrites=true&w=majority" , {useNewUrlParser :true, useUnifiedTopology :true });

var yapilacakListesi = new Schema(
  {
    gorev : String,
    tarih : Date
  }
);

var Gorev = mongoose.model("Gorev",yapilacakListesi);

Gorev.findOneAndUpdate({gorev:"Yemek Yap"} , {gorev:"Kitap Oku"},function(err,results){
  console.log(results);
});




// Modele göre 3 tane döküman oluşturalım.

var gorev1 =new Gorev(
  {
    gorev:"ToDoList'e Hoşgeldin.",
    tarih:new Date()
  }
);

var gorev2 =new Gorev(
  {
    gorev:"+ butonuna tıklayarak veri ekleyebilirsin.",
    tarih:new Date()
  }
);

var gorev3 =new Gorev(
  {
    gorev:"<-- Görevi silmek için tıklayın",
    tarih:new Date()
  }
);

/*
gorev1.save();
gorev2.save();
gorev3.save();
*/


app.get("/", function(req, res) {
    Gorev.find({} ,null , {sort : {tarih : "desc"}}, function(err, gelenVeriler){
      console.log(gelenVeriler);
      if(gelenVeriler.length < 1){
        var array=[gorev1,gorev2,gorev3]
        Gorev.insertMany(array, function(err,results){
          res.redirect("/");
        });

      }else{
        res.render("anasayfa", {  gorevler : gelenVeriler });
      }
    });
});

app.post("/ekle", function(req,res){
  var gelenAciklama=req.body.gorevAciklama;
  var gorev =new Gorev(
    {
      gorev:gelenAciklama,
      tarih:new Date()
    }
  );

  gorev.save(function(){
    res.redirect("/");
  });

});

app.post("/sil", function(req,res){
var dokumanID=req.body.id;

Gorev.deleteOne({ _id :dokumanID},function(err){
  res.redirect("/");
});
});






let port = process.env.PORT;
if(port == "" || port == null){
  port = 5000;
}
app.listen(port, function(){
  console.log("port : " + port);
});
