/********************************************************************************
* @classDescription 사용자 샘플 페이지 js
* @author kw
* @version 1.0
* -------------------------------------------------------------------------------
* Modification Information
* Date              Developer           Content
* ----------        -------------       -------------------------
* 2025/04/17        김건우               신규생성
* -------------------------------------------------------------------------------
*********************************************************************************/
"use strict";
/********************************************************************************
 * Global Variable : 전역변수
 ********************************************************************************/
const gCONST_SAMPE = '';  //const 샘플임(가능하면 언더스코어)
const gConstSampe = '';   //이거도 허용함 (상황에 맞게 사용할 것)
let gSampleLet;           //let 샘플임

/********************************************************************************
 * Page Load : After DOM Ready
 ********************************************************************************/
function onloadpage()
{
    //페이지 정의
    LoginView.definePage();
    //이벤트 정의
    LoginView.defineEvent();
    //초기 데이터 로딩
    LoginView.initDataLoading();
} 

/********************************************************************************
 * Page Object 
 ********************************************************************************/
const LoginView = {
    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "LoginView",
     
    /********************************************************************************
     * Define Page Object (layout, grid,tree..정의)
     ********************************************************************************/
    definePage: function()
    {
        console.log(`${this.name} definePage ::::: `);
    },

    /********************************************************************************
     * Define Event Object
     ********************************************************************************/
    defineEvent: function()
    {
        console.log(`${this.name} defineEvent ::::: `);

        // enter 이벤트
        _$(".login_input_group").on("keydown", function (event) {
            if (event.key === "Enter" || event.keyCode === 13) {
                LoginView.goLogin();
            }
        });

        // 아이디, 비밀번호 입력시 공백 제거
        _$(".login_input_group").on({'keyup keydown paste focusout': (event) => {
                let obj = $(event.target);
                let val = obj.val();
                obj.val(val.replace(/ /g,''));
            }});
    },
    
    /********************************************************************************
     * Init Data Loading Object
     ********************************************************************************/
    initDataLoading: function()
    {
        console.log(`${this.name} initDataLoading ::::: `);
    },
    
    /********************************************************************************
     * Main Function Object
     ********************************************************************************/
    goLogin: function()
    {
        if (!LoginView.loginValidation()) {
            return null;
        }
        const user_id = $("#user_id").val()?.trim();
        const user_password = $("#user_password").val()?.trim();

        const params = {
            user_id: user_id
            ,user_password: user_password
        }

        const response = LoginApi.getLoginCheck(params);
        if (response.responseJSON.response_code === RESPONSE_CODE_SUCCESS) {
            console.log(response);
            window.location.href = "/home";
        }
    },
    loginValidation: function()
    {
        let validation = true;

        const user_id = _$("#user_id").val().trim();
        const user_password = _$("#user_password").val().trim();

        if (!user_password) {
            validation = false;
            wrongDivAnimation("#div_user_password");
            _$(".span_warn_msg").text("비밀번호를 입력해 주세요.");
            _$("#user_password").focus();
        }

        if (!user_id) {
            validation = false;
            wrongDivAnimation("#div_user_id");
            _$(".span_warn_msg").text("아이디를 입력해 주세요.");
            _$("#user_id").focus();
        }

        if (!validation) {
            _$(".txt_info").show();
        } else {
            _$(".txt_info").hide();
        }

        return validation;
    }
};


/********************************************************************************
 * Page Public Object (외부접근용) 
 ********************************************************************************/
var PublicLoginView = {
    name: "PublicLoginView",
    selects: LoginView.selects
};
