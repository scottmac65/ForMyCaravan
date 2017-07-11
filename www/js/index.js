/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

$(document).ready(function () {

    // add forms to local storage
    $('#vehicleDetails').sisyphus();
    $('#trailDetails').sisyphus();
    $('#carWeights').sisyphus();
    $('#vanWeights').sisyphus();
    $('#assessWeights').sisyphus();

    $("[data-collapse-group]").on('show.bs.collapse', function () {
        var $this = $(this);
        var thisCollapseAttr = $this.attr('data-collapse-group');
        $("[data-collapse-group='" + thisCollapseAttr + "']").not($this).collapse('hide');
    });

    // set cursor to default for disabled buttons in help guides
    $('#listGuide').css("cursor", "default");
    $('#listGuide1').css("cursor", "default");
    $('#listGuide2').css("cursor", "default");
    $('#listGuide3').css("cursor", "default");
    $('#listGuide4').css("cursor", "default");
    $('#listGuide5').css("cursor", "default");
    //control main tabs
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        localStorage.setItem('activeTab', $(e.target).attr('href'));
    });
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        $('#myCaravanTab a[href="' + activeTab + '"]').tab('show');
    }

    // manage checklists
    $('#keyArrItem').keypress(function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            add_item('arr');
        }
    });

    $('#keyDepItem').keypress(function(e) {
        if (e.which == 13 || e.keyCode == 13) {
            e.preventDefault();
            add_item('dep');
        }
    });
    $(document).keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            return true;
        }
    });
    //buttons to add items to lists
    $("button").click(function() {
      var buttonValue = this.id;
      switch (buttonValue) {
        case "butArrItem":
          add_item('arr');
          break;
        case "butDepItem":
          add_item('dep');
          break;
        case "butVanReset":
          clear_storage('vanReset');
          break;
        case "butCarReset":
          clear_storage('carReset');
          break;
        case "butVehReset":
          clear_storage('vehReset');
          break;
        case "butTrailReset":
          clear_storage('trailReset');
          break;
        case "butArrReset":
          clear_storage('arrReset');
          break;
        case "butDepReset":
          clear_storage('depReset');
          break;
        case "butArrInside":
          SetAllCheckBoxes('displayArrListInside','arrive',false);
          break;
        case "butArrOutside":
          SetAllCheckBoxes('displayArrListOutside','arrive',false);
          break;
        case "butDepInside":
          SetAllCheckBoxes('displayDepListInside','depart',false);
          break;
        case "butDepInside":
          SetAllCheckBoxes('displayDepListOutside','depart',false);
          break;
        case "butSaveListArr":
          save_list('arr');
          break;
        case "butSaveListDep":
            save_list('dep');
            break;
        default:
          break;
      }
    });

    // update when weight values change
    $(document).on('change', '#vanAtm', function () {
      update_assessments();
    });
    $(document).on('change', '#carTowCapacity', function () {
      car_tow_capacity();
    });
    $(document).on('change', '#carTowbar', function () {
      car_tow_capacity();
    });
    $(document).on('change', '#carKerb', function () {
      update_assessments();
    });
    $(document).on('change', '#carGvm', function () {
      car_maxpayload_assess();
    });
    $(document).on('change', '#carAccessories', function () {
      update_assessments();
    });
    $(document).on('change', '#carPayload', function () {
      update_assessments();
    });
    $(document).on('change', '#vanTare', function () {
      update_assessments();
    });
    $(document).on('change', '#carPayload', function () {
      update_assessments();
    });
    $(document).on('change', '#carGcm', function () {
      check_combined_weights();
    });
    // work out if all the items are checked in form
    // $(".arri").change(function() {
    $(document).on('click', '.arri', function() {
        var checked;
        if ($('.arri:checked').length === $('.arri').length) {
            checked = true;
        } else {
            checked = false;
        }
        var panelObj = {panel: "one", list: "Arrival", location: "Inside"};
        panel_attributes(checked, panelObj);
    });

    $(document).on('click', '.arro', function() {
        var checked;
        if ($('.arro:checked').length === $('.arro').length) {
            checked = true;
        } else {
            checked = false;
        }
        var panelObj = {panel: "two", list: "Arrival", location: "Outside"};
        panel_attributes(checked, panelObj);
    });
    $(document).on('click', '.depi', function() {
        var checked;
        if ($('.depi:checked').length === $('.depi').length) {
            checked = true;
        } else {
            checked = false;
        }
        var panelObj = {panel: "three", list: "Depart", location: "Inside"};
        panel_attributes(checked, panelObj);
    });
    $(document).on('click', '.depo', function() {
        var checked;
        if ($('.depo:checked').length === $('.depo').length) {
            checked = true;
        } else {
            checked = false;
        }
        var panelObj = {panel: "four", list: "Depart", location: "Outside"};
        panel_attributes(checked, panelObj);
    });
    // work out if we have items in localstorage if not create a counter set to 0
    if (localStorage.getItem('cntarr') === null) {
        localStorage.setItem('cntarr', '0');
    }
    if (localStorage.getItem('cntdep') === null) {
        localStorage.setItem('cntdep', '0');
    }

    // check if we have a value or not - if not return a '0'   makes page look tidy on load removes 'NaN' statements
    document.getElementById("carMaxPayload").value = document.getElementById("carGvm").value - document.getElementById("carKerb").value;
    document.getElementById("carYourWeights").value = document.getElementById("carKerb").value + document.getElementById("carPayload").value + document.getElementById("carAccessories").value;
    document.getElementById("vanYourWeights").value = document.getElementById("vanTare").value + document.getElementById("vanPayload").value;
    document.getElementById("vanMaxPayload").value = document.getElementById("vanAtm").value - document.getElementById("vanTare").value;
    update_assessments();
    save_list();
    check_lists();

});



