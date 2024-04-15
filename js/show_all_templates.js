$(function () {

    settings.indexedDB.getAll('message_templates', function (obj) {
        let myTemplate = obj.result
        if (myTemplate !== undefined) {
            var i = 0;
            myTemplate.forEach(function (e) {
                var templateName = e.name;
                var template = e.template;
                if (template && template.length > 100) {
                    template = template.substring(0, 97) + "...";
                }
                i++;
                var row = $("<tr id='row-'" + i + ">");
                row.append($("<td>" + i + "</td>")).append($("<td><a href='mt.html?template_name=" + templateName + "'>" + templateName + "</a></td>")).append($("<td>" + template + "</td>"));
                $("#show_all_lists_table tbody").append(row);
            });
        }
    })
});