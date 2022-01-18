


class Database {
	static crypto = require('crypto');
	static itemsTable = [];
	static serialNumbers = [];
	static MAX_SIZE = 1000000;


	/**
	 * Setters
	 * */
	static addItem(name, manufacturer, serialNumber) {
		var index = Database.hash(String(serialNumber));

		if (Database.serialNumbers[index] == -1) {
			Database.serialNumbers[index] = serialNumber;

		}
		//serial number already exists in database. Therefore cannot add item
		else {
			return false;
		}
		index = Database.hash(name + " " + manufacturer);
		var obj = Database.itemsTable[index];
		if (obj == null) {
			Database.itemsTable[index] = {
				name: name,
				manufacturer: manufacturer,
				serialNumbers: [serialNumber],
				amount: 1
			}
		} else {
			Database.itemsTable[index].serialNumbers.push(serialNumber);
			Database.itemsTable[index].amount += 1;
		}

		return true;

	}

	static editItem(oldName, newName, oldManufacturer, newManufacturer, serialNumber) {


		var item = Database.getItem(oldName, oldManufacturer);
		var arr = Database.arrayRemove(item.serialNumbers, serialNumber);

		item.amount -= 1;
		item.serialNumbers = arr;
		var index = Database.hash(oldName + " " + oldManufacturer);
		//case 1: there are no items left, in which case set the itemsTable[index] to null

		if (item.amount == 0) {
			Database.itemsTable[index] = null;

		}

		index = Database.hash(String(serialNumber));

		Database.serialNumbers[index] = -1;

		Database.addItem(newName, newManufacturer, serialNumber);
		//case 2: there is one or more items left, in which case remove the serial number from this items list of serial numbers
		//go to the new index of itemsTable. if it is null, create a new item with the new serial number. If it is not null, append the new
		//serial number to the item that is already there and increase the amount by 1

	}


