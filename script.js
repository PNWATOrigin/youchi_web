const roles = {
  advertiser: {
    label: "광고주",
    title: "광고주 홈 대시보드",
    nav: [
      ["홈", "index.html"],
      ["상세 검색", "analysis.html"],
      ["캠페인", "campaign.html"],
      ["구좌 선정", "trade.html"],
    ],
    kpis: [
      ["앱에서 집행한 실적", "84.5%", "캠페인 목표 대비"],
      ["진행 건수", "12건", "활성 캠페인"],
      ["진행 돈", "4,800만 원", "누적 총 집행액"],
      ["광고 성과 지표", "148% ROI", "평균 ROI 기준"],
    ],
    insights: [
      ["프리미엄 브랜드 적합도", "온유메이크업은 브랜드 세이프티와 광고 적합도가 높아 뷰티 캠페인 집행에 적합합니다."],
      ["추천 매칭 채널", "미나뷰티로그는 예산 대비 성장률과 예상 ROI가 높아 초기 테스트 집행에 적합합니다."],
      ["주의 지표", "구좌 선정 전 채널별 장기 PPL 단가와 권리 범위를 함께 확인해야 합니다."],
    ],
  },
  creator: {
    label: "크리에이터",
    title: "크리에이터 스튜디오 홈",
    nav: [
      ["홈", "index.html"],
      ["CIV 관리", "analysis.html"],
      ["제안 관리", "campaign.html"],
      ["수익 정산", "trade.html"],
      ["조달 관리", "invest.html"],
    ],
    kpis: [
      ["성장성", "89.4%", "S등급 달성"],
      ["팬덤", "125.4K", "충성 구독자군"],
      ["CIV 리포트", "AAA", "기관 투자 추천"],
      ["조회수 성장", "+24.8%", "최근 30일 기준"],
    ],
    insights: [
      ["구독자 전환 모멘텀", "시청자가 구독자로 전환되는 비율이 카테고리 평균 대비 높습니다."],
      ["협찬/광고 협업 가능성", "브랜드 안전성 점수가 높아 제품 협찬과 장기 PPL 제안을 받을 가능성이 큽니다."],
      ["개선 액션", "협찬 집행 가이드와 업로드 주기를 함께 관리하면 CIV 점수 상승이 예상됩니다."],
    ],
  },
  investor: {
    label: "투자자",
    title: "투자자 채널 성장 홈",
    nav: [
      ["홈", "index.html"],
      ["계약", "invest.html"],
      ["매매", "invest.html"],
      ["채널 발굴", "trade.html"],
    ],
    kpis: [
      ["계약", "3건", "시리즈 기획안 검토"],
      ["매매", "15건", "인수 검토 채널"],
      ["채널 발굴", "12건", "성장 후보 채널"],
      ["PPL 적합", "8건", "파트너 제안 가능"],
    ],
    insights: [
      ["시리즈 계약", "크리에이터가 등록한 전용 영상 시리즈 3건의 제작비 투자와 제품 지원 조건을 검토해야 합니다."],
      ["채널 매매", "브랜드 안전성 점수가 높은 채널 3개가 인수 검토 대상으로 업데이트됐습니다."],
      ["채널 발굴", "PPL 적합 성장 채널 8개가 업데이트되어 장기 광고·제작 지원 제안을 보낼 수 있습니다."],
    ],
  },
};

const ranks = [
  ["1", "미나뷰티로그", "뷰티 · 75 CIV · ROI 180%"],
  ["2", "온유메이크업", "뷰티 · 87 CIV · ROI 159%"],
  ["3", "유라글로우", "뷰티 · 86 CIV · ROI 129%"],
  ["4", "롤체연구소", "게임 · 65 CIV · ROI 173%"],
  ["5", "FPS훈이", "게임 · 81 CIV · ROI 162%"],
];

const advertiserChannels = [
  { name: "미나뷰티로그", category: "뷰티", subscribers: "7.8만명", avgViews: "52,237회", scale: "소형", format: "숏폼", civ: 75, roi: "180.2%", value: "₩ 1.2억", desc: "숏폼 중심의 데일리 메이크업·학생 뷰티 채널" },
  { name: "온유메이크업", category: "뷰티", subscribers: "28.4만명", avgViews: "110,058회", scale: "중형", format: "롱폼+숏폼", civ: 87, roi: "159.4%", value: "₩ 4.7억", desc: "기초 화장품 리뷰와 출근 메이크업 중심 채널" },
  { name: "유라글로우", category: "뷰티", subscribers: "92.5만명", avgViews: "161,039회", scale: "대형", format: "롱폼", civ: 86, roi: "129.4%", value: "₩ 16.2억", desc: "브랜드 협업 경험이 많은 프리미엄 뷰티 채널" },
  { name: "롤체연구소", category: "게임", subscribers: "8.6만명", avgViews: "44,339회", scale: "소형", format: "숏폼", civ: 65, roi: "173.4%", value: "₩ 1.5억", desc: "전략 게임 공략과 패치 분석 중심 채널" },
  { name: "FPS훈이", category: "게임", subscribers: "34.2만명", avgViews: "121,241회", scale: "중형", format: "롱폼+숏폼", civ: 81, roi: "161.9%", value: "₩ 5.7억", desc: "FPS 하이라이트와 장비 리뷰를 함께 다루는 채널" },
  { name: "종합겜민수", category: "게임", subscribers: "128.0만명", avgViews: "290,410회", scale: "대형", format: "롱폼", civ: 83, roi: "105.2%", value: "₩ 23.1억", desc: "신작 게임 리뷰와 종합 게임 예능형 대형 채널" },
];

