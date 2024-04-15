$('head').append("<link rel='stylesheet' href=''>")

function sendPush() {
    sendbutton = document.getElementsByClassName("_4sWnG"),
        1 == sendbutton.length ? sendbutton[0].click() : window.setTimeout(sendPush, 1e3)
}

/// file upload - start ///
var filesToBeUploaded = [];
var imagesToBeUploaded = [];

var leads;

var processingPhoneList = false;
var preventAlert = false;
var clipboardData;

function fileInput() {

    var files = this.files;
    if (files == undefined) {
        return;
    }
    var tempFileList = [];
    for (var i = 0; i < files.length; i++) {
        files[i].guid = create_UUID();
        tempFileList.push(files[i]);
        filesToBeUploaded.push(files[i]);
    }

    renderFileList(tempFileList);
    // this is to allow the file browser trigger again
    this.files = null;
};

function imagesInput(images) {
    removeAllFiles();
    if (images == undefined) {
        return;
    }
    var tempFileList = [];
    var imagesLength = images.length;
    for (var i = 0; i < imagesLength; i++) {
        images[i].guid = create_UUID();
        tempFileList.push(images[i]);
        imagesToBeUploaded.push(images[i]);
    }
    console.log(tempFileList)
    renderFileList(tempFileList);
}

function create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

var renderFileList = function (tempFileList) {
    var fileListDisplay = document.getElementById('fileList');

    tempFileList.forEach(function (file, index) {

        var output = [];
        var removeLink = "<a class=\"removeFile\" style='color:maroon' href=\"#\" data-fileid=\"" + file.guid + "\">Remove</a>";
        if (file.original_file_name) {
            output.push("<li>", escape(file.original_file_name), " - ", " &nbsp; &nbsp; ", removeLink, "</li> ");
        } else {
            output.push("<li>", escape(file.name), " - ", " &nbsp; &nbsp; ", removeLink, "</li> ");
        }
        var appendNode = document.createElement("p")
        appendNode.setAttribute('wa_tm_image_parent', true);
        appendNode.innerHTML = output.join("");
        fileListDisplay.appendChild(appendNode);
        var elementByClassName = document.getElementsByClassName("removeFile");
        for (var i = 0; i < elementByClassName.length; i++) {
            elementByClassName[i].addEventListener('click', removeFile, false);
        }
    });
};

function removeAllFiles() {
    try {
        filesToBeUploaded = [];
        imagesToBeUploaded = [];
        var imageNodes = document.querySelectorAll('[wa_tm_image_parent=true]');
        if (imageNodes) {
            for (var i = 0; i < imageNodes.length; i++) {
                imageNodes[i].remove();
            }
        }
    } catch (e) {
    }
};

function removeFile() {
    try {
        var guid = this.getAttribute('data-fileid');
        this.parentElement.parentElement.remove();
        if (guid) {
            for (var i = 0; i < filesToBeUploaded.length; i++) {
                if (filesToBeUploaded[i] && filesToBeUploaded[i].guid == guid) {
                    delete filesToBeUploaded[i];
                    break;
                }
            }
            for (var i = 0; i < imagesToBeUploaded.length; i++) {
                if (imagesToBeUploaded[i] && imagesToBeUploaded[i].guid == guid) {
                    delete imagesToBeUploaded[i];
                    break;
                }
            }
        }
    } catch (e) {
    }
};

/// file upload - end ///

function getMensajes() {
    var a = JSON.parse(JSON.stringify(Store.Chat))[0].msgs,
        b = [];
    if (a.length > 0)
        for (i = 0; i < a.length; i++) {
            var c = a[i].body;
            b.push(c)
        }

    return b
}

function sendNewMsg() {

    var content = "";
    var table = document.getElementById('phonetosendtable');
    for (var r = 0, n = table.rows.length; r < n; r++) {
        var myrows = "";
        for (var c = 1, m = table.rows[r].cells.length; c < m; c++) {
            myrows = myrows + table.rows[r].cells[c].innerHTML + ': '
        }
        myrows = myrows.slice(0, -2)
        content = content + myrows + '\n';
    }
    if (content != "") {
        var a = content;
    } else {
        var a = document.getElementById("phonetosend").value;
    }

    var b = document.getElementById("messagetosend").value;
    // console.log(leads);
    // console.log(content)
    // var b = leads;

    "" == b && (b = WhatsDockLink), wdlauncher("openchatat", {
        id: a,
        msg: b,
        imageFiles: filesToBeUploaded,
        images: imagesToBeUploaded
    }),

        numbers = a.split("\n");
    var c = numbers.length,
        d = c;
    for (c >= 1000 && (c = 1000), i = 0; i < c; i++) {
        var nameAndNumber = numbers[i];
        var a = nameAndNumber.split(':');
        var number, name = '';

        number = a[0];
        if (a.length == 2) {
            name = a[1];
        }
        number = number.replace(/ /g, '');

        wdStats({
            number: number,
            message: b,
            imageFiles: filesToBeUploaded,
            images: imagesToBeUploaded,
            event: "wamsg"
        })
    }
    ;
    sendingmessage = !1;
}

