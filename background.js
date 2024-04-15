chrome.action.onClicked.addListener(tab => {
});

// whatsappbot script
   
    
async function getWhatsAppTab() {
    let queryOptions = { url: 'https://web.whatsapp.com/*' };
    let [tab] = await chrome.tabs.query(queryOptions);
    console.log("whatsapp tab",tab);
    return tab;
}

function loadPage() {
    chrome.tabs.query({
        url: whatsAppUrl
    }, function (a) {
        if (a.length > 0) {
            chrome.tabs.update(a[0].id, {
                active: !0
            });

        } else {
        }
        loggedLogic();
    })
}

function updateWhatsAppTabs(a) {
    chrome.tabs.query({
        url: whatsAppUrl + "*"
    }, function (b) {
        whatsAppTabs = [];
        for (var c = 0; c < b.length; c++)
            whatsAppTabs.push(b[c].id);
        debug && console.info("WA: Updated WApp tabs: " + JSON.stringify(whatsAppTabs)),
            a();
    })
}

function closeAllWhatsAppTabs() {
    return closeAllWhatsAppTabsBut(-1)
}

function closeAllWhatsAppTabsBut(a) {
    for (var b = [], c = whatsAppTabs.length - 1; c >= 0; c--) {
        var d = whatsAppTabs[c];
        d != a && b.push(whatsAppTabs.splice(c, 1)[0]);
    }
    if (b.length > 0)
        try {
            chrome.tabs.remove(b);
        } catch (e) {
        }
    return b.length
}

function onMessage(a, b, c) {

    if(!a.isActivated){
        } else {
            (async()=>{
                chrome.scripting.executeScript({
                    target: { tabId: (await getWhatsAppTab()).id, allFrames: true },
                    files: ['whatsappbot/js/inject.js'],
                });
            })()
    }

    if ('content' == a.from && 'get_list' == a.subject) {
        settings.indexedDB.getAll('broadcast_groups', obj => {
            c(obj);
        })
    }
    if ("content" == a.from && "get_template" == a.subject) {
        settings.indexedDB.getAll('message_templates', function (obj) {
            c(obj)
        })

    } else if ("content" == a.from && "click_settings_button" == a.subject) {
        chrome.tabs.create({url: chrome.runtime.getURL('index.html')}, function (tab) {
        });
    } else if ('content' == a.from && 'get_template_images' == a.subject) {
        if (a.template_name) {
            var key = a.template_name + '_images';
            settings.indexedDB.load(a.template_name, 'images', obj => {
                c({'images': obj, 'template_name': a.template_name});
            })
        }
    } else if ("content" === a.from && 'get_meta_data' === a.subject) {
        settings.indexedDB.getAll('meta_data', function (res) {
            c(res)
        })
    } else if ("content" === a.from && 'upload_broadcast' === a.subject) {
        let broadcasts = JSON.parse(a.broadcasts);
        var arr = Object.keys(broadcasts).map(function (key) {
            return [key, broadcasts[key]]
        })
        arr.forEach(function (value) {
            let data = {name: value[0], list: value[1]}
            settings.indexedDB.load(data.name, 'broadcast_groups', function (evt) {
                if (evt === undefined) {
                    settings.indexedDB.save(data, 'broadcast_groups');
                    return true
                }
                settings.indexedDB.put(data, 'broadcast_groups')
            })
        })

    }

    return !0
}

