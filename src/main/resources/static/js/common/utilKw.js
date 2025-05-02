const _$ = jQuery;

jQuery(function () {
    jQuery.ajaxSetup({
        type: "post",
        dataType: "json",
        beforeSend: function (x) {
            x.setRequestHeader("_ajax", "true");
        },
        complete: function (x, status) {
        }
    })
});

const kwfw = {
    ajax: function (userOption) {
        const option = {
            url: null,
            params: null,
            async: false,
            timeout: null,
            type: "post",
            contentType: "application/json",
            dataType: "json",
            callBackFn: null,
            progress: true
        };

        jQuery.extend(true, option, userOption);

        console.log("ajax data : " + JSON.stringify(userOption));

        return jQuery.ajax({
            url: option.url,
            data: JSON.stringify(option.params),
            async: option.async,
            timeout: option.timeout,
            type: option.type,
            contentType: option.contentType,
            dataType: option.dataType,
            beforeSend: function (xhr) {
                const header = $("meta[name='_csrf_header']").attr('content');
                const token = $("meta[name='_csrf']").attr('content');
                if (token && header) {
                    xhr.setRequestHeader(jQuery("meta[name='_csrf_header']").attr("content"), jQuery("meta[name='_csrf']").attr("content"));
                }
            },
            success: function (data) {
                let ajaxData;
                let jsonFlag;

                try {
                    ajaxData = eval("(" + data + ")");
                    jsonFlag = true;
                } catch (e) {
                    ajaxData = data;
                    jsonFlag = false;
                }

                if (jsonFlag) {
                    if (ajaxData != null && ajaxData.error && ajaxData.error === "true") {
                        console.log('ajax Error ::: ' + ajaxData.error);
                        console.log('ajax Error ajaxData ::: ' + ajaxData);
                    }
                }

                if (option.callBackFn) {
                    option.callBackFn(ajaxData);
                }
            },
            complete: function (data) {

            },
            error: function (xhr) {
                console.log("ajax Error ::: ", xhr)
            }
        });
    },

    /********************************************************************************
     * formatDateToYMD
     * Date -> yyyy/mm/dd
     ********************************************************************************/
    formatDateToYMD: function (date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, '0'); // 1월은 0이므로 +1
        const dd = String(date.getDate()).padStart(2, '0');

        return `${yyyy}/${mm}/${dd}`;
    }
}