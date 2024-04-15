$(function () {

    settings.indexedDB.getAll('meta_data', obj => {
        if (obj.result.length !== 0)
            for (var i = 0; i < obj.result.length; i++) {
                let saved_value = obj.result[i]
                if (saved_value.name === 'use_message_delay') {
                    $("#" + saved_value.name).attr('value', saved_value.option)
                }
                if (saved_value.name !== 'use_default_country_code')
                    $("#" + saved_value.name).attr("checked", saved_value.option);
                else
                    $("#" + saved_value.name).attr("value", saved_value.option);
            }
        else {
            $("#do_load_contacts_on_startup").attr("checked", false);
            $("#do_not_include_media_name").attr("checked", false);
            $("#do_use_public_name").attr("checked", false);
            $("#use_only_first_name").attr("checked", false);
            $("#use_default_country_code").attr('value', '');
            $("#use_message_delay").attr('value', 15);
        }
    });

    $("#save").click(
        function () {
            var do_load_contacts_on_startup = $("#do_load_contacts_on_startup")[0].checked;
            var use_only_first_name = $("#use_only_first_name")[0].checked;
            var use_default_country_code = $("#use_default_country_code").val();
            var use_message_delay = $("#use_message_delay").val();
            var do_not_include_media_name = $("#do_not_include_media_name")[0].checked;
            settings.indexedDB.put({
                id: 1,
                name: 'do_load_contacts_on_startup',
                option: do_load_contacts_on_startup
            }, 'meta_data')
            settings.indexedDB.put({
                id: 2,
                name: 'do_not_include_media_name',
                option: do_not_include_media_name
            }, 'meta_data')
            settings.indexedDB.put({id: 3, name: 'use_only_first_name', option: use_only_first_name}, 'meta_data')
            settings.indexedDB.put({
                id: 4,
                name: 'use_default_country_code',
                option: use_default_country_code
            }, 'meta_data')
            settings.indexedDB.put({id: 5, name: 'use_message_delay', option: use_message_delay}, 'meta_data')
            alert("Successfully saved the settings.");
        });
});
