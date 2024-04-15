$(function () {
    const isCharDigit = n => n < 10;

    $.urlParam = function (name) {
        var results = new RegExp('[\?&]' + name + '=([^&#]*)')
            .exec(window.location.search);

        return (results !== null) ? results[1] || 0 : false;
    }

    var listName = $.urlParam('list_name');
    if (listName) {
        listName = decodeURIComponent(listName);
        var storedMap = {};
        var listSelected;
        settings.indexedDB.load(listName, 'broadcast_groups', obj => {
            listSelected = obj;
            console.log(listSelected)
            if (listSelected !== undefined) {
                $("#broadcast_group_name").val(listSelected.name);
                $("#phone_numbers").val(listSelected.list);
                convertToTable(listSelected.list);

                if (listName === "my_contacts") {
                    $('#broadcast_group_name').attr('readonly', 'readonly');
                    $('#phone_numbers').attr('readonly', 'readonly');
                }
            }
        })

    }
    document.getElementById("phone_numbers").addEventListener("keyup", alertString);
    document.getElementById("phone_numbers").addEventListener("paste", convertToTable);
    document.getElementById("clearButton").addEventListener('click', function (e) {
        e.preventDefault();
        clearTable();
    });

    function convertToTable(e) {
        document.getElementById("phone_numbers").style.display = "none";
        document.getElementById("create_list_table").style.display = "block";
        document.getElementById("clearButton").style.display = "block";
        if (e.clipboardData != null || window.clipboardData != null) {
            var clipBoard = e.clipboardData;
            clipBoard = clipBoard.getData('text');
        } else {
            var clipBoard = e
        }

        var myrows = clipBoard.split('\n');
        myrows = myrows.filter(function (i) {
            return i;
        });

        for (let i = 0; i < myrows.length; i++) {
            var rowContent = myrows[i];
            var a = rowContent.split('\t');
            var tr = '<tr><td>' + (i + 1) + '</td>';
            console.log(a);
            for (let j = 0; j < a.length && j < 5; j++) {
                tr = tr + '<td>' + a[j] + '</td>';
            }
            tr = tr + '</tr>';
            document.getElementById('create_list_table').innerHTML += tr;
        }
        document.getElementById("save").addEventListener('click', function (e) {
            e.preventDefault();
            var broadcast_group_name = $("#broadcast_group_name")[0].value;
            var phone_numbers = clipBoard

            try {
                if (!broadcast_group_name || broadcast_group_name == '') {
                    throw "$Broadcast List name should not be empty.";
                }
                if (!phone_numbers || phone_numbers == '') {
                    throw "$Phone numbers field should not be empty.";
                }
                if (broadcast_group_name) {
                    broadcast_group_name = slug(broadcast_group_name);
                }
                if (broadcast_group_name === "my_contacts") {
                    throw "$List name 'my_contacts' is reserved for your contacts. Pls use different name.";
                }

                var split = phone_numbers.split('\n').filter(String);
                if (split.length > 1000) {
                    throw '$Upto 1000 numbers only allowed for one list';
                }
                let data = {name: broadcast_group_name, list: phone_numbers};
                settings.indexedDB.load(data.name, 'broadcast_groups', (e) => {
                    if (e === undefined) {
                        settings.indexedDB.save(data, 'broadcast_groups');
                        alert('Sua lista foi salva com sucesso !');
                        setTimeout(()=>{
                            window.location.href = 'all_lists.html';
                        }, 500)
                        return
                    }
                    settings.indexedDB.put(data, 'broadcast_groups');
                });
                alert('Sua lista foi salva com sucesso !');
                setTimeout(()=>{
                    window.location.href = 'all_lists.html';
                }, 500)
            } catch (e) {
                if (e && e.charAt(0) == '$') {
                    alert(e.substring(1, e.length));
                } else {
                    alert('Exception occured, please check your input');
                }
            }

        });

    }

    function clearTable() {
        let clear = document.getElementById("create_list_table");
        clear.innerText = "";
        document.getElementById('create_list_table').style.display = 'none';
        document.getElementById('phone_numbers').style.display = 'block';
    }

    function alertString() {
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
    $("#delete").click(function () {
        try {
            var broadcast_group_name = $("#broadcast_group_name")[0].value;
            var phone_numbers = $("#phone_numbers")[0].value;

            if (!broadcast_group_name || broadcast_group_name == '') {
                throw "$Please specify a list from show_all_lists page.";
            }

            if (broadcast_group_name === "my_contacts") {
                throw "$List name 'my_contacts' is reserved for your contacts. It can not be deleted.";
            }

            var c = confirm("Are you sure that you want to delete this list ? This action is not reversible.");
            if (c) {

                settings.indexedDB.delete(broadcast_group_name, 'broadcast_groups');
                setTimeout(()=>{
                    window.location.href = 'all_lists.html';
                }, 500)

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