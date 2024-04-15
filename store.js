var Store = {};

function getStore() {
    if (!Store.Chat) {
        function getStore(modules) {
            let foundCount = 0;
            let neededObjects = [
                {id: "Store", conditions: (module) => (module.default && module.default.Chat) ? module.default : null},
                {
                    id: "MediaCollection",
                    conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments) ? module.default : null
                },
                {id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null},
                {id: "Wap", conditions: (module) => (module.createGroup) ? module : null},
                {
                    id: "ServiceWorker",
                    conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null
                },
                {id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null},
                {
                    id: "WapDelete",
                    conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null
                },
                {
                    id: "Conn",
                    conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null
                },
                {
                    id: "WapQuery",
                    conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null)
                },
                {id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null},
                {
                    id: "OpenChat",
                    conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null
                },
                {
                    id: "UserConstructor",
                    conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null
                },
                {id: "genId", conditions: (module) => (module.randomId) ? module.randomId : null},
                {
                    id: "SendTextMsgToChat",
                    conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null
                },
                {id: "SendSeen", conditions: (module) => (module.sendSeen) ? module.sendSeen : null},
                {id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null},
                {id: "WidFactory", conditions: (module) => (module.createWid) ? module.createWid : null}
            ];
            for (let idx in modules) {
                if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    neededObjects.forEach((needObj) => {
                        if (!needObj.conditions || needObj.foundedModule) {
                            return;
                        }
                        let neededModule = needObj.conditions(modules[idx]);
                        if (neededModule !== null) {
                            foundCount++;
                            needObj.foundedModule = neededModule;
                        }
                    });

                    if (foundCount == neededObjects.length) {
                        break;
                    }
                }
            }

            let neededStore = neededObjects.find((needObj) => needObj.id === "Store");

            window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
            neededObjects.splice(neededObjects.indexOf(neededStore), 1);
            neededObjects.forEach((needObj) => {
                if (needObj.foundedModule) {
                    window.Store[needObj.id] = needObj.foundedModule;
                }
            });

            window.Store.Chat.modelClass.prototype.sendMessage = function (e) {
                window.Store.SendTextMsgToChat(this, ...arguments);
            }

            return window.Store;
        }

        if (typeof webpackJsonp === 'function') {
            webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite']);
        } else {
            let tag = new Date().getTime();
            webpackChunkwhatsapp_web_client.push([["parasite" + tag], {}, function (o, e, t) {
                let modules = [];
                for (let idx in o.m) {
                    let module = o(idx);
                    modules.push(module);
                }
                getStore(modules);
            }
            ]);
        }
        if (!window.Store.Chat._find) {
            window.Store.Chat._find = e => {
                const target = window.Store.Chat.get(e);
                return target ? Promise.resolve(target) : Promise.resolve({
                    id: e
                });
            };
        }
    }
}

var getChat = function (_id) {
    let result = null;
    Store.Chat._models.forEach(x => {
        if (x.hasOwnProperty("__x_id") && x.__x_id == _id) {
            result = x;
        }
    });

    return result;
};

function sendMessage_2(i, t, idUser, message, name, images) {
    var do_not_include_media_name = localStorage["do_not_include_media_name"];
    setTimeout(function () {
        var modal = document.getElementById('modal-alert');
        var leadsModal = '<div style="max-width: 600px;background-color: #fff;margin: auto;border-radius: 20px;">' +
            '<h3 style="text-align: center; padding-top: 15px; margin: 0;font-weight: 600;color: #128C7E;">RELATÓRIO</h3>' +
            '<div style="width: 100%; padding: 10px">' +
            '<p style="padding-bottom: 10px;">Sua Campanha foi inicializada.</p>' +
            '<p id="progress-leads" style="padding-bottom: 10px;">foram enviadas ' + t + ' de ' + (l - 1) + ' mensagens.</p>' +
            '</div>' +
            '<div style="text-align: center; margin: 15px 0;"><button id="button-quit" style="padding: 5px 25px;border: 2px solid #128C7E;border-radius: 5px;color: #128C7E;">Cancelar</button></div>';
        modal.innerHTML = leadsModal;
        document.getElementById('modal-alert').style.display = 'flex';
        document.getElementById("button-quit").addEventListener("click", function () {
            location.reload();
        });
        sendMessage(idUser, message, name);
        if (images) {
            images.forEach(function (file, index) {
                try {
                    if (file) {
                        var caption = file.name;
                        if (do_not_include_media_name === 'true') {
                            caption = '';
                        }
                        sendImageFile(file, idUser, caption);
                    }
                } catch (e) {
                }
            });
        }
    }, i, t, idUser, message, images);
}

