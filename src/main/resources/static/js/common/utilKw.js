jQuery(function() {
    jQuery.ajaxSetup({
        type: "post",
        dataType: "json",
        beforeSend: function(x) {
            x.setRequestHeader("_ajax", "true");
        },
        complete: function(x, status) { }
    })
});

const kwfw = {
    ajax: function(userOption) {
        const option = {
            url: null,
            params: null,
            async: false,
            timeout: null,
            type: "post",
            contentType: "application/json",
            dataType: "json",
            callBackFn: null,
            completeCallBackFn: null,
            progress: true
        };

        jQuery.extend(true, option, userOption);

        return jQuery.ajax({
            url: option.url,
            data: JSON.stringify(option.params),
            async: option.async,
            timeout: option.timeout,
            type: option.type,
            contentType: option.contentType,
            dataType: option.dataType,
            beforeSend: function(xhr) {
                xhr.setRequestHeader(jQuery("meta[name='_csrf_header']").attr("content"), jQuery("meta[name='_csrf']").attr("content"));
            },
            success: function(data) {
                let ajaxData;
                let jsonFlag;

                try {
                    ajaxData = eval("(" + data + ")");
                    jsonFlag = true;
                }
                catch (e) {
                    ajaxData = data;
                    jsonFlag = false;
                }

                if (jsonFlag == true) {
                    if (ajaxData != null && ajaxData.error && ajaxData.error == "true") {
                        console.log('ajax Error ::: ' + ajaxData.error);
                        console.log('ajax Error ajaxData ::: ' + ajaxData);
                    }
                }

                if (option.callBackFn) {
                    option.callBackFn(ajaxData);
                }
            },
            complete: function(data) {
                
            },
            error: function(xhr) {
                console.log("ajax Error ::: ", xhr)
            }
        });
    }
}

//function ajaxKw(userOption) {
//    $.ajax({
//        type: data.type,
//        url: data.url,
//        dataType: "json",
//        data: data.data
//    }).done((abc) => {
//        console.log(abc);
//    }).fail((err) => {
//        console.log(err);
//    });
//}