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

var deleteItemsLabel = `<label> Serial Numbers/Amounts: </label><br>`;




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



});

















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
