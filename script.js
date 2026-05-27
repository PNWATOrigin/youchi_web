const roles = {
  advertiser: {
    label: "광고주",
    title: "광고주 홈 대시보드",
    nav: [
      ["홈", "index.html"],
      ["요약", "analysis.html"],
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
    title: "투자자 장기 계약 홈",
    nav: [
      ["홈", "index.html"],
      ["계약", "invest.html"],
      ["매매", "invest.html"],
      ["지분 거래", "trade.html"],
    ],
    kpis: [
      ["장기 계약", "6건", "반복 PPL 계약"],
      ["매매 검토", "3건", "권리 리스크 낮음"],
      ["지분 거래", "12건", "에스크로 보호"],
      ["예상 수익률", "+8.4%", "광고 수익 기여권"],
    ],
    insights: [
      ["장기 PPL 계약", "반복 노출 계약 2건이 검토 대기 중이며 광고 수익 기여권으로 전환 가능합니다."],
      ["채널 매매", "브랜드 안전성 점수가 높은 채널 3개가 인수 검토 대상으로 업데이트됐습니다."],
      ["거래 신뢰", "지분 거래와 권리 양도는 스마트 계약 기반 에스크로로 보호되는 구조입니다."],
    ],
  },
};

const ranks = [
  ["1", "온유메이크업", "뷰티 · 87 CIV"],
  ["2", "디지털리뷰랩", "IT · 93 CIV"],
  ["3", "맛있는형제", "먹방 · 88 CIV"],
];

const holdings = [
  { name: "온유메이크업", amount: 3789000, date: "2026-05-20", trades: 173, rate: "ROI 159.4%", own: "0.8%" },
  { name: "디지털리뷰랩", amount: 10078000, date: "2026-05-18", trades: 191, rate: "ROI 99.7%", own: "1.4%" },
  { name: "맛있는형제", amount: 19513000, date: "2026-05-16", trades: 201, rate: "ROI 110.5%", own: "1.7%" },
  { name: "테크살롱", amount: 4797000, date: "2026-05-14", trades: 177, rate: "ROI 136.1%", own: "1.1%" },
  { name: "야식누나", amount: 5813000, date: "2026-05-12", trades: 181, rate: "ROI 144.0%", own: "2.0%" },
];

const page = document.body.dataset.page || "home";
const pageDefaultRole = { creator: "creator", investment: "investor" }[page];
let currentRole = pageDefaultRole || localStorage.getItem("youchi-role") || "advertiser";
let loggedIn = localStorage.getItem("youchi-logged-in") === "true";
let currentAppTab = 0;

const appTabs = {
  advertiser: [
    ["홈", "home"],
    ["요약", "analysis"],
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
    ["지분 거래", "trade"],
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
  const roleCopy = {
    advertiser: "CIV 요약부터 캠페인·구좌 선정까지",
    creator: "협찬 제안, 정산, 장기 PPL 조달 관리",
    investor: "장기 계약, 채널 매매, 지분 거래 관리",
  }[currentRole];
  return `
    <div class="app-scroll">
      <section class="app-hero-card">
        <span>${data.label} 모드</span>
        <h2>${roleCopy}</h2>
        <p>채널별 CIV, 광고 적합도, 장기 PPL 권리와 매매 상태를 한 화면에서 확인하세요.</p>
        <div class="app-search">
          <select><option>전체 채널 사이즈</option><option>소형</option><option>중형</option><option>대형</option></select>
          <select><option>전체 카테고리</option><option>뷰티</option><option>IT</option><option>먹방</option><option>경제</option></select>
          <input placeholder="키워드 입력" />
          <button data-app-tab="1">분석 보기</button>
        </div>
      </section>
      <h3 class="app-section-title">맞춤형 서비스 모드</h3>
      <div class="role-switcher app-role-switcher">
        <button class="${currentRole === "advertiser" ? "active" : ""}" data-role-button="advertiser">광고주</button>
        <button class="${currentRole === "creator" ? "active" : ""}" data-role-button="creator">크리에이터</button>
        <button class="${currentRole === "investor" ? "active" : ""}" data-role-button="investor">투자자</button>
      </div>
      <h3 class="app-section-title">플랫폼 주요 지표</h3>
      <div class="app-kpi-grid">${kpis}</div>
      <div class="pc-work-grid">
        <section>
          <h3 class="app-section-title">실시간 인기 채널 랭킹</h3>
          <div class="app-rank-list">
            ${ranks.map(([rank, name, info]) => `<button data-app-tab="1"><b>${rank}</b><span><strong>${name}</strong><em>${info}</em></span></button>`).join("")}
          </div>
        </section>
        <section class="app-panel pc-side-panel">
          <h3>오늘의 작업</h3>
          <div class="app-row"><span>CIV 리포트 업데이트</span><strong>완료</strong></div>
          <div class="app-row"><span>장기 PPL 계약 검토</span><strong>2건</strong></div>
          <div class="app-row"><span>협찬/정산 알림</span><strong>2건</strong></div>
        </section>
      </div>
    </div>`;
}

function renderAppAnalysis() {
  const title = currentRole === "creator" ? "내 채널 스튜디오" : currentRole === "investor" ? "장기 계약 가치 분석" : "채널 가치 요약 지표";
  return `
    <div class="app-scroll">
      <div class="pc-analysis-grid">
        <div>
          <section class="app-profile">
            <div class="avatar">뷰</div>
            <div><strong>${currentRole === "creator" ? "온유메이크업 스튜디오" : "온유메이크업"}</strong><span>YouTube · 뷰티 · 구독자 28.4만</span></div>
            <i>✓</i>
          </section>
          <section class="app-score-card">
            <span>${title}</span>
            <strong>87</strong>
            <em>안정 성장 · 추정 채널 가치 ₩4.7억</em>
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
        <h3>${currentRole === "creator" ? "AI 개선 제안" : "AI 분석 요약"}</h3>
        ${roles[currentRole].insights.map(([title, body]) => `<div class="app-insight"><strong>${title}</strong><p>${body}</p></div>`).join("")}
      </section>
    </div>`;
}

function renderAppCampaign() {
  if (currentRole === "creator") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">광고 제안 관리 센터</h2>
        <p class="app-page-sub">광고주가 CIV 가치를 기반으로 보낸 제안을 관리합니다.</p>
        ${["올리브영 신규 기초 라인업 런칭 협찬 제안|₩1,500,000|대기중", "에스티 로더 어드밴스드 나이트 리페어 협찬 협의|보상 조율|대기중", "샤넬 하이드라 뷰티 마이크로 세럼 집행|제품 수령|수락됨"].map((item) => {
          const [name, price, status] = item.split("|");
          return `<section class="app-panel"><div class="app-row"><strong>${name}</strong><span>${status}</span></div><p>협찬 조건 ${price}</p><div class="button-row"><button class="danger-button">거절</button><button class="primary-button">검토</button></div></section>`;
        }).join("")}
      </div>`;
  }
  if (currentRole === "investor") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">채널 매매 카탈로그</h2>
        <div class="app-kpi-grid">
          ${appCard("매매 후보", "3건", "실사 가능")}
          ${appCard("평균 CIV", "89", "상위 채널")}
          ${appCard("권리 리스크", "낮음", "에스크로 검토")}
          ${appCard("공정가 괴리", "±4.8%", "AI 평가 기준")}
        </div>
        <section class="app-panel"><h3>인수 검토 채널</h3><div class="app-row"><strong>디지털리뷰랩</strong><span>₩12.6억</span></div><div class="app-row"><strong>맛있는형제</strong><span>₩24.4억</span></div><div class="app-row"><strong>돈박사TV</strong><span>₩13.3억</span></div></section>
      </div>`;
  }
  return `
    <div class="app-scroll">
      <h2 class="app-page-title">AI 캠페인 ROI 시뮬레이터</h2>
      <section class="app-panel">
        <label>캠페인 예산 <output id="budgetOutput">₩ 5,000,000</output></label>
        <input id="budgetRange" type="range" min="1000000" max="50000000" value="5000000" step="1000000" />
        <label>캠페인 기간 <output id="durationOutput">4주</output></label>
        <input id="durationRange" type="range" min="1" max="12" value="4" />
        <div class="result-grid" id="simResults"></div>
      </section>
      <section class="app-panel">
        <div class="app-row"><strong>온유메이크업</strong><span>98% 매칭</span></div>
        <p>뷰티 · 87 CIV · 광고 적합도 90 · 장기 PPL 전환 가능</p>
        <button class="primary-button">제안하기</button>
      </section>
    </div>`;
}

function renderAppTrade() {
  if (currentRole === "creator") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">정산 및 채널 자본 조달</h2>
        <section class="app-panel"><h3>내 수익 및 정산금 현황</h3><div class="app-row"><span>누적 광고 정산액</span><strong>₩28,450,000</strong></div><div class="app-row"><span>출금 가능 잔액</span><strong>₩4,850,000</strong></div><button class="primary-button">출금 신청</button></section>
        <section class="app-panel"><h3>장기 PPL 수익 지분 양도 신청</h3><label>양도할 광고 수익 기여율 <output>5%</output></label><input type="range" min="1" max="20" value="5" /><button class="primary-button">양도 스마트 계약 등록 신청</button></section>
      </div>`;
  }
  if (currentRole === "advertiser") {
    return `
      <div class="app-scroll">
        <h2 class="app-page-title">채널 광고 구좌 선매수 마켓</h2>
        <section class="app-panel"><div class="app-row"><strong>온유메이크업 3분기 장기 PPL 구좌</strong><span>독점</span></div><p>₩10,600,000 · 뷰티 카테고리 단독 노출 협의</p></section>
        <section class="app-panel"><div class="app-row"><strong>유라글로우 프리미엄 브랜드 협업권</strong><span>얼리버드</span></div><p>₩61,500,000 · 대형 뷰티 채널 장기 스폰서십</p></section>
      </div>`;
  }
  return `
    <div class="app-scroll">
      <h2 class="app-page-title">지분 거래</h2>
      <section class="app-panel">
        <div class="app-row"><strong>온유메이크업 장기 PPL 지분 10%</strong><span>Escrow</span></div>
        <p>추정 평가 가치 ₩4.7억 · 광고 수익 기여권</p>
        <svg class="trade-chart" viewBox="0 0 320 92"><polyline points="0,70 45,52 90,58 135,40 180,30 225,34 270,18 320,12" fill="none" stroke="currentColor" stroke-width="4"/></svg>
        <div class="button-row"><button class="secondary-button">매수 Buy</button><button class="danger-button">매도 Sell</button></div>
      </section>
      <section class="app-panel"><h3>실시간 체결 내역</h3><div class="app-row"><span>12초 전 · 지분 1%</span><strong>₩2,050,000</strong></div><div class="app-row"><span>1분 전 · 지분 2%</span><strong>₩4,100,000</strong></div></section>
    </div>`;
}

function renderAppInvest() {
  return `
    <div class="app-scroll">
      <h2 class="app-page-title">${currentRole === "creator" ? "내 프로젝트 조달 관리" : currentRole === "advertiser" ? "광고주 제휴 연계 & 집행 실적" : "장기 PPL 계약"}</h2>
      <section class="app-panel">
        <div class="app-row"><strong>온유메이크업 장기 PPL 조달 프로젝트</strong><span>D-3</span></div>
        <p>목표 ₩50,000,000 · 현재 ₩41,000,000 · 달성률 82%</p>
        <input type="range" min="0" max="100" value="82" disabled />
        <button class="primary-button">${currentRole === "creator" ? "참여자 보기" : currentRole === "advertiser" ? "제휴 혜택 보기" : "계약 검토하기"}</button>
      </section>
      <section class="app-panel">
        <h3>장기 PPL 계약 지분 현황</h3>
        ${holdings.slice(0, 5).map((x) => `<div class="app-row"><span>${x.name} 계약 지분 ${x.own}<br><em>${money(x.amount)} · ${x.date}</em></span><strong>${x.rate}</strong></div>`).join("")}
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
    title.textContent = currentRole === "creator" ? "내 채널 CIV 관리" : currentRole === "investor" ? "채널 투자 가치 분석" : "채널 가치 평가 지표";
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
          ${["올리브영 신규 기초 라인업 런칭 협찬 제안|₩ 1,500,000|대기중", "에스티 로더 어드밴스드 나이트 리페어 협찬 협의|보상 조율|대기중", "샤넬 하이드라 뷰티 마이크로 세럼 집행|제품 수령|수락됨"].map((x) => {
            const [a,b,c] = x.split("|"); return `<div class="item-row"><div><strong>${a}</strong><p>협찬 조건 ${b}</p></div><span class="tag">${c}</span></div>`;
          }).join("")}
        </div>
      </div>`;
    return;
  }
  if (currentRole === "investor") {
    target.innerHTML = `
      <div class="section-title"><div><p class="eyebrow">Acquisition</p><h2>채널 매매 카탈로그</h2></div></div>
      <div class="feature-grid">
        <div class="control-card"><h3>매매 검토 요약</h3><div class="portfolio-stats"><div><span>매매 후보</span><strong>3건</strong></div><div><span>평균 CIV</span><strong>89</strong></div><div><span>권리 리스크</span><strong>낮음</strong></div><div><span>공정가 괴리</span><strong>±4.8%</strong></div></div></div>
        <div class="list-card"><div class="item-row"><div><strong>디지털리뷰랩</strong><p>IT · 93 CIV · 추정 가치 ₩12.6억</p></div><span class="tag">실사 가능</span></div><div class="item-row"><div><strong>맛있는형제</strong><p>먹방 · 88 CIV · 추정 가치 ₩24.4억</p></div><span class="tag">수익 우수</span></div><div class="item-row"><div><strong>돈박사TV</strong><p>경제 · 장기 PPL 전환 후보</p></div><span class="tag">검토중</span></div></div>
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
      <div class="list-card"><h3>추천 최적 매칭 채널</h3><div class="item-row"><div><strong>온유메이크업</strong><p>뷰티 · 87 CIV · 광고 적합도 90 · 장기 PPL 전환 가능</p></div><button class="primary-button">제안하기</button></div></div>
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
    results.innerHTML = `<div><span>예상 노출</span><strong>${Math.round(impressions).toLocaleString("ko-KR")}회</strong></div><div><span>예상 클릭</span><strong>${Math.round(clicks).toLocaleString("ko-KR")}회</strong></div><div><span>예상 ROI</span><strong>${roi.toFixed(1)}%</strong></div><div><span>예상 광고 매출</span><strong>${money(b * roi / 100)}</strong></div>`;
  };
  budget.addEventListener("input", update);
  duration.addEventListener("input", update);
  update();
}