var sendMessage = function sendMessage(id, message, name, done) {
    var chat = window.Store.Chat.get(id);
    if (chat == null || chat === undefined) {
        chat = getChat(id);
    }

    if (chat == null || chat !== undefined) {
        if (done !== undefined) {
            chat.sendMessage(message).then(function () {
                function sleep(ms) {
                    return new Promise(resolve => setTimeout(resolve, ms));
                }

                var trials = 0;

                function check() {
                    for (let i = chat.msgs._models.length - 1; i >= 0; i--) {
                        let msg = chat.msgs._models[i];

                        if (!msg.senderObj.isMe || msg.body != message) {
                            continue;
                        }
                        done(_serializeMessageObj(msg));
                        return true;
                    }
                    trials += 1;
                    console.log(trials);
                    if (trials > 30) {
                        done(true);
                        return;
                    }
                    sleep(500).then(check);
                }

                check();
            });
            message = message.replace('{nome}', name);
            chat.sendMessage = (chat.sendMessage) ? chat.sendMessage : function () {
                return window.Store.sendMessage.apply(this, arguments);
            };
            chat.sendMessage(message);
            return true;
        } else {
            if (chat == null || chat === undefined) {
                var idUser = new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
                return Store.Chat.find(idUser).then((chat) => {
                    if (!name || name == '') {
                        try {
                            var do_use_public_name = localStorage["do_use_public_name"];
                            if (do_use_public_name && do_use_public_name == 'true') {
                                name = chat.__x_contact.__x_displayName;
                                var use_only_first_name = localStorage["use_only_first_name"];
                                if (use_only_first_name && use_only_first_name == 'true') {
                                    name = getFirstName(name);
                                }
                            }
                        } catch (e) {
                        }
                    }
                    message = message.replace('{nome}', name);
                    chat.sendMessage = (chat.sendMessage) ? chat.sendMessage : function () {
                        return window.Store.sendMessage.apply(this, arguments);
                    };
                    chat.sendMessage(message);
                });
            } else {
                if (!name || name == '') {
                    try {
                        var do_use_public_name = localStorage["do_use_public_name"];
                        if (do_use_public_name && do_use_public_name == 'true') {
                            name = chat.__x_contact.__x_displayName;
                            var use_only_first_name = localStorage["use_only_first_name"];
                            if (use_only_first_name && use_only_first_name == 'true') {
                                name = getFirstName(name);
                            }
                        }
                    } catch (e) {
                    }
                }
                message = message.replace('{nome}', name);
                chat.sendMessage = (chat.sendMessage) ? chat.sendMessage : function () {
                    return window.Store.sendMessage.apply(this, arguments);
                };
                chat.sendMessage(message);
            }
            return true;
        }
    } else {
        if (done !== undefined) done(false);
        return false;
    }
};
var _serializeMessageObj = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign(_serializeRawObj(obj), {
        id: obj.id._serialized,
        sender: obj["senderObj"] ? _serializeContactObj(obj["senderObj"]) : null,
        timestamp: obj["t"],
        content: obj["body"],
        isGroupMsg: obj.isGroupMsg,
        isLink: obj.isLink,
        isMMS: obj.isMMS,
        isMedia: obj.isMedia,
        isNotification: obj.isNotification,
        isPSA: obj.isPSA,
        type: obj.type,
        chat: _serializeChatObj(obj['chat']),
        chatId: obj.id.remote,
        quotedMsgObj: _serializeMessageObj(obj['_quotedMsgObj']),
        mediaData: _serializeRawObj(obj['mediaData'])
    });
};