// clear all checkboxes for the selected form
function SetAllCheckBoxes(FormName, FieldName, CheckValue) {
    // declare function variables
    var i, panelObj, checked, objCheckBoxes, countCheckBoxes;

    if (!document.forms[FormName]) {
        return;
    }
    objCheckBoxes = document.forms[FormName].elements[FieldName];
    if (!objCheckBoxes) {
        return;
    }
    countCheckBoxes = objCheckBoxes.length;

    if (!countCheckBoxes) {
        objCheckBoxes.checked = CheckValue;
    } else {
        // set the check value for all check boxes
        for (i = 0; i < countCheckBoxes; i++) {
            objCheckBoxes[i].checked = CheckValue;
        }
    }
    checked = false;
    //create the headings for each of the panels after we clear the check buttons
    switch (FormName) {
        case 'displayArrListInside':
        panelObj = {panel: "one", list: "Arrival", location: "Inside"};
        break;
        case 'displayArrListOutside':
        panelObj = {panel: "two", list: "Arrival", location: "Outside"};
        break;
        case 'displayDepListInside':
        panelObj = {panel: "three", list: "Depart", location: "Inside"};
        break;
        case 'displayDepListOutside':
        panelObj = {panel: "four", list: "Depart", location: "Outside"};
        break;
    }
    panel_attributes(checked, panelObj);
}
// change panel properties if all checkboxes are checked in a list
function panel_attributes(checked, panel2change) {
    // reconstruct the panel headingaOne
    var heading, list = panel2change.list, location = panel2change.location, panel = panel2change.panel, panelHead, panelBody, panelHeading;
    //create the panel heading

    heading = list;
    heading += ' List ';
    heading += location;
    // control the check list panels
    switch (panel) {
        case 'one':
        panelHead = 'panelOne';
        panelBody = 'panelbOne';
        panelHeading = 'headingaOne';
        break;
        case 'two':
        panelHead = 'panelTwo';
        panelBody = 'panelbTwo';
        panelHeading = 'headingaTwo';
        break;
        case 'three':
        panelHead = 'panelThree';
        panelBody = 'panelbThree';
        panelHeading = 'headingaThree';
        break;
        case 'four':
        panelHead = 'panelFour';
        panelBody = 'panelbFour';
        panelHeading = 'headingaFour';
        break;
    }
    if (checked) {
        document.getElementById(panelHead).setAttribute("class", "panel panel-success");
        document.getElementById(panelBody).style.backgroundColor = "#e6ffcc";
        document.getElementById(panelHeading).innerHTML = heading + " -- Complete";
    } else {
        document.getElementById(panelHead).setAttribute("class", "panel panel-info");
        document.getElementById(panelBody).style.backgroundColor = "white";
        document.getElementById(panelHeading).innerHTML = heading;
    }
}
// managing localStorage counters to keep track of how many items we have
function manageCounters(list, move) {
    //declare vaiables for function
    var cnt, newKey = 'cnt' + list;

    if (move === "increment") {
        cnt = localStorage.getItem(newKey);
        cnt++;
        localStorage.setItem(newKey, cnt);
    } else { // we are decrementing
        cnt = localStorage.getItem(newKey);
        cnt--;
        localStorage.setItem(newKey, cnt);
    }
}

