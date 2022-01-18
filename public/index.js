//labels and inputs
var nameLabel = `<label for=\"name\"> Item Name: </label>`;
var nameLabelNew = `<label for=\"name\"> New Item Name: </label>`;
var nameField = `<input type="text" id="name" class="data-input" name="name" />`;
var nameFieldNew = `<input type="text" id="name-new" class="data-input" name="name" />`;


var manufacturerLabel = `<label for=\"manufacturer\"> Manufacturer Name: </label>`;
var manufacturerLabelNew = `<label for=\"manufacturer\"> New Manufacturer Name: </label>`;
var manufacturerInput = `<input type="text" id="manufacturer" class="data-input" name="manufacturer" />`;
var manufacturerInputNew = `<input type="text" id="manufacturer-new" class="data-input" name="manufacturer" />`;


var serialNoLabel = `<label for=\"serialNo\"> Serial Number: </label>`;
var serialNoInput = `<input type="text" id="serialNo" class="data-input" name="serialNo" />`;

var quantityLabel = `<label for=\"quantityNo\"> Quantity:</label>`;
var quantityInput = `<input type="text" id="quantityNo" class="data-input" name="quantityNo" />`;

//buttons
var addItemButton = `<button type="button" id="submit-add" class="btn btn-dark">Add Item</button>`;
var editItemButton = `<button type="button" id="submit-edit" class="btn btn-dark">Edit Item</button>`;
var deleteItemButton = `<button type="button" id="submit-delete" class="btn btn-dark">Delete Item</button>`;


//labels for scrollable box
var editLabel = `<label> Name, Manufacturer, Serial Number: </label><br>`;
var editBoard = '<div style="height:120px;width:300px;border:1px solid #ccc;overflow-y:auto;" id="serialNoBoard"></div>';

var deleteItemsLabel = `<label> Name, Manufacturer, Quantity: </label><br>`;
var deleteBoard = '<div style="height:120px;width:300px;border:1px solid #ccc;overflow-y:auto;" id="serialNoBoard"></div>';

//for the viewpage

var viewAllButton = `<button type="button" id="view-all" class="btn btn-dark">View All Items</button>`;;
var viewByAmountButton = `<button type="button" id="view-amnt" class="btn btn-dark">View By Amount</button>`;;
var viewByManufacturerButton = `<button type="button" id="view-manufacturer" class="btn btn-dark">View By Manufacturer</button>`;;
var viewByNameButton = `<button type="button" id="view-name" class="btn btn-dark">View By Name</button>`;;




