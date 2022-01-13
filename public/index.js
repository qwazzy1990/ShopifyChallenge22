//labels and inputs
var nameLabel =  `<label for=\"name\"> Item Name: </label>`;
var nameField = `<input type="text" id="name" name="name" />`;
var manufacturerLabel =  `<label for=\"manufacturer\"> Manufacturer Name: </label>`;
var manufacturerInput = `<input type="text" id="manufacturer" name="manufacturer" />`;
var serialNoLabel =  `<label for=\"serialNo\"> Serial Number: </label>`;
var serialNoInput = `<input type="text" id="serialNo" name="serialNo" />`;
var quantityLabel = `<label for=\"quantity\"> Quantity:</label>`;
var quantityInput = `<input type="text" id="quantityNo" name="quantityNo" />`;

//buttons
var addItemButton = `<button type="button" id="submit-add" class="btn btn-dark">Add Item</button>`;
var editItemButton = `<button type="button" id="submit-edit" class="btn btn-dark">Edit Item</button>`;
var deleteItemButton = `<button type="button" id="submit-delete" class="btn btn-dark">Delete Item</button>`;


//labels for scrollable box
var serialNosLabel = `<label> Serial Numbers: </label><br>`;
var serialNoBoard = '<div style="height:120px;width:300px;border:1px solid #ccc;overflow-y:auto;" id="serialNoBoard"></div>';

var deleteItemsLabel = `<label> Serial Numbers/Qunatities: </label><br>`;

//for the viewpage

var viewAllButton = `<button type="button" id="view-all" class="btn btn-dark">View All Items</button>`;;
var viewByAmountButton=`<button type="button" id="view-amnt" class="btn btn-dark">View By Amount</button>`;;
var viewByManufacturerButton = `<button type="button" id="view-manufacturer" class="btn btn-dark">View By Manufacturer</button>`;;
var viewByNameButton = `<button type="button" id="view-name" class="btn btn-dark">View By Name</button>`;;




$(document).ready(function () {

	
	//load uploadpage.html
	$('#btn-add').click(() => {
	
		$('#main-div').empty();
		$('#main-div').append(getMainPage());
		$('#add-container').append(addItemButton);
		//$('.btn-navbar').attr('disabled', false);
		//$('#btn-add').attr('disabled', true);
		
	});

	$('#btn-edit').click(()=>{
		//send search page
		$('#main-div').empty();
		$('#main-div').append(getMainPage());
		$(`#add-container`).append(editItemButton);
		$('#main-div').append(serialNosLabel);
		$('#main-div').append(serialNoBoard);
		$('#serialNoBoard').append(makeSerialNoList([1111, 222, 333, 444, 55, 555, 6666, 666, 6655]));


	});

	$('#btn-delete').click(()=>{
		//send delete page
		//send search page
		$('#main-div').empty();
		$('#main-div').append(getDeletePage());
		$('#add-container').append(deleteItemButton);
		$('#main-div').append(deleteItemsLabel);
		$('#main-div').append(serialNoBoard);
		$('#serialNoBoard').append(makeDeleteList([{sNo:123, amnt:22}, {sNo:22222, amnt:3333}, {sNo:12345, amnt:666}, {sNo:444, amnt:123}, {sNo:55, amnt:222}]));





	});

	$('#btn-view').click(()=>{
		$('#main-div').empty();
		$(`#main-div`).append(getViewPage());
		$(`#view-all`).click(()=>{
			alert("viewing all");
		});
	});



});
















//main page for adding and editing
function getMainPage()
{
	var s =  `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\">`
	 + `<div class=\"container center\" id=\"add-container\">`
	 +`<br>`
	 + `${nameLabel} ${nameField}` 
	 +`<br><br>`
	 + `${manufacturerLabel} ${manufacturerInput}`
	 +'<br><br>'
	 +`${serialNoLabel} ${serialNoInput}`
	 +`<br><br>`
	 +`${quantityLabel} ${quantityInput}`
	 +'<br><br>'
	 + "</div>"
	 + "</div>";

	 return s;

}


//make serial numbers list
function makeSerialNoList(data)
{
	var s = `<ul>`;
	for(var i = 0; i < data.length; i++)
	{
		s += `<li>`
		s += String(data[i]);
		s += `</li>`;
	}
	s += `</ul>`;
	return s;
}


//delete page
function getDeletePage()
{
	var s =  `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\">`
	 + `<div class=\"container center\" id=\"add-container\">`
	 +`<br><br><br>`
	 +`${serialNoLabel} ${serialNoInput}`
	 +`<br><br>`
	 +`${quantityLabel} ${quantityInput}`
	 +'<br><br>'
	 + "</div>"
	 + "</div>";

	 return s;

}

function makeDeleteList(data)
{
	var s = `<ul>`;
	for(var i = 0; i < data.length; i++)
	{
		s += `<li>`
		s += String(data[i].sNo);
		s += "/"
		s += String(data[i].amnt);
		s += `</li>`;
	}
	s += `</ul>`;
	return s;
}


//for the view page

function getViewPage()
{
	var s = `<div class=\"jumbotron jumbotron-fluid\" id=\"homepage-jumbotron\"><div class=\"container center\" id=\"add-container\"><br>`
	+`${viewAllButton} <label> View all items in inventory: Results in message board </label>`
	+`<br><br><br>${viewByAmountButton} <label> Will return all items with the number of units\nat most as the amount enetered:  Results in message board </label><br><br><input type="text" class="view-input"></label>`
	+`<br><br><br>${viewByManufacturerButton}<label> Will return all items made by the manufacturer entered:  Results in message board </label><br><br><input type="text" class="view-input"></label><br><br><br>`
	+`${viewByNameButton}<label> Will return all items with the name entered:  Results in message board </label><br><br><input type="text" class="view-input"></label>`
	+`</div></div>`;
	return s;
}