function renderTrade() {
  const root = document.querySelector("#tradePage") || document.querySelector("#trade");
  if (!root) return;
  if (currentRole === "creator") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Settlement</p><h2>정산 및 채널 자본 조달</h2></div></div><div class="feature-grid"><div class="control-card"><h3>내 수익 및 정산금 현황</h3><div class="portfolio-stats"><div><span>누적 광고 정산액</span><strong>₩28,450,000</strong></div><div><span>누적 장기 광고/협찬비</span><strong>₩4,200,000</strong></div><div><span>출금 가능 잔액</span><strong>₩4,850,000</strong></div></div><button class="primary-button">출금 신청</button></div><div class="control-card"><h3>장기 PPL 수익 지분 양도 신청</h3><label>양도할 광고 수익 기여율 <output>5%</output></label><input type="range" min="1" max="20" value="5" /><button class="primary-button">양도 스마트 계약 등록 신청</button></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Ad Slot Market</p><h2>채널 광고 구좌 선매수 마켓</h2></div></div><div class="list-card"><div class="item-row"><div><strong>온유메이크업 3분기 장기 PPL 구좌</strong><p>₩10,600,000 · 뷰티 카테고리 단독 노출 협의</p></div><span class="tag">독점 보장</span></div><div class="item-row"><div><strong>유라글로우 프리미엄 브랜드 협업권</strong><p>₩61,500,000 · 대형 뷰티 채널 장기 스폰서십</p></div><span class="tag">카테고리 독점</span></div></div>`;
    return;
  }
  root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Exchange</p><h2>지분 거래</h2></div></div><div class="feature-grid"><div class="control-card"><h3>온유메이크업 장기 PPL 지분 10%</h3><p>추정 평가 가치 ₩4.7억 · 광고 수익 기여권 · Escrow Secured</p><svg class="trade-chart" viewBox="0 0 320 92" role="img" aria-label="거래 추이"><polyline points="0,70 45,52 90,58 135,40 180,30 225,34 270,18 320,12" fill="none" stroke="currentColor" stroke-width="4"/></svg><div class="button-row"><button class="secondary-button">지원 신청 Apply</button><button class="danger-button">권리 양도 Assign</button></div></div><div class="list-card"><h3>실시간 지분 거래 내역</h3><div class="item-row"><strong>12초 전 · 지분 1%</strong><span class="tag">₩2,050,000</span></div><div class="item-row"><strong>1분 전 · 지분 2%</strong><span class="tag">₩4,100,000</span></div><div class="item-row"><strong>10분 전 · 지분 0.5%</strong><span class="tag">₩1,025,000</span></div></div></div>`;
}