$(document).ready(function () {


	//load addpage
	$('#btn-add').click(() => {

		$('#main-div').empty();
		$('#main-div').append(getAddPage());
		$('#add-container').append(addItemButton);

	});//end add tab

	//edit tab
	$('#btn-edit').click(() => {
		//send search page
		$('#main-div').empty();
		$('#main-div').append(getEditPage());
		$(`#add-container`).append(editItemButton);
		$('#main-div').append(editLabel);
		$('#main-div').append(editBoard);
		$.ajax({
			type: 'GET',
			url: '/editBoard',
			success: (data) => {
				if (data.status == 200) {
					$('#serialNoBoard').append(makeEditList(data.items));
				} else {
					alert("Error getting items")
				}
			},
			fail: (error) => {
				alert(error);
			}


		});//end ajax


	});//end edit tab

	//delete tab
	$('#btn-delete').click(() => {
		//send delete page
		//send search page
		$('#main-div').empty();
		$('#main-div').append(getDeletePage());
		$('#add-container').append(deleteItemButton);
		$('#main-div').append(deleteItemsLabel);
		$('#main-div').append(deleteBoard);
		$.ajax({
			type: 'GET',
			url: '/deleteBoard',
			success: (data) => {
				if (data.status == 200) {
					$('#serialNoBoard').append(makeDeleteList(data.items));

				}

			},
			fail: (error) => {

			}
		});//end ajax
	});//end deletetab

	//view tab
	$('#btn-view').click(() => {
		$('#main-div').empty();
		$(`#main-div`).append(getViewPage());
	});//end view tab




	//ajax call for adding an item
	$(document).on("click", "#submit-add", () => {
		var name = $('#name').val();
		var manufacturer = $('#manufacturer').val();
		var sNum = $('#serialNo').val();
		$.ajax({
			type: 'POST',
			url: '/addItem',
			data: {
				name: name,
				manufacturer: manufacturer,
				sNum: sNum
			},
			success: function (data) {
				if (data.status == 200) $(`#message-board-list`).append(`<li>Successfully added ${data.name} manufactured by ${data.manufacturer} with serial number ${data.sNum} at ${data.time}</li>`);
				else $(`#message-board-list`).append(`<li>Serial Number already exists. Cannot add two items with the same serial number: (${data.time})</li>`);
			},
			fail: function (error) {
				$(`#message-board-list`).append(`<li>Server Error</li>`);
			}

		});//end ajax


	});//end callback

	//ajax call for editing an item
	$(document).on('click', '#submit-edit', () => {
		var oldName = $(`#name`).val();
		var newName = $(`#name-new`).val();
		var oldManufacturer = $(`#manufacturer`).val();
		var newManufacturer = $(`#manufacturer-new`).val();
		var serialNumber = $(`#serialNo`).val();
		$.ajax({
			type: 'POST',
			url: '/editItem',
			data: {
				oldName: oldName,
				newName: newName,
				oldManufacturer: oldManufacturer,
				newManufacturer: newManufacturer,
				serialNumber: parseInt(serialNumber)
			},
			success: (data) => {
				//valid return status
				if (data.status == 200) {
					$(`#message-board-list`).append(`<li>Successfully edited ${data.oldName} manufactured by ${data.oldManufacturer} with serial number ${data.serialNumber}, to ${data.newName} manufactured by ${data.newManufacturer} at ${data.time}</li>`);

					//nested ajax
					$.ajax({
						type: 'GET',
						url: '/editBoard',
						//success
						success: (data) => {
							if (data.status == 200) {
								$(`#serialNoBoard`).empty();
								$('#serialNoBoard').append(makeEditList(data.items));
							} else {
								alert("Error getting items")
							}
						},//end success


						fail: (error) => {
							alert(error);
						}//emd fail


					});//end ajax
				}//end valid return status

				//if editing the item using the same parameters for name and manufacturer
				else if (data.status == 401) {
					$(`#message-board-list`).append(`<li>Please enter a new name, new manufacturer or both (${data.time})</li>`);

				}//end if

				//if item does not contain serial number
				else if (data.status == 402) {
					$(`#message-board-list`).append(`<li>Could not find serial number ${serialNumber} for item ${data.oldName} manufactured by ${data.oldManufacturer}(${data.time})</li>`);

				}

				//if there is no item with the old name and old manufacturer
				else if (data.status == 403) {
					$(`#message-board-list`).append(`<li>Could not find item ${data.oldName} manufactured by ${data.oldManufacturer}(${data.time})</li>`);


				} else if (data.status == 404) {
					$(`#message-board-list`).append(`<li>Server Error: (${data.time})</li>`);

				}//end if

			},//end success
			fail: (error) => {
				$(`#message-board-list`).append(`${error}`);
			}//end fail

		});//end ajax
	});//end callback


	// call for deleting an item
	$(document).on("click", "#submit-delete", () => {
		var name = $(`#name`).val();
		var manufacturer = $(`#manufacturer`).val();
		var amount = $(`#quantityNo`).val();
		$.ajax({
			type: 'POST',
			url: '/deleteItem',
			data: {
				name: name,
				manufacturer: manufacturer,
				amount: amount
			},
			//success
			success: (data) => {

				//if valid request sent
				if (data.status == 200) {
					$(`#message-board-list`).append(`<li>Successfully deleted ${data.amount} units of ${data.name} manufactured by ${data.manufacturer} at ${data.time}</li>`);
					$(`#serialNoBoard`).empty();
					//nested ajax
					$.ajax({
						type: 'GET',
						url: '/deleteBoard',
						success: (data) => {
							if (data.status == 200) {
								$('#serialNoBoard').append(makeDeleteList(data.items));

							}

						},
						fail: (error) => {

						}
					});//end ajax

				}
				//tried deleting an empty item
				else if (data.status == 400) {
					$(`#message-board-list`).append(`<li>There is no such item with the name ${name} manufactured by ${manufacturer} (${data.time})</li>`);

				}//deleting less than 1 item error
				else if (data.status == 401) {
					$(`#message-board-list`).append(`<li>Enter an integer amount greater than 0 (${data.time})</li>`);

				}
				//server error
				else if (data.status == 404) {
					$(`#message-board-list`).append(`<li>Server Error ${data.time}</li>`);

				}
			},//end success
			fail: (err) => {
				$(`#message-board-list`).append(`<li>${err}</li>`);

			}//end failure
		});//end ajax
	});//end callback


	//view callbacks 

	//view all
	$(document).on("click", "#view-all", () => {
		//ajax
		console.log("viewing all");
		$.ajax({
			type: `POST`,
			url: `/viewItems`,
			data: {
				mode: 0,
				info: null
			},
			success: (data) => {
				if (data.status == 200) {
					appendViewItems(data, 0, null);
				}

			},
			fail: (error) => {

			}

		});//end ajax
	});//end callback


	//view callbacks 

	//view by amount
	$(document).on("click", "#view-amnt", () => {
		var mode = 1;
		var amount = $(`#quantityNo`).val();
		console.log(amount);
		//ajax
		$.ajax({
			type: `POST`,
			url: `/viewItems`,
			data: {
				mode: mode,
				info: amount
			},
			success: (data) => {
				if (data.status == 200) {
					appendViewItems(data, 1, amount);
				}
			},
			fail: (error) => {

			}

		});//end ajax
	});//end view 


	//view by name 
	$(document).on("click", "#view-name", () => {
		//ajax
		var mode = 2;
		var name = $(`#name`).val();
		$.ajax({
			type: `POST`,
			url: `/viewItems`,
			data: {
				mode: mode,
				info: name
			},
			success: (data) => {
				if (data.status == 200) {
					appendViewItems(data, 2, name);
				}
			},
			fail: (error) => {

			}

		});//end ajax
	});//end callback


	//view by manufacturer 
	$(document).on("click", "#view-manufacturer", () => {
		//ajax
		var mode = 3;
		var manufacturer = $(`#manufacturer`).val();
		$.ajax({
			type: `POST`,
			url: `/viewItems`,
			data: {
				mode: mode,
				info: manufacturer
			},
			success: (data) => {
				if (data.status == 200) {
					appendViewItems(data, 3, manufacturer);
				}
			},
			fail: (error) => {

			}

		});//end ajax
	});//end callback




});//end document.ready













