package com.kwfw.findiary.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;


public class JsonHelper {
    private static final Logger logger = LoggerFactory.getLogger(JsonHelper.class);

    public static final Gson _Gson = new GsonBuilder().serializeNulls().disableHtmlEscaping().create();
    public static final Gson _GsonPretty = new GsonBuilder().serializeNulls().disableHtmlEscaping().setPrettyPrinting().create();
    public static final ObjectMapper _ObjectMapper = JsonMapper.builder().build();
    // @JsonIgnoreProperty(ignoreUnknown = true) 옵션 추가
    public static final ObjectMapper _ObjectMapperIgnoreUnknown = JsonMapper.builder().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false).build();
    // 대소문자 구분 없이 변환하는 옵션
    public static final ObjectMapper _ObjectMapperAcceptCaseIsensitiveProperties = JsonMapper.builder().configure(MapperFeature.ACCEPT_CASE_INSENSITIVE_PROPERTIES, true).build();

    public static Gson getGson() {
        return _Gson;
    }

    public static Gson getGsonPretty() {
        return _GsonPretty;
    }

    public static ObjectMapper getObjectMapper() {
        return _ObjectMapper;
    }

    public static ObjectMapper getObjectMapperIgnoreUnknown() {
        return _ObjectMapperIgnoreUnknown;
    }

    public static ObjectMapper getObjectMapperAcceptCaseIsensitiveProperties() {
        return _ObjectMapperAcceptCaseIsensitiveProperties;
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, String val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, byte val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, short val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, int val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, long val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, float val) {
        jsonObject.put(key, val);
    }

    @SuppressWarnings("unchecked")
    public static void addJson(JSONObject jsonObject, String key, Object val) {
        jsonObject.put(key, val);
    }

    public static boolean isValid(String json) {
        try {
            _Gson.fromJson(json, Object.class);
            return true;
        } catch (Exception e) {
            logger.error("exception", e);
            return false;
        }
    }

    public static boolean isObject(String json) {
        try {
            _Gson.fromJson(json, JsonObject.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static JsonObject strToObject(String json) {
        try {
            return _Gson.fromJson(json, JsonObject.class);
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean isArray(String json) {
        try {
            _Gson.fromJson(json, JsonArray.class);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public static JsonArray strToArray(String json) {
        try {
            return _Gson.fromJson(json, JsonArray.class);
        } catch (Exception e) {
            return null;
        }
    }

    public static <T> List<T> strToArray(String json, Class<T> valueType) {
        try {
            // 구체적인 타입 정보를 전달하여 변환
            return _ObjectMapperAcceptCaseIsensitiveProperties.readValue(
                    json,
                    _ObjectMapperAcceptCaseIsensitiveProperties.getTypeFactory().constructCollectionType(List.class, valueType)
            );
        } catch (Exception e) {
            return null;
        }
    }

    public static <T> List<T> objToArray(Object object, Class<T> valueType) {
        try {
            // Object를 JSON 문자열로 변환
            String json = _ObjectMapperAcceptCaseIsensitiveProperties.writeValueAsString(object);

            // 변환된 JSON 문자열을 List<T>로 변환
            return strToArray(json, valueType);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    /**
     * 이거 사용하면 gson 에서 map 사용시 숫자를 double 로 변경함
     * 추후 수정해서 사용 필요
     *
     * @param json
     * @return
     */
    public static String orderByKey(String json) {
        // 추후 수정
        try {
            if (isObject(json)) {
                TreeMap<String, Object> map = new TreeMap<String, Object>();
                JsonObject jsonObject = _Gson.fromJson(json, JsonObject.class);
                for (String key : jsonObject.keySet()) {
                    map.put(key, jsonObject.get(key));
                }
                return _Gson.toJson(map);
            } else if (isArray(json)) {
                @SuppressWarnings("unchecked")
                TreeMap<String, Object> map = new Gson().fromJson(json, TreeMap.class);
                return _Gson.toJson(map);
            } else {
                return json;
            }
//			if (isObject(json) || isArray(json)) {
//				// order by key
//				@SuppressWarnings("unchecked")
//				TreeMap<String, Object> map = new Gson().fromJson(json, TreeMap.class);
//				return gson.toJson(map);
//			}
        } catch (Exception e) {
            logger.error("exception", e);
        }
        return json;
    }

    public static String makePrettyFormat(String json) {
        try {
            String result = json.trim();
            if (isObject(result)) {
                // make pretty json format
                JsonObject jsonObject = _Gson.fromJson(result, JsonObject.class);
                return _GsonPretty.toJson(jsonObject);
            } else if (isArray(result)) {
                JsonArray jsonArray = _Gson.fromJson(result, JsonArray.class);
                return _GsonPretty.toJson(jsonArray);
            }
        } catch (Exception e) {
            logger.error("exception", e);
        }
        return json;
    }

    public static Map<String, Object> strToMap(String json) {
        try {
            // remove warning: Type safety: The expression of type Map needs unchecked conversion to conform to Map<String,Object>
            TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {
            };
            return _ObjectMapperAcceptCaseIsensitiveProperties.readValue(json, typeRef);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static Map<String, Object> objToMap(Object object) {
        try {
            // remove warning: Type safety: The expression of type Map needs unchecked conversion to conform to Map<String,Object>
            TypeReference<HashMap<String, Object>> typeRef = new TypeReference<HashMap<String, Object>>() {
            };
            return _ObjectMapperAcceptCaseIsensitiveProperties.convertValue(object, typeRef);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static <T> T strToObj(String json, Class<T> valueType) {
        try {
            return _ObjectMapperAcceptCaseIsensitiveProperties.readValue(json, valueType);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static <T> T mapToObj(Map<String, Object> map, Class<T> toValueType) {
        try {
            return _ObjectMapperAcceptCaseIsensitiveProperties.convertValue(map, toValueType);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static <T> T objToObj(Object object, Class<T> toValueType) {
        try {
            return _ObjectMapperAcceptCaseIsensitiveProperties.convertValue(object, toValueType);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static String mapToJsonString(Map<String, Object> map) {
        try {
            return _ObjectMapperAcceptCaseIsensitiveProperties.writeValueAsString(map);
        } catch (Exception e) {
            logger.error("exception", e);
            return null;
        }
    }

    public static String objToJsonString(Object object) {
        try {
            return _ObjectMapperAcceptCaseIsensitiveProperties.writeValueAsString(object);
        } catch (Exception e) {
            logger.error("exception", e);
            return "";
        }
    }

    public static String objToPrettyJsonString(Object object) {
        try {
            return makePrettyFormat(_ObjectMapperAcceptCaseIsensitiveProperties.writeValueAsString(object));
        } catch (Exception e) {
            logger.error("exception", e);
            return "";
        }
    }
}