// remove an element from the list and localstorage
function removeElement(removeID) {
    //declare variables for function
    var newID = removeID.slice(4), elem = document.getElementById(newID);
    //  console.log ("new " + newID + " elem " + elem);
    elem.parentNode.removeChild(elem);
    localStorage.removeItem(newID);
    if (newID.includes('arr')) {
        manageCounters('arr', 'decrement');
    } else {
        manageCounters('dep', 'decrement');
    }
}

// add an item to the list - then call the build process
function add_item(list2edit) {
    //declare function variables
    var text = "", item2add = "";

    // get item to add and clear the output text for dupe items until we have a dupe item
    if (list2edit === 'arr') {
        item2add = document.getElementById('keyArrItem').value;
        document.getElementById('dupeArrItem').innerHTML = text;
    } else {
        item2add = document.getElementById('keyDepItem').value;
        document.getElementById('dupeDepItem').innerHTML = text;
    }

    if (item2add === "") { return; } //being lazy could use validate

    //check for duplicate items
    if (check_for_dupes(item2add, list2edit)) {
        return;
    }
    display_list(list2edit, item2add);
}

// check for duplicate values in the checklists
function check_for_dupes(item2add, list2edit) {
    // declare variables for function
    var text ="";
    var dupeListItem = list2edit;
    var locate = inside_or_outside(list2edit);
    dupeListItem += locate.locateItem;
    var cnt = localStorage.length;

    for (var i = 0 ; i < cnt; i++) {
        var storeVal = localStorage.getItem(localStorage.key(i));
        var storedKey = localStorage.key(i);
        if ((storedKey.startsWith(dupeListItem)) && (storeVal === item2add)) {
            text = "<b>You already have this item in your list!</b>";
            if (list2edit === 'arr') {
                document.getElementById("dupeArrItem").innerHTML = text;
            } else {
                document.getElementById("dupeDepItem").innerHTML = text;
            }
            return true;
        }
    }
}

//work out whether we have an inside or outside list
function inside_or_outside(list2edit) {
    //declare function variables
    var locate = "", locateItem, locateList;

    if (list2edit === "arr") {
        locate = document.getElementsByName('locateArr');
    }else {
        locate = document.getElementsByName('locateDep');
    }
    //return locate;
    // determine if we have an inside/outside value
    for (var i = 0; i < locate.length; i++) {
        if (locate[i].checked) {
            locateItem = locate[i].value;
            // value to concat to item for storing
            if (locate[i].value === "inside") {
                locateItem = "_i_";
                locateList = locate[i].value;
            } else {
                locateItem = "_o_";
                locateList = locate[i].value;
            }
            break;
        }
    }
    return {locateItem: locateItem, locateList:locateList};
}

