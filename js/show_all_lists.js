$(function () {
    settings.indexedDB.getAll('broadcast_groups', obj => {
        let myGroups = obj.result
        console.log(myGroups)
        if (myGroups) {
            var i = 0;
            myGroups.forEach(function (e) {
                let countContacts = e.list.trim().split('\n');
                var row = $("<tr id='row-'" + i + ">");
                row.append($("<td>" + ++i + "</td>")).append($("<td><a href='create_lists.html?list_name=" + e.name + "'>" + e.name + "</a></td>")).append($("<td>" + countContacts[1] + "</td>"))
                    .append($("<td>" + (countContacts.length - 1) + "</td>"));
                $("#show_all_lists_table tbody").append(row);
            })
        }
    })
})
;