	/**
	 * 
	 * @param {*} none 
	 * @returns List of items
	 */
	static getItemsForEditTable() {
		var items = [];
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null) {
				var item = {
					name: Database.itemsTable[i].name,
					manufacturer: Database.itemsTable[i].manufacturer,
					serialNumbers: Database.itemsTable[i].serialNumbers
				}
				items.push(item);
			}
		}

		return items;
	}


	//delete functions
	static getItemsForDeleteTable() {
		var items = [];
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null) {
				var item = {
					name: Database.itemsTable[i].name,
					manufacturer: Database.itemsTable[i].manufacturer,
					amount: Database.itemsTable[i].amount
				}
				items.push(item);
			}
		}

		return items;
	}
	static deleteItem(name, manufacturer, amount) {
		var item = Database.getItem(name, manufacturer);
		if (amount > item.amount) {
			amount = item.amount;
		}

		Database.deleteSerialNumbers(item, amount);

		if (amount == item.amount) {
			var index = Database.hash(name + " " + manufacturer);
			Database.itemsTable[index] = null;
		} else {
			item.amount -= amount;
		}


		//remove all the serial numbers from the serial number table.
	}

	static deleteSerialNumbers(item, amount) {
		for (var i = 0; i < amount; i++) {
			var serialNumber = item.serialNumbers[i];
			Database.serialNumbers[Database.hash(String(serialNumber))] = -1;
			item.serialNumbers.shift();
		}
	}

	//view functions
	static viewItem(mode) {
		return 0;
	}


	static hash(string) {
		var index = Database.crypto.createHash('sha256').update(string).digest('hex');
		index = parseInt(index, 16) % this.MAX_SIZE;
		return index;
	}

	static initDataBase() {
		for (var i = 0; i < this.MAX_SIZE; i++) {
			Database.itemsTable[i] = null;
			Database.serialNumbers[i] = -1;
		}
	}


	//getters

	/**
	 * 
	 * @param {String} name 
	 * @param {String} manufacturer 
	 * @returns {object} item
	 */
	static getItem(name, manufacturer) {
		var index = Database.hash(name + " " + manufacturer);
		var item = Database.itemsTable[index];

		return item;
	}


	/**
	 * 
	 * @param {String} oldName 
	 * @param {String} newName 
	 * @param {String} oldManufacturer 
	 * @param {String} newManufacturer 
	 * @returns {boolean} true if oldName == newName and oldManufacturer==newManufacturer, else false
	 */
	static sameItem(oldName, newName, oldManufacturer, newManufacturer) {
		if (oldName.localeCompare(newName) == 0 && oldManufacturer.localeCompare(newManufacturer) == 0) return true;
		return false;
	}

	/**
	 * 
	 * @param {object} item 
	 * @param {integer} serialNumber 
	 * @returns true if  the object contains the serial number, else returns false
	 */
	static containsSerialNumber(item, serialNumber) {
		for (var i = 0; i < item.serialNumbers.length; i++) {
			if (item.serialNumbers[i] == serialNumber) return true;
		}
		return false;
	}


	//view  fucntions

	/**
	 * 
	 * @param {int} mode
	 * @param {any} key (amount, name, manufacturer)
	 * @return {list} items: list of items to view 
	 */
	static viewItems(mode, key) {

		var items = [];
		if (mode == 0) {
			//return all
			Database.getAll(items);

		}
		else if (mode == 1) {
			//view by amount
			Database.getByAmount(items, parseInt(key));
		} else if (mode == 2) {
			//view by name
			Database.getByName(items, key);
		} else if (mode == 3) {
			//view by manufacturer
			Database.getByManufacturer(items, key);
		}

		return items;

	}




	//get a list of all items in database
	static getAll(items) {
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null) {
				var item = Database.itemsTable[i];
				for (var j = 0; j < item.serialNumbers.length; j++) {
					var subItem = {
						name: item.name,
						manufacturer: item.manufacturer,
						serialNumber: item.serialNumbers[j]
					}
					items.push(subItem);
				}
			}
		}
	}//end function

	//get a list of all items <= amount entered

	static getByAmount(items, amount) {
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null && Database.itemsTable[i].amount <= amount) {
				var item = Database.itemsTable[i];
				items.push(item);
			}
		}

	}//end function

	//get by name
	static getByName(items, name) {
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null && Database.itemsTable[i].name.localeCompare(name) == 0) {
				var item = Database.itemsTable[i];
				for (var j = 0; j < item.serialNumbers.length; j++) {
					var subItem = {
						name: item.name,
						manufacturer: item.manufacturer,
						serialNumber: item.serialNumbers[j]
					}
					items.push(subItem);
				}
			}
		}
	}//end function


	//get by manufacturer
	static getByManufacturer(items, manufacturer) {
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null && Database.itemsTable[i].manufacturer.localeCompare(manufacturer) == 0) {
				var item = Database.itemsTable[i];
				for (var j = 0; j < item.serialNumbers.length; j++) {
					var subItem = {
						name: item.name,
						manufacturer: item.manufacturer,
						serialNumber: item.serialNumbers[j]
					}
					items.push(subItem);
				}
			}
		}
	}//end function


	//helper functions
	static arrayRemove(arr, value) {

		return arr.filter(function (ele) {
			return ele != value;
		});
	}

	static toCsvArray() {
		var csvArray = [["Name", "Manufacturer", "Serial Number"]];
		for (var i = 0; i < Database.MAX_SIZE; i++) {
			if (Database.itemsTable[i] != null) {
				var item = Database.itemsTable[i];
				for (var j = 0; j < item.serialNumbers.length; j++) {
					var csvObj = {
						name: item.name,
						manufacturer: item.manufacturer,
						serialNumber: item.serialNumbers[j],
					}
					csvArray.push(csvObj);

				}
			}
		}

		return csvArray;

	}

}



module.exports = Database;