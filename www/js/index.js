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

/**
 * main app includes listeners and deviceready.
 * @type {Object}
 */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event.
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};
//initialise the app
app.initialize();
/**
 * document ready - values and initialisations.
 * @return {boolean} if device is ready
 */
$(document).ready(function () {

    // add forms to local storage using sysyphus javascript.
    $('#vehicleDetails').sisyphus();
    $('#trailDetails').sisyphus();
    $('#carWeights').sisyphus();
    $('#vanWeights').sisyphus();
    $('#assessWeights').sisyphus();

    // determine which group is active or collapsed.
    $("[data-collapse-group]").on('show.bs.collapse', function () {
        var $this = $(this);
        var thisCollapseAttr = $this.attr('data-collapse-group');
        $("[data-collapse-group='" + thisCollapseAttr + "']").not($this).collapse('hide');
    });

    // set cursor to default for disabled buttons in help guides.
    $('#listGuide').css("cursor", "default");
    $('#listGuide1').css("cursor", "default");
    $('#listGuide2').css("cursor", "default");
    $('#listGuide3').css("cursor", "default");
    $('#listGuide4').css("cursor", "default");
    $('#listGuide5').css("cursor", "default");
    //control main application tabs.
    $('a[data-toggle="tab"]').on('show.bs.tab', function(e) {
        localStorage.setItem('activeTab', $(e.target).attr('href'));
    });
    /**
     * keep track of the main app active tab in localStorage
     * @type {string}
     */
    var activeTab = localStorage.getItem('activeTab');
    if (activeTab) {
        $('#myCaravanTab a[href="' + activeTab + '"]').tab('show');
    }

    // listeners for changes to checklists,
    // also removes default behaviours for return key
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
    // handle default behaviour of return key in forms.
    $(document).keypress(function (e) {
        if (e.which === 13 || e.keyCode === 13) {
            e.preventDefault();
            return true;
        }
    });
    //listeners for buttons - could use a class but some buttons need,
    //different controls.
    $("button").click(function() {
      var buttonValue = this.id;
      switch (buttonValue) {
        case "butArrItem":
          add_item('arr');
          break;
        case "butDepItem":
          add_item('dep');
          break;
        case "butTodoItem":
          add_item('tod');
          break;
        case "butVanReset":
          clear_storage('vanReset');
          break;
        case "butCarReset":
          clear_storage('carReset');
          break;
        case "butTodoReset":
          clear_storage('todReset');
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

    //listeners for when weights fields change so we can,
    //ensure values are updated
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
    $(document).on('change', '#vanPayload', function () {
      update_assessments();
    });
    $(document).on('change', '#carGcm', function () {
      check_combined_weights();
    });
    // if a checkbox is selected determine if,
    // all checkboxes are selected so we can set panel attributes.
    $(document).on('click', '.arri', function() {
        var checked;
        if ($('.arri:checked').length === $('.arri').length) {
            checked = true;
        } else {
            checked = false;
        }
        var panelObj = {panel: "one", list: "Arrival", location: "Inside"};
        //procedure call to change panel attributes.
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
    //listener for removing items from checklist.
    $(document).on('click', '.butRemoveItem', function() {
      remove_element(this.id);
    });

    // work out if we have items in localstorage,
    // if not create a counter set to 0.
    if (localStorage.getItem('cntarr') === null) {
        localStorage.setItem('cntarr', '0');
    }
    if (localStorage.getItem('cntdep') === null) {
        localStorage.setItem('cntdep', '0');
    }
    if (localStorage.getItem('cnttod') === null) {
        localStorage.setItem('cnttod', '0');
    }

    // check if we have a value or not - if not return a '0',
    // makes page look tidy on load removes 'NaN' statements.
    document.getElementById("carMaxPayload").value = document.getElementById("carGvm").value - document.getElementById("carKerb").value;
    document.getElementById("carYourWeights").value = document.getElementById("carKerb").value + document.getElementById("carPayload").value + document.getElementById("carAccessories").value;
    document.getElementById("vanYourWeights").value = document.getElementById("vanTare").value + document.getElementById("vanPayload").value;
    document.getElementById("vanMaxPayload").value = document.getElementById("vanAtm").value - document.getElementById("vanTare").value;
    //procedure calls to establish lists and assessments if we have details,
    //available in localstorage.
    update_assessments();
    save_list();
    check_lists();
});

/**
 * Class that sets or unsets all checkboxes in a form
 * @param       {string} FormName   Name of Form for checkboxes.
 * @param       {string} FieldName  Name of checkbox field.
 * @param       {boolean} CheckValue value of checkbox.
 * @constructor
 */
function SetAllCheckBoxes(FormName, FieldName, CheckValue) {
    /** SetAllCheckBoxes local variables
    *   @type {number} i counter
    *   @type {string} panelObj panel that we are working on
    *   @type {boolean} checked value of checkbox
    *   @type {Objec<string>} objCheckBoxes form and field name for checkbox list
    *   @type {number} countCheckBoxes number of checkboxes in a form
    **/
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
        // set the check value for all check boxes.
        for (i = 0; i < countCheckBoxes; i++) {
            objCheckBoxes[i].checked = CheckValue;
        }
    }
    checked = false;
    //create the headings for each of the panels after we clear the check buttons.
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
    //call procedure to change/update panel attributes,
    // pass boolen for all boxes checked and the name of the panel.
    panel_attributes(checked, panelObj);
}

/**
 * Function to change panel attributes if all boxes are checked.
 * @param  {boolean} checked      checked value
 * @param  {string} panel2change name of panel to change
 * @return {boolean}              returns if true
 */
function panel_attributes(checked, panel2change) {
    /**
     * panel_attributes local variables.
     * @type {string} heading name of list
     * @type {Object<string>} list list we are referring to
     * @type {Object<string>} location inside or outside list
     * @type {Object<string>} panel panel we are referring to
     * @type {string} panelHead panel heading attributes
     * @type {string} panelBody panel body attributes
     * @type {string} panelHeading panel heading value
     */
    var heading,
        list = panel2change.list,
        location = panel2change.location,
        panel = panel2change.panel,
        panelHead,
        panelBody,
        panelHeading;

    //create the panel heading.
    heading = list;
    heading += ' List ';
    heading += location;
    // control the check list panels.
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
/**
 * Function to manage localStorage counters for tracking no of items.
 * @param  {string} list list to manage arrival or departure
 * @param  {string} move determine whether we increment/decrement counter
 * @return {boolean}      returns if true
 */
function manage_counters(list, move) {
  /**
   * manage_counters local variables.
   * @type {number} cnt local loop counter
   * @type {string} cnt counter that we are working with
   */
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

/**
 * removes an item from a checklist and decrement relevant counter.
 * @param  {string} removeID item to remove
 * @return {boolean}          returns if true
 */
function remove_element(removeID) {
    /**
     * remove_element local variables.
     * @type {string} newID which list we are removing from
     * @type {string} elem name of item to remove from list
     */
    var newID = removeID.slice(4), elem = document.getElementById(newID);
    //  console.log ("new " + newID + " elem " + elem);
    elem.parentNode.removeChild(elem);
    localStorage.removeItem(newID);
    // decrement relevant counter.
    if (newID.includes('arr')) {
        manage_counters('arr', 'decrement');
    } else {
        manage_counters('dep', 'decrement');
    }
}

/**
 * add an item to a list - then call the build process
 * @param {string} list2edit List name to add item
 */
function add_item(list2edit) {
    /**
    * add_item local variables.
    * @type {String} text text value to be displayed in form
    * @type {string} item2add name of item to add to list
    */
    var text = "", item2add = "";

    // get item to add and clear the output text for dupe items until we have a dupe item
    if (list2edit === 'arr') {
        item2add = document.getElementById('keyArrItem').value;
        document.getElementById('dupeArrItem').innerHTML = text;
    } else if (list2edit === "dep") {
        item2add = document.getElementById('keyDepItem').value;
        document.getElementById('dupeDepItem').innerHTML = text;
    } else { // item is todo list
        item2add = document.getElementById('keyTodoItem').value;
        document.getElementById('dupeTodoItem').innerHTML = text;
    }
    // do nothing if we have no input
    if (item2add === "") { return; }

    //check for duplicate items
    if (check_for_dupes(item2add, list2edit)) {
        return;
    }
    display_list(list2edit, item2add);
}

/**
 * check to see if list value already exists.
 * @param  {string} item2add  Name of item to add
 * @param  {string} list2edit Name of list to add item
 * @return {boolean}           returns true if we have a dupelicate item
 */
function check_for_dupes(item2add, list2edit) {
    /**
     * check_for_dupes local variables.
     * @type {String} text text to be added to HTML form
     * @type {string} dupeListItem local copy of list item
     * @type {string} locate list to review
     * @type {number} cnt local loop counter
      */
    var text ="", dupeListItem = list2edit, locate = inside_or_outside(list2edit);
    var cnt = localStorage.length;

    dupeListItem += locate.locateItem;

    for (var i = 0 ; i < cnt; i++) {
        var storeVal = localStorage.getItem(localStorage.key(i));
        var storedKey = localStorage.key(i);
        if ((storedKey.startsWith(dupeListItem)) && (storeVal === item2add)) {
            text = "<b>You already have this item in your list!</b>";
            if (list2edit === 'arr') {
                document.getElementById("dupeArrItem").innerHTML = text;
            } else if (list2edit === 'dep'){
                document.getElementById("dupeDepItem").innerHTML = text;
            } else { // list2edit === tod
              document.getElementById("dupeTodoItem").innerHTML = text;
            }
            return true;
        }
    }
}

/**
 * Display the list
 * @param  {string} list2edit Name of list that we are displaying
 * @param  {string} item2add  name of item that we are displaying
 * @return {boolean}           returns if true
 */
function display_list(list2edit, item2add) {
    /**
     * display_list local variables.
     * @type {String} locate local copy of list to edit
     * @type {string} storageKey used to determine the localStorage key
     */
    var locate, storageKey = "";
    // procedure call to determine whether we have an inside or outside list
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
    '<button type="button" name="removeItem" id="rem_' + storageKey + '" class="butRemoveItem btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true">' +
    '</button></span></div></div>';
    if (list2edit === 'arr') {
        document.getElementById("createArrList").appendChild(createItem);
        localStorage.setItem(storageKey, item2add);
        manage_counters(list2edit, 'increment');
    } else {
        document.getElementById("createDepList").appendChild(createItem);
        localStorage.setItem(storageKey, item2add);
        manage_counters(list2edit, 'increment');
    }
}

/**
 * determine whether we are working with an inside/outside list.
 * @param  {string} list2edit list that we are working on
 * @return {Object<string>}           returns the item and the list
 */
function inside_or_outside(list2edit) {
    //declare function variables
    /**
     * inside_or_outside local variables.
     * @type {String} locate retrieve HTML element for location
     * @type {string} locateItem item to be stored in localStorage
     * @type {string} locateList list to be stored in localStorage
     */
    var locate = "", locateItem, locateList;

    if (list2edit === "arr") {
        locate = document.getElementsByName('locateArr');
    }else if (list2edit === "dep") {
        locate = document.getElementsByName('locateDep');
    } else { // we have todo list - future could be more than one list?
      locate = 't';
    }
    // determine if we have an inside/outside value
    for (var i = 0; i < locate.length; i++) {
      //alert("locate " + locate + " length " + locate.length + " check " + locate[i].checked + " value " + locate[i].value);

        if (locate[i].checked && locate !== 't') {
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
        } else { // more basic at this stage as we only have one todo list
          locateItem = "_t_";
          locateList = "todo";
        }
    }
    return {locateItem: locateItem, locateList:locateList};
}

/**
 * create the checklist - arrive/depart inside/outside.
 * @return {[type]} [description]
 */
function check_lists() {
    /**
     * check_lists local variables
     * @type {number} isArrList arrival list counter from localStorage
     * @type {number} isDepList departure list counter from localStorage
     */
    var isArrList = localStorage.getItem('cntarr');
    var isDepList = localStorage.getItem('cntdep');

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
        /**
         * loop local variables.
         * @type {String} tmpList name of list
         * @type {String} displayItem name to display
         * @type {String} haveList the list we are working on
         * @type {String} label html label element
         * @type {string} tmpItem item retrieved from localStorage
         * @type {string} tmpKey key retrieved from localStorage
         */
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
            // check inside or outside list.
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

/**
 * display the completed checklist but still allow editing.
 * @param  {string} list2save name of list to save
 * @return {boolean}           returns if true
 */
function save_list(list2save) {
  /**
   * save_list local variables.
   * @type {String} createItem HTML details of item that we are adding to list
   * @type {String} tmpList name of list we are working with
   */
    var createItem = "", tmpList = "";
    const arrparent = document.getElementById("createArrList");
    while(arrparent.firstChild) {
        arrparent.removeChild(arrparent.firstChild);
    }
    const depparent = document.getElementById("createDepList");
    while(depparent.firstChild) {
        depparent.removeChild(depparent.firstChild);
    }
    // loop through local storage and display lists and create checklists.
    for (var i=0; i < localStorage.length; i++) {
      /**
       * loop local variables.
       * @type {String} tmpItem item we are adding
       * @type {String} tmpLocate where item is located inside/outside
       * @type {String} tmpSymbol symbol used in localStorage in or out
       */
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

        // create the storageKey.
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
        '<button type="button" name="removeItem" id="rem_' + tmpKey + '" class="butRemoveItem btn btn-danger"><span class="glyphicon glyphicon-trash" aria-hidden="true">' +
        '</button></span></div></div>';

        if(tmpList === "arr"){
            document.getElementById("createArrList").appendChild(createItem);
        } else {
            document.getElementById("createDepList").appendChild(createItem);
        }
    }
    // procedure call to create the check_lists.
    check_lists();
}

/**
 * determine the maximum payload of the van.
 * @return {boolean} returns if true
 */
function van_max_payload () {
    //declare function variables
    /**
     * van_max_payload local variables.
     * @type {string} result value of assessment implemented into HTML
     */
    var result = document.getElementById("vanAtm").value - document.getElementById("vanTare").value;
    document.getElementById("vanMaxPayload").style.backgroundColor = "#c5f0f7";
    document.getElementById("vanMaxPayload").innerHTML = result;
}

/**
 * ensure van payload is within limits.
 * @return {boolean} returns if true
 */
function van_payload_check() {
  /**
   * van_payload_check
   * @type {[type]}
   */
    var payload = document.getElementById("vanAtm").value;
    var gtm = document.getElementById("vanGtm").value;
    var towball = document.getElementById("vanTowballMass");

    //payload.value = gtm + towball;
}

/**
 * determine the weight of the van based on user values then assess against manufacturer value.
 * @return {boolean} returns if true
 */
function van_weight_assess () {
    /**
     * van_weight_assess local variables
     * @type {String} text variable used to hold HTML text relating to assessment
     * @type {number} weight variable used to hold weight assessment
     */
    var text = "";
    var weight = (parseInt(document.getElementById("vanTare").value) || 0) + (parseInt(document.getElementById("vanPayload").value) || 0);

    if (weight > document.getElementById("vanAtm").value) {
        document.getElementById("vanYourWeights").style.backgroundColor = "#ffcccc";
        document.getElementById("vanYourWeights").style.fontStyle = "oblique";
        text = "<span class='text-danger'><strong>Your van is to heavy you need to reduce your weight!</strong></span>";
    } else {
        document.getElementById("vanYourWeights").style.backgroundColor="#99ffcc";
        document.getElementById("vanYourWeights").style.fontStyle = "normal";
        text = "TARE + your payload.";
    }
    document.getElementById("vanYourWeights").innerHTML = weight;
    document.getElementById("vanYourWeightsHelp").innerHTML = text;

}

/**
 * Ensure tow bar is <= to the vehicles legal tow weight.
 * @return {boolean} returns if true
 */
function car_tow_capacity () {
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
/**
 * determine maximum payload for car based on user values.
 * @return {boolean} returns if true
 */
function car_maxpayload_assess () {
    /**
     * car_maxpayload_assess local variables.
     * @type {number} result variable to hold the weight result of assessment
     */
    var result = document.getElementById("carGvm").value - document.getElementById("carKerb").value - document.getElementById("carAccessories").value;
    document.getElementById("carMaxPayload").style.backgroundColor = "#c5f0f7";
    document.getElementById("carMaxPayload").innerHTML = result;
}

//determine the overall vehicle weight and return a response
/**
 * determine the overall vehicle weight.
 * @return {boolean} return if true
 */
function car_weight_assess () {
    /**
     * car_weight_assess local variables.
     * @type {String} text HTML text returned based on weight assessment
     * @type {number} weight weight determine from assessment
     */
    var text = "";
    var weight = (parseInt(document.getElementById("carKerb").value) || 0) + (parseInt(document.getElementById("carAccessories").value) || 0) + (parseInt(document.getElementById("carPayload").value) || 0);

    if (weight > document.getElementById("carGvm").value) {
        document.getElementById("carYourWeights").style.backgroundColor="#ffcccc";
        document.getElementById("carYourWeights").style.fontStyle = "oblique";
        text = "<span class='text-danger'><strong>You are over your GVM! Check your weights</strong></span>";
    } else {
        document.getElementById("carYourWeights").style.backgroundColor="#99ffcc";
        document.getElementById("carYourWeights").style.fontStyle = "normal";
        text ="Total Car Weight = Kerb + Accessories + Payload";
    }
    document.getElementById("carYourWeights").innerHTML = weight;
    document.getElementById("carYourWeightsHelp").innerHTML = text;
}

/**
 * set the maximum payload value to the maximum allowable paylaod.
 * @return {boolean} return if true
 */
function car_payload_maxvalue() {
    // declare function variables
    /**
     * car_payload_maxvalue local variables.
     * @type {number} maxPayload maximum payload of car
     * @type {number} newMax new maxium paylaod of car
     */
    var maxPayload = document.getElementById("carPayload");
    var newMax = document.getElementById("carMaxPayload").value;
    maxPayload.setAttribute("max",newMax);
}

/**
 * determine car payload.
 * @return {boolean} return if true
 */
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

/**
 * determine the combined assessment based on the cars GCM.
 * @return {[type]} [description]
 */
function check_combined_weights() {
    /**
     * check_combined_weights local variables.
     * @type {String} text text values to be returned
     * @type {number} weights the weights of the car/trail based on user input
     * @type {number} carWeight the cars weight based on users values
     * @type {number} vanWeight the vans weight based on users values
     */
    var text = "";
    var weights = (parseInt(document.getElementById("carYourWeights").value) || 0) + (parseInt(document.getElementById("vanYourWeights").value) ||0);
    var carWeight = (parseInt(document.getElementById("carKerb").value) || 0) + (parseInt(document.getElementById("carAccessories").value) || 0) + (parseInt(document.getElementById("carPayload").value) || 0);
    var vanWeight = (parseInt(document.getElementById("vanTare").value) || 0) + (parseInt(document.getElementById("vanPayload").value) || 0);

    if (weights > document.getElementById("carGcm").value) {
        document.getElementById("combinedWeights").style.backgroundColor="#ffcccc";
        text = "<span class='text-danger'><strong>Your combined weights is greater than your GCM!</strong></span>";
    } else if (vanWeight > document.getElementById("vanAtm").value) {
          document.getElementById("combinedWeights").style.backgroundColor = "#ffcccc";
          text = "<span class='text-danger'><strong>Your van is to heavy you need to reduce your weight!</strong></span>";
    } else if (carWeight > document.getElementById("carGvm").value) {
          document.getElementById("combinedWeights").style.backgroundColor="#ffcccc";
          text = "<span class='text-danger'><strong>You are over your car's GVM! Check your car weights</strong><span>";
    }  else {
        document.getElementById("combinedWeights").style.backgroundColor="#99ffcc";
        text = "Your combined weights";
    }
    document.getElementById("combinedWeights").innerHTML = weights;
    document.getElementById("combinedWeightsHelp").innerHTML = text;
}


/**
 * clear localStorage values.
 * @param  {string} clearing the area of localStorage to clear
 * @return {boolean}          confirm request true to clear false don't clear
 */
function clear_storage (clearing) {

    // declare function variables
    /**
     * clear_storage local variables
     * @type {string} retVal value displayed in alert box to confirm delete
     * @type {number} cnt set to localStorage length
     * @type {string} re  values in localStorage to clear
     */
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
        } else if (clearing === "todReset") {
            re = /tod/;
            localStorage.setItem('cnttod', 0);
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

/**
 * calls to a number of procedures to ensure assessments are changed,
 * in realtime
 * @return {boolean} return if true
 */
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
