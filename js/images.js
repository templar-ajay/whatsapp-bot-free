$(function() {

	window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

	var storeMap = getImagesMap();
	if(storeMap) {
		for(var i = 1; i <= 20; i++) {
			var fileName = 'image_' + i;
			$('#' + fileName).attr('width', '220');
			$('#' + fileName).attr('height', '145');
			if(storeMap[fileName] != undefined) {
				$('#' + fileName).attr('src', storeMap[fileName].content);
				var originalFileName = storeMap[fileName].name;
				if(originalFileName) {
					originalFileName = originalFileName.length > 30 ? originalFileName.substr(0, 30) : originalFileName;
					$('#image_' + i + '_label').text(originalFileName);
				}
			}
		}
	}

	$('input[type=file]').change(function() {
		var t = $(this).val();
		var labelText = 'File : ' + t.substr(12, t.length);
//		$(this).prev('label').text(labelText);

		if(labelText <= 0) {
			alert("File name is too small, please select a file");
			return;
		}

		if(labelText.length > 70) {
			alert("File name is too large, please trim it");
			return;
		}

		var freeSlot = findfirstFreeSlot();
		if(freeSlot == -1) {
			alert('Only 20 images are allowed, please delete one to save');
			return;
		}
		var fileName = "image_" + freeSlot;
		var originalFileName = t.substr(12, t.length);
		if(originalFileName) {
			originalFileName = originalFileName.length > 30 ? originalFileName.substr(0, 30) : originalFileName;
			$('#image_' + freeSlot + '_label').text(originalFileName);
		}
		var content = readURL(this, fileName, t.substr(12, t.length));
	})

	function readURL(input, fileName, originalFileName) {
		if (input.files && input.files[0]) {
			var reader = new FileReader();

			reader.onload = function(e) {
				$('#' + fileName).attr('width', '220');
				$('#' + fileName).attr('height', '145');
				$('#' + fileName).attr('src', e.target.result);

				saveImage(fileName, originalFileName, e.target.result);
			};

			reader.readAsDataURL(input.files[0]);
		}
	}

	$("[id^=delete_]").click(function() {
		var id = this.id.substr(this.id.indexOf('_') + 1);
		var fileName = 'image_' + id;
		var c = confirm("Are you sure to delete the image? name: " + fileName);
		if(c) {
			$('#' + fileName).attr('src', 'img/no_image.png');
			$('#image_' + id + '_label').text('Image ' + id);

			var imgMap = getImagesMap();
			imgMap[fileName] = undefined;
			localStorage['my_images'] = JSON.stringify(imgMap);
		}
	});

	function getFileName(i) {
		return 'image_' + i;
	}

	function findfirstFreeSlot() {
		var storeMap = getImagesMap();
		if (storeMap) {
			var freeSlot = -1;
			for (var i = 1; i <= 20; i++) {
				if (storeMap[getFileName(i)] == null) {
					freeSlot = i;
					break;
				}
			}
			return freeSlot;
		}
		return 1;
	}


	function binEncode(data) {
		return data.replace(/data\:image\/png;base64,/, '');
	}

	function saveImage(fileName, originalFileName, content) {
		var storeMap = getImagesMap();
		if(storeMap) {
			if(storeMap[fileName]) {
				alert('Only 20 images are allowed, please delete one to save');
				return;
			}
		} else {
			storeMap = {};
		}
		var object = {};
		object.name = originalFileName;
		object.content = content;
		storeMap[fileName] = object;
		localStorage['my_images'] = JSON.stringify(storeMap);
	}

	function readImage(e, fileName) {
	}

	function getImagesMap() {
		if(localStorage['my_images']) {
			return JSON.parse(localStorage['my_images']);
		}
	}
});
