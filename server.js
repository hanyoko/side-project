const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const port = 3000;

app.use(express.static('public'));

app.get('/scrape', async (req, res) => {
  const keyword = req.query.keyword;

  // 브라우저 열기
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-zygote', '--disable-features=NetworkService', '--disable-application-cache'] });
  const page = await browser.newPage();

  // 쿠팡 사이트 열기
  await page.goto(`https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`);

  // 상품 정보 크롤링
  const productInfo = await scrapeProductInfo(page);

  // 브라우저 닫기
  await browser.close();

  res.json(productInfo);
});

async function scrapeProductInfo(page, limit = 30) {
    return page.evaluate((limit) => {
      const results = [];
      const items = document.querySelectorAll('.search-product-list li.search-product');
  
      items.forEach((item, index) => {
        if (index >= limit) return;  // 지정된 갯수 이상이면 종료
  
        const title = item.querySelector('.name').textContent.trim();
        const price = item.querySelector('.price-value').textContent.trim();
  
        results.push({ title, price });
      });
  
      return results;
    }, limit);
  }

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});