const creatorOffers = [
  ["(주) 윈드이노센터", "(주) 윈드이노센터 aliquam 캠페인", "4,842만 원", "2026-06-9 까지", "수락됨"],
  ["(주) 라온씨앤씨네트워크", "(주) 라온씨앤씨네트워크 ducimus 캠페인", "2,630만 원", "2026-06-1 까지", "대기중"],
  ["유한회사 가야엔지니어링", "유한회사 가야엔지니어링 temporibus 캠페인", "270만 원", "2026-06-19 까지", "대기중"],
  ["(유) 가람글로벌개발공사", "(유) 가람글로벌개발공사 esse 캠페인", "3,498만 원", "2026-06-13 까지", "대기중"],
  ["유한회사 라온마을은행", "유한회사 라온마을은행 esse 캠페인", "3,097만 원", "2026-06-10 까지", "거절됨"],
  ["유한회사 라온마을은행", "유한회사 라온마을은행 perspiciatis 캠페인", "1,857만 원", "2026-06-12 까지", "거절됨"],
];

const slotDeals = [
  ["FPS훈이 (유) 가람글로벌개발공사 repudiandae 캠페인", "₩ 16,510,000", "정가 대비 13% 할인", "매칭 점수 93점"],
  ["온유메이크업 (유) 마루센터 optio 캠페인", "₩ 7,830,000", "정가 대비 21% 할인", "매칭 점수 86점"],
  ["혼밥대장 (주) 우리코리아에너지 cum 캠페인", "₩ 48,740,000", "정가 대비 17% 할인", "매칭 점수 97점"],
];

const acquisitionChannels = [
  ["미나뷰티로그", "뷰티 · 구독자 7.8만명 · 평균 조회수 52,237회", "CIV 75", "₩ 120,250,228"],
  ["온유메이크업", "뷰티 · 구독자 28.4만명 · 평균 조회수 110,058회", "CIV 87", "₩ 473,663,978"],
  ["유라글로우", "뷰티 · 구독자 92.5만명 · 평균 조회수 161,039회", "CIV 86", "₩ 1,620,134,856"],
  ["롤체연구소", "게임 · 구독자 8.6만명 · 평균 조회수 44,339회", "CIV 65", "₩ 153,957,285"],
  ["FPS훈이", "게임 · 구독자 34.2만명 · 평균 조회수 121,241회", "CIV 81", "₩ 567,489,312"],
  ["종합겜민수", "게임 · 구독자 128.0만명 · 평균 조회수 290,410회", "CIV 83", "₩ 2,307,203,529"],
];

const seriesPlans = [
  {
    channel: "온유메이크업",
    title: "출근 전 10분 메이크업 시즌 3",
    category: "뷰티",
    summary: "매주 2편씩 8주간 출근, 데이트, 면접 상황별 메이크업 루틴을 제작하고 고정 제품 PPL을 자연스럽게 노출합니다.",
    target: "₩50,000,000",
    raised: "₩41,000,000",
    progress: 82,
    minTicket: "₩3,000,000",
    product: "기초 라인 200세트",
    exposure: "예상 누적 노출 92만",
    benefit: "고정 제품 컷 + 더보기 링크",
    days: "D-3",
  },
  {
    channel: "FPS훈이",
    title: "게이밍 룸 업그레이드 챌린지",
    category: "게임",
    summary: "소형 게임 채널의 성장형 시리즈로 장비 교체, 라이브 플레이, 리뷰 콘텐츠를 묶어 브랜드 노출을 반복 설계합니다.",
    target: "₩36,000,000",
    raised: "₩21,500,000",
    progress: 60,
    minTicket: "₩2,000,000",
    product: "헤드셋/키보드 패키지",
    exposure: "예상 누적 노출 58만",
    benefit: "장비 세팅 고정 노출",
    days: "D-8",
  },
];

const campaignContracts = [
  ["(주) 비전유통 numquam 캠페인", "₩ 19,980,000", "크리에이터 검토 중", "2026-06-15"],
  ["유한회사 조선 rem 캠페인", "₩ 43,680,000", "계약 조율 완료 (정산 대기)", "2026-06-15"],
];

const campaignReports = [
  ["(유) 미래코리아시스템 unde 캠페인", "실제 ROI 154.0%", "₩ 47,020,000", "4,702K 노출"],
  ["디지털리뷰랩 x 원더신라제조 캠페인", "실제 ROI 162.0%", "₩ 52,400,000", "5,240K 노출"],
];

const page = document.body.dataset.page || "home";
const pageDefaultRole = document.body.dataset.roleDefault || { creator: "creator", investment: "investor" }[page];
const parsedDefaultTab = Number(document.body.dataset.tabDefault || 0);
let currentRole = pageDefaultRole || localStorage.getItem("youchi-role") || "advertiser";
let loggedIn = localStorage.getItem("youchi-logged-in") === "true";
let currentAppTab = Number.isFinite(parsedDefaultTab) ? parsedDefaultTab : 0;

const appTabs = {
  advertiser: [
    ["홈", "home"],
    ["상세 검색", "analysis"],
    ["캠페인", "campaign"],
    ["구좌 선정", "trade"],
  ],
  creator: [
    ["홈", "home"],
    ["CIV 관리", "analysis"],
    ["제안 관리", "campaign"],
    ["수익 정산", "trade"],
    ["조달 관리", "invest"],
  ],
  investor: [
    ["홈", "home"],
    ["계약", "invest"],
    ["매매", "campaign"],
    ["채널 발굴", "trade"],
  ],
};

function money(value) {
  return `₩ ${Math.round(value).toLocaleString("ko-KR")}`;
}

