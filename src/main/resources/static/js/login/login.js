$(document).ready(function () {
    _$(".login_input_group").on("keydown", function (event) {
        if (event.key === "Enter" || event.keyCode === 13) {
            login();
        }
    });
});

function login() {
    if (login_validation()) {
        return null;
    }
    const user_id = $("#user_id").val();
    const user_password = $("#user_password").val();
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

function login_validation() {
    let validation = true;

    const user_id = _$("#user_id").val().trim();
    const user_password = _$("#user_password").val().trim();

    if (!user_id) {
        validation = false;
        wrongDivAnimation("#div_user_id");
        _$(".span_warn_msg").text("아이디를 입력해 주세요.");
        _$("#user_id").focus();
    }

    if (!user_password) {
        validation = false;
        wrongDivAnimation("#div_user_password");
        _$(".span_warn_msg").text("비밀번호를 입력해 주세요.");
        _$("#user_password").focus();
    }

    if (!validation) {
        _$(".txt_info").show();
    } else {
        _$(".txt_info").hide();
    }

    return validation;
}