//display the lists
function display_list(list2edit, item2add) {
    //declare vairables
    var locate;
    var storageKey = "";

    locate = inside_or_outside(list2edit);

    // reset input values
    document.getElementById("keyArrItem").value = "";
    document.getElementById("keyDepItem").value = "";

    //create the storagekey
    storageKey = list2edit;
    storageKey += locate.locateItem;
    storageKey += item2add;
    var createItem = document.createElement('div');
    createItem.setAttribute("class", "row");
    createItem.setAttribute("id", storageKey);
    createItem.innerHTML = '<div class="col-md-12">' +
    '<div class="input-group">' +
    '<span class="input-group-addon">' + locate.locateList + '</span>' +
    '<input type="text" class="form-control" name="' + storageKey + '" id="' + storageKey + '" value="' + item2add +'" readonly>' +
    '<span class="input-group-btn">'+
    '<button type="button" name="removeItem" id="rem_' + storageKey + '" class="btn btn-danger" onClick="removeElement(this.id)"><span class="glyphicon glyphicon-trash" aria-hidden="true">' +
    '</button></span></div></div>';
    if (list2edit === 'arr') {
        document.getElementById("createArrList").appendChild(createItem);
        localStorage.setItem(storageKey, item2add);
        manageCounters(list2edit, 'increment');
    } else {
        document.getElementById("createDepList").appendChild(createItem);
        localStorage.setItem(storageKey, item2add);
        manageCounters(list2edit, 'increment');
    }
}


// create the checklists
function check_lists() {
    // declare function variables
    var isArrList = localStorage.getItem('cntarr');
    var isDepList = localStorage.getItem('cntdep');
    var noArriveList ="", noDepartList ="";

    // clean up a checklist if we have had it previously
    const arriparent = document.getElementById("displayArrListInside");
    while(arriparent.firstChild) {
        arriparent.removeChild(arriparent.firstChild);
    }
    const arroparent = document.getElementById("displayArrListOutside");
    while(arroparent.firstChild) {
        arroparent.removeChild(arroparent.firstChild);
    }
    const depiparent = document.getElementById("displayDepListInside");
    while(depiparent.firstChild) {
        depiparent.removeChild(depiparent.firstChild);
    }
    const depoparent = document.getElementById("displayDepListOutside");
    while(depoparent.firstChild) {
        depoparent.removeChild(depoparent.firstChild);
    }


    for (var i=0; i<localStorage.length; i++) {
        var tmpList = "", displayItem = "", haveList = "", label="";
        var tmpItem = localStorage.getItem(localStorage.key(i));
        var tmpKey = localStorage.key(i);

        if (tmpKey.includes("_i_")) {
            haveList = "i";
        } else{
            haveList = "o";
        }

        if (localStorage.key(i).startsWith("arr")) { // get an item and see which list to add it to
            tmpList = "arr";
            // check inside or outside list
            displayItem = document.createElement('div');
            displayItem.setAttribute("class", "checkbox checkbox-success");
            displayItem.innerHTML = '<input id="'+ tmpList + tmpItem + haveList + '" name="arrive" class="' + tmpList + haveList + '" type="checkbox">';
            label = document.createElement("label");
            label.setAttribute("for", tmpList + tmpItem + haveList);
            label.setAttribute("class", "col-sm-8");
            label.appendChild(document.createTextNode(tmpItem));
            if (tmpKey.includes("_i_")) {
                document.getElementById("displayArrListInside").appendChild(displayItem).appendChild(label);
            } else {
                document.getElementById("displayArrListOutside").appendChild(displayItem).appendChild(label);
            }
        } else if (localStorage.key(i).startsWith("dep")) {
            tmpList = "dep";
            displayItem = document.createElement('div');
            displayItem.setAttribute("class", "checkbox checkbox-success");
            //displayItem.setAttribute("class", "row");
            displayItem.innerHTML = '<input id="'+ tmpList + tmpItem + haveList + '" name="depart" class="' + tmpList + haveList + '" type="checkbox">';
            label = document.createElement("label");
            label.setAttribute("for", tmpList + tmpItem + haveList);
            label.setAttribute("class", "col-sm-8");
            label.appendChild(document.createTextNode(tmpItem));
            if (tmpKey.includes("_i_")) {
                document.getElementById("displayDepListInside").appendChild(displayItem).appendChild(label);
            } else {
                document.getElementById("displayDepListOutside").appendChild(displayItem).appendChild(label);
            }
        } else { // handle values in localstorge that aren't part of checklists
            continue;
        }
    }
}