function setRole(role) {
  currentRole = role;
  localStorage.setItem("youchi-role", role);
  document.querySelector(".app-shell")?.setAttribute("data-role", role);
  if (currentAppTab >= appTabs[role]?.length) currentAppTab = 0;
  document.querySelectorAll("[data-role-button]").forEach((button) => {
    button.classList.toggle("active", button.dataset.roleButton === role);
  });
  const roleButton = document.querySelector("#roleCycleButton");
  if (roleButton) roleButton.textContent = roles[role].label;
  if (document.querySelector("#appContent")) {
    renderAppPreview();
    return;
  }
  renderNavigation();
  renderHome();
  renderAnalysis();
  renderCampaign();
  renderTrade();
  renderInvest();
}

function appCard(title, value, subtext) {
  return `<article class="app-kpi"><span>${title}</span><strong>${value}</strong><em>${subtext}</em></article>`;
}

function channelCard(channel) {
  return `
    <article class="channel-card" data-app-tab="1">
      <div class="channel-card__visual">
        <div class="avatar">${channel.category.slice(0, 1)}</div>
        <b>CIV ${channel.civ}</b>
      </div>
      <div class="channel-card__body">
        <div class="channel-card__head">
          <strong>${channel.name}</strong>
          <span>Verified</span>
        </div>
        <p>${channel.category} · 구독자 ${channel.subscribers} · 평균 조회수 ${channel.avgViews}</p>
        <div class="channel-card__tags"><span>${channel.scale}</span><span>${channel.format}</span></div>
        <em>${channel.desc}</em>
      </div>
      <div class="channel-card__stats">
        <span>예상 ROI <strong>${channel.roi}</strong></span>
        <span>추정 가치 <strong>${channel.value}</strong></span>
      </div>
    </article>`;
}

function renderAppPreview() {
  const content = document.querySelector("#appContent");
  const bottomNav = document.querySelector("#bottomNav");
  const sideNav = document.querySelector("#appSideNav");
  const drawerLinks = document.querySelector("#drawerLinks");
  if (!content) return;

  const tabs = appTabs[currentRole];
  const currentTabKey = tabs[currentAppTab]?.[1] || "home";
  const navMarkup = tabs
    .map(([label], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}">${label}</button>`)
    .join("");
  if (bottomNav) bottomNav.innerHTML = navMarkup;
  if (sideNav) sideNav.innerHTML = navMarkup;
  if (drawerLinks) {
    drawerLinks.innerHTML = tabs
      .map(([label], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}">${label} 이동</button>`)
      .join("");
  }
  const pageTitle = document.querySelector("#pcPageTitle");
  if (pageTitle) pageTitle.textContent = `${roles[currentRole].label} ${tabs[currentAppTab]?.[0] || "홈"}`;

  if (currentTabKey === "home") content.innerHTML = renderAppHome();
  if (currentTabKey === "analysis") content.innerHTML = renderAppAnalysis();
  if (currentTabKey === "campaign") content.innerHTML = renderAppCampaign();
  if (currentTabKey === "trade") content.innerHTML = renderAppTrade();
  if (currentTabKey === "invest") content.innerHTML = renderAppInvest();

  document.querySelectorAll("[data-app-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      currentAppTab = Number(button.dataset.appTab);
      document.querySelector("#drawer")?.classList.remove("open");
      renderAppPreview();
    });
  });
  document.querySelectorAll("[data-role-button]").forEach((button) => {
    button.addEventListener("click", () => setRole(button.dataset.roleButton));
  });
  bindSimulator();
}

function renderAppHome() {
  const data = roles[currentRole];
  const kpis = data.kpis.map(([label, value, sub]) => appCard(label, value, sub)).join("");
  const homeBody = {
    advertiser: `
      <section class="app-hero-card">
        <span>광고주 모드</span>
        <h2>유튜버 검색</h2>
        <p>키워드만 입력해 캠페인에 맞는 크리에이터를 바로 찾아보세요.</p>
        <div class="app-search">
          <input placeholder="예: 뷰티, 게임, 출근 메이크업" />
          <button data-app-tab="1">검색</button>
        </div>
      </section>
      <h3 class="app-section-title">실시간 인기 채널 랭킹</h3>
      <div class="app-rank-list">
        ${ranks.map(([rank, name, info]) => `<button data-app-tab="1"><b>${rank}</b><span><strong>${name}</strong><em>${info}</em></span></button>`).join("")}
      </div>`,
    creator: `
      <section class="app-hero-card">
        <span>파트너 파워 크리에이터 · CIV 점수 87.0</span>
        <h2>온유메이크업 크리에이터님,</h2>
        <p>채널 성장과 광고 제휴 매칭을 실시간으로 연동하여 가치를 극대화하고 있습니다.</p>
      </section>
      <section class="app-panel">
        <div class="app-row"><strong>내 채널 상세 정보 요약</strong><span>펼쳐서 상세 보기</span></div>
        <p>카테고리, 구독자 규모, 단가 범위</p>
      </section>
      <h3 class="app-section-title">협찬 관리 현황</h3>
      <section class="app-panel"><h3>신규 협찬 제안 현황</h3><div class="app-row"><span>올리브영 신규 기초 라인업 런칭 협찬 제안<br><em>유한회사 푸르가야뷰티 · 제품 제공 및 ₩1,500,000</em></span><strong>수락</strong></div><div class="app-row"><span>에스티 로더 어드밴스드 나이트 리페어 협찬 협의<br><em>(유) 마루센터 · 제품 제공 및 보상 조율 가능</em></span><strong>수락</strong></div></section>
      <section class="app-panel"><h3>수령 완료 물품</h3><div class="app-row"><span>샤넬 하이드라 뷰티 마이크로 세럼<br><em>2026.05.20 · 집행 가이드 동봉</em></span><strong>2종</strong></div><div class="app-row"><span>다이슨 에어랩 멀티 스타일러 롱배럴 에디션<br><em>2026.05.15 · PPL 단독 권장</em></span><strong>수령</strong></div></section>`,
    investor: `
      <section class="app-hero-card">
        <span>투자자 모드</span>
        <h2>성장 채널을 찾고 PPL 파트너십을 제안하세요</h2>
        <p>시리즈 기획안 계약, 채널 매매, 성장 후보 발굴을 한 화면에서 관리합니다.</p>
      </section>
      <h3 class="app-section-title">투자자 주요 현황</h3>
      <div class="app-kpi-grid">${kpis}</div>
      <section class="app-panel pc-side-panel">
        <h3>오늘 확인할 내용</h3>
        <div class="app-row"><span>신규 시리즈 기획안 3건 지원 조건 검토 필요</span><strong>계약</strong></div>
        <div class="app-row"><span>권리 리스크 낮음 채널 3개 업데이트</span><strong>매매</strong></div>
        <div class="app-row"><span>PPL 적합 성장 채널 8개 업데이트</span><strong>발굴</strong></div>
      </section>`,
  }[currentRole];
  return `
    <div class="app-scroll">
      ${homeBody}
    </div>`;
}