function wdStats(message) {
}

function getThatSideElement() {
    var sideMainElement;

    // main element
    var mainElement = document.evaluate("//div[@id='main']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (mainElement && mainElement.snapshotLength >= 1) {
        sideMainElement = mainElement.snapshotItem(0);
    }

    // header
    if (!sideMainElement) {
        var mainHeaderElement = document.evaluate("//header[count(*)=3]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (mainHeaderElement && mainHeaderElement.snapshotLength >= 1) {
            var mainHeader = mainHeaderElement.snapshotItem(0);
            if (mainHeader && mainHeader.parentElement) {
                sideMainElement = mainHeader.parentElement;
            }
        }
    }

    // image on introduction page
    if (!sideMainElement) {
        var imageElement = document.evaluate("//div[@data-asset-intro-image='true']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (imageElement && imageElement.snapshotLength >= 1) {
            var image = imageElement.snapshotItem(0);
            if (image && image.parentElement && image.parentElement.parentElement) {
                sideMainElement = image.parentElement.parentElement;
            }
        }
    }

    // Phone connected
    if (!sideMainElement) {
        var sideDivElements = document.evaluate("//div[@tabindex=-1]//div//div[descendant::*[descendant::*[contains(text(), 'Keep your phone connected')]]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (sideDivElements && sideDivElements.snapshotLength >= 1) {
            var sideDivElement = sideDivElements.snapshotItem(0);
            if (sideDivElement && sideDivElement.firstElementChild) {
                sideMainElement = sideDivElement.firstElementChild;
            }
        }
    }

    // Phone connected in other languages
    if (!sideMainElement) {
        var sideDivElements = document.evaluate("//div[@tabindex=-1]//div[descendant::*[descendant::h1]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (sideDivElements && sideDivElements.snapshotLength >= 1) {
            var sideDivElement = sideDivElements.snapshotItem(0);
            if (sideDivElement && sideDivElement.firstElementChild) {
                sideMainElement = sideDivElement.firstElementChild;
            }
        }
    }

    // loading the ui again on top of ui
    if (!sideMainElement) {
        var headerElement = document.evaluate("//header[@id='wa_send_bulk_messages_header']", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (headerElement && headerElement.snapshotLength >= 1) {
            var header = headerElement.snapshotItem(0);
            if (header && header.parentElement) {
                sideMainElement = header.parentElement;
            }
        }
    }

    return sideMainElement;
}


function getHeader1() {
    var header;
    var mainElement = document.evaluate("//span//div[descendant :: div[@title='Status'] or descendant :: span[contains(@data-icon, 'status')]]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (mainElement && mainElement.snapshotLength >= 1) {
        header = mainElement.snapshotItem(0);
    }

    if (!header) {
        var statusElement = document.evaluate("//span/div[descendant :: *[name()='svg' and @id='df9d3429-f0ef-48b5-b5eb-f9d27b2deba6' or @id='ee51d023-7db6-4950-baf7-c34874b80976']]", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        if (statusElement && statusElement.snapshotLength >= 1) {
            header = statusElement.snapshotItem(0);
        }
    }

    var statusElement = document.evaluate("//header//span[descendant :: span[@data-icon='chat']]//div", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    if (statusElement && statusElement.snapshotLength >= 1) {
        header = statusElement.snapshotItem(0);
    }

    return header;
}

function processImagesData(data) {
    if (data) {
        var images = data.images;
        var templateName = data.template_name;
        imagesInput(images);
    }
}

function addDownloadContactsButton() {
    if (!document.getElementById('side')) {
        return;
    }

    var ulElement = getHeader1();
    var downloadContactsDiv = document.getElementById('home_button');
    if ((downloadContactsDiv == null || downloadContactsDiv.length == 0) && (ulElement && ulElement.length != 0)) {
        ulElement.insertAdjacentHTML('beforeBegin',
            '<script src="bootstrap/js/jquery.min.js"></script>' +
            '<div id="home_button" class="' + ulElement.className + '">' +
            '<div role="button" title="Menu">' +
            '<span data-icon="menu" class="">' +
            '<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 40 40" style="fill:#000000;">' +
            '<g id="surface1">' +
            '<path style=" fill:#FFFFFF;" d="M 4.222656 29.296875 L 4.117188 29.117188 C 2.507813 26.332031 1.65625 23.148438 1.660156 19.910156 C 1.664063 9.761719 9.925781 1.5 20.078125 1.5 C 25.003906 1.503906 29.632813 3.417969 33.109375 6.898438 C 36.585938 10.378906 38.5 15.007813 38.5 19.925781 C 38.496094 30.078125 30.230469 38.339844 20.078125 38.339844 C 16.996094 38.339844 13.953125 37.566406 11.269531 36.101563 L 11.09375 36.003906 L 1.710938 38.464844 Z "></path>' +
            '<path style=" fill:#4788C7;" d="M 20.078125 2 C 24.867188 2 29.371094 3.867188 32.753906 7.253906 C 36.136719 10.640625 38 15.140625 38 19.925781 C 37.996094 29.804688 29.957031 37.839844 20.074219 37.839844 C 17.082031 37.839844 14.121094 37.085938 11.507813 35.660156 L 11.160156 35.472656 L 10.777344 35.570313 L 2.421875 37.761719 L 4.648438 29.632813 L 4.757813 29.226563 L 4.550781 28.867188 C 2.984375 26.15625 2.15625 23.058594 2.160156 19.910156 C 2.164063 10.035156 10.203125 2 20.078125 2 M 20.078125 1 C 9.652344 1 1.164063 9.484375 1.15625 19.910156 C 1.15625 23.246094 2.027344 26.5 3.683594 29.367188 L 1 39.167969 L 11.03125 36.539063 C 13.792969 38.046875 16.90625 38.839844 20.070313 38.839844 L 20.078125 38.839844 C 30.507813 38.839844 38.996094 30.355469 39 19.925781 C 39 14.871094 37.035156 10.121094 33.460938 6.546875 C 29.890625 2.972656 25.140625 1.003906 20.078125 1 Z "></path>' +
            '<path style="fill:#98CCFD;" d="M 19.996094 35 C 17.492188 35 15.011719 34.367188 12.828125 33.175781 L 11.394531 32.394531 L 9.816406 32.808594 L 6.574219 33.660156 L 7.40625 30.628906 L 7.859375 28.972656 L 7 27.484375 C 5.691406 25.21875 5 22.628906 5 19.992188 C 5.003906 11.726563 11.730469 5 19.996094 5 C 24.007813 5 27.777344 6.5625 30.609375 9.398438 C 33.441406 12.230469 35 16 35 20.003906 C 34.996094 28.273438 28.269531 35 19.996094 35 Z "></path>' +
            '<path style=" fill:#FFFFFF;" d="M 28.085938 24.1875 C 27.640625 23.964844 25.464844 22.894531 25.058594 22.746094 C 24.652344 22.597656 24.355469 22.523438 24.0625 22.96875 C 23.765625 23.410156 22.917969 24.40625 22.660156 24.703125 C 22.402344 24.996094 22.144531 25.035156 21.699219 24.8125 C 21.257813 24.59375 19.828125 24.121094 18.140625 22.613281 C 16.820313 21.441406 15.933594 19.992188 15.675781 19.546875 C 15.417969 19.105469 15.648438 18.867188 15.867188 18.644531 C 16.066406 18.445313 16.3125 18.128906 16.53125 17.867188 C 16.753906 17.609375 16.828125 17.425781 16.976563 17.128906 C 17.125 16.835938 17.050781 16.574219 16.9375 16.355469 C 16.828125 16.132813 15.941406 13.953125 15.574219 13.066406 C 15.214844 12.203125 14.847656 12.320313 14.574219 12.308594 C 14.316406 12.296875 14.023438 12.292969 13.726563 12.292969 C 13.433594 12.292969 12.953125 12.402344 12.546875 12.847656 C 12.140625 13.292969 11 14.363281 11 16.542969 C 11 18.722656 12.585938 20.828125 12.808594 21.121094 C 13.027344 21.417969 15.929688 25.890625 20.375 27.808594 C 21.429688 28.261719 22.257813 28.535156 22.898438 28.738281 C 23.960938 29.078125 24.925781 29.027344 25.6875 28.914063 C 26.539063 28.785156 28.308594 27.84375 28.675781 26.808594 C 29.046875 25.777344 29.046875 24.890625 28.933594 24.703125 C 28.824219 24.519531 28.527344 24.40625 28.085938 24.1875 Z "></path>' +
            '</g>' +
            '</svg>' +
            '</span>' +
            '</div>' +
            '<span></span>' +
            '</div>'
        );

        document.getElementById('home_button').addEventListener("click", function () {
                var mainElement = getThatSideElement();
                if (mainElement) {
                    var childLength = mainElement.childElementCount;
                    while (mainElement.lastChild) {
                        mainElement.removeChild(mainElement.lastChild);
                    }
                    if ($("#modalSH")) {
                        $('#modalSH').remove();
                    }
                    var main = $("#main").parent();
                    main.append('<div id="modalSH" style="height: 100%; width: 100%; position: absolute; z-index: 99; padding-top: 2rem; background: #f7f7f7">' +
                        '<div style="height: 100%;">' +
                        '<div style=" height: 100%;">' +
                        '<div style="width: 100%;height:100%;max-width: 88%;max-height: 100%;margin-top: 5%;margin-left: 6%;/* margin-right: 6%; */">' +
                        '<select id="select_broadcast_list" name="select_broadcast_list" style="width: 30%;margin-left: 20%;float:left;">' +
                        '<option>Escolha uma lista</option>' +
                        '</select> ' +
                        '<select id="select_message_template" name="select_message_template" style="margin-left:4%; width:25%">' +
                        '<option>Escolha um template</option>' +
                        '</select>' +
                        '<button style="float:right;margin: 0 15px;" class="btn-close" id="settings_close"></button>' +
                        '<a style="float:right;" class="btn-settings" id="settings_button" target="_blank" href="#"></a>' +

                        '<h2 style="color: black;margin-top: 6%;margin-bottom:1%;font-size:100%;" class="">' +
                        'Decarregue e edite a ' +
                        '<a href="https://login.socialhub.pro/templates/template.xls" download style="font-weight: bold">planilha de exemplo</a>.' +
                        'Copie e cole as leads da planilha na área embaixo.' +
                        '</h2> ' +
                        '<span id="alertkeyup" style="padding: 10px 4px;background-color: red;display: none;float: left;border-radius: 10px;color: #ffff;margin-bottom: 8px;font-weight: 700;">Ação não permitida, cole a planilha.</span>' +
                        '<button type="button" style="float: right;padding: 7px 10px;margin: 0px 15px 5px 0;background-color:red;border-radius: 7px;color: white;font-weight: 600; display:none;" id="cleartable">Apagar</button>' +

                        '<textarea id="phonetosend" maxlength="0" class="phonetosend" style="height: 24%;font-size: 16px;width: 98%; border-color: rgb(28, 179, 155); background-color: white; cursor: text" placeholder="Cole sua planilha nessa área utilzando CTRL + V."></textarea>' +

                        '<table id="phonetosendtable" class="tg" style="visibility:hidden; display:none; background-color: white; height: 24%;font-size: 16px; width: 98%; border: 1px solid rgb(28, 179, 155); overflow-y: auto;"></table>' +

                        '<h2 style="color:black;margin-top:2%;margin-bottom:1%" class="">Digite sua mensagem aqui</h2>' +
                        '<textarea id="messagetosend" class="messagetosend" style="font-size: 16px;padding: 0.7%;border-color: rgb(28, 179, 155);height: 22%;width: 98%;">Ola {name}, Aqui e o Marcos da SocialHub. Acesse nosso site www.socialhub.pro e confira todos os nossos produtos.</textarea>' +
                        '<div class="container">' +
                        '<form id="fileupload" action="#" method="POST" enctype="multipart/form-data" style="width: 100%;"> ' +
                        '<span class="btn btn-default btn-file" style="position: relative;margin-top: 17px;overflow: hidden;color: #1cb39b;background-color: white;display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: 400;line-height: 1.42857143;text-align: center;white-space: nowrap;vertical-align: middle;cursor: pointer;-moz-user-select: none;-ms-user-select: none;user-select: none;box-sizing: border-box;border: 2px solid;border-radius: 4px;float: left;">' +
                        'Subir arquivo ' +
                        '<input type="file" name="files1" id="files1" multiple="" style=" position: absolute; top: 0; right: 0; min-width: 100%; min-height: 100%; font-size: 100px; text-align: right; filter: alpha(opacity=0); opacity: 0; outline: none; background: white; cursor: inherit; display: block; ">' +
                        '</span> ' +
                        '<span id="sendbutton" class="btn btn-default btn-file" style="position: relative;margin-top: 17px;overflow: hidden;color: #1cb39b;background-color: white;display: inline-block;padding: 6px 12px;margin-bottom: 0;font-size: 14px;font-weight: 400;line-height: 1.42857143;text-align: center;white-space: nowrap;vertical-align: middle;float: right;cursor: pointer;-moz-user-select: none;-ms-user-select: none;user-select: none;box-sizing: border-box;border: 2px solid;border-radius: 4px;/* margin-right: 0%; */">' +
                        'Enviar Mensagem </span><br>' +
                        '<ul class="fileList" id="fileList"></ul>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div id="modal-alert" style="width: 100%; height: 100%; overflow-y: scroll; background-color: rgba(0, 0, 0, 0.5) ; position: absolute; top: 0; display: none;">' +
                        '</div>' +
                        '<div id="loginExt" style="width: 100%; height: 100%;overflow-y: scroll; background-color: rgba(0, 0, 0, 0.5) ; position: absolute; top: 0; display: none; justify-content: center; align-items: center">' +
                        '<div class="container mx-auto min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0">' +
                        '<div>' +
                        '</div>' +
                        '<div class="w-full w-3/4 sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden rounded-lg">' +
                        '<form action="POST" id="formLogin">' +
                        '<div>' +
                        '<label class="block font-medium text-sm text-gray-700" for="email">' +
                        '<span>Email</span>' +
                        '</label>' +
                        '<input class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full" id="email" name="email" type="email" required="" autofocus="">' +
                        '</div>' +
                        '<div class="mt-4">' +
                        '<label class="block font-medium text-sm text-gray-700" for="password">' +
                        '<span>Senha</span>' +
                        '</label>' +
                        '<input class="border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 rounded-md shadow-sm mt-1 block w-full" id="password" name="password" type="password" required="" autocomplete="current-password">' +
                        '</div>' +
                        '<div class="block mt-4">' +
                        '<a class="text-gray-800 hover:text-gray-500" target="_blank" href="https://ext.socialhub.pro/forgot-password">Esqueceu a senha?</a>' +
                        '</div>' +
                        '<div class="flex items-center justify-end mt-4">' +
                        '<button id="btn-login" type="submit" class="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 active:bg-gray-900 focus:outline-none focus:border-gray-900 focus:ring focus:ring-gray-300 disabled:opacity-25 transition ml-4"> Log in </button>' +
                        '</div>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                    );

                    $("#formLogin").submit(function (e) {
                        e.preventDefault();
                        var form = $(this);
                        var data = {
                            email: document.querySelector("#email").value,
                            password: document.querySelector("#password").value,
                            extension: 1
                        }
                        $.ajax({
                            url: "https://ext.socialhub.pro/api/login-ext",
                            type: "POST",
                            dataType: "JSON",
                            data: data,
                            success: function (response) {
                                if (response.token) {
                                    localStorage['token'] = response.token
                                    $('#loginExt').css('display', 'none')
                                } else if (response.fail) {
                                    alert(response.fail)
                                } else {
                                    alert(response)
                                }

                            }
                        })
                    })

                    function checkLogin() {
                        var token = localStorage['token'];
                        $.ajax({
                            url: "https://ext.socialhub.pro/api/login-check",
                            type: "POST",
                            headers: {'Authorization': "Bearer " + token},
                            dataType: "json",
                            async: true,
                            success: function (res) {
                                if (res.success === "false") {
                                    $('#loginExt').css('display', 'flex')
                                }
                            },
                            error: function (error) {
                                $('#loginExt').css('display', 'flex')
                            }
                        })
                    }

                    //checkLogin();
                    document.getElementById("phonetosend").addEventListener("keyup", activeArea);
                    document.getElementById("settings_close").addEventListener("click", closeExt);
                    document.getElementById("phonetosend").addEventListener("paste", convertToTable);
                    document.getElementById("sendbutton").addEventListener("click", sendButtonClick);
                    document.getElementById("cleartable").addEventListener("click", clearTable);

                    filesToBeUploaded = [];
                    imagesToBeUploaded = [];
                    document.getElementById("files1").addEventListener("change", fileInput);

                    document.getElementById("messagetosend").defaultValue = "Oi {nome}, Aqui é o {vendedor} da SocialHub. Acesse nosso site www.socialhub.pro e confira todos os nossos produtos com promoções válidas até {data} da categoria {plataforma}.";
                    mainElement.className = '_2ruyW';
                    if (document.getElementById('select_message_template')) {
                        function getTemplateData(callback) {
                            chrome.runtime.sendMessage({
                                from: "content",
                                subject: "get_template",
                            }, function (response) {
                                callback(response);
                            });
                        }

                        function getImagesData(templateName, callback) {
                            chrome.runtime.sendMessage({
                                from: "content",
                                subject: "get_template_images",
                                template_name: templateName
                            }, function (response) {
                                callback(response);
                            });
                        }

                        function getListData(callback) {
                            chrome.runtime.sendMessage({
                                from: "content",
                                subject: "get_list",
                            }, function (response) {
                                callback(response);
                            });
                        }

                        function getMetaData(callback) {
                            chrome.runtime.sendMessage({
                                from: "content",
                                subject: "get_meta_data",
                            }, function (response) {
                                response.forEach(function (value, key) {
                                    localStorage[value.name] = value.option
                                })
                            });
                        }

                        function uploadBroadCast(callback) {
                            chrome.runtime.sendMessage({
                                from: "content",
                                subject: "upload_broadcast",
                                broadcasts: localStorage['broadcast_groups']
                            }, function (response) {
                                callback(response);
                            });
                        }

                        var c = new CustomEvent("wdlmk", {
                            detail: "load_contacts"
                        });
                        document.dispatchEvent(c);

                        function processOptionsTemplate(data) {
                            var y = document.getElementsByName("select_message_template")[0];
                            y.addEventListener("change", function () {
                                var selectedOption = getSelectedOption(y);
                                if (selectedOption) {
                                    var templateName = selectedOption.innerText;
                                    getImagesData(templateName, processImagesData);
                                    document.getElementById("messagetosend").value = selectedOption.getAttribute('template');
                                }
                            });
                            if (data.length > 0) {
                                data.forEach(function (entry) {
                                    var option = document.createElement("option");
                                    option.text = entry.name;
                                    option.setAttribute('template', entry.template);
                                    y.add(option);
                                })
                            }
                        }

                        function processOptionsList(data) {
                            var x = document.getElementsByName("select_broadcast_list")[0];
                            x.addEventListener("change", function () {
                                var selectedOption = getSelectedOption(x);
                                if (selectedOption) {
                                    convertToTable(selectedOption.getAttribute('list'))
                                }
                            });
                            if (data) {
                                data.forEach(function (entry) {
                                    var option = document.createElement("option");
                                    option.text = entry.name;
                                    var list = '';
                                    if (entry.list) {
                                        var split = entry.list.split('\n');
                                        split.forEach(function (s) {
                                            if (s != '') {
                                                list += s + '\n';
                                            }
                                        });
                                    }
                                    option.setAttribute('list', list);
                                    x.add(option);
                                })
                            }
                        }

                        console.log('meta')
                        getMetaData();
                        uploadBroadCast();
                        getListData(processOptionsList);
                        getTemplateData(processOptionsTemplate);
                    }
                }
                addSettingsButtonEvent();
            }
        )
    }
}

function activeArea() {
    if (flag) {
        return
    }
    var flag = true

    $('#alertkeyup').fadeIn(2000, function () {
        $('#alertkeyup').fadeOut(2000, function () {
            flag = false
        });
    });
}

function convertToTable(e) {
    // return;
    console.log(e)
    if (processingPhoneList) {
        return
    } else {
        processingPhoneList = true
    }

    document.getElementById('phonetosend').style.visibility = 'hidden';
    document.getElementById('phonetosend').style.display = 'none';

    document.getElementById('phonetosendtable').style.visibility = 'visible';
    document.getElementById('phonetosendtable').style.display = 'block';
    document.getElementById('cleartable').style.display = 'block';

    var country_code = localStorage["use_default_country_code"];
    if (country_code == 'null') {
        country_code = ''
    }
    if (e.clipboardData != null || window.clipboardData != null) {
        clipboardData = e.clipboardData || window.clipboardData;
        pastedData = clipboardData.getData('Text');
        myrows = pastedData.split("\n");
        // First Column Table
        tag = myrows[0].split('\t');
        let tb = '<tr><td>1</td>'
        for (let i = 0; i < tag.length; i++) {
            tb = tb + '<td>' + tag[i] + '</td>'
        }
        tb = tb + '</tr>'
        document.getElementById('phonetosendtable').innerHTML += tb;
    } else {
        pastedData = e
        // // tag = "<tr><td>1</td><td>telefone</td><td>nome</td></tr>"
        // document.getElementById('phonetosendtable').innerHTML += tag;
        // myrows = pastedData.split("\n");
        myrows = pastedData.split("\n");
        // First Column Table
        tag = myrows[0].split('\t');
        let tb = '<tr><td>1</td>'
        for (let i = 0; i < tag.length; i++) {
            tb = tb + '<td>' + tag[i] + '</td>'
        }
        tb = tb + '</tr>'
        document.getElementById('phonetosendtable').innerHTML += tb;
    }
    // // First Column Table
    // tag = myrows[0].split('\t');
    // let tb = '<tr><td>1</td>'
    // for (let i = 0; i < tag.length; i++) {
    // 	tb = tb + '<td>' + tag[i] + '</td>'
    // }
    // tb = tb + '</tr>'
    // document.getElementById('phonetosendtable').innerHTML += tb;

    // to other columns
    var c = myrows.length,
        d = c;
    leads = '';
    var N = c;
    if (myrows[(c - 1)] == '') {
        N = c - 1;
    }
    var invalidLeads = {};
    var alreadyLeads = {};
    for (let i = 1; (i < N && i < 1000); i++) {
        var rowContent = myrows[i];
        var a = rowContent.split('\t');

        var lead = '';

        var tr = '<tr><td>' + (i + 1) + '</td>';
        for (let j = 0; (j < a.length && j < 5); j++) {
            if (j == 0 && country_code == undefined || j == 0 && country_code == '-' || j == 0 && country_code == '') {
                a[j] = a[j].replace(/[^\d]+/g, '');
                num = false;
                if (a[j][1] != '+') {
                    a[j] = '+' + a[j];
                }
                num = a[j]
                if (alreadyLeads[a[j]] != undefined) {
                    alreadyLeads[a[j]] = alreadyLeads[a[j]] + 1;
                    num = false
                } else {
                    if (num) {
                        alreadyLeads[a[j]] = 1;
                    }
                }

            } else if (j == 0 && country_code == '+55') { //default Brasil, então conferir se tem o +55 e adicionar se não
                a[j] = a[j].replace(/[^\d]+/g, '');
                num = false;
                if (a[j][1] != '+') {
                    a[j] = '+55' + a[j];
                }
                if (a[j].length > 14 && a[j].indexOf('+5555') <= 0) {
                    a[j] = '+' + a[j].slice(3);
                }
                if (a[j].slice(1, 3) != '55') {
                    a[j] = '+55' + a[j].slice(1);
                }
                if (a[j][3] == '0') {
                    a[j] = a[j].slice(0, 3) + a[j].slice(4)
                }

                num = validateBrasil(a[j], '');
                if (num) {
                    a[j] = num;
                }
                if (alreadyLeads[a[j]] != undefined) {
                    alreadyLeads[a[j]] = alreadyLeads[a[j]] + 1;
                    num = false
                } else {
                    if (num) {
                        alreadyLeads[a[j]] = 1;
                    } else {
                        if (invalidLeads[a[j]] != undefined) {
                            invalidLeads[a[j]] = invalidLeads[a[j]] + 1;
                        } else {
                            invalidLeads[a[j]] = 1;
                        }
                    }
                }
            } else if (j == 0) { //default Brasil, então conferir se tem o +55 e adicionar se não
                a[j] = a[j].replace(/[^\d]+/g, '');
                country_clear = country_code.replace('+', '');
                num = false;
                if (a[j][1] == '+') {
                    a[j] = a[j].slice(1)
                }

                if (a[j].slice(0, 2) == country_clear) {
                    a[j] = a[j].slice(2);
                }

                if (a[j][1] == '0') {
                    a[j] = a[j].slice(1)
                }

                num = country_code + a[j];
                a[j] = num;

                if (alreadyLeads[a[j]] != undefined) {
                    alreadyLeads[a[j]] = alreadyLeads[a[j]] + 1;
                    num = false
                } else {
                    if (num) {
                        alreadyLeads[a[j]] = 1;
                    } else {
                        if (invalidLeads[a[j]] != undefined) {
                            invalidLeads[a[j]] = invalidLeads[a[j]] + 1;
                        } else {
                            invalidLeads[a[j]] = 1;
                        }
                    }
                }
            }
            tr = tr + '<td>' + a[j] + '</td>';
            lead = lead + a[j] + ':';
        }
        tr = tr + '</tr>';
        lead = lead.slice(0, -1) + '\n';
        if (num || i == 0) {
            lead = leads + lead;
            // console.log(tr)
            document.getElementById('phonetosendtable').innerHTML += tr;
        }
    }
    var alertAlreadyLeads = Object.entries(alreadyLeads);
    var repeatLead = [];

    for (let i = 0; i < alertAlreadyLeads.length; i++) {
        if (alertAlreadyLeads[i][1] > 1) {
            repeatLead.push(alertAlreadyLeads[i])
        }
    }
    if (invalidLeads != []) {
        var alertInvalidLeads = Object.entries(invalidLeads);
    }
    if (repeatLead.length > 0 || alertInvalidLeads.length > 0) {
        AlertModal(repeatLead, alertInvalidLeads);
    }
    processingPhoneList = false

    if (e.clipboardData != null || window.clipboardData != null) {
        e.stopPropagation();
        e.preventDefault();
    }
    return false;
}


function clearTable() {
    let clear = document.getElementById("phonetosendtable");
    clear.innerText = "";
    document.getElementById('phonetosendtable').style.visibility = 'hidden';
    document.getElementById('phonetosendtable').style.display = 'none';
    document.getElementById('phonetosend').style.visibility = 'visible';
    document.getElementById('phonetosend').style.display = 'block';

}


function AlertModal(alreadyLeads, invalidLeads) {
    var elementModal = '<div style="max-width: 600px;background-color: #fff;margin: auto;border-radius: 20px;">' +
        '<h3 style="text-align: center; padding-top: 15px; margin: 0;font-weight: 600;color: #128C7E;">RELATÓRIO</h3>';

    if (alreadyLeads.length > 0) {
        var stralreadyLeads = '';
        for (let i = 0; i < alreadyLeads.length; i++) {
            stralreadyLeads = stralreadyLeads + '<p style="font-size: 0.9rem;padding-bottom: 5px;">' + alreadyLeads[i][0] + ' tem ' + alreadyLeads[i][1] + ' repetições </p>'
        }
        elementModal = elementModal +
            '<div style="width: 100%; padding: 10px">' +
            '<p style="padding-bottom: 10px;">Os seguintes números repetidos foram removidos da lista:</p>' +
            stralreadyLeads +
            '</div>';
    }

    if (invalidLeads.length > 0) {
        var strinvalidLeads = '';
        for (let i = 0; i < invalidLeads.length; i++) {
            strinvalidLeads = strinvalidLeads + '<p style="font-size: 0.9rem;padding-bottom: 5px;">' + invalidLeads[i][0] + ' tem ' + invalidLeads[i][1] + ' repetição(ões) </p>'
        }
        elementModal = elementModal +
            '<div style="width: 100%; padding: 10px">' +
            '<p style="padding-bottom: 10px;">Os seguintes números inválidos foram removidos da lista:</p>' +
            strinvalidLeads +
            '</div>';
    }

    elementModal = elementModal + '<div style="text-align: center; margin: 15px 0;"><button id="button-alert" style="padding: 5px 25px;border: 2px solid #128C7E;border-radius: 5px;color: #128C7E;">OK</button></div>' +
        '</div>';
    var modal = document.getElementById('modal-alert');
    modal.innerHTML = elementModal;
    document.getElementById('modal-alert').style.display = 'flex';

    document.getElementById("button-alert").addEventListener("click", function () {
        document.getElementById('modal-alert').style.display = 'none';
    });
}

function validateBrasil(phone, brasil_code) {
    if (brasil_code != '') {
        phone = brasil_code + phone
    }
    if (!(phone.length == 13 || phone.length == 14)) { //incluindo o +
        return false;
    }

    //+55XX9+8digitos, onde XX=[11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28], ex:
    //+55XX+8digitos em outro casso, ex:
    // +5521965913089
    // +558781687546

    var DDDs = ['11', '12', '13', '14', '15', '16', '17', '18', '19', '21', '22', '24', '27', '28'];
    if (DDDs.includes(phone.slice(3, 5))) {
        if (phone.slice(5, phone.length).length == 8) {
            phone = phone.slice(0, 5) + '9' + phone.slice(5);
        } else if (phone.slice(6, phone.length).length == 9 && phone.slice(6, 7) != 9) {
            // console.log('Número inválido: ' + phone);
            return false;
        }
    } else {
        if (phone.slice(5, phone.length).length == 9) {
            phone = phone.slice(0, 5) + phone.slice(6);
        }
    }

    return phone;
}

function closeExt() {
    document.getElementById('modalSH').remove();
}


function addSettingsButtonEvent() {
    var settings_button = document.getElementById('settings_button');
    if (settings_button) {
        settings_button.addEventListener("click", function () {
            event.preventDefault();
            chrome.runtime.sendMessage({
                from: "content",
                subject: "click_settings_button",
            }, function (response) {
            });
        });
    }
}

function getSelectedOption(sel) {
    var opt;
    for (var i = 0, len = sel.options.length; i < len; i++) {
        opt = sel.options[i];
        if (opt.selected === true) {
            break;
        }
    }
    return opt;
}

function sendButtonClick() {
    sendingmessage = !0, sendNewMsg()
}

var scriptElem = document.createElement("script");
scriptElem.innerHTML = "window.onbeforeunload = null;";
var setrate = !1,
    PanesClass = {};
PanesClass.pane = "pane", PanesClass["pane-one"] = "pane-one", PanesClass["pane-two"] = "pane-two", PanesClass["pane-three"] = "pane-three", updatepanes = !0;

var wdlauncher = function (a, b) {
        "undefined" == typeof b && (b = {}), b.op = a;
        var c = new CustomEvent("wdlmk", {
            bubbles: !0,
            cancelable: !1,
            detail: b
        });
        document.dispatchEvent(c)
    },
    inputsearchphoneshowfunction = function () {
        addDownloadContactsButton();
    },
    checknumberofrecipients = function (a) {
        var b = document.getElementById("phonetosend");
        return (
            "undefined" == typeof a && (a = b.value.split(",").length),
            !(a >= 1000) ||
            ((document.getElementById("sendbutton").style.width = "0%"),
                (document.getElementById("sendbutton").style.opacity = "0"),
                (document.getElementById("messagetosend").style.width = getComputedStyle(document.getElementById("phonetosend")).width),
                (document.getElementById("messagetosend").value = ""),
                (document.getElementById("messagetosend").style.display = "none"),
                (document.getElementsByClassName("phonelabellimit")[0].style.display = "block"),
                (document.querySelector(".wdtemplateopenicon").className = "wdtemplateopenicon"),
                !1)
        );
    }

function setToken(token) {
    chrome.storage.sync.set({token: token}, function () {
    });
}

function getToken(callback) {
    chrome.storage.sync.get(['token'], function (result) {
        var token = result.token
        if (token == null) {
            return false
        }
        callback(token)
    })
}
