
function getWaMyNum() {
    if (Object.keys(Store).length > 0) return waMyNum = "", "object" == typeof Store && "object" == typeof Store.Conn && "string" == typeof Store.Conn.me && (waMyNum = Store.Conn.me), waMyNum
}

function getWebpackFunctionID(functionname) {
    for (i = 0; i < jsonpids.length; i++) {
        var id = eval(jsonpids[i]);
        try {
            if (webpackJsonp([], null, [id]) && webpackJsonp([], null, [id])[functionname] && "function" == typeof webpackJsonp([], null, [id])[functionname]) return id
        } catch (e) {}
    }
    return !1
}

function SendIfIsValidContact(i, a, b) {
    if (Object.keys(Store).length > 0) {
        var c = a[0];
        if (0 != queryExistId && queryExistId || (queryExistId = getWebpackFunctionID("queryExist")), !queryExistId) return queryExistId = 0, !1;
        webpackJsonp([], null, [queryExistId]).queryExist(c).then(function(d) {
            var e = !1;
            if (200 === d.status) {
                e = !0, Store.Chat.gadd(c);
                var f = Store.Chat.get(c);
                if("undefined" != typeof f) {
                	sendMessage(i, f, b);
                }
            }

            a.splice(0, 1), a.length > 0 && setTimeout(function() {
                SendIfIsValidContact(i, a, b)
            }, 3000)
        })
    }
    return !1
}

function getMainTrigger() {
    MainTriggerId = 0, 0 != MainTriggerId && MainTriggerId || (MainTriggerId = getWebpackFunctionID("openChatAt"))
}