/***HELPER FUCNTIONS */


//main page for adding and editing
function getAddPage() {
	var s = `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\">`
		+ `<div class=\"container center\" id=\"add-container\">`
		+ `<br>`
		+ `${nameLabel} ${nameField}`
		+ `<br><br>`
		+ `${manufacturerLabel} ${manufacturerInput}`
		+ '<br><br>'
		+ `${serialNoLabel} ${serialNoInput}`
		+ '<br><br>'
		+ "</div>"
		+ "</div>";

	return s;

}

function getEditPage() {
	var s = `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\">`
		+ `<div class=\"container center\" id=\"add-container\">`
		+ `<br>`
		+ `${nameLabel} ${nameField}<br>`
		+ `${nameLabelNew} ${nameFieldNew}`
		+ `<br><br>`
		+ `${manufacturerLabel} ${manufacturerInput}<br>`
		+ `${manufacturerLabelNew} ${manufacturerInputNew}<br><br>`
		+ `${serialNoLabel} ${serialNoInput}`
		+ '<br><br>'
		+ "</div>"
		+ "</div>";

	return s;
}


//make serial numbers list
function makeEditList(data) {
	var s = `<ul>`;
	for (var i = 0; i < data.length; i++) {
		s += `<li>`
		s += String(data[i].name);
		s += ", ";
		s += String(data[i].manufacturer);
		s += ", "
		s += String(data[i].serialNumber);
		s += `</li>`;
	}
	s += `</ul>`;
	return s;
}