// same as utils.js
let settings = {
    indexedDB: {
        save: function (data, store_name, callback) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                tx.objectStore(store_name).add(data);
                tx.oncomplete = function () {
                    callback();
                };
                tx.onabort = function () {
                    console.log(tx.error);
                };
            });
        },
        delete: function (name, store_name) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var req = tx.objectStore(store_name).index('name').get(name);
                req.onsuccess = function (obj) {
                    let id = obj.target.result.id;
                    console.log(obj);
                    deleteStore(id, store_name);
                }
            });
        },
        load: function (name, store_name, callback) {
            let options = 'name';
            if (store_name === 'images')
                options = 'template_name';
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var req = tx.objectStore(store_name).index(options).openCursor(IDBKeyRange.only(name));
                let items = [];
                req.onsuccess = function (obj) {
                    let cursor = obj.target.result;
                    if (cursor) {
                        items.push(cursor.value);
                        cursor.continue();
                    } else {
                        if (items.length > 1 || store_name === 'images') {
                            callback(items);
                        } else {
                            callback(items[0]);
                        }
                    }
                }
            });
        },
        getAll: function (store_name, callback) {
            try {
                this.openDB(function (db) {
                    var tx = db.transaction(store_name, 'readonly');
                    var store = tx.objectStore(store_name).getAll();

                    store.onsuccess = function () {
                        callback(store.result);
                    }
                })
            } catch (e) {
                console.log(e);
            }

        }, put: function (payload, store_name) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var ObjectStore = tx.objectStore(store_name);
                var req = ObjectStore.index('name').get(payload.name);
                req.onsuccess = function (obj) {
                    var data = req.result;
                    Object.keys(payload).forEach((value) => {
                        data[value] = payload[value];
                    });
                    var otherReq = ObjectStore.put(data);

                    otherReq.onsuccess = function (ev) {
                        console.log(true);
                    }
                }
            });
        },
        openDB: function (callback) {
            var open = indexedDB.open('my_db');
            open.onupgradeneeded = function () {
                var db = open.result;
                let broadcast_groups = db.createObjectStore('broadcast_groups', {
                    keyPath: 'id',
                    autoIncrement: true
                });
                broadcast_groups.createIndex('name', 'name', {unique: true});
                let message_templates = db.createObjectStore('message_templates', {keyPath: 'id', autoIncrement: true});
                message_templates.createIndex('name', 'name', {unique: true});
                db.createObjectStore('meta_data', {
                    keyPath: 'id',
                    autoIncrement: false
                }).createIndex('name', 'name', {unique: true});
                let images = db.createObjectStore('images', {keyPath: 'id', autoIncrement: true});
                images.createIndex('name', 'name', {unique: true});
                images.createIndex('template_name', 'template_name', {unique: false});
            };
            open.onsuccess = function () {
                var db = open.result;
                callback(db);
            };
            open.onerror = function () {
                console.log(open.error);
            };
        }
    }
}

function deleteStore(id, store_name) {
    settings.indexedDB.openDB((db) => {
        var tx = db.transaction(store_name, 'readwrite');
        var req = tx.objectStore(store_name).delete(id);
        req.onsuccess = function (obj) {
            console.log(obj);
        }
    });
}

function loggedLogic(a, b) {
    "undefined" == typeof a && (a = !0),
    "undefined" == typeof b && (b = !0),
        islogged ? (chrome.action.setIcon({
            path: {
                19: "img/favicon19.png",
                38: "img/favicon38.png"
            }
        }),
        a && chrome.tabs.query({
            url: whatsAppUrl
        }, function (a) {
            a.length > 0 ? (watabid = a[0].id,
                wawindowid = a[0].windowId,
                chrome.windows.update(wawindowid, {
                    focused: !0
                }),
                chrome.tabs.update(a[0].id, {
                    active: !0
                })) : (watabid = 0,
                wawindowid = 0,
                chrome.tabs.create({
                    url: whatsAppUrl,
                    active: b
                }))
        })) : chrome.runtime.sendMessage(whatsdockid, {
            whatsnote: !0
        }, function (c) {
            "undefined" == typeof c ? (isWhatsDock = !1,
                chrome.action.setIcon({
                    path: {
                        19: "img/favicon19.png",
                        38: "img/favicon38.png"
                    }
                }),
            a && chrome.tabs.query({
                url: whatsAppUrl
            }, function (a) {
                if (a.length > 0) {
                    watabid = a[0].id,
                        wawindowid = a[0].windowId,
                        chrome.windows.update(wawindowid, {
                            focused: !0
                        }),
                        chrome.tabs.update(a[0].id, {
                            active: !0
                        })
                } else
                    wawindowid = 0,
                        watabid = 0,
                        chrome.tabs.create({
                            url: whatsAppUrl,
                            active: b
                        })
            })) : (isWhatsDock = !0,
                b ? chrome.runtime.sendMessage(whatsdockid, {
                    focus: !0
                }, function (a) {
                }) : chrome.runtime.sendMessage(whatsdockid, {}, function (a) {
                    a.mynum && (mynumber = a.mynum),
                    a.myavatar && (myavatar = a.myavatar),
                    a.running && (islogged = !0)
                }))
        })
}

