// ide deklaráljátok a függvényeket.
var userDatas = [];
document.querySelector('#search-button').addEventListener('click', linearSearchByModel);

// Duplaklikkre betölti az adott div innerHTML-jét az oldalsó div-be.
function loadToSide() {
  document.querySelector('#sideDiv').innerHTML = document.querySelector(`#${this.id}`).innerHTML;
}

// A tömb hossza alapján diveket készít.
function makeDivs(array) {
  for (var k = 0; k < array.length; k++) {
    var newDiv = document.createElement('div');
    newDiv.setAttribute('id', `spaceS${k + 1}`);
    newDiv.ondblclick = loadToSide;
    document.querySelector('.spaceship-list').appendChild(newDiv);
  }
}

// Elkészít egy bizonyos típusú divet, egy id-vel.
function makeAndAppendTagWithId(type, name, toWhere) {
  var newDiv = document.createElement(type);
  newDiv.setAttribute('id', name);
  document.querySelector(toWhere).appendChild(newDiv);
}


function moveIt(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}


function sortAscByPrice(array, key) {
  var l = array.length;
  while (l--) {
    for (var k = 0, j = 1; k < l; k++, j++) {
      if (array[k][key] === null) {
        moveIt(array, k, (array.length - 1)); // Az objektumokat, amiknek null értékű kulcsuk van, a tömb végére mozgatja.
      }
      if (array[k].hasOwnProperty([key])) {
        if (parseInt(array[k][key], 10) > parseInt(array[j][key], 10)) {
          [array[k], array[j]] = [array[j], array[k]];
        }
      }
    }
  } return array;
}


function deleteByPropertyValue(array, property) {
  for (var k = 0; k < array.length; k++) {
    if (array[k][property] === null) {
      array.splice(k, 1);
      k--;
    }
  }
  return array;
}


function modifyNull(array, value, modVal) {
  for (var i = 0; i < array.length; i++) {
    for (var j in array[i]) {
      if (array[i][j] === value) {
        array[i][j] = modVal;
      }
    }
  }
  return array;
}


function displayObject(array) {
  var result;
  for (var k in array) {
    result += `${[k]}: ${array[k]} <br>`;
  }
  return result;
}


function getArrayToDiv(array) {
  var result = '';
  for (var j = 0; j < array.length; j++) {
    result += `${displayObject(array[j])} <br>`;
    var url = `/img/${array[j].image}`;
    result += `<img src=${url} onerror="this.src='/img/fallback.jpg';">`;
    falconsToList(result, `#spaceS${j + 1}`);
    result = '';
  }
}


function falconsToList(message, destination) {
  document.querySelector(destination).innerHTML = message;
}


// Megszámlálja az egy fős legénységű hajókat.
function countBy(array, key, x) {
  var count = 0;
  for (var k = 0; k < array.length; k++) {
    if (parseInt(array[k][key], 10) === x) {
      count++;
    }
  }
  return count;
}

// Vissza adja a legtöbb rakományt bíró hajó nevét/leghosszabb hajó képét.
function maxiestStat(array, keyOne, keyTwo) {
  var max = array[0][keyOne];
  var maxiest = '';
  for (var k in array) {
    if (parseInt(array[k][keyOne], 10) > parseInt(max, 10)) {
      max = array[k][keyOne];
      maxiest = array[k][keyTwo];
    }
  }
  return maxiest;
}

// Összesíti az utasok férőhelyének számát.
function sumUpPassengers(array) {
  var sum = 0;
  var count = 0;
  for (var k in array) {
    if (array[k].passengers !== 'unknown') {
      sum += parseInt(array[k].passengers, 10);
      count++;
    }
  }
  var message = `${count} of ${array.length} ships can take a sum of ${sum} passengers.`;
  return message;
}

// Elkészíti a statisztikát, stringgel tér vissza.
function shipStats(array) {
  var result =
   `<hr>
    <h2>Stats</h2>
    One-man ships: ${countBy(array, 'crew', 1)} <br>
    Most cargo: ${maxiestStat(array, 'cargo_capacity', 'model')} <br>
    ${sumUpPassengers(array)} <br>
    Lengthiest's image: ${maxiestStat(array, 'lengthiness', 'image')}`;

  return result;
}


// Visszatér a kereső mező tartalmával.
function getInput() {
  var srcInput = document.querySelector('#search-text').value.toLowerCase();
  return srcInput;
}


function sortAscByStrng(array, key) {
  var l = array.length;
  while (l--) {
    for (var k = 0, j = 1; k < l; k++, j++) {
      if (array[k].hasOwnProperty([key])) {
        if (array[k][key] > array[j][key]) {
          [array[k], array[j]] = [array[j], array[k]];
        }
      }
    }
  } return array;
}


// Kereső
function linearSearchByModel() {
  sortAscByStrng(userDatas, 'model');
  var srcInput = getInput();
  var message = '';
  var found = false;

  for (var k = 0; !found && k < userDatas.length; k++) {
    if (userDatas[k].model.toLocaleLowerCase().indexOf(srcInput) !== -1) {
      found = true;
      message = displayObject(userDatas[k]);
      var url = `/img/${userDatas[k].image}`;
      message += `<img src=${url} alt='It was some kind of elaborate ruse!'>`;
    } else {
      message = 'It is some kind of elaborate ruse!';
    }
  }
  falconsToList(message, '#sideDiv');
}


function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}


function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var Data = JSON.parse(xhttp.responseText);
  userDatas = Data;

  // Innen lehet hívni.
  sortAscByPrice(userDatas, 'cost_in_credits');
  deleteByPropertyValue(userDatas, 'consumables');
  modifyNull(userDatas, null, 'unknown');
  makeDivs(userDatas);
  makeAndAppendTagWithId('div', 'shipStats', '.spaceship-list');
  makeAndAppendTagWithId('div', 'sideDiv', '.one-spaceship');
  getArrayToDiv(userDatas);
  falconsToList(shipStats(userDatas), '#shipStats');
}
getData('/json/spaceships.json', successAjax);

