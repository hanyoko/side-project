const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.static('public'));

// 사용자의 검색어를 받아와서 크롤링 요청을 처리하는 엔드포인트 설정
app.get('/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  // 브라우저 창이 화면에 나타나지 않고, 백그라운드에서 실행되는 브라우저 열기
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-zygote', '--disable-features=NetworkService', '--disable-application-cache'] });
  const page = await browser.newPage();

  // 제공된 키워드로 쿠팡 사이트 열기
  await page.goto(`https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`);

  // 상품 정보 크롤링 및 지정된 갯수로 제한
  const productInfo = await scrapeProductInfo(page, 30);

  // 브라우저 닫기
  await browser.close();

  // 크롤링한 상품 정보를 JSON 응답으로 전송
  res.json(productInfo);
});

// 페이지에서 상품 정보를 크롤링하는 함수
async function scrapeProductInfo(page, limit = 30) {
  return page.evaluate((limit) => {
    const results = [];
    const items = document.querySelectorAll('.search-product-list li.search-product');

    // 페이지의 각 항목에 대해 루프 수행
    items.forEach((item, index) => {
      if (index >= limit) return;  // 지정된 갯수에 도달하면 루프 종료

      // 각 항목에서 제목 및 가격 정보 추출
      const title = item.querySelector('.name').textContent.trim();
      const price = item.querySelector('.price-value').textContent.trim();

      // 추출한 정보를 결과 배열에 추가
      results.push({ title, price });
    });

    // 크롤링한 상품 정보가 담긴 배열 반환
    return results;
  }, limit);
}

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});