// display the completed list but still allow editing
function save_list(list2save) {
    var createItem = "", tmpList = "";
    const arrparent = document.getElementById("createArrList");
    while(arrparent.firstChild) {
        arrparent.removeChild(arrparent.firstChild);
    }
    const depparent = document.getElementById("createDepList");
    while(depparent.firstChild) {
        depparent.removeChild(depparent.firstChild);
    }
    // loop through local storage and display lists and create checklists
    for (var i=0; i < localStorage.length; i++) {
        var tmpItem = "", tmpLocate = "", tmpSymbol = "", tmpKey = "";

        if (localStorage.key(i).startsWith("arr")) { // get an item and see which list to add it to
            tmpList = 'arr';
            tmpLocate = localStorage.key(i).substr(4,1);
        } else if (localStorage.key(i).startsWith("dep")) {
            tmpList = "dep";
            tmpLocate = localStorage.key(i).substr(4,1);
        } else {
            continue;
        }
        if (tmpLocate === 'i') {
            tmpSymbol = '_i_';
            tmpLocate = 'inside';
        } else {
            tmpSymbol = '_o_';
            tmpLocate = 'outside';
        }
        tmpItem = localStorage.getItem(localStorage.key(i));

        // create the storageKey
        tmpKey = tmpList;
        tmpKey += tmpSymbol;
        tmpKey += tmpItem;

        createItem = document.createElement('div');
        createItem.setAttribute("class", "row");
        createItem.setAttribute("id", tmpKey);
        createItem.innerHTML = '<div class="col-md-12">' +
        '<div class="input-group">' +
        '<span class="input-group-addon">' + tmpLocate + '</span>' +
        '<input type="text" class="form-control" name="' + tmpKey + '" id="' + tmpKey + '" value="' + tmpItem +'" readonly>' +
        '<span class="input-group-btn">'+
        '<button type="button" name="removeItem" id="rem_' + tmpKey + '" class="btn btn-danger" onClick="removeElement(this.id)"><span class="glyphicon glyphicon-trash" aria-hidden="true">' +
        '</button></span></div></div>';

        if(tmpList === "arr"){
            document.getElementById("createArrList").appendChild(createItem);
        } else {
            document.getElementById("createDepList").appendChild(createItem);
        }
    }
    check_lists();
}


/********* van assessments ************/
/* keep track of tow vehicle weight against trailer ATM */
/*
function van_atm () {
var vanWeights = document.getElementById("vanWeights");
var carWeights = document.getElementById("carWeights");
if ((vanWeights.elements["vanAtm"].value || vanWeights.elements["vanYourWeights"].value) >= carWeights.elements["carTow"].value) {
document.getElementById("carTow").style.backgroundColor="#ffcccc";
} else {
document.getElementById("carTow").style.backgroundColor="#99ffcc";
};
};
*/
// determine van maximum payload
function van_max_payload () {
    //declare function variables
    var result = document.getElementById("vanAtm").value - document.getElementById("vanTare").value;
    document.getElementById("vanMaxPayload").style.backgroundColor = "#99ffcc";
    document.getElementById("vanMaxPayload").innerHTML = result;
}

