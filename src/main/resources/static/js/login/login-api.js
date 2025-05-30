/********************************************************************************
 * @classDescription 사용자 샘플 API js
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
 * Api Object
 ********************************************************************************/
const LoginApi = {

    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "LoginApi",
    requestmapping: "/api/login",

    /********************************************************************************
     * Main Object
     ********************************************************************************/
    // 로그인 체크
    getLoginCheck: (params) => {
        return kwfw.ajax({url: `${LoginApi.requestmapping}/login-check`, params});
    },

    //분류 저장
    saveCate: (params) => {
        return efw.ajax({url: `${SmpApi.requestmapping}/cate-save`, params});
    },

    //분류 표시순서 저장
    saveCateDispOrder: (params) => {
        return efw.ajax({url: `${SmpApi.requestmapping}/cate-save-disp-order`, params});
    },


    /********************************************************************************
     * Dummay Object : 더미
     ********************************************************************************/
    endApi: function () {
    }
};