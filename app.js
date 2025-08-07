const express= require("express");
const app =express(); 
const mongoose =require ("mongoose");
const Listing=require("./models/listing.js");
const Path = require("path"); 
const methodOverride = require("method-override");
const ejsmate=require("ejs-mate");
const path = require("path");

main()
     .then(() => {
        console.log("Connected to MongoDB");
     })
     .catch((err) => {
        console.error("Error connecting to MongoDB", err);
    });

async function main() {
        await mongoose.connect("mongodb://localhost:27017/wanderlust");
    }
app.use(express.static(path.join(__dirname,"/public"))) ;   
app.engine('ejs',ejsmate);    
app.set("view engine","ejs");
app.set("views",Path.join(__dirname,"views"));    
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


    app.get("/",(req,res)=>{
    res.send("Hello World");
});

app.get("/listings",async(req,res)=>{
    const allListings= await Listing.find({});
    res.render("listings/index",{allListings}); 
    console.log("rendered listings");
}); 

app.get("/listings/new", (req, res) => {
  res.render("listings/new"); 
});

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing= await Listing.findById(id);
    res.render("listings/show",{listing});
    console.log("rendered listing with id:", id);
});

app.post("/listings",async(req,res)=>{
const newListing=new Listing(req.body.listing);
await newListing.save();
res.redirect("/listings");
});

app.get("/listings/:id/edit", async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit", { listing });
});

app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id,{ ...req.body.listing });
  res.redirect("/listings");
});

app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;  
    let deletedlisting =await Listing.findByIdAndDelete(id);
    console.log("Deleted listing:", deletedlisting);
    res.redirect("/listings");
});

app.listen(8080,()=>{
    console.log(
        "Server is running on port 8080"
    );
})