function renderAppAnalysis() {
  if (currentRole === "advertiser") {
    return `
      <div class="app-scroll">
        <section class="app-hero-card">
          <span>상세 검색</span>
          <h2>크리에이터 채널 탐색</h2>
          <p>광고 캠페인에 최적화된 크리에이터를 상세 조건으로 검색하세요.</p>
          <div class="app-search">
            <select><option>전체 분야</option><option>뷰티</option><option>게임</option><option>IT</option><option>먹방</option><option>경제</option></select>
            <select><option>전체 규모</option><option>소형 (&lt;10만)</option><option>중형 (10만~50만)</option><option>대형 (50만+)</option></select>
            <select><option>전체 포맷</option><option>롱폼</option><option>숏폼</option><option>롱폼+숏폼</option></select>
          </div>
        </section>
        <h3 class="app-section-title">검색 결과 15건</h3>
        <div class="channel-grid">
          ${advertiserChannels.map(channelCard).join("")}
        </div>
      </div>`;
  }
  const title = currentRole === "creator" ? "내 채널 가치 지수 (CIV)" : currentRole === "investor" ? "장기 계약 가치 분석" : "채널 가치 요약 지표";
  const profileName = currentRole === "creator" ? "미나뷰티로그" : "온유메이크업";
  const profileMeta = currentRole === "creator" ? "YouTube · 뷰티 · 구독자 7.8만명" : "YouTube · 뷰티 · 구독자 28.4만명";
  const score = currentRole === "creator" ? "75.0" : "87";
  const scoreMeta = currentRole === "creator" ? "최근 30일 데이터 기준 · 상승 25% · 추정 공정 가치 ₩1.1억 ~ ₩1.3억" : "안정 성장 · 추정 채널 가치 ₩4.7억";
  return `
    <div class="app-scroll">
      <div class="pc-analysis-grid">
        <div>
          <section class="app-profile">
            <div class="avatar">뷰</div>
            <div><strong>${profileName}</strong><span>${profileMeta}</span></div>
            <i>✓</i>
          </section>
          <section class="app-score-card">
            <span>${title}</span>
            <strong>${score}</strong>
            <em>${scoreMeta}</em>
          </section>
        </div>
        <div class="metric-grid app-metrics">
          <div><span>성장성</span><strong>93</strong><em>S등급</em></div>
          <div><span>팬덤</span><strong>84</strong><em>우수</em></div>
          <div><span>광고 적합도</span><strong>90</strong><em>우수</em></div>
          <div><span>브랜드 안전성</span><strong>84</strong><em>A등급</em></div>
        </div>
      </div>
      <section class="app-panel">
        <h3>${currentRole === "creator" ? "CIV 가치 상승 액션 플랜" : "AI 분석 요약"}</h3>
        ${currentRole === "creator" ? `<div class="app-insight"><strong>정기 업로드 주기 최적화</strong><p>매주 금요일 오후 6시 업로드 시 노출 급상승 예측 · 90% 달성</p></div><div class="button-row"><button class="secondary-button" data-app-tab="2">제안 관리</button><button class="primary-button" data-app-tab="3">수익 정산하기</button></div>` : roles[currentRole].insights.map(([title, body]) => `<div class="app-insight"><strong>${title}</strong><p>${body}</p></div>`).join("")}
      </section>
    </div>`;
}