var _serializeChatObj = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign(_serializeRawObj(obj), {
        kind: obj.kind,
        isGroup: obj.isGroup,
        contact: obj['contact'] ? _serializeContactObj(obj['contact']) : null,
        groupMetadata: obj["groupMetadata"] ? _serializeRawObj(obj["groupMetadata"]) : null,
        presence: obj["presence"] ? _serializeRawObj(obj["presence"]) : null,
        msgs: null
    });
};

var _serializeContactObj = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign(_serializeRawObj(obj), {
        formattedName: obj.formattedName,
        isHighLevelVerified: obj.isHighLevelVerified,
        isMe: obj.isMe,
        isMyContact: obj.isMyContact,
        isPSA: obj.isPSA,
        isUser: obj.isUser,
        isVerified: obj.isVerified,
        isWAContact: obj.isWAContact,
        profilePicThumbObj: obj.profilePicThumb ? _serializeProfilePicThumb(obj.profilePicThumb) : {},
        statusMute: obj.statusMute,
        msgs: null
    });
};

var _serializeRawObj = (obj) => {
    if (obj) {
        return obj.toJSON();
    }
    return {}
};

var _serializeProfilePicThumb = (obj) => {
    if (obj == undefined) {
        return null;
    }

    return Object.assign({}, {
        eurl: obj.eurl,
        id: obj.id,
        img: obj.img,
        imgFull: obj.imgFull,
        raw: obj.raw,
        tag: obj.tag
    });
}

var sendImageFile = function (file, chatid, caption, done) {
    if (chatid) {
        chatid = chatid.replace('+', '');
    }
    var idUser = new window.Store.UserConstructor(chatid, {intentionallyUsePrivateConstructor: true});
    // create new chat
    return Store.Chat.find(idUser).then((chat) => {
        var mc = new window.Store.MediaCollection(chat);
        mc.processAttachments([{file: file}, 1], chat, 1).then(() => {
            let media = mc._models[0];
            media.sendToChat(chat, {caption: caption});
            if (done !== undefined) done(true);
        });
    });
}

var sendImage = function (imgBase64, chatid, filename, caption, done) {
    if (chatid) {
        chatid = chatid.replace('+', '');
    }
    var idUser = new window.Store.UserConstructor(chatid, {intentionallyUsePrivateConstructor: true});
    // create new chat
    return Store.Chat.find(idUser).then((chat) => {
        var mediaBlob = base64ImageToFile(imgBase64, filename);
        var mc = new window.Store.MediaCollection();
        mc.processAttachments([{file: mediaBlob}, 1], chat, 1).then(() => {
            let media = mc._models[0];
            media.sendToChat(chat, {caption: caption});
            if (done !== undefined) done(true);
        });
    });
}

var base64ImageToFile = function (b64Data, filename) {
    var arr = b64Data.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
};


// ==================================================================================================
// ===================================================================================================
// ===================================================================================================

