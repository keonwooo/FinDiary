/********************************************************************************
 * @classDescription diary API js
 * @author kw
 * @version 1.0
 * -------------------------------------------------------------------------------
 * Modification Information
 * Date              Developer           Content
 * ----------        -------------       -------------------------
 * 2025/04/24        김건우               신규생성
 * -------------------------------------------------------------------------------
 *********************************************************************************/
"use strict";
/********************************************************************************
 * Api Object
 ********************************************************************************/
const DiaryApi = {

    /********************************************************************************
     * Variable Object : 페이지 내 전역 Object
     ********************************************************************************/
    name: "DiaryApi",
    requestmapping: "/api/diary",

    /********************************************************************************
     * Main Object
     ********************************************************************************/
    // get 개인 일지
    getUserEvents: (params) => {
        return kwfw.ajax({url: `${DiaryApi.requestmapping}/getUserDiaries`, params});
    },

    // get 사용자 계좌 번호 List
    getUserBankAccountNumList: (params) => {
        return kwfw.ajax({url: `${DiaryApi.requestmapping}/getUserBankAccountNumList`, params});
    },

    // get 사용자 계좌 번호
    getUserBankAccountNum: (params) => {
        return kwfw.ajax({url: `${DiaryApi.requestmapping}/getUserBankAccountNum`, params});
    },

    // insert 개인 일지
    insertTradingDiary: (params) => {
        return kwfw.ajax({url: `${DiaryApi.requestmapping}/insertTradingDiary`, params});
    },

    // update 개인 일지
    updateTradingDiary: (params) => {
        return kwfw.ajax({url: `${DiaryApi.requestmapping}/updateTradingDiary`, params});
    },

    /********************************************************************************
     * Dummay Object : 더미
     ********************************************************************************/
    endApi: function() {}
};