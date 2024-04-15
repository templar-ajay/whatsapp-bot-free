function backgroundScript() {
    onMainUiReady(function () {
        proxyNotifications(!0)
    }), reCheckLoadingError()
}

function foregroundScript() {
    onMainUiReady(function () {
        proxyNotifications(!1)
    })
}

function onMainUiReady(a) {
    try {
        if (void 0 != document.querySelector(".app-wrapper > .app")) debug && console.info("WA: Found main UI, will notify main UI ready event directly"), setTimeout(function () {
            a()
        }, safetyDelayShort);
        else {
            debug && console.info("WA: Setting up mutation observer for main UI ready event...");
            var b = document.getElementById("app");
            if (void 0 != b) {
                var c = new MutationObserver(function (b) {
                    debug && console.info("WA: Mutation observerd, will search main UI");
                    for (var d = !1, e = 0; e < b.length; e++) {
                        for (var f = (b[e], b[e].addedNodes), g = 0; g < f.length; g++) {
                            var h = f[g];
                            if ("div" == h.nodeName.toLowerCase() && h.classList.contains("app")) {
                                debug && console.info("WA: Found main UI, will notify main UI ready event"), c.disconnect(), setTimeout(function () {
                                    a()
                                }, safetyDelayShort), d = !0;
                                break
                            }
                        }
                        if (d) break
                    }
                });
                c.observe(b, {
                    childList: !0,
                    subtree: !0
                })
            }
        }
    } catch (d) {
        console.error("WA: Exception while setting up mutation observer for main UI ready event"), console.error(d)
    }
}

function proxyNotifications(a) {
    a ? window.addEventListener("message", function (a) {
        void 0 != a && void 0 != a.data && "backgroundNotificationClicked" == a.data.name && chrome.runtime.sendMessage({
            name: "backgroundNotificationClicked",
            srcChatTitle: a.data.srcChatTitle
        })
    }) : window.addEventListener("message", function (a) {
        if (void 0 == a || void 0 == a.data || "foregroundNotificationClicked" != a.data.name && "foregroundNotificationShown" != a.data.name) {
            if (void 0 != a && void 0 != a.data && "chat" == a.data.name) {
                var b = JSON.parse(a.data.chat),
                    c = "";
                "undefined" != typeof a.data.cid && (c = a.data.cid), chrome.runtime.sendMessage({
                    name: "myChats",
                    chats: JSON.stringify(b.msgs),
                    id: b.id,
                    cid: c
                })
            }
        } else setTimeout(function () {
            checkBadge(!1)
        }, safetyDelayLong)
    });
    var b = "";
    b += "var debug = " + debug + ";", b += "var isBackgroundScript = " + a + ";", b += "var backgroundNotif = " + backgroundNotif + ";", b += "(" + function () {
        var b = window.Notification,
            c = function (c, d) {
                if (a && !backgroundNotif) return void (debug && console.info("WA: Notification creation intercepted, will not proxy it because the user disabled background notifications"));
                debug && console.info("WA: Notification creation intercepted, will proxy it");
                var e = new b(c, d);
                this.title = e.title, this.dir = e.dir, this.lang = e.lang, this.body = e.body, this.tag = e.tag, this.icon = e.icon;
                var f = this;
                e.onclick = function (b) {
                    if (void 0 != f.onclick && f.onclick(b), a) {
                        var c = void 0;
                        void 0 != b && void 0 != b.srcElement && "string" == typeof b.srcElement.title && b.srcElement.title.length > 0 && (c = b.srcElement.title, debug && console.info("WA: Background notification click intercepted with srcChatTitle " + c)), window.postMessage({
                            name: "backgroundNotificationClicked",
                            srcChatTitle: c
                        }, "*")
                    } else debug && console.info("WA: Foreground notification click intercepted"), window.postMessage({
                        name: "foregroundNotificationClicked"
                    }, "*")
                }, e.onshow = function (b) {
                    void 0 != f.onshow && f.onshow(b), a || (debug && console.info("WA: Foreground notification show intercepted"), window.postMessage({
                        name: "foregroundNotificationShown"
                    }, "*"))
                }, e.onerror = function (a) {
                    void 0 != f.onerror && f.onerror(a)
                }, e.onclose = function (a) {
                    void 0 != f.onclose && f.onclose(a)
                }, this.close = function () {
                    e.close()
                }, this.addEventListener = function (a, b, c) {
                    e.addEventListener(a, b, c)
                }, this.removeEventListener = function (a, b, c) {
                    e.removeEventListener(a, b, c)
                }, this.dispatchEvent = function (a) {
                    e.dispatchEvent(a)
                }
            };
        c.permission = b.permission, c.requestPermission = b.requestPermission, window.Notification = c
    } + ")();";
    var c = document.createElement("script");
    c.innerHTML = b, document.head.appendChild(c)
}

function reCheckLoadingError() {
    setTimeout(function () {
        checkLoadingError()
    }, checkLoadingErrorInterval)
}

function checkLoadingError() {
    debug && console.info("WA: Checking potential loading error...");
    try {
        var a = document.getElementsByClassName("spinner").length > 0;
        a && !lastPotentialLoadingError && debug && console.warn("WA: Found potential loading error"), lastPotentialLoadingError && a ? (debug && console.warn("WA: Found loading error, will reload"), window.location.href = whatsAppUrl) : lastPotentialLoadingError = a
    } catch (b) {
        console.error("WA: Exception while checking loading error"), console.error(b)
    }
    reCheckLoadingError()
}

function optionRateClick() {
    window.open(rateUrl)
}

function sendPush() {
    sendbutton = document.getElementsByClassName("_4sWnG"), 1 == sendbutton.length ? sendbutton[0].click() : window.setTimeout(sendPush, 1e3)
}

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

function injectScript(a, b) {
    var c = document.getElementsByTagName(b)[0],
        d = document.createElement("script");
    d.setAttribute("type", "text/javascript"), d.setAttribute("src", a), c.appendChild(d)
}

var debug = !1,
    debugRepeating = !1,
    whatsAppUrl = "https://web.whatsapp.com/",
    optionsFragment = "#watOptions",
    sourceChatFragment = "#watSrcChatTitle=",
    safetyDelayShort = 300,
    safetyDelayLong = 600,
    checkBadgeInterval = 5e3,
    checkLoadingErrorInterval = 3e4,
    backgroundNotif = !0,
    wideText = !1,
    taggedcontactspreloaded = !1;
    chrome.runtime.sendMessage({
    name: "getIsBackgroundPage"
}, function (a) {
    a ? (debug && console.info("WA: Background script injected"), backgroundScript()) : (debug && console.info("WA: Foreground script injected"), foregroundScript()), chrome.runtime.sendMessage({
        name: "getOptions"
    }, function (b) {

    })
});

var addButton = setInterval(function () {
    var a = document.getElementById("pane-side"), b = document.getElementsByClassName("_1lRek");
    // var a = document.getElementById("pane-side"), b = document.getElementsByClassName("chatlist-panel-body");

    if (0 == b.length && a && (b = [a]), b.length > 0) {
        inputsearchphoneshowfunction();
        clearInterval(addButton);

        wdlauncher("load_contacts", {});
    }
}, 5000);

var wideTextStyleElem, userMsgPrepare = function (a, b) {
    wdlauncher("openchatat", {
        id: a + "@c.us",
        msg: b
    })
};
injectScript(chrome.runtime.getURL("store.js"), "body");