function renderAppCampaign() {
  if (currentRole === "creator") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">광고 제안 관리 센터</h2>
        <p class="app-page-sub">광고주가 CIV 가치를 기반으로 보낸 제안을 관리합니다.</p>
        ${creatorOffers.map((item) => {
          const [company, name, price, date, status] = item;
          const actions = status === "대기중" ? `<div class="button-row"><button class="danger-button">거절</button><button class="primary-button">수락</button></div>` : `<button class="secondary-button">${status === "수락됨" ? "계약 조율 및 메시지 보내기" : "제안 종료됨"}</button>`;
          return `<section class="app-panel"><div class="app-row"><strong>${company}</strong><span>${status}</span></div><h3>${name}</h3><div class="app-row"><span>제안 단가<br><strong>${price}</strong></span><span>제안 만료일<br><strong>${date}</strong></span></div>${actions}</section>`;
        }).join("")}
      </div>`;
  }
  if (currentRole === "investor") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">채널 매매 및 인수 마켓</h2>
        <p class="app-page-sub">잠재력이 검증된 크리에이터 채널의 전체 권리를 투명하게 인수하세요.</p>
        <section class="app-panel">
          <div class="app-search">
            <select><option>전체 분야</option><option>뷰티</option><option>게임</option><option>IT</option></select>
            <select><option>전체 규모</option><option>소형</option><option>중형</option><option>대형</option></select>
            <select><option>전체 가격대</option><option>1억 미만</option><option>1억~5억</option><option>5억 초과</option></select>
          </div>
        </section>
        <h3 class="app-section-title">인수 가능 매물 15건</h3>
        ${acquisitionChannels.map(([name, meta, civ, price]) => `<section class="app-panel"><div class="app-row"><strong>${name}</strong><span>${civ}</span></div><p>${meta}</p><div class="app-row"><span>채널 총 매수 제안가<br><em>즉시 인수 가능</em></span><strong>${price}</strong></div></section>`).join("")}
      </div>`;
  }
  return `
    <div class="app-scroll">
      <div class="sort-row app-subtabs"><button class="active">ROI 시뮬레이터</button><button>성과 및 계약 관리</button></div>
      <h2 class="app-page-title">AI 캠페인 ROI 시뮬레이터</h2>
      <p class="app-page-sub">광고 예산과 기간을 설정해 예상 성과를 확인하고 최적의 채널을 제안받으세요.</p>
      <section class="app-panel">
        <label>캠페인 예산 <output id="budgetOutput">₩ 5,000,000</output></label>
        <input id="budgetRange" type="range" min="1000000" max="50000000" value="5000000" step="1000000" />
        <label>캠페인 기간 <output id="durationOutput">4주</output></label>
        <input id="durationRange" type="range" min="1" max="12" value="4" />
        <div class="result-grid" id="simResults"></div>
      </section>
      <section class="app-panel">
        <h3>추천 최적화 매칭 채널</h3>
        <div class="app-row"><span><strong>미나뷰티로그</strong><br><em>뷰티 · 75 CIV · 숏폼 중심 데일리 메이크업·학생 뷰티 채널</em></span><button class="primary-button">제안하기</button></div>
        <div class="app-row"><span><strong>온유메이크업</strong><br><em>뷰티 · 87 CIV · 기초 화장품 리뷰와 출근 메이크업 중심 채널</em></span><button class="primary-button">제안하기</button></div>
      </section>
      <section class="app-panel">
        <h3>진행 중인 광고 캠페인 계약 현황</h3>
        ${campaignContracts.map(([name, budget, status, date]) => `<div class="app-row"><span><strong>${name}</strong><br><em>캠페인 예산: ${budget} · 계약 체결일: ${date}</em></span><strong>${status}</strong></div>`).join("")}
      </section>
      <section class="app-panel">
        <h3>집행 완료 캠페인 성과 리포트</h3>
        ${campaignReports.map(([name, roi, budget, impressions]) => `<div class="app-row"><span><strong>${name}</strong><br><em>${budget} · ${impressions}</em></span><strong>${roi}</strong></div>`).join("")}
      </section>
    </div>`;
}

function renderAppTrade() {
  if (currentRole === "creator") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">정산 및 채널 자본 조달</h2>
        <p class="app-page-sub">광고 수익 및 장기 협찬비를 정산하고, 장기 광고/협찬 집행권 양도를 신청하세요.</p>
        <section class="app-panel"><h3>내 수익 및 정산금 현황</h3><div class="app-row"><span>누적 광고 정산액</span><strong>₩28,450,000</strong></div><div class="app-row"><span>누적 장기 광고/협찬비</span><strong>₩4,200,000</strong></div><div class="app-row"><span>출금 가능한 잔액</span><strong>₩4,850,000</strong></div><button class="primary-button">출금 신청</button></section>
      </div>`;
  }
  if (currentRole === "advertiser") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">채널 광고 구좌 선매수 마켓</h2>
        <p class="app-page-sub">크리에이터의 미래 비디오 광고 구좌 및 스폰서십 권리를 선매수하여 단가를 고정하고 독점권을 선점하세요.</p>
        <section class="app-panel"><h3>선매수 추천 구좌 매물</h3>${slotDeals.map(([name, price, discount, score]) => `<div class="app-row"><span><strong>${name}</strong><br><em>${price} (${discount})</em></span><strong>${score}</strong></div>`).join("")}</section>
      </div>`;
  }
  return `
    <div class="app-scroll">
      <h2 class="app-page-title">성장 채널 발굴</h2>
      <p class="app-page-sub">아직 작지만 성장 가능성이 높은 크리에이터를 찾아 장기 PPL, 광고, 제작 지원으로 함께 키워갈 채널을 선별하세요.</p>
      <section class="app-panel">
        <h3>채널 발굴 조건</h3>
        <div class="sort-row app-subtabs"><button class="active">전체</button><button>뷰티</button><button>먹방</button><button>IT</button><button>경제</button></div>
        <div class="sort-row app-subtabs"><button class="active">소형</button><button>중형</button><button>빠른 성장</button><button>PPL 적합</button></div>
      </section>
      <h3 class="app-section-title">추천 성장 채널</h3>
      <div class="channel-grid discovery-grid">
        ${advertiserChannels.map((channel, index) => {
          const growth = [95, 89, 86, 92, 84, 79][index] || 82;
          const fit = Math.round((channel.civ + growth) / 2);
          const support = 120 + index * 35;
          return `
            <article class="channel-card discovery-card">
              <div class="channel-card__visual">
                <div class="avatar">${channel.category.slice(0, 1)}</div>
                <b>성장 ${growth}</b>
              </div>
              <div class="channel-card__body">
                <div class="channel-card__head"><strong>${channel.name}</strong><span>Verified</span></div>
                <p>${channel.category} · 구독자 ${channel.subscribers} · 평균 조회 ${channel.avgViews}</p>
                <em>${channel.desc}</em>
              </div>
              <div class="channel-card__stats">
                <span>PPL 적합 <strong>${fit}</strong></span>
                <span>월 지원 <strong>${support}만</strong></span>
              </div>
              <div class="button-row discovery-actions"><button class="secondary-button">상세 보기</button><button class="primary-button">파트너 제안</button></div>
            </article>`;
        }).join("")}
      </div>
    </div>`;
}

