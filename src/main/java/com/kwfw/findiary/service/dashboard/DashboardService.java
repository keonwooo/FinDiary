package com.kwfw.findiary.service.dashboard;

import com.kwfw.findiary.mapper.bankAccount.BankAccountMapper;
import com.kwfw.findiary.mapper.dashboard.DashboardMapper;
import com.kwfw.findiary.model.BankAccountDto;
import com.kwfw.findiary.model.DiaryDto;
import com.kwfw.findiary.model.HoldingStockDto;
import com.kwfw.findiary.model.QuotesVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardMapper dashboardMapper;
    private final BankAccountMapper bankAccountMapper;

    public List<QuotesVO> getQuotes() {
        return dashboardMapper.getQuotes();
    }

    public BankAccountDto getShareholding(DiaryDto diaryDto) {

        BankAccountDto bankAccountDto = bankAccountMapper.getBankAccountProperty(diaryDto);

        HoldingStockDto holdingStockDto = bankAccountMapper.getHoldingStock(diaryDto);

        // TODO 보유 주식 가지고 보유현황 뿌려주기 
        
        return dashboardMapper.getShareholding();
    }

    public Map<String, String> getFearGreedIndex() {
        HashMap<String, String> fearGreedIndex = new HashMap<>();
        String apiUrl = "https://production.dataviz.cnn.io/index/fearandgreed/graphdata";

        try {
            // 1. URL 연결
            URL url = new URL(apiUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            // 2. GET 요청 설정
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            conn.setRequestProperty("Referer", "https://edition.cnn.com/");
            conn.setRequestProperty("Accept-Language", "en-US,en;q=0.9");

            // 3. 응답 코드 확인
            int responseCode = conn.getResponseCode();
            if (responseCode != 200) {
                throw new RuntimeException("HTTP 요청 실패: 응답 코드 " + responseCode);
            }

            // 4. 응답 데이터 읽기
            BufferedReader in = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            StringBuilder responseContent = new StringBuilder();
            String line;
            while ((line = in.readLine()) != null) {
                responseContent.append(line);
            }
            in.close();
            conn.disconnect();

            // 5. JSON 파싱
            JSONObject json = new JSONObject(responseContent.toString());

            // 6. 예시: 현재 값 출력
            JSONObject fearGreedData = json.getJSONObject("fear_and_greed");
            String currentValue = Integer.toString(fearGreedData.getInt("score"));
            String classification = fearGreedData.getString("rating");

            log.info("Fear & Greed Index: {} ({})", currentValue, classification);
            fearGreedIndex.put("currentValue", currentValue);
            fearGreedIndex.put("classification", classification);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return fearGreedIndex;
    }

}
