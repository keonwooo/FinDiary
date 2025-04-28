jQuery(document).ready(function () {
    try {
        if (typeof onloadpage === "function") {
            onloadpage();
        }
    } catch (e) {
        console.log("onloadpage error=", e);
    }
});

const FinDiary = {
    movePageFnc: function (page) {

        kwfw.ajax()
    }
}