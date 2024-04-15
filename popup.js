chrome.tabs.query({
    url: "https://web.whatsapp.com/*"
}, function(e) {
    0 < e.length && (window.close(), chrome.tabs.update(e[0].id, {
        active: !0,
        highlighted: !0
    }), chrome.runtime.sendMessage({
        type: "openChat",
        phone: 't'
    }))
})

chrome.tabs.query({
    url: "https://web.whatsapp.com/*"
}, function(e) {
    0 < e.length ? chrome.tabs.update(e[0].id, {
        active: !0,
        highlighted: !0
    }) : chrome.tabs.create({
        url: "https://web.whatsapp.com/"
    })
})