/* check if van payload is within limits */
function van_payload_check() {
    var payload = document.getElementById("vanAtm").value;
    var gtm = document.getElementById("vanGtm").value;
    var towball = document.getElementById("vanTowballMass");

    //payload.value = gtm + towball;
}

/* determine the weight of the van based on user values then assess against manufacturer value */
function van_weight_assess () {
    // declare function variables
    var weight = (parseInt(document.getElementById("vanTare").value) || 0) + (parseInt(document.getElementById("vanPayload").value) || 0);

    if (weight > document.getElementById("vanAtm").value) {
        document.getElementById("vanYourWeights").style.backgroundColor = "#ffcccc";
        document.getElementById("vanYourWeights").style.fontStyle = "oblique";
        document.getElementById("vanYourWeightsHelp").innerHTML = "<span class='text-danger'><strong>Your van is to heavy you need to reduce your weight!</strong></span>";
    } else {
        document.getElementById("vanYourWeights").style.backgroundColor="#99ffcc";
        document.getElementById("vanYourWeights").style.fontStyle = "normal";
        document.getElementById("vanYourWeightsHelp").innerHTML = "TARE + your payload.";
    }
    document.getElementById("vanYourWeights").innerHTML = weight;
}

/* **** tow vehicle assessments **** */

/* Ensure Tow bar is <= to vehicle tow weight */
function car_tow_capacity () {
    //console.log("tow barid" + document.getElementById("carTowbar").value + " car towid" + document.getElementById("carTowCapacity").value);
    if (document.getElementById("carTowbar").value > document.getElementById("carTowCapacity").value) {
        document.getElementById("carTowbar").style.backgroundColor="#ffcccc";
        document.getElementById("carTowbar").style.fontStyle ="oblique";
        document.getElementById("carTowbarHelp").innerHTML = "<span class='text-danger'><strong>Check your towbar and vehicle tow weights</strong></span>";
    } else {
        document.getElementById("carTowbar").style.backgroundColor="white";
        document.getElementById("carTowbar").style.fontStyle ="normal";
        document.getElementById("carTowbarHelp").innerHTML = "Tow Bar rating - worth checking";
    }
}

function car_maxpayload_assess () {
    // declare function variables
    var result = document.getElementById("carGvm").value - document.getElementById("carKerb").value - document.getElementById("carAccessories").value;
    document.getElementById("carMaxPayload").style.backgroundColor = "#99ffcc";
    document.getElementById("carMaxPayload").innerHTML = result;
}

/* set max of payload to the maximum allowable paylaod  */
function car_payload_maxvalue() {
    // declare function variables
    var carWeights = document.getElementById("carWeights");
    var maxPayload = document.getElementById("carPayload");
    var newMax = document.getElementById("carMaxPayload");
    carMaxPayload.setAttribute("max",newMax);
}

//determine the overall vehicle weight and return a response
function car_weight_assess () {
    // declare function variables
    var text = "";
    var weight = (parseInt(document.getElementById("carKerb").value) || 0) + (parseInt(document.getElementById("carAccessories").value) || 0) + (parseInt(document.getElementById("carPayload").value) || 0);

    if (weight > document.getElementById("carGvm").value) {
        document.getElementById("carYourWeights").style.backgroundColor="#ffcccc";
        text = "<b>Car + load is greater than GVM! Check your weights</b>";
    } else {
        document.getElementById("carYourWeights").style.backgroundColor="#99ffcc";
    }
    document.getElementById("weightOutcome").innerHTML = text;
    document.getElementById("carYourWeights").innerHTML = weight;
}

/* sets max value of the payload to the maximum allowable paylaod  */
function car_payload_maxvalue() {
    // declare function variables
    var maxPayload = document.getElementById("carPayload");
    var newMax = document.getElementById("carMaxPayload").value;
    maxPayload.setAttribute("max",newMax);
}

