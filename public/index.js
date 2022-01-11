var nameLabel =  `<label for=\"name\"> Item Name: </label>`;
var nameField = `<input type="text" id="name" name="name" />`;
var manufacturerLabel =  `<label for=\"manufacturer\"> Manufacturer Name: </label>`;
var manufacturerInput = `<input type="text" id="manufacturer" name="manufacturer" />`;
var serialNoLabel =  `<label for=\"serialNo\"> Serial Number: </label>`;
var serialNoInput = `<input type="text" id="serialNo" name="serialNo" />`;
var quantityLabel = `<label for=\"quantity\"> Quantity:</label>`;
var quantityInput = `<input type="text" id="quantityNo" name="quantityNo" />`;
var submitButton = `<button type="button" id="btn-logout" class="btn btn-outline">Submit</button>`;



$(document).ready(function () {

	
	//load uploadpage.html
	$('#btn-add').click(() => {
		alert("here");
	
		$('#main-div').empty();
		$('#main-div').append(getAddPage());
		//$('.btn-navbar').attr('disabled', false);
		//$('#btn-add').attr('disabled', true);
		
	});

	$('#btn-search').click(()=>{
		//send search page
	});

	$('#btn-delete').click(()=>{
		//send delete page
	});



});

















function getAddPage()
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
	 + `${submitButton}`
	 + "</div>"
	 + "</div>";

	 return s;

}
