// ide deklaráljátok a függvényeket.


// A stackoverflow hatalmánál fogva...
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

// Ár szerint növekvő sorrendbe rendezi a tömb elemeit.
function sortAscByInt(array, key) {
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

// Névszerint növekvő sorrendbe rendezi a tömb elemeit.
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

// Az űrhajók tömb elemeit megjeleníti a spaceship-list divben.
function falconsToList(message, destination) {
  document.querySelector(destination).innerHTML += message;
}

// Törli az objektumot, ha a consumables értéke null.
function deleteByPropertyValue(array, property) {
  for (var k = 0; k < array.length; k++) {
    if (array[k][property] === null) {
      array.splice(k, 1);
      k--;
    }
  }
  return array;
}

// A null-okat unknown-ra cseréli.
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

// Listába teszi az objektum elemeit
function displayObject(array) {
  var result;
  for (var k in array) {
    result += `${[k]}: ${array[k]} <br>`;
  }
  return result;
}

// Listába teszi a tömb elemeit.
function displayArray(array) {
  var result = '';
  for (var j = 0; j < array.length; j++) {
    result += `${displayObject(array[j])} <br>`;
    result += '<br>';
  }
  return result;
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
  var message = `${count} of ${array.length} ships have a sum of ${sum} seats.`;
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

// Kereső
function linearSearchShip(srcInput, array, key) {
  //var srcInput = getInput();
  sortAscByStrng(array, key);
  var message = '';
  var found = false;

  for (var k = 0; !found && k < array.length; k++) {
    if (array[k][key].toLocaleLowerCase().indexOf(srcInput) !== -1) {
      found = true;
      message = displayObject(array[k]);
    } else {
      message = 'It is some kind of elaborate ruse!';
    }
  }
  return message;
}


function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status === 200) {
      callbackFunc(this);
    }
  }
  xhttp.open('GET', url, true);
  xhttp.send();
}

function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  // Innen lehet hívni.
  sortAscByInt(userDatas, 'cost_in_credits');
  deleteByPropertyValue(userDatas, 'consumables');
  modifyNull(userDatas, null, 'unknown');
  falconsToList(displayArray(userDatas), '.spaceship-list');
  falconsToList(shipStats(userDatas), '.spaceship-list');
  falconsToList(linearSearchShip('tie', userDatas, 'model'), '.one-spaceship');
}
getData('/gyakorlo-zarora-1/json/spaceships.json', successAjax);


/* Out of order

document.querySelector('#search-button').addEventListener('click', linearSearchShip);

// The force has left this function
function binaryShip(srcInput, array) {
  var maxIndex = array.length - 1;
  var minIndex = 0;
  var guess;

  while (minIndex <= maxIndex) {
    guess = Math.floor((maxIndex + minIndex) / 2);
    var ship = array[guess].model.toLowerCase();
    if (ship.indexOf(srcInput) !== -1) {
      var message = array[guess].model;
      return message;
    } else if (ship < srcInput) {
      minIndex = guess + 1;
    } else (ship > srcInput) {
      maxIndex = guess - 1;
    }
  }
  return -1;
}

// To replace parseInt
function getInteger(value) {
  if (value !== null) {
    return parseInt(value, 10);
  }
  return 0;
} 


function loadImage(destination, img) {
  document.querySelector(destination).innerHTML += `<img src="../img/${img}" height="50%" width= "50%">`;
}

*/