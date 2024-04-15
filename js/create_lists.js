$(function() {

	// const isCharDigit = n => n < 10;

	// $.urlParam = function(name) {
	// 	var results = new RegExp('[\?&]' + name + '=([^&#]*)')
	// 			.exec(window.location.search);

	// 	return (results !== null) ? results[1] || 0 : false;
	// }

	// var listName = $.urlParam('list_name');
	// if (listName) {
	// 	listName = decodeURIComponent(listName);
	// 	var storedMap = {};
	// 	if (localStorage["broadcast_groups"] !== undefined) {
	// 		storedMap = JSON.parse(localStorage["broadcast_groups"]);

	// 		$("#broadcast_group_name").val(listName);
	// 		$("#phone_numbers").val(storedMap[listName]);
	// 		console.log();

	// 		if (listName === "my_contacts") {
	// 			$('#broadcast_group_name').attr('readonly', 'readonly');
	// 			$('#phone_numbers').attr('readonly', 'readonly');
	// 		}
	// 	}
	// }

	// $("#save").click(function() {
	// 	var broadcast_group_name = $("#broadcast_group_name")[0].value;
	// 	var phone_numbers = $("#phone_numbers")[0].value;

	// 	try {
	// 		if(!broadcast_group_name || broadcast_group_name == '') {
	// 			throw "$Broadcast List name should not be empty.";
	// 		}
	// 		if(!phone_numbers || phone_numbers == '') {
	// 			throw "$Phone numbers field should not be empty.";
	// 		}
	// 		if (broadcast_group_name === "my_contacts") {
	// 			throw "$List name 'my_contacts' is reserved for your contacts. Pls use different name.";
	// 		}

	// 		var split = phone_numbers.split('\n').filter(String);
	// 		if(split.length > 1000) {
	// 			throw '$Upto 1000 numbers only allowed for one list';
	// 		}

	// 		phone_numbers = '';
	// 		var c = false;
	// 		for (var i = 0; i < split.length; i++) {
	// 			var entry = split[i];
	// 			var name = '', phoneNumber = '';
	// 			if (entry) {
	// 				if (entry.indexOf(':') > 0) {
	// 					var np = entry.split(':');
	// 					name = np[0];
	// 					phoneNumber = np[1];
	// 				} else {
	// 					if(entry.indexOf(':') == 0) {
	// 						phoneNumber = entry.substring(1, entry.length);
	// 					} else {
	// 						phoneNumber = entry;
	// 					}
	// 				}

	// 				if (!phoneNumber || (phoneNumber = phoneNumber.trim()).charAt(0) != '+') {
	// 					var savedCountryCode = getDefaultCountryCode();
	// 					if(!c && (!savedCountryCode || savedCountryCode == '')) {
	// 						c = confirm(phoneNumber + "', phone number should start with + followed by country code. If you have a default country code set in 'settings' page, then you can save it Otherwise cancel and add country code including +");
	// 						if(!c)
	// 							break;
	// 					}
	// 				}
	// 				if(phoneNumber && phoneNumber != '') {
	// 					phoneNumber = phoneNumber.replace(/ /g, ""); 
	// 					if(name && name != '') {
	// 						phone_numbers += name + ":";
	// 					}
	// 					phone_numbers += phoneNumber.trim() + "\n";
	// 				}
	// 			}
	// 		}

	// 		var storedMap = {};
	// 		if (localStorage["broadcast_groups"] !== undefined) {
	// 			storedMap = JSON.parse(localStorage["broadcast_groups"]);
	// 		}
	// 		var c = true;
	// 		if (storedMap[broadcast_group_name]) {
	// 			c = confirm("There is already one list with this name : '" + broadcast_group_name + "'. You want to override it ?");
	// 		}
	// 		if (c) {
	// 			storedMap[broadcast_group_name] = phone_numbers;
	// 			localStorage["broadcast_groups"] = JSON.stringify(storedMap);

	// 			alert('Successfully saved your list');
	// 			window.location.href='all_lists.html';
	// 		}
	// 	} catch (e) {
	// 		if (e && e.charAt(0) == '$') {
	// 			alert(e.substring(1, e.length));
	// 		} else {
	// 			alert('Exception occured, please check your input');
	// 		}
	// 	}
	// });

	$("#delete").click(function() {
		try {
			var broadcast_group_name = $("#broadcast_group_name")[0].value;
			var phone_numbers = $("#phone_numbers")[0].value;
	
			if(!broadcast_group_name || broadcast_group_name == '') {
				throw "$Please specify a list from show_all_lists page.";
			}
	
			if (broadcast_group_name === "my_contacts") {
				throw "$List name 'my_contacts' is reserved for your contacts. It can not be deleted.";
			}
	
			var c = confirm("Are you sure that you want to delete this list ? This action is not reversible.");
			if(c) {
				var storedMap = {};
				if (localStorage["broadcast_groups"] !== undefined) {
					storedMap = JSON.parse(localStorage["broadcast_groups"]);
					delete storedMap[broadcast_group_name];
	
					localStorage["broadcast_groups"] = JSON.stringify(storedMap);
					alert("Successfully deleted the list.");
					window.location.href='all_lists.html';
				} else {
					
				}
			}
		} catch (e) {
			if (e && e.charAt(0) == '$') {
				alert(e.substring(1, e.length));
			} else {
				alert('Exception occured, please check your input');
			}
		}
	});

	function getDefaultCountryCode() {
		if (localStorage["use_default_country_code"]) {
			var saved_value = '';
			try {
				saved_value = localStorage["use_default_country_code"];
			} catch (e) {
			}
			return saved_value;
		}
	}
});