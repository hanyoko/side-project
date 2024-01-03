// 클라이언트 측에서 Coupang 검색을 처리하는 함수
async function searchCoupang() {
  // 입력 필드에서 검색 키워드 가져오기
  const keyword = document.getElementById('keyword').value;

  try {
    // 제공된 키워드로 서버의 /scrape 엔드포인트에 fetch 요청 보내기
    const response = await fetch(`/scrape?keyword=${encodeURIComponent(keyword)}`);

    // 크롤링한 상품 정보가 담긴 JSON 응답 파싱
    const productInfo = await response.json();

    // 페이지에 크롤링한 상품 정보 표시
    const resultsContainer = document.getElementById('results');

    resultsContainer.innerHTML = `<h2>검색어: ${keyword}</h2>`;
    resultsContainer.innerHTML += '<h3>상품 정보:</h3>';
    resultsContainer.innerHTML += '<ul>';
    
    // 크롤링한 상품 정보를 루프하여 결과 컨테이너에 추가
    productInfo.forEach(product => {
      resultsContainer.innerHTML += `<li>${product.title} - ${product.price}</li>`;
    });

    resultsContainer.innerHTML += '</ul>';

  } catch (error) { // 크롤링 중 오류 발생 시 에러 메시지 출력
    console.error('Error:', error);
  }
}