window.onbeforeunload = function () {
    if (performance.navigation.type == 0) {
        // return "You're about to end your session, are you sure?";
    }
}

$(function () {

    var allowed_images_size = 8;
    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);

        return (results !== null) ? results[1] || 0 : false;
    }

    var paramTemplateName = $.urlParam('template_name');
    if (paramTemplateName && paramTemplateName !== false) {
        paramTemplateName = decodeURIComponent(paramTemplateName);

        settings.indexedDB.load(paramTemplateName, 'message_templates', obj => {
            let templateSelected = obj;
            if (templateSelected !== undefined) {
                $("#message_template_name").val(templateSelected.name);
                $("#message_template").val(templateSelected.template);

            }
        })

        getImagesMap(paramTemplateName, function (storeMap) {
            if (storeMap.length !== 0) {
                for (var i = 1; i <= allowed_images_size; i++) {
                    var fileName = 'image_' + i;
                    var button = 'delete_' + i
                    $('#' + fileName).attr('width', '220');
                    $('#' + fileName).attr('height', '145');
                    if (storeMap[(i - 1)])
                        $('#' + button).attr('data-id', storeMap[(i - 1)].name)
                    if (storeMap[i - 1] !== undefined) {
                        if (storeMap[(i - 1)].src.indexOf('image') > -1 || storeMap[(i - 1)].src.indexOf('application/pdf') > -1) {
                            $('#' + fileName).attr('src', storeMap[i - 1].src);
                        }
                        $('#' + fileName).attr('original_src', storeMap[(i - 1)].original_src);
                        var originalFileName = storeMap[i - 1].original_file_name;
                        if (originalFileName) {
                            originalFileName = originalFileName.length > 30 ? originalFileName.substr(0, 30) : originalFileName;
                            $('#image_' + i + '_label').text(originalFileName);
                        }
                    }
                }
            }
        });
    }

    $("#save").click(function () {
        try {
            var message_template_name = $("#message_template_name")[0].value;
            var message_template = $("#message_template")[0].value;

            if (!message_template_name || message_template_name == '') {
                throw new Error("Please enter 'Message template name'.");
            }
            if (message_template_name == 'my_template') {
                throw new Error("Message template name can not be 'my_template'. Enter different name.");
            }
            if (!message_template || message_template == '') {
                throw new Error("Please enter 'message_template'.");
            }


            if (message_template_name) {
                message_template_name = slug(message_template_name).trim();
            }

            if (message_template) {
                message_template = message_template.trim();
                if (message_template.length > 1500) {
                    alert('Please limit the size to 1500 chars only');
                    return;
                }
            }

            let data = {name: message_template_name, template: message_template}
            settings.indexedDB.load(data.name, 'message_templates', (e) => {
                if (e === undefined) {
                    settings.indexedDB.save(data, 'message_templates');
                } else {
                    settings.indexedDB.put(data, 'message_templates');
                }
            })
            for (var i = 1; i <= allowed_images_size; i++) {
                var fileName = 'image_' + i;
                var originalFileName = $('#' + fileName + '_label').text();
                var originalSrc = $('#' + fileName).attr('original_src');
                var src = $('#' + fileName).attr('src');
                if (!originalSrc) {
                    continue;
                }
                if (originalFileName) {
                    originalFileName = originalFileName.length > 30 ? originalFileName.substr(0, 30) : originalFileName;
                }
                let imgObj = {
                    'template_name': message_template_name,
                    'name': fileName + '_' + message_template_name,
                    'original_file_name': originalFileName,
                    'original_src': originalSrc,
                    'src': src
                }
                saveImage(imgObj);
            }
            alert('Template salvo com sucesso!');
            setTimeout(() => {
                window.location.href = 'all_templates.html';
            }, 500)

        } catch (e) {
            if (e.message)
                alert(e.message);
        }
    });

    $("#delete").click(function (event) {
        try {
            event.preventDefault();
            var templateName = $("#message_template_name")[0].value;
            var template = $("#message_template")[0].value;

            if (!templateName || templateName == '') {
                throw new Error("Please specify a template from show_all_templates page.");
            }

            var c = confirm("Tem certeza de que deseja excluir este template? esta acao nao e reversivel..");
            if (c) {
                settings.indexedDB.delete(templateName, 'message_templates')
                alert("Template deletado com sucesso.");
                setTimeout(() => {
                    window.location.href = 'all_templates.html';
                }, 500)
            }
        } catch (e) {
            if (e.message)
                alert(e.message);
        }
    });

    $("[id^=delete_]").click(function (event) {
        event.preventDefault();
        var dataId = $(this).attr("data-id");
        console.log(dataId);
        var id = this.id.substr(this.id.indexOf('_') + 1);
        var fileName = 'image_' + id;
        var c = confirm("Are you sure to delete the image? name: " + fileName);
        if (c) {
            settings.indexedDB.delete(dataId, 'images');
            $('#' + fileName).attr('src', 'img/no_image.png');
            $('#' + fileName).attr('original_src', '');
            $('#image_' + id + '_label').text('Media ' + id);

        }
    });

    $('input[type=file]').change(function () {
        var t = $(this).val();
        var labelText = 'File : ' + t.substr(12, t.length);

        if (labelText <= 0) {
            alert("File name is too small, please select a file");
            return;
        }

        if (labelText.length > 70) {
            alert("File name is too large, please trim it");
            return;
        }

        var templateName = $("#message_template_name")[0].value;
        console.log(templateName)
        var freeSlot = findfirstFreeSlot(templateName);
        if (freeSlot == -1) {
            alert('Only ' + allowed_images_size + ' images are allowed, please delete one to save');
            return;
        }
        var fileName = "image_" + freeSlot;
        var originalFileName = t.substr(12, t.length);
        if (originalFileName) {
            originalFileName = originalFileName.length > 30 ? originalFileName.substr(0, 30) : originalFileName;
            $('#image_' + freeSlot + '_label').text(originalFileName);
        }

        readURL(this, fileName, t.substr(12, t.length), function (e, file) {
            var type = file.type;
            if (type == 'application/pdf') {
                pdfThumb(file, fileName, function (canvas) {
                    var src = canvas.toDataURL();
                    setImage(templateName, fileName, originalFileName, src, e.target.result);
                }, fileName);
            } else if (type && type.indexOf('image/') >= 0) {
                setImage(templateName, fileName, originalFileName, e.target.result, e.target.result);
            } else if (type == 'video/mp4') {
                setImage(templateName, fileName, originalFileName, e.target.result, e.target.result);
            } else if (type == 'audio/mpeg') {
                setImage(templateName, fileName, originalFileName, e.target.result, e.target.result);
            }
        });
        this.value = null;
    });

    function setImage(templateName, fileName, originalFileName, src, originalSrc) {
        // $('#' + fileName).attr('src', src);
        let input = $(`#${fileName}`);
        input.attr('width', '220');
        input.attr('height', '145');
        if (src.indexOf('image') > -1 || src.indexOf('application/pdf') > -1) {
            $('#' + fileName).attr('src', src);
        }
        input.attr('original_src', originalSrc);
        let imgObj = {
            'template_name': templateName,
            'name': fileName,
            'original_file_name': originalFileName,
            'original_src': originalSrc,
            'src': src
        };
    }

    function findfirstFreeSlot(templateName) {
        for (var i = 1; i <= allowed_images_size; i++) {
            var fileName = 'image_' + i;
            var originalSrc = $('#' + fileName).attr('original_src');
            if (!originalSrc || originalSrc === 'img/no_image.png') {
                return i;
            }
        }
        return -1;
    };

    function getImagesMap(templateName, callback) {
        return settings.indexedDB.load(templateName, 'images', function (evt) {
            callback(evt)
        });
    }

    function getFileName(i) {
        return 'image_' + i;
    }

    function readURL(input, fileName, originalFileName, callback) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            var file = input.files[0];
            reader.onload = function (e) {
                callback(e, file);
            };

            reader.readAsDataURL(file);
        }
    };

    function makeThumb(page) {
        // draw page to fit into 96x96 canvas
        var vp = page.getViewport({scale: 1,});
        var canvas = document.createElement("canvas");
        canvas.width = 220;
        canvas.height = 145;
        var scale = Math.min(canvas.width / vp.width, canvas.height / vp.height);
        return page.render({
            canvasContext: canvas.getContext("2d"),
            viewport: page.getViewport({scale: scale,})
        }).promise.then(function () {
            return canvas;
        });
    }

    function pdfThumb(pdfUrl, fileName, callback) {
        pdfUrl = URL.createObjectURL(pdfUrl);
        pdfjsLib.getDocument(pdfUrl).promise.then(function (doc) {
            return doc.getPage(1).then(makeThumb).then(callback);
        }, fileName).catch(console.error);
    }

    function saveImage(imagesToSave) {
        console.log(imagesToSave)
        settings.indexedDB.load(imagesToSave.name, 'images', (e) => {
            if (e.length === 0) {
                settings.indexedDB.save(imagesToSave, 'images');
            } else
                settings.indexedDB.put(imagesToSave, 'images');
        })

    };
    var slug = function (str) {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "ãàáäâẽèéëêìíïîõòóöôùúüûñç·/_,:;";
        var to = "aaaaaeeeeeiiiiooooouuuunc------";
        for (var i = 0, l = from.length; i < l; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    };
});