//delete page
function getDeletePage() {
	var s = `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\">`
		+ `<div class=\"container center\" id=\"add-container\">`
		+ `<br><br><br>`
		+ `${nameLabel} ${nameField}`
		+ `<br><br>`
		+ `${manufacturerLabel} ${manufacturerInput}`
		+ `<br><br>`
		+ `${quantityLabel} ${quantityInput}`
		+ '<br><br>'
		+ "</div>"
		+ "</div>";

	return s;

}

function makeDeleteList(data) {
	var s = `<ul>`;
	for (var i = 0; i < data.length; i++) {
		s += `<li>`
		s += String(data[i].name);
		s += ", "
		s += String(data[i].manufacturer);
		s += ", "
		s += String(data[i].amount);

		s += `</li>`;
	}
	s += `</ul>`;
	return s;
}


function getViewPage() {
	var s = `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\"><div class=\"container center\" id=\"add-container\"><br>`
		+ `${viewAllButton} <label> View all items in inventory: Results in message board </label>`
		+ `<br><br><br>${viewByAmountButton} <label> Will return all items with the number of units\nat most as the amount enetered:  Results in message board </label><br><br>${quantityInput}`
		+ `<br><br><br><label>${viewByNameButton} Will return all items with the name entered:  Results in message board </label><br><br>${nameField}<br><br><br>`
		+ `<label>${viewByManufacturerButton} Will return all items manufactured by the manufacturer entered:  Results in message board </label><br><br>${manufacturerInput}`
		+ `</div></div>`;
	return s;
}


function emptyElements(elements) {
	$(`#name`).empty();
	for (var i = 0; i < elements.length; i++) {
		console.log(elements[i]);
		$(`${elements[i]}`).empty();
	}
}

function appendViewItems(data, mode, key) {
	//get the name, manufacturer, serial number
	if (mode == 0) {
		$(`#message-board-list`).append("LIST OF ALL ITEMS:");

		for (var i = 0; i < data.items.length; i++) {
			$(`#message-board-list`).append(`<li>Name: ${data.items[i].name}, Manufacturer: ${data.items[i].manufacturer}, Serial Number: ${data.items[i].serialNumber}, Time: ${data.time}</li>`);

		}
	} else if (mode == 1) {
		$(`#message-board-list`).append(`LIST OF ALL ITEMS BY AMOUNT ENTERED ${key}:`);

		for (var i = 0; i < data.items.length; i++) {
			$(`#message-board-list`).append(`<li>Name: ${data.items[i].name}, Manufacturer: ${data.items[i].manufacturer}, Amount: ${data.items[i].amount}, Time: ${data.time}</li>`);

		}
	} else if (mode == 2) {
		$(`#message-board-list`).append(`LIST OF ALL ITEMS BY NAME ${key}:`);
		for (var i = 0; i < data.items.length; i++) {
			$(`#message-board-list`).append(`<li>Manufacturer: ${data.items[i].manufacturer}, Serial Number: ${data.items[i].serialNumber}, Time: ${data.time}</li>`);

		}
	} else if (mode == 3) {
		$(`#message-board-list`).append(`LIST OF ALL ITEMS BY MANUFACTURER ${key}:`);
		for (var i = 0; i < data.items.length; i++) {
			$(`#message-board-list`).append(`<li>Name: ${data.items[i].name}, Seial Number: ${data.items[i].serialNumber}, Time: ${data.time}</li>`);

		}
	}
}
