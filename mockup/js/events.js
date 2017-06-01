//Data

var cats = [
  {
    id: 1,
    picture: "Resources/Pictures/Cat_1.png",
    name: "Margo",
    age: "5",
    color: "White",
    price: "50",
    isKitten: false,
    size: 'medium'
  },
  {
    id: 2,
    picture: "Resources/Pictures/Cat_2.png",
    name: "Vaksa",
    age: "10",
    color: "Gray",
    price: "20",
    isKitten: false,
    size: 'medium'
  },
  {
    id: 3,
    picture: "Resources/Pictures/Cat_3.png",
    name: "Mr Wiggles",
    age: "12",
    color: "Red",
    price: "35",
    isKitten: false,
    size: 'large'
  },
  {
    id: 4,
    picture: "Resources/Pictures/Cat_4.png",
    name: "Boris",
    age: "1",
    color: "Gray",
    price: "50",
    isKitten: true,
    size: 'small'
  }
];
var cart = [];

//Main Elements

var container = document.getElementById('container');
var header = document.getElementById('header');
var catalog = container.$.catalog;

//Loading page

var catsJson = JSON.stringify(cats);
catalog.setAttribute('cats', catsJson);

//Functions for filtering

function filterContent(event) {
  var filtered = cats.filter(function(cat) {
    return isInFilter(cat, event);
  });
  
  if (filtered.length === 0) {
    alert('No items fit your filter!');
    catalog.setAttribute('cats', JSON.stringify(cats));
  }
  else {
    var catsJson = JSON.stringify(filtered);
    catalog.setAttribute('cats', catsJson);
  }
}

function isInFilter(cat, event) {
  function isFitPrice() {
    return cat.price >= event.detail.price.from && cat.price <= event.detail.price.to;
  }
  
  function isFitAge() {
    return cat.age >= event.detail.age.from && cat.age <= event.detail.age.to;
  }
  
  return  isFitPrice() && 
          isFitAge() &&
          event.detail.size[cat.size] &&
          event.detail.color[cat.color] &&
          (event.detail.onlyKittens ? cat.isKitten : true); 
}

//Functions for cart

function addCatToCart(event) {
  var ids = cart.map(function(item) { return item.id; });
  
  if (!ids.includes(event.detail.cat.id)) {
    cart.push(event.detail.cat);
    var price = event.detail.cat.price;
    
    header.refreshPrice(price);
    header.refreshCartCounter(cart.length);
  }
  else {
    alert('This cat is already in the cart');
  }
}

function addBigToCart(event) {
  var pic = event.detail.cat.picture;
  event.detail.cat.picture = pic.slice(0, -8) + pic.slice(-4);
  cart.push(event.detail.cat);
  
  event.detail.cat.picture = pic;
  var catBig = createBigCat(event.detail.cat);
  
  var price = event.detail.cat.price;
  header.refreshPrice(price);
  header.refreshCartCounter(cart.length);
  
  document.body.replaceChild(catBig, header.nextElementSibling);
}

function removeCatFromCart(event) {
  var id = event.detail.cat.id;
  if (cart.length === 1) {
    cart = [];
    backToMainPage();
  }
  else {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === event.detail.cat.id) {
        cart.splice(i, 1);
        break;
      }
    }
    
    header.nextElementSibling.setAttribute('cats', JSON.stringify(cart));
  }
  
  header.refreshCartCounter(cart.length);
  var price = -event.detail.cat.price;
  header.refreshPrice(price);
}

function removeBigFromCart(event) {
  var id = event.detail.cat.id;
  if (cart.length === 1) {
    cart = [];
  }
  else {
    for (var i = 0; i < cart.length; i++) {
      if (cart[i].id === event.detail.cat.id) {
        cart.splice(i, 1);
        break;
      }
    }
  }
  
  header.refreshCartCounter(cart.length);
  var price = -event.detail.cat.price;
  header.refreshPrice(price);
  
  var catBig = createBigCat(event.detail.cat);
  document.body.replaceChild(catBig, header.nextElementSibling);
}

function openCart() {
  if (cart.length === 0) {
    alert('Cart is empty!!!');
    return;
  }
  var cartElement = document.createElement('mockup-cart');
  var json = JSON.stringify(cart);
  cartElement.setAttribute('cats', json);
  document.body.replaceChild(cartElement, header.nextElementSibling);
}

//Functions for details

function showDetails(event) {
  var picture = event.detail.cat.picture;
  var half = picture.slice(0, picture.indexOf('.'));
  var extencion = picture.slice(-4);
  event.detail.cat.picture = half + '_520' + extencion;
  
  var catBig = createBigCat(event.detail.cat);
  
  document.body.replaceChild(catBig, header.nextElementSibling);
}

function backToMainPage() {
  document.body.replaceChild(container, header.nextElementSibling);
}

//Common functions

function isCatInCart(id) {
  var ids = cart.map(function(item) { return item.id; });
  return ids.includes(id);
}

function createBigCat(cat) {
  var json = JSON.stringify(cat);
  var catBig = document.createElement('mockup-cat-big');
  catBig.setAttribute('cat', json);
  
  if (isCatInCart(cat.id)) {
    catBig.setAttribute('buttontype', 'remove');
    catBig.setAttribute('buttontext', 'Remove from cart');
  }
  
  return catBig;
}