function getStore() {
	if (!Store.Chat) {
		function getStore(modules) {
            let foundCount = 0;
            let neededObjects = [
                {id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null},
                {
                    id: "MediaCollection",
                    conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null
                },
                {
                    id: "ChatClass",
                    conditions: (module) => (module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat") ? module : null
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
                {
                    id: "SendTextMsgToChat",
                    conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null
                },
                { 
                    id: "sendDelete",
                    conditions: (module) => (module.sendDelete) ? module.sendDelete : null 
                },
                {  
                    id: "SendSeen",
                    conditions:  (module) => (module.sendSeen) ? module.sendSeen : null
                },
            ];
            for (let idx in modules) {
                if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    let first = Object.values(modules[idx])[0];
                    if ((typeof first === "object") && (first.exports)) {
                        for (let idx2 in modules[idx]) {
                            let module = modules(idx2);
                            if (!module) {
                                continue;
                            }
                            neededObjects.forEach((needObj) => {
                                if (!needObj.conditions || needObj.foundedModule)
                                    return;
                                let neededModule = needObj.conditions(module);
                                if (neededModule !== null) {
                                    foundCount++;
                                    needObj.foundedModule = neededModule;
                                }
                            });
                            if (foundCount == neededObjects.length) {
                                break;
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
                        window.Store.ChatClass.default.prototype.sendMessage = function (e) {
                            return window.Store.SendTextMsgToChat(this, ...arguments);
                        }
                        return window.Store;
                    }
                }
            }
        }

		webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite']);
	}
}

function getStoreContact() {
    for (i = 0; i < jsonpids.length; i++) {
        var id = eval(jsonpids[i]);
        try {
            webpackJsonp([], null, [id]) && webpackJsonp([], null, [id]).Contact && "object" == typeof webpackJsonp([], null, [id]).Contact && (Store = webpackJsonp([], null, [id]))
        } catch (e) {}
    }
}

function uniq(a) {
    return a.sort().filter(function(a, b, c) {
        return !b || a != c[b - 1]
    })
}
var StoreChatOld = "",
    WaDOMMethod = "",
    WaMyNum = "",
    UserInfoId = 0,
    ContactClass = [],
    ContactBlockClass = {},
    PanesClass = [],
    PanesBlockClass = {},
    WelcomeClass = "",
    queryExistId = 0,
    MainTriggerId = 0,
    isSending = !1,
    ContactListClass = "",
    ContactDataClass = "",
    Store = {},
    isWAStarting = function() {
        return !(document.getElementById("app") && !document.getElementById("startup") && !document.getElementById("initial_startup") && 0 == document.getElementsByClassName("media-body").length)
    },
    wdIay = function(a, b) {
        "undefined" == typeof b && (b = {}), b.op = a;
        var c = new CustomEvent("wdIay", {
            bubbles: !0,
            cancelable: !1,
            detail: b
        });
        document.dispatchEvent(c)
    };

function loadAllContacts() {
	//getStoreContact();
	if(Store == undefined || Store.Contact === undefined) {
		return;
	}

	var contactsMap = {};
	var numbers = Object.values(Store.Contact._models);

	var promise = new Promise(function (resolve, reject) {
		for (let i = 0; i < numbers.length; i++) {
			var entry = numbers[i];
			if(entry.__x_isUser == true) {
				if(entry.__x_isMyContact == true) {
					contactsMap[entry.__x_formattedShortName] =  '+' + entry.userid;
				} else {
					Store.Contact.find(entry.__x_id).then(function(d){
						if(entry.__x_isUser == true && entry.__x_isMyContact == true) {
							var publicName = '';
							var notifyName = d.__x_notifyName;
							if(notifyName) {
								publicName = notifyName;
							} else {
								publicName = d.__x_pushname;
							}
							if(!publicName) {
								publicName = '';
							}
							var ph = entry.userid;
							if(ph == undefined || ph == null || ph == 'null') {
								ph = entry.__x_fromattedName;
								if(ph) {
									ph = ph.replace(/ /g, '').replace('+', '');
								}
							}
							if(ph) {
								contactsMap[publicName] =  '+' + ph;
							}
						}
					});
				}
			}
		}
		resolve(contactsMap);
	});

	promise.then(function(value) {
		var list = '';
		Object.keys(value).sort().forEach(function(entry) {
			list += entry + ":" + value[entry] + "\n";
		});
		localStorage['my_contacts'] = list;
	});
}


document.addEventListener("wdlmk", function(a) {
	if(Store === undefined || Store.Chat === undefined) {
		getStore();
	}

	if("load_contacts" == a.detail) {
		loadAllContacts();
	} else if ("openchatat" == a.detail.op)
        if (0 != MainTriggerId && MainTriggerId || getMainTrigger(), "string" == typeof a.detail.msg && "" !== a.detail.msg) {
            var k = a.detail.id.split("\n");

            if(k) {
            	k = k.filter(String);
                l = k.length;
            }
            if(l > 251) {
            	alert('Only 250 members at once are allowed. Please split this list and send.');
            } else {
	            var m = [];
	            var use_only_first_name = localStorage["use_only_first_name"];
	            for (i = 0; i < l; i++) {
	            	var sarray = k[i].replace(',', '').trim().split(':');
	            	var number, name = '';
	            	if(sarray.length == 2) {
	            		name = sarray[0];
	            		if(name) {
	            			name = name.trim();
	            		}
	            		number = sarray[1];
	            	} else {
	            		number = sarray[0];
	            	}
	            	var message = a.detail.msg;
	            	if(use_only_first_name && use_only_first_name == 'true') {
	            		if(name) {
	            			name = name.split(' ')[0]
	            			if(name.indexOf('@') != -1) {
	            				name = name.split('@')[0];
	            			}
	            			if(name.indexOf('.') != -1) {
	            				name = name.split('.')[0];
	            			}
	            		}
	            	}
	            	if(message) {
	            		message = message.replace('{name}', name);
	            	}

	            	if(number) {
		                var n = number.trim() + "@c.us";
		                n = n.replace('+', '').replace('-', '').replace('(', '').replace(')', '').replace(/\s/g, '');
		                var idUser = new window.Store.UserConstructor(n);
		                sendMessage(i, idUser, message);
	            	}
	            }
	            m.length > 0 && SendIfIsValidContact(0, m, message), wdIay("endMessageSend", {
	                // contacts: b
	            })
            }
        } else MainTriggerId > 0 && webpackJsonp([], null, [MainTriggerId]).openChatAt(Store.Chat.get(number));
    else "chatContacts" == a.detail.op && Store.Chat.find(a.detail.waid).then(function(a) {
        var b = [];
        a.isGroup ? (b = a.groupMetadata.participants.models.map(function(a) {
            return a.id
        }), b.length > 0 && wdIay("insertContactsList", {
            contacts: b
        })) : (b.push(a.id), b.length > 0 && wdIay("insertContactsList", {
            contacts: b
        }))
    })
});

function sendMessage(i, idUser, message) {
	setTimeout(function() {
		Store.Chat.find(idUser).then((chat) => {
            chat.sendMessage(message);
            return true;
        });
	},  i * 4000, idUser, message);
};