function renderAppInvest() {
  if (currentRole === "investor") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">크리에이터 시리즈 계약</h2>
        <p class="app-page-sub">크리에이터가 등록한 영상 시리즈 기획안을 보고 제작비 투자 또는 제품 지원을 제안하세요.</p>
        <section class="app-panel">
          <h3>지원 방식 설정</h3>
          <div class="app-row"><span>투자 검토 금액</span><strong>₩5,000,000</strong></div>
          <input type="range" min="1000000" max="20000000" value="5000000" />
          <label class="check-row"><input type="checkbox" checked /> 제품 지원도 함께 제안</label>
          <p>현금 투자와 샘플/제품 제공을 조합해 제안합니다.</p>
        </section>
        <h3 class="app-section-title">투자 가능한 시리즈</h3>
        ${seriesPlans.map((plan) => `<section class="app-panel series-card">
          <div class="app-row"><strong>${plan.title}</strong><span>${plan.days}</span></div>
          <p><b>${plan.channel}</b> · ${plan.category}</p>
          <p>${plan.summary}</p>
          <input type="range" min="0" max="100" value="${plan.progress}" disabled />
          <div class="app-row"><span>모집 ${plan.raised}</span><span>목표 ${plan.target}</span></div>
          <div class="result-grid">
            <div><span>최소 참여</span><strong>${plan.minTicket}</strong></div>
            <div><span>제품 지원</span><strong>${plan.product}</strong></div>
            <div><span>노출 규모</span><strong>${plan.exposure}</strong></div>
            <div><span>계약 혜택</span><strong>${plan.benefit}</strong></div>
          </div>
          <div class="button-row"><button class="secondary-button">기획안 보기</button><button class="primary-button">지원 제안</button></div>
        </section>`).join("")}
      </div>`;
  }
  return `
    <div class="app-scroll">
      <h2 class="app-page-title">${currentRole === "creator" ? "내 프로젝트 펀딩 관리" : "광고주 제휴 연계 & 집행 실적"}</h2>
      <section class="app-panel">
        <div class="app-row"><strong>뷰티풀 마인드 시즌3 제작 프로젝트</strong><span>D-3</span></div>
        <p>목표 모집 금액 ₩50,000,000 · 현재 모금된 금액 ₩41,000,000 · 달성률 82% · 48명 참여</p>
        <input type="range" min="0" max="100" value="82" disabled />
        <button class="primary-button">${currentRole === "creator" ? "참여자 보기" : "제휴 혜택 보기"}</button>
      </section>
      <section class="app-panel">
        <h3>${currentRole === "creator" ? "실시간 펀딩 참여자" : "플랫폼 주요 지표"}</h3>
        ${currentRole === "creator" ? `<div class="app-row"><span>투자자 A님</span><strong>₩5,000,000 참여</strong></div><div class="app-row"><span>투자자 B님</span><strong>₩10,000,000 참여</strong></div><div class="app-row"><span>투자자 C님</span><strong>₩2,000,000 참여</strong></div>` : roles.creator.kpis.map(([label, value, sub]) => `<div class="app-row"><span>${label}</span><strong>${value}<br><em>${sub}</em></strong></div>`).join("")}
      </section>
    </div>`;
}

function renderNavigation() {
  const activeMap = { home: "index.html", analysis: "analysis.html", campaign: "campaign.html", trade: "trade.html", invest: "invest.html" };
  const items = roles[currentRole].nav;
  const navHtml = items
    .map(([label, href]) => `<button class="${activeMap[page] === href ? "active" : ""}" onclick="location.href='${href}'">${label}</button>`)
    .join("");
  const drawerHtml = items
    .map(([label, href]) => `<button class="${activeMap[page] === href ? "active" : ""}" onclick="location.href='${href}'">${label} 이동</button>`)
    .join("");
  const bottomNav = document.querySelector("#bottomNav");
  const drawerLinks = document.querySelector("#drawerLinks");
  if (bottomNav) bottomNav.innerHTML = navHtml;
  if (drawerLinks) drawerLinks.innerHTML = drawerHtml;
  document.querySelectorAll(".login-link").forEach((link) => {
    if (loggedIn && link.getAttribute("href") === "./login.html") {
      link.textContent = "내 계정";
      link.href = "./index.html#dashboard";
    }
  });
}

function renderHome() {
  const data = roles[currentRole];
  const title = document.querySelector("#dashboardTitle");
  const kpiGrid = document.querySelector("#kpiGrid");
  const rankStrip = document.querySelector("#rankStrip");
  if (title) title.textContent = data.title;
  if (kpiGrid) {
    kpiGrid.innerHTML = data.kpis
      .map(([label, value, sub]) => `<article class="kpi-card"><span>${label}</span><strong>${value}</strong><em>${sub}</em></article>`)
      .join("");
  }
  if (rankStrip) {
    rankStrip.innerHTML = ranks
      .map(([rank, name, info]) => `<article class="rank-card"><b class="rank-badge">${rank}</b><div><strong>${name}</strong><span>${info}</span></div></article>`)
      .join("");
  }
}

function renderAnalysis() {
  const title = document.querySelector("#analysisTitle");
  const list = document.querySelector("#insightList");
  if (title) {
    title.textContent = currentRole === "creator" ? "내 채널 CIV 관리" : currentRole === "investor" ? "채널 투자 가치 분석" : "크리에이터 상세 검색";
  }
  if (list) {
    list.innerHTML = roles[currentRole].insights
      .map(([title, body]) => `<article class="insight"><strong>${title}</strong><p>${body}</p></article>`)
      .join("");
  }
}

function renderCampaign() {
  const root = document.querySelector("#campaignPage");
  const homeRoot = document.querySelector("#campaign");
  const target = root || homeRoot;
  if (!target) return;
  if (currentRole === "creator") {
    target.innerHTML = `
      <div class="section-title"><div><p class="eyebrow">Offers</p><h2>광고 제안 관리 센터</h2></div></div>
      <div class="feature-grid">
        <div class="control-card"><h3>받은 제안</h3><p>광고주가 CIV 가치를 기반으로 보낸 프리미엄 제안입니다.</p><div class="portfolio-stats"><div><span>대기중</span><strong>1건</strong></div><div><span>수락됨</span><strong>1건</strong></div></div></div>
        <div class="list-card">
          ${creatorOffers.map((x) => {
            const [company, name, price, date, status] = x; return `<div class="item-row"><div><strong>${name}</strong><p>${company} · ${price} · ${date}</p></div><span class="tag">${status}</span></div>`;
          }).join("")}
        </div>
      </div>`;
    return;
  }
  if (currentRole === "investor") {
    target.innerHTML = `
      <div class="section-title"><div><p class="eyebrow">Acquisition</p><h2>채널 매매 및 인수 마켓</h2></div></div>
      <div class="feature-grid">
        <div class="control-card"><h3>검색 조건</h3><div class="portfolio-stats"><div><span>분야</span><strong>전체</strong></div><div><span>규모</span><strong>전체</strong></div><div><span>가격대</span><strong>전체</strong></div></div></div>
        <div class="list-card"><h3>인수 가능 매물 15건</h3>${acquisitionChannels.slice(0, 5).map(([name, meta, civ, price]) => `<div class="item-row"><div><strong>${name}</strong><p>${meta}</p></div><span class="tag">${civ}<br>${price}</span></div>`).join("")}</div>
      </div>`;
    return;
  }
  target.innerHTML = `
    <div class="section-title"><div><p class="eyebrow">Campaign</p><h2>AI 캠페인 ROI 시뮬레이터</h2></div></div>
    <div class="feature-grid">
      <div class="control-card">
        <h3>예산과 기간 설정</h3>
        <label>캠페인 예산 <output id="budgetOutput">₩ 5,000,000</output></label>
        <input id="budgetRange" type="range" min="1000000" max="50000000" value="5000000" step="1000000" />
        <label>캠페인 기간 <output id="durationOutput">4주</output></label>
        <input id="durationRange" type="range" min="1" max="12" value="4" />
        <div class="result-grid" id="simResults"></div>
      </div>
      <div class="list-card"><h3>추천 최적 매칭 채널</h3><div class="item-row"><div><strong>미나뷰티로그</strong><p>뷰티 · 75 CIV · 숏폼 중심 데일리 메이크업·학생 뷰티 채널</p></div><button class="primary-button">제안하기</button></div><div class="item-row"><div><strong>온유메이크업</strong><p>뷰티 · 87 CIV · 기초 화장품 리뷰와 출근 메이크업 중심 채널</p></div><button class="primary-button">제안하기</button></div></div>
    </div>`;
  bindSimulator();
}

function bindSimulator() {
  const budget = document.querySelector("#budgetRange");
  const duration = document.querySelector("#durationRange");
  const results = document.querySelector("#simResults");
  if (!budget || !duration || !results) return;
  const update = () => {
    const b = Number(budget.value);
    const d = Number(duration.value);
    const impressions = b * 0.28 + d * 120000;
    const clicks = impressions * 0.045;
    const roi = 145 + d * 3.5;
    document.querySelector("#budgetOutput").textContent = money(b);
    document.querySelector("#durationOutput").textContent = `${d}주`;
    results.innerHTML = `<div><span>예상 노출수</span><strong>${Math.round(impressions).toLocaleString("ko-KR")} 회</strong></div><div><span>예상 클릭수</span><strong>${Math.round(clicks).toLocaleString("ko-KR")} 회</strong></div><div><span>예상 ROI</span><strong>${roi.toFixed(1)} %</strong></div><div><span>예상 광고 매출</span><strong>${Math.round((b * roi / 100) / 10000).toLocaleString("ko-KR")}만 원</strong></div>`;
  };
  budget.addEventListener("input", update);
  duration.addEventListener("input", update);
  update();
}

function renderTrade() {
  const root = document.querySelector("#tradePage") || document.querySelector("#trade");
  if (!root) return;
  if (currentRole === "creator") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Settlement</p><h2>수익 정산</h2></div></div><div class="feature-grid"><div class="control-card"><h3>내 수익 및 정산금 현황</h3><div class="portfolio-stats"><div><span>누적 광고 정산액</span><strong>₩28,450,000</strong></div><div><span>누적 장기 광고/협찬비</span><strong>₩4,200,000</strong></div><div><span>출금 가능 잔액</span><strong>₩4,850,000</strong></div></div><button class="primary-button">출금 신청</button></div><div class="list-card"><h3>정산 안내</h3><div class="item-row"><div><strong>진행 완료 광고 정산</strong><p>검수 완료 캠페인의 정산금을 확인하고 출금 신청을 진행합니다.</p></div><span class="tag">정산</span></div></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Ad Slot Market</p><h2>채널 광고 구좌 선매수 마켓</h2></div></div><div class="list-card"><h3>선매수 추천 구좌 매물</h3>${slotDeals.map(([name, price, discount, score]) => `<div class="item-row"><div><strong>${name}</strong><p>${price} (${discount})</p></div><span class="tag">${score}</span></div>`).join("")}</div>`;
    return;
  }
  root.innerHTML = `
    <div class="section-title"><div><p class="eyebrow">Discovery</p><h2>성장 채널 발굴</h2></div></div>
    <div class="feature-grid">
      <div class="control-card">
        <h3>채널 발굴 조건</h3>
        <div class="portfolio-stats"><div><span>분야</span><strong>전체</strong></div><div><span>규모</span><strong>소형/중형</strong></div><div><span>조건</span><strong>PPL 적합</strong></div></div>
        <p>장기 PPL, 광고, 제작 지원으로 함께 키울 수 있는 성장 채널을 선별합니다.</p>
      </div>
      <div class="list-card">
        <h3>추천 성장 채널</h3>
        ${advertiserChannels.slice(0, 6).map((channel, index) => `<div class="item-row"><div><strong>${channel.name}</strong><p>${channel.category} · 구독자 ${channel.subscribers} · 평균 조회 ${channel.avgViews}</p></div><span class="tag">PPL 적합 ${Math.round((channel.civ + 90 - index) / 2)}<br>월 지원 ${120 + index * 35}만</span></div>`).join("")}
      </div>
    </div>`;
}

