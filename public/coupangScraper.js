async function searchCoupang() {
  const keyword = document.getElementById('keyword').value;

  try {
    const response = await fetch(`/scrape?keyword=${encodeURIComponent(keyword)}`);
    const productInfo = await response.json();

    // 추출한 상품 정보 출력
    const resultsContainer = document.getElementById('results');
    resultsContainer.innerHTML = `<h2>검색어: ${keyword}</h2>`;
    resultsContainer.innerHTML += '<h3>상품 정보:</h3>';
    resultsContainer.innerHTML += '<ul>';
    productInfo.forEach(product => {
      resultsContainer.innerHTML += `<li>${product.title} - ${product.price}</li>`;
    });
    resultsContainer.innerHTML += '</ul>';
  } catch (error) {
    console.error('Error during scraping:', error);
  }
}