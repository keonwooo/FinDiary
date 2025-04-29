jQuery(document).ready(function () {
    try {
        if (typeof onloadpage === "function") {
            onloadpage();
        }
    } catch (e) {
        console.log("onloadpage error=", e);
    } finally {
        const pathName = this.location.pathname.replace("/", '');
        if (pathName !== "") {
            _$("." + pathName).addClass("active");
        }
    }
});

const FinDiary = {
    movePageFnc: function (page) {

        kwfw.ajax()
    }
}