function loadAllContacts() {
    console.log('loadAllContacts')
    if (Store == undefined || Store.Contact === undefined) {
        return;
    }
    if (localStorage['do_load_contacts_on_startup'] === false) {
        return;
    }

    var contactsMap = {};
    var numbers = Object.values(Store.Contact._models);
    var promise = new Promise(function (resolve, reject) {
        var myEntry;
        for (let i = 0; i < numbers.length; i++) {
            var entry = numbers[i];
            if (entry.__x_isMe == true) {
                myEntry = entry;
            } else if (entry.__x_isUser == true) {
                if (entry.__x_isMyContact == true) {
                    contactsMap[entry.__x_formattedShortName] = '+' + entry.userid;
                } else {
                    Store.Contact.find(entry.__x_id).then(function (d) {
                        if (entry.__x_isUser == true && entry.__x_isMyContact == true) {
                            var publicName = '';
                            var notifyName = d.__x_notifyName;
                            if (notifyName) {
                                publicName = notifyName;
                            } else {
                                publicName = d.__x_pushname;
                            }
                            if (!publicName) {
                                publicName = '';
                            }
                            var ph = entry.userid;
                            if (ph == undefined || ph == null || ph == 'null') {
                                ph = entry.__x_fromattedName;
                                if (ph) {
                                    ph = ph.replace(/ /g, '').replace('+', '');
                                }
                            }
                            if (ph) {
                                contactsMap[publicName] = '+' + ph;
                            }
                        }
                    });
                }
            }
        }
        var args = {'my_entry': myEntry, 'contacts_map': contactsMap};
        resolve(args);
    });

    promise.then(function (args) {
        var myEntry, contactsMap;
        if (args) {
            myEntry = args.my_entry;
            contactsMap = args.contacts_map;
        }
        if (contactsMap) {
            var list = '';
            var count = 1
            var arrName = [];
            var arrNumber = [];
            var objList = {};
            Object.keys(contactsMap).sort().forEach(function (entry) {
                arrNumber.push(contactsMap[entry]);
                arrName.push(entry);
                if (arrName.length > 999) {
                    count = count + 1;
                    arrName = [];
                    arrNumber = [];
                }
                objList[count] = {
                    'name': arrName,
                    'number': arrNumber
                }
                // list += contactsMap[entry] + "\t" + entry + "\n";
            });
            for (let i = 1; i <= Object.keys(objList).length; i++) {
                let ob = objList[i]

                for (let j = 0; j < ob.name.length; j++) {
                    if (j === 0) {
                        console.log(1)
                        list += 'whatsapp\tnome\n'
                    }
                    list += ob.number[j] + '\t' + ob.name[j] + '\n';
                }
                let storedMap = {}
                if (localStorage["broadcast_groups"] !== undefined) {
                    storedMap = JSON.parse(localStorage["broadcast_groups"]);
                }
                if (i == 1) {
                    storedMap['meus_contatos'] = list

                } else {
                    storedMap['meus_contatos' + i] = list
                }
                localStorage['broadcast_groups'] = JSON.stringify(storedMap);
                list = '';
            }

            // localStorage['my_contacts'] = list;
        }
        if (myEntry) {
            try {
                saveAndSendMessageFrom(myEntry.__x_id._serialized);
            } catch (e) {
            }
        }
    });
}

function saveAndSendMessageFrom(id) {
    var my_new_entry = id;
    var my_stored_entry = localStorage['my_entry'];
    if (my_stored_entry != my_new_entry) {
        localStorage['my_entry'] = my_new_entry;
        // var message = 'Olá SocialHub, acabei de fazer o meu primeiro disparo. Esta mensagem é automática para salvar o contato.';
        // sendMessage('5511932260850@c.us', message);
    }
}

function randomIntFromInterval(min, max) { // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getFirstName(name) {
    if (name) {
        name = name.split(' ')[0]
        if (name.indexOf('@') != -1) {
            name = name.split('@')[0];
        }
        if (name.indexOf('.') != -1) {
            name = name.split('.')[0];
        }
    }
    return name;
}