var debug = !0
    , whatsAppUrl = "https://web.whatsapp.com/"
    , newTabUrl = "chrome://newtab/"
    , sourceChatFragment = "#watSrcChatTitle="
    , backgroundNotif = !0
    , wideText = !1
    , islogged = !1
    , mynumber = ""
    ,
    myavatar = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iMjEycHgiIGhlaWdodD0iMjEycHgiIHZpZXdCb3g9IjAgMCAyMTIgMjEyIiBlbmFibGUtYmFja2dyb3VuZD0ibmV3IDAgMCAyMTIgMjEyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBmaWxsPSIjREZFNUU3IiBkPSJNMTA1Ljk0NiwwLjI1QzE2NC4zMTgsMC4yNSwyMTEuNjQsNDcuNTk2LDIxMS42NCwxMDYNCgljMCw1OC40MDQtNDcuMzIyLDEwNS43NS0xMDUuNjk1LDEwNS43NUM0Ny41NzEsMjExLjc1LDAuMjUsMTY0LjQwNCwwLjI1LDEwNkMwLjI1LDQ3LjU5Niw0Ny41NzEsMC4yNSwxMDUuOTQ2LDAuMjV6Ii8+DQo8Zz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTczLjU2MSwxNzEuNjE1Yy0wLjYwMS0wLjkxNS0xLjI4Ny0xLjkwNy0yLjA2NS0yLjk1NWMtMC43NzctMS4wNDktMS42NDUtMi4xNTUtMi42MDgtMy4yOTkNCgkJYy0wLjk2NC0xLjE0NC0yLjAyNC0yLjMyNi0zLjE4NC0zLjUyN2MtMS43NDEtMS44MDItMy43MS0zLjY0Ni01LjkyNC01LjQ3Yy0yLjk1Mi0yLjQzMS02LjMzOS00LjgyNC0xMC4yMDQtNy4wMjYNCgkJYy0xLjg3Ny0xLjA3LTMuODczLTIuMDkyLTUuOTgtMy4wNTVjLTAuMDYyLTAuMDI4LTAuMTE4LTAuMDU5LTAuMTgtMC4wODdjLTkuNzkyLTQuNDQtMjIuMTA2LTcuNTI5LTM3LjQxNi03LjUyOQ0KCQljLTE1LjMxLDAtMjcuNjI0LDMuMDg5LTM3LjQxNiw3LjUyOWMtMC4zMzgsMC4xNTMtMC42NTMsMC4zMTgtMC45ODUsMC40NzRjLTEuNDMxLDAuNjc0LTIuODA2LDEuMzc2LTQuMTI4LDIuMTAxDQoJCWMtMC43MTYsMC4zOTMtMS40MTcsMC43OTItMi4xMDEsMS4xOTdjLTMuNDIxLDIuMDI3LTYuNDc1LDQuMTkxLTkuMTUsNi4zOTVjLTIuMjEzLDEuODIzLTQuMTgyLDMuNjY4LTUuOTI0LDUuNDcNCgkJYy0xLjE2MSwxLjIwMS0yLjIyLDIuMzg0LTMuMTg0LDMuNTI3Yy0wLjk2NCwxLjE0NC0xLjgzMiwyLjI1LTIuNjA5LDMuMjk5Yy0wLjc3OCwxLjA0OS0xLjQ2NCwyLjA0LTIuMDY1LDIuOTU1DQoJCWMtMC41NTcsMC44NDgtMS4wMzMsMS42MjItMS40NDcsMi4zMjRjLTAuMDMzLDAuMDU2LTAuMDczLDAuMTE5LTAuMTA0LDAuMTc0Yy0wLjQzNSwwLjc0NC0wLjc5LDEuMzkyLTEuMDcsMS45MjYNCgkJYy0wLjU1OSwxLjA2OC0wLjgxOCwxLjY3OC0wLjgxOCwxLjY3OHYwLjM5OGMxOC4yODUsMTcuOTI3LDQzLjMyMiwyOC45ODUsNzAuOTQ1LDI4Ljk4NWMyNy42NzgsMCw1Mi43NjEtMTEuMTAzLDcxLjA1NS0yOS4wOTUNCgkJdi0wLjI4OWMwLDAtMC42MTktMS40NS0xLjk5Mi0zLjc3OEMxNzQuNTk0LDE3My4yMzgsMTc0LjExNywxNzIuNDYzLDE3My41NjEsMTcxLjYxNXoiLz4NCgk8cGF0aCBmaWxsPSIjRkZGRkZGIiBkPSJNMTA2LjAwMiwxMjUuNWMyLjY0NSwwLDUuMjEyLTAuMjUzLDcuNjgtMC43MzdjMS4yMzQtMC4yNDIsMi40NDMtMC41NDIsMy42MjQtMC44OTYNCgkJYzEuNzcyLTAuNTMyLDMuNDgyLTEuMTg4LDUuMTItMS45NThjMi4xODQtMS4wMjcsNC4yNDItMi4yNTgsNi4xNS0zLjY3YzIuODYzLTIuMTE5LDUuMzktNC42NDYsNy41MDktNy41MDkNCgkJYzAuNzA2LTAuOTU0LDEuMzY3LTEuOTQ1LDEuOTgtMi45NzFjMC45MTktMS41MzksMS43MjktMy4xNTUsMi40MjItNC44NGMwLjQ2Mi0xLjEyMywwLjg3Mi0yLjI3NywxLjIyNi0zLjQ1OA0KCQljMC4xNzctMC41OTEsMC4zNDEtMS4xODgsMC40OS0xLjc5MmMwLjI5OS0xLjIwOCwwLjU0Mi0yLjQ0MywwLjcyNS0zLjcwMWMwLjI3NS0xLjg4NywwLjQxNy0zLjgyNywwLjQxNy01LjgxMQ0KCQljMC0xLjk4NC0wLjE0Mi0zLjkyNS0wLjQxNy01LjgxMWMtMC4xODQtMS4yNTgtMC40MjYtMi40OTMtMC43MjUtMy43MDFjLTAuMTUtMC42MDQtMC4zMTMtMS4yMDItMC40OS0xLjc5Mw0KCQljLTAuMzU0LTEuMTgxLTAuNzY0LTIuMzM1LTEuMjI2LTMuNDU4Yy0wLjY5My0xLjY4NS0xLjUwNC0zLjMwMS0yLjQyMi00Ljg0Yy0wLjYxMy0xLjAyNi0xLjI3NC0yLjAxNy0xLjk4LTIuOTcxDQoJCWMtMi4xMTktMi44NjMtNC42NDYtNS4zOS03LjUwOS03LjUwOWMtMS45MDktMS40MTItMy45NjYtMi42NDMtNi4xNS0zLjY3Yy0xLjYzOC0wLjc3LTMuMzQ4LTEuNDI2LTUuMTItMS45NTgNCgkJYy0xLjE4MS0wLjM1NS0yLjM5LTAuNjU1LTMuNjI0LTAuODk2Yy0yLjQ2OC0wLjQ4NC01LjAzNS0wLjczNy03LjY4LTAuNzM3Yy0yMS4xNjIsMC0zNy4zNDUsMTYuMTgzLTM3LjM0NSwzNy4zNDUNCgkJQzY4LjY1NywxMDkuMzE3LDg0Ljg0LDEyNS41LDEwNi4wMDIsMTI1LjV6Ii8+DQo8L2c+DQo8L3N2Zz4NCg=="
    , watabid = 0
    , whatwindowid = 0
    , isWhatsDock = !1
    , whatsdockid = "afkpjkcjohhlflbfeibjhngjbepocnpd"
    , setrate = !1
    , isBackgroundPageLoaded = !1
    , whatsAppTabs = [];
updateWhatsAppTabs(function () {

    0 === whatsAppTabs.length ? (debug && console.info("WA: There were no WApp tabs on startup, try to enable it"),
        loadPage()) : 1 === whatsAppTabs.length ? debug && console.info("WA: There was one WApp tab on startup, do nothing") : (debug && console.info("WA: There were more than one WApp tabs on startup, close all but the last one"),
        closeAllWhatsAppTabsBut(whatsAppTabs[whatsAppTabs.length - 1]))
}), chrome.runtime.onMessage.addListener(onMessage)
    , loggedLogic();


    