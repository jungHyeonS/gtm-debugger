function interceptDataLayer() {
  if (
    (window as any).dataLayer &&
    typeof (window as any).dataLayer.push === 'function'
  ) {
    // 이미 가로챘다면 중복 실행 방지
    if ((window as any).dataLayer._isIntercepted) {
      return;
    }

    const originalPush = (window as any).dataLayer.push;
    console.log('DataLayer found, intercepting push method...', originalPush);
    (window as any).dataLayer.push = function () {
      // const args = Array.from(arguments);
      console.log('DataLayer Push detected by interceptor'); // 개발자 도구 콘솔에서 확인 가능

      // // 백그라운드 스크립트로 데이터 전송
      // chrome.runtime
      //   .sendMessage({
      //     type: 'dataLayerPush',
      //     payload: args,
      //   })
      //   .catch((error) => {
      //     // 메시지 전송 오류 처리 (예: 팝업이 닫혀있을 때)
      //     console.warn('Failed to send message to extension:', error);
      //   });

      // return originalPush.apply(this, arguments);
    };

    // 가로챘음을 표시하여 중복 실행 방지
    (window as any).dataLayer._isIntercepted = true;

    // 페이지 로드 시 현재 데이터Layer 상태 전송 (초기 데이터 확인용)
    chrome.runtime
      .sendMessage({
        type: 'dataLayerInitial',
        payload: JSON.parse(JSON.stringify((window as any).dataLayer)), // 순환 참조 문제 방지를 위해 깊은 복사
      })
      .catch((error) => {
        console.warn('Failed to send initial dataLayer message:', error);
      });

    console.log('DataLayer push successfully intercepted.');
    return true; // 성공적으로 가로챘음
  }
  return false; // 아직 dataLayer가 준비되지 않음
}

// DataLayer가 아직 없을 경우 MutationObserver를 사용하여 감지
if (!interceptDataLayer()) {
  console.log(
    '(window as any).dataLayer not found initially. Starting MutationObserver...'
  );

  const observer = new MutationObserver((mutationsList, observer) => {
    // 모든 DOM 변경 사항을 순회 (여기서는 특정 변경에만 집중)
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'attributes') {
        // body나 head에 스크립트가 추가될 가능성 감지
        // 또는 (window as any) 객체에 dataLayer 속성이 추가되는 것을 직접적으로 감지하기는 어려우므로
        // DOM 변경이 발생할 때마다 dataLayer 존재 여부를 확인하는 방식
        if (interceptDataLayer()) {
          console.log(
            'DataLayer found via MutationObserver. Stopping observer.'
          );
          observer.disconnect(); // DataLayer를 찾으면 더 이상 감시할 필요 없음
          return;
        }
      }
    }
  });

  // document.documentElement (<html>)의 모든 자식 노드 변경과 하위 트리 변경 감시
  // 이는 페이지 전반의 스크립트 추가나 DOM 구조 변경을 감지하는 데 효과적
  observer.observe(document.documentElement, {
    childList: true, // 자식 노드 추가/제거 감지
    subtree: true, // 자식의 자식 노드까지 모든 하위 트리 감지
    attributes: true, // 속성 변경 감지 (예: script src 변경)
  });

  // 안전 장치: 특정 시간 이후에도 dataLayer를 찾지 못하면 옵저버 중지
  // 너무 오래 감시하는 것을 방지하고 리소스 소모를 줄임
  setTimeout(() => {
    if (observer) {
      observer.disconnect();
      console.warn(
        'MutationObserver stopped after timeout. DataLayer might not be present or loaded too late.'
      );
    }
  }, 10000); // 10초 후에 옵저버 중지
}
