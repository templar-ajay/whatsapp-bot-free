let settings = {
    storage: {
        get: function (key, callback) {
            return chrome.storage.sync.get(key, function (x) {
                if (callback)
                    callback(x);
                return x;
            });
        },
        save: function (k, val, callback) {

            let obj = {};
            obj[k] = val;

            chrome.storage.sync.set(obj);
            // , function (x) {
            //     console.log(x);
            //     // console.log(key, val);
            //     if(callback)
            //         callback();
            // });
        },
        remove: function (key, callback) {
            chrome.storage.sync.remove(key, function (x) {
                console.log(x);
                if (callback)
                    callback();
            })
        },
        removeAll: function () {
            this.remove("codes");
            this.remove("regex");
            this.remove("countries");
        }
    },
    indexedDB: {
        save: function (data, store_name, callback) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                tx.objectStore(store_name).add(data);
                tx.oncomplete = function () {
                    // callback();
                };
                tx.onabort = function () {
                    console.log(tx.error);
                };
            });
        },
        load: function (name, store_name, callback) {
            let options = 'name';
            if (store_name === 'images')
                options = 'template_name'
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var req = tx.objectStore(store_name).index(options).openCursor(IDBKeyRange.only(name));
                let items = [];
                req.onsuccess = function (obj) {
                    let cursor = obj.target.result
                    if (cursor) {
                        items.push(cursor.value)
                        cursor.continue()
                    } else {
                        if (items.length > 1 || store_name === 'images') {
                            callback(items)
                        } else {
                            callback(items[0])
                        }
                    }
                }
            });
        },
        getAll: function (store_name, callback) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readonly');
                var store = tx.objectStore(store_name).getAll();

                store.onsuccess = function () {
                    callback(store)
                }
            })

        },
        put: function (payload, store_name) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var ObjectStore = tx.objectStore(store_name);
                var req = ObjectStore.index('name').get(payload.name);
                req.onsuccess = function (obj) {
                    var data = req.result;
                    if (data) {
                        data.option = payload.option;
                        var otherReq = ObjectStore.put(data);
                    } else {
                        data = payload;
                        var otherReq = ObjectStore.add(data);
                    }
                    otherReq.onsuccess = function (ev) {
                        console.log(true);
                    }
                }
            });
        },
        delete: function (name, store_name) {
            this.openDB(function (db) {
                var tx = db.transaction(store_name, 'readwrite');
                var req = tx.objectStore(store_name).index('name').get(name);
                req.onsuccess = function (obj) {
                    console.log(obj)
                    let id = obj.target.result.id;
                    deleteStore(id, store_name);
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
                })
                broadcast_groups.createIndex('name', 'name', {unique: true})
                let message_templates = db.createObjectStore('message_templates', {keyPath: 'id', autoIncrement: true})
                message_templates.createIndex('name', 'name', {unique: true});
                db.createObjectStore('meta_data', {
                    keyPath: 'id',
                    autoIncrement: false
                }).createIndex('name', 'name', {unique: true});
                let images = db.createObjectStore('images', {keyPath: 'id', autoIncrement: true});
                images.createIndex('name', 'name', {unique: true})
                images.createIndex('template_name', 'template_name', {unique: false})
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
            console.log(true);
        }
    });
}