function renderInvest() {
  const root = document.querySelector("#investPage") || document.querySelector("#invest");
  if (!root) return;
  if (currentRole === "creator") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Funding</p><h2>내 프로젝트 조달 관리</h2></div></div><div class="feature-grid"><div class="control-card"><h3>온유메이크업 장기 PPL 조달 프로젝트</h3><p>목표 ₩50,000,000 · 현재 ₩41,000,000 · 달성률 82%</p><input type="range" min="0" max="100" value="82" disabled /></div><div class="list-card"><h3>실시간 참여자</h3><div class="item-row"><strong>투자자 A님</strong><span>₩5,000,000</span></div><div class="item-row"><strong>투자자 B님</strong><span>₩10,000,000</span></div><div class="item-row"><strong>투자자 C님</strong><span>₩2,000,000</span></div></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Partnership</p><h2>광고주 펀딩 연계 & 집행 실적</h2></div></div><div class="feature-grid"><div class="control-card"><h3>광고 제휴 혜택</h3><div class="item-row"><div><strong>PPL 매칭 우선권</strong><p>펀딩 성공 시즌 영상 스폰서십 단가 최대 20% 할인</p></div></div><div class="item-row"><div><strong>크로스 미디어 독점권</strong><p>굿즈 및 오프라인 행사 브랜드 노출 독점 보장</p></div></div></div><div class="list-card" id="portfolioList"></div></div>`;
  } else {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Long-term PPL</p><h2>장기 PPL 계약 & 내 투자 포트폴리오</h2></div></div><div class="feature-grid"><div class="control-card"><h3>온유메이크업 장기 PPL 조달 프로젝트</h3><div class="portfolio-stats"><div><span>누적 계약액</span><strong>₩42.8억</strong></div><div><span>평균 예상 수익률</span><strong>14.2%</strong></div><div><span>계약 체결률</span><strong>98.5%</strong></div></div><button class="primary-button">계약 검토하기</button></div><div class="list-card"><h3>장기 PPL 계약 지분 현황</h3><div class="sort-row"><button class="active" data-sort="default">기본</button><button data-sort="amount">투자 금액</button><button data-sort="date">최신순</button><button data-sort="trades">최다 거래</button></div><div id="portfolioList"></div></div></div>`;
  }
  renderPortfolio("default");
  document.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-sort]").forEach((b) => b.classList.remove("active"));
      button.classList.add("active");
      renderPortfolio(button.dataset.sort);
    });
  });
}

function renderPortfolio(sort) {
  const list = document.querySelector("#portfolioList");
  if (!list) return;
  const rows = [...holdings].sort((a, b) => {
    if (sort === "amount") return b.amount - a.amount;
    if (sort === "date") return b.date.localeCompare(a.date);
    if (sort === "trades") return b.trades - a.trades;
    return 0;
  });
  list.innerHTML = rows
    .map((x) => `<div class="item-row"><div><strong>${x.name} 지분 ${x.own}</strong><p>${money(x.amount)} · 거래 ${x.trades}회 · ${x.date}</p></div><span class="tag">${x.rate}</span></div>`)
    .join("");
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
