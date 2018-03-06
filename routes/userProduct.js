var express = require('express');
var router = express.Router();

var fs = require('fs');
var readstream = fs.createReadStream('./db.json');

var jsonData = [];
var categoryValue={};
readstream.on('data', data => {
  jsonData = JSON.parse(data);
});


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ jsonData });
});

router.get('/add', function (req, res, next) {
  res.json({ jsonData });
});

router.post('/addProd', function (req, res, next) {
  var userProducts = req.body;
  var productId = jsonData.customerProducts.length;
  userProducts.id = ++productId;
  jsonData.customerProducts.push(userProducts);
  var writeStream = fs.createWriteStream('./db.json');
  writeStream.write(JSON.stringify(jsonData), error => {
    if (error) {
      throw error;
    } else {
      let message = "Product Added Succesfully";
      res.status(200).json({ message });
      console.log(message, "message");
    }
  })
});

router.get("/editProd/:id", function (req, res) {
  var editId = req.params.id;
  console.log(editId, "cccc");
  var editIndex = jsonData.customerProducts.findIndex(userProd => userProd.id == editId);
  console.log(editIndex, "editIndex");
  res.json({ userProdDetails: jsonData.customerProducts[editIndex] });
});

router.post("/editProd", function (req, res) {
  var editProducts = req.body;
  var editProdId = editProducts.id;
  var editProdIndex = jsonData.customerProducts.findIndex(userProd => userProd.id == editProdId);
  editProducts.id = editProdId;
  console.log(editProdIndex, "editProdIndex");
  if (editProdIndex != -1) {
    jsonData.customerProducts[editProdIndex] = editProducts;
    console.log(editProdIndex, "editIndex");
    var writeStream = fs.createWriteStream('./db.json');
    writeStream.write(JSON.stringify(jsonData), error => {
      if (error) {
        throw error;
      } else {
        let editMessage = "Your" + editProdId + "Product Edited Succesfully";
        res.status(200).json({ userProdDetails: jsonData.customerProducts, editMessage });
        console.log(editMessage, "message");
      }
    })
  } else {
    let invalidMessage = "invalid Id";
    res.status(200).json({ invalidMessage });
    console.log(invalidMessage, "message");
  }

});


router.get("/deleteProd/:id", function (req, res) {
  var deleteId = req.params.id;
  var deleteIndex = jsonData.customerProducts.findIndex(userProd => userProd.id == deleteId);
  console.log(deleteIndex, "message");
  if (deleteIndex != -1) {
    jsonData.customerProducts.splice(deleteIndex, 1);
    var writeStream = fs.createWriteStream('./db.json');
    writeStream.write(JSON.stringify(jsonData), error => {
      if (error) {
        throw error;
      } else {
        let deleteMessage = "Your " + deleteId + " Product deleted Succesfully";
        res.status(200).json({ userProdDetails: jsonData.customerProducts, deleteMessage });
      }
    });
  } else {
    let invalidMessage = "invalid Id";
    res.status(200).json({ invalidMessage });
    console.log(invalidMessage, "message");
  }
});

router.get("/findProd/:term", function (req, res) {
  var term = req.params.term;
  var termIndex = jsonData.customerProducts.findIndex(userProd => userProd.id == term || userProd.productName == term);
  console.log(termIndex, "termssss");
  if (termIndex != -1) {
    res.status(200).json({ userProdDetails: jsonData.customerProducts[termIndex] });
  } else {
    let invalidMessage = "invalid Id/ProductName";
    res.status(200).json({ invalidMessage });
    console.log(invalidMessage, "message");
  }
});

router.get("/searchProd/:prodName", function (req, res) {
  var prodname = req.params.prodName;
  var prodIndex = jsonData.customerProducts.findIndex(search => search.productName == prodname);
  console.log(prodIndex, "product");
  if (prodIndex != -1) {
    res.status(200).json({ userProdDetails: jsonData.customerProducts[prodIndex] });
  }
  else {
    let message = "invalid ProductName";
    res.status(200).json({ message });
    console.log(message, "message");
  }
});

router.get("/globalfind/:searchval", function (req, res) {
  var getvalue = req.params.searchval.toLowerCase();
  var getsearchDetails = [];
  getsearchDetails = jsonData.customerProducts.filter(obj => {
    return Object.keys(obj).some(key => {
      return obj[key].toString().toLowerCase().includes(getvalue)});
    });
  console.log("getgetails", getsearchDetails);
  res.json({globalfindsearch:getsearchDetails});
});


router.get("/searchByCategory", function(req,res){
let category=[];

for(let i=0;i< jsonData.customerProducts.length;i++){
  category.push(jsonData.customerProducts[i].category);
}
console.log(category,"category");
for(let j=0;j<category.length-1;j++){
for(let i=1;i <category.length;i++){
  if(category[i]==category[j]){
    category.splice(i,i++);
  }
}
}

  for (let i = 0; i < category.length; i++) {
    let finalCategory = [];
    let count = 0;
    for (j = 0; j < jsonData.customerProducts.length; j++) {
      if (category[i] == jsonData.customerProducts[j].category) {
        finalCategory[count] = jsonData.customerProducts[j];
        count++;
      }
    }
    categoryValue[category[i]] = finalCategory;
  }
  res.json({ CategoryList: categoryValue });
  console.log("categoryValue", categoryValue);
});
 

module.exports = router;