document.addEventListener("wdlmk", function (a) {
    if (Store === {} || Store === undefined || Store.Chat === undefined) {
        getStore();
    }

    if ("load_contacts" == a.detail.op) {
        loadAllContacts();
    } else if ("openchatat" == a.detail.op)
        if ("string" == typeof a.detail.msg && "" !== a.detail.msg) {
            var k = a.detail.id.split("\n");

            if (k) {
                k = k.filter(String);
                l = k.length;
            }
            if (l > 1001) {
                alert('Only 1000 members at once are allowed. Please split this list and send.');
            } else {

                var use_only_first_name = localStorage["use_only_first_name"];
                var use_default_country_code = localStorage["use_default_country_code"];
                var use_message_delay = localStorage["use_message_delay"];
                if (use_message_delay === "undefined" || use_message_delay === undefined) {
                    use_message_delay = 10; // here in seconds
                } else if (use_message_delay < 6 || use_message_delay > 500) {
                    use_message_delay = 6;
                }
                var images = a.detail.imageFiles;
                var templateImages = a.detail.images;

                try {
                    if (templateImages) {
                        for (var im = 0; im < templateImages.length; im++) {
                            try {
                                if (templateImages[im]) {
                                    var imageName = templateImages[im].name;
                                    var image2File = base64ImageToFile(templateImages[im].original_src,
                                        imageName);
                                    images.push(image2File);
                                }
                            } catch (e) {
                                console.log(e);
                            }
                        }
                    }
                } catch (e) {
                    console.log(e);
                }

                var columnsNames = []
                var tnarray = k[0].replace(',', '').trim().split(': ');
                if (tnarray.length > 1) {
                    for (let ic = 1; ic < tnarray.length; ic++) {
                        columnsNames.push(tnarray[ic].trim())
                    }
                }
                var progressBar = false;
                for (i = 1; i < l; i++) {
                    var sarray = k[i].trim().split(': ');
                    var number = sarray[0];
                    var columns = [];
                    if (sarray.length > 1) {
                        for (ic = 1; ic < sarray.length; ic++) {
                            columns.push(sarray[ic])
                        }
                    }
                    if (use_only_first_name && use_only_first_name == 'true' && sarray.length >= 1) {
                        columns[0] = getFirstName(columns[0]);
                    }

                    if (number) {
                        number = number.trim();
                        if (number.slice(-1) == ":") {
                            number = number.slice(0, -1)
                        }
                        if (use_default_country_code != 'undefined' || use_default_country_code === undefined) {
                            if (!number.startsWith('+')) {
                                number = use_default_country_code.trim() + number;
                            }
                        }
                        var n = number + "@c.us";
                        n = n.replace('+', '').replace('-', '').replace('(', '').replace(')', '').replace(/\s/g, '');

                        var message = a.detail.msg;
                        if (message) {
                            for (let j = 0; j < columns.length; j++) {
                                if (columns[j] != undefined) {
                                    message = message.replace('{' + columnsNames[j] + '}', columns[j]);
                                }
                            }

                            var name = '';
                            if (columns.length) {
                                if (columns[0] != undefined) {
                                    name = columns[0]
                                }
                            }
                            // delay we received from user in seconds
                            sendMessage_2((i - 1) * use_message_delay * 1000, i, n, message, name, images);

                            if (i == l - 1) {
                                setTimeout(function () {
                                    var modal = document.getElementById('modal-alert');
                                    var elementModal = '<div style="max-width: 600px;background-color: #fff;margin: auto;border-radius: 20px;">' +
                                        '<h3 style="text-align: center; padding-top: 15px; margin: 0;font-weight: 600;color: #128C7E;">RELATÓRIO</h3>' +
                                        '<div style="width: 100%; padding: 10px">' +
                                        '<p style="padding-bottom: 10px;">Sua Campanha foi finalizada com sucesso.</p>' +
                                        '</div>' +
                                        '<div style="text-align: center; margin: 15px 0;"><button id="button-alert" style="padding: 5px 25px;border: 2px solid #128C7E;border-radius: 5px;color: #128C7E;">OK</button></div>';
                                    modal.innerHTML = elementModal;
                                    document.getElementById('modal-alert').style.display = 'flex';
                                    document.getElementById("button-alert").addEventListener("click", function () {
                                        document.getElementById('modal-alert').style.display = 'none';
                                        let clear = document.getElementById("phonetosendtable");
                                        clear.innerText = "";
                                        document.getElementById('phonetosendtable').style.visibility = 'hidden';
                                        document.getElementById('phonetosendtable').style.display = 'none';
                                        document.getElementById('phonetosend').style.visibility = 'visible';
                                        document.getElementById('phonetosend').style.display = 'block';
                                    });
                                }, (i - 1) * use_message_delay * 1000)
                            }
                        }
                    }
                }
            }
        }
});