function renderInvest() {
  const root = document.querySelector("#investPage") || document.querySelector("#invest");
  if (!root) return;
  if (currentRole === "creator") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Funding</p><h2>내 프로젝트 펀딩 관리</h2></div></div><div class="feature-grid"><div class="control-card"><h3>뷰티풀 마인드 시즌3 제작 프로젝트</h3><p>목표 모집 금액 ₩50,000,000 · 현재 모금된 금액 ₩41,000,000 · 달성률 82% · 48명 참여</p><input type="range" min="0" max="100" value="82" disabled /></div><div class="list-card"><h3>실시간 펀딩 참여자</h3><div class="item-row"><strong>투자자 A님</strong><span>₩5,000,000 참여</span></div><div class="item-row"><strong>투자자 B님</strong><span>₩10,000,000 참여</span></div><div class="item-row"><strong>투자자 C님</strong><span>₩2,000,000 참여</span></div></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Partnership</p><h2>광고주 펀딩 연계 & 집행 실적</h2></div></div><div class="feature-grid"><div class="control-card"><h3>광고 제휴 혜택</h3><div class="item-row"><div><strong>PPL 매칭 우선권</strong><p>펀딩 성공 시즌 영상 스폰서십 단가 최대 20% 할인</p></div></div><div class="item-row"><div><strong>크로스 미디어 독점권</strong><p>굿즈 및 오프라인 행사 브랜드 노출 독점 보장</p></div></div></div><div class="list-card"><h3>플랫폼 주요 지표</h3>${roles.advertiser.kpis.map(([label, value, sub]) => `<div class="item-row"><div><strong>${label}</strong><p>${sub}</p></div><span class="tag">${value}</span></div>`).join("")}</div></div>`;
  } else {
    root.innerHTML = `
      <div class="section-title"><div><p class="eyebrow">Series Contract</p><h2>크리에이터 시리즈 계약</h2></div></div>
      <div class="feature-grid">
        <div class="control-card">
          <h3>지원 방식 설정</h3>
          <div class="portfolio-stats"><div><span>투자 검토 금액</span><strong>₩5,000,000</strong></div><div><span>제품 지원</span><strong>포함</strong></div><div><span>제안 방식</span><strong>현금+제품</strong></div></div>
          <button class="primary-button">지원 조건 저장</button>
        </div>
        <div class="list-card">
          <h3>투자 가능한 시리즈</h3>
          ${seriesPlans.map((plan) => `<div class="item-row"><div><strong>${plan.title}</strong><p>${plan.channel} · ${plan.category} · ${plan.summary}</p></div><span class="tag">${plan.days}<br>${plan.raised}</span></div>`).join("")}
        </div>
      </div>`;
  }
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-sort]").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
    });
  });
}

document.querySelectorAll("[data-role-button]").forEach((button) => {
  button.addEventListener("click", () => setRole(button.dataset.roleButton));
});

document.querySelectorAll(".dropdown-toggle").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const dropdown = button.closest(".dropdown");
    const isOpen = dropdown?.classList.toggle("open");
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".dropdown.open").forEach((dropdown) => {
    dropdown.classList.remove("open");
    dropdown.querySelector(".dropdown-toggle")?.setAttribute("aria-expanded", "false");
  });
});

document.querySelector("#loginForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const role = form.get("role") || "advertiser";
  localStorage.setItem("youchi-role", role);
  localStorage.setItem("youchi-logged-in", "true");
  location.href = "./index.html#dashboard";
});

document.querySelector("#roleCycleButton")?.addEventListener("click", () => {
  const keys = Object.keys(roles);
  setRole(keys[(keys.indexOf(currentRole) + 1) % keys.length]);
});

document.querySelector("#menuButton")?.addEventListener("click", () => document.querySelector("#drawer")?.classList.add("open"));
document.querySelector("#drawerCloseButton")?.addEventListener("click", () => document.querySelector("#drawer")?.classList.remove("open"));
document.querySelector("#drawer")?.addEventListener("click", (event) => {
  if (event.target.id === "drawer") event.currentTarget.classList.remove("open");
});
document.querySelector("#myPageButton")?.addEventListener("click", () => {
  document.querySelector("#drawer")?.classList.remove("open");
  document.querySelector("#myPageModal")?.classList.add("open");
});
document.querySelector("#modalCloseButton")?.addEventListener("click", () => document.querySelector("#myPageModal")?.classList.remove("open"));
document.querySelector(".modal__backdrop")?.addEventListener("click", () => document.querySelector("#myPageModal")?.classList.remove("open"));
document.querySelectorAll("[data-nav]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetPage = { analysis: "analysis.html", campaign: "campaign.html", trade: "trade.html", invest: "invest.html" }[button.dataset.nav];
    if (targetPage) location.href = targetPage;
  });
});

setRole(currentRole);