function car_payload_capacity () {

    if (document.getElementById("carPayload").value > document.getElementById("carMaxPayload").value) {
        document.getElementById("carPayload").style.backgroundColor="#ffcccc";
        document.getElementById("carPayload").style.fontStyle ="oblique";
        document.getElementById("carPayloadHelp").innerHTML = "<span class='text-danger'><strong>Your payload needs to be reduced!</strong></span>";
    } else {
        document.getElementById("carPayload").style.backgroundColor="white";
        document.getElementById("carPayload").style.fontStyle="normal";
        document.getElementById("carPayloadHelp").innerHTML = "people, cargo etc.";
    }
}

/* combined assessments   these are in for interest only given being over on either is illegal */
function check_combined_weights() {

    // declare function variables
    var weights = (parseInt(document.getElementById("carYourWeights").value) || 0) + (parseInt(document.getElementById("vanYourWeights").value) ||0);


    if (weights > document.getElementById("carGcm").value) {
        document.getElementById("combinedWeights").style.backgroundColor="#ffcccc";
        document.getElementById("combinedWeightsHelp").innerHTML = "<span class='text-danger'><strong>Your combined weights is greater than your GCM!</strong></span>";
        document.getElementById("combinedWeights").innerHTML = weights;
    } else {
        document.getElementById("combinedWeights").style.backgroundColor="#99ffcc";
        document.getElementById("combinedWeightsHelp").innerHTML = "Your combined weights";
        document.getElementById("combinedWeights").innerHTML = weights;
    }
}


/* clear local storage after confirmation */
function clear_storage (clearing) {

    // declare function variables
    var retVal = confirm("Are you sure you want to clear the page?");
    var cnt, re;
    //determine if we are clearing vehicle or caravan details
    if ( retVal === true ) {
        if (clearing === "vanReset") {
            re = /van/;
        } else if (clearing === "carReset") {
            re = /car/;
        } else if (clearing === "vehReset") {
            re = /veh/;
        } else if (clearing === "trailReset") {
            re = /trail/;
        } else if (clearing === "depReset") {
            re = /dep/;
            localStorage.setItem('cntdep', 0);
        } else if (clearing === "arrReset") {
            re = /arr/;
            localStorage.setItem('cntarr', 0);
        }
        // need to reverse loop based on behaviour of localstorage
        cnt = localStorage.length;
        for (var i = localStorage.length-1; i >= 0; i--) {
            var key = localStorage.key(i);
            var value = localStorage.getItem(key);
            if (re.exec(key)) {
                localStorage.removeItem(localStorage.key(i));
            }
        }
        location.reload();
        return true;
    }
    return false;
}

/* 'onchange' calls to keep assessments up to date  */
function update_assessments () {
    van_weight_assess();
    van_payload_check();
    van_max_payload();
    car_tow_capacity();
    car_maxpayload_assess();
    car_payload_capacity();
    car_payload_maxvalue();
    car_weight_assess();
    check_combined_weights();
}

/* ensure ouput values are calculated when loading localStorage */

window.onload = function() {
    /*
    if (localStorage.getItem('cntarr') === null)  {
    console.log("setting item to 0");
    localStorage.setItem('cntarr', '0');
}
if (localStorage.getItem('cntdep') === null) {
localStorage.setItem('cntdep', '0');
}

document.getElementById("carMaxPayload").value = document.getElementById("carGvm").value - document.getElementById("carKerb").value;
document.getElementById("carYourWeights").value = document.getElementById("carKerb").value + document.getElementById("carPayload").value + document.getElementById("carAccessories").value;
document.getElementById("vanYourWeights").value = document.getElementById("vanTare").value + document.getElementById("vanPayload").value;
document.getElementById("vanMaxPayload").value = document.getElementById("vanAtm").value - document.getElementById("vanTare").value;
*/
// update_assessments();
// save_list();
//check_lists();
};
