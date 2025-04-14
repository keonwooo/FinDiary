// $(document).ready(function () {
//
// });

function login() {
    const user_id = $("#user_id").val();
    const user_password = $("#user_password").val();
    const params = {
        user_id: user_id
        ,user_password: user_password
    };
    const userOption = {
        url: "api/login"
        ,params : {
            user_id: user_id
            ,user_password: user_password
        }
        ,completeCallBackFn: function() {
            alert("test");
        }
    }
    kwfw.ajax(userOption);
}