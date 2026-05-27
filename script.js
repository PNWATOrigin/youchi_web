const roles = {
  advertiser: {
    label: "광고주",
    title: "광고주 홈 대시보드",
    nav: [
      ["홈", "index.html"],
      ["채널 탐색", "analysis.html"],
      ["캠페인", "campaign.html"],
      ["구좌 선점", "trade.html"],
    ],
    kpis: [
      ["앱에서 집행한 실적", "84.5%", "캠페인 목표 대비"],
      ["진행 건수", "12건", "활성 캠페인"],
      ["진행 돈", "4,800만 원", "누적 총 집행액"],
      ["광고 성과 지표", "148% ROI", "평균 ROI 기준"],
    ],
    insights: [
      ["프리미엄 브랜드 적합도", "브랜드 세이프티 95점으로 뷰티/패션 캠페인 집행에 적합합니다."],
      ["추천 매칭 채널", "뷰티풀 마인드가 예산 대비 전환 효율과 충성 구독자 지표가 가장 높습니다."],
      ["주의 지표", "최근 업로드 주기 변동성이 있어 캠페인 기간에는 콘텐츠 캘린더 확인이 필요합니다."],
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
      ["프리미엄 협업 가능성", "브랜드 안전성 점수가 높아 고단가 PPL 제안을 받을 가능성이 큽니다."],
      ["개선 액션", "업로드 주기를 매주 금요일 오후 6시로 고정하면 CIV 점수 상승이 예상됩니다."],
    ],
  },
  investor: {
    label: "투자자",
    title: "투자자 포트폴리오 홈",
    nav: [
      ["홈", "index.html"],
      ["투자 분석", "analysis.html"],
      ["매출 추적", "campaign.html"],
      ["지분 거래", "trade.html"],
      ["조각 투자", "invest.html"],
    ],
    kpis: [
      ["총 투자 자산", "₩420만", "평가액 기준"],
      ["월 예상 배당", "₩48,500", "6월 예상"],
      ["누적 배당 수익률", "14.2%", "연 환산"],
      ["보유 지분", "5개", "Verified"],
    ],
    insights: [
      ["예상 배당률", "뷰티풀 마인드 채널은 연 16.5% 수준의 추정 배당률을 보입니다."],
      ["리스크 포인트", "업로드 주기 변동성이 있어 배당 안정성은 A+ 등급으로 관리됩니다."],
      ["거래 신뢰", "지분 거래는 스마트 계약 기반 에스크로로 보호되는 구조입니다."],
    ],
  },
};

const ranks = [
  ["1", "뷰티풀 마인드", "뷰티/패션 · 88.4 CIV"],
  ["2", "라이프스타일 비츠", "일상/Vlog · 86.2 CIV"],
  ["3", "테크 인사이드", "IT 리뷰 · 85.9 CIV"],
];

const holdings = [
  { name: "뷰티풀 마인드", amount: 4200000, date: "2026-05-20", trades: 154, rate: "연 16.5%", own: "2.0%" },
  { name: "테크 인사이드", amount: 6800000, date: "2026-05-25", trades: 240, rate: "연 18.2%", own: "3.5%" },
  { name: "쿠킹클래스", amount: 3500000, date: "2026-05-23", trades: 110, rate: "연 12.0%", own: "1.8%" },
  { name: "라이프스타일 비츠", amount: 2500000, date: "2026-05-10", trades: 88, rate: "연 14.5%", own: "1.5%" },
  { name: "게임마스터즈", amount: 1200000, date: "2026-05-05", trades: 45, rate: "연 11.2%", own: "0.8%" },
];

const page = document.body.dataset.page || "home";
const pageDefaultRole = { creator: "creator", investment: "investor" }[page];
let currentRole = pageDefaultRole || localStorage.getItem("youchi-role") || "advertiser";
let loggedIn = localStorage.getItem("youchi-logged-in") === "true";

function money(value) {
  return `₩ ${Math.round(value).toLocaleString("ko-KR")}`;
}

function setRole(role) {
  currentRole = role;
  localStorage.setItem("youchi-role", role);
  document.querySelector(".app-shell")?.setAttribute("data-role", role);
  document.querySelectorAll("[data-role-button]").forEach((button) => {
    button.classList.toggle("active", button.dataset.roleButton === role);
  });
  const roleButton = document.querySelector("#roleCycleButton");
  if (roleButton) roleButton.textContent = roles[role].label;
  renderNavigation();
  renderHome();
  renderAnalysis();
  renderCampaign();
  renderTrade();
  renderInvest();
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
          ${["아모레퍼시픽 헤라 뷰티 캠페인|₩ 8,000,000|대기중", "삼성전자 갤럭시 S26 브랜디드|₩ 15,000,000|수락됨", "올리브영 스킨케어 기획전|₩ 4,500,000|거절됨"].map((x) => {
            const [a,b,c] = x.split("|"); return `<div class="item-row"><div><strong>${a}</strong><p>제안 금액 ${b}</p></div><span class="tag">${c}</span></div>`;
          }).join("")}
        </div>
      </div>`;
    return;
  }
  if (currentRole === "investor") {
    target.innerHTML = `
      <div class="section-title"><div><p class="eyebrow">Revenue</p><h2>채널 광고 매출 분석</h2></div></div>
      <div class="feature-grid">
        <div class="control-card"><h3>투자 채널 광고 통계</h3><div class="portfolio-stats"><div><span>누적 집행액</span><strong>₩148.5억</strong></div><div><span>활성 캠페인</span><strong>342건</strong></div><div><span>평균 ROI</span><strong>154.2%</strong></div><div><span>월 배당 영향</span><strong>+8.4%</strong></div></div></div>
        <div class="list-card"><div class="item-row"><div><strong>뷰티/패션</strong><p>평균 광고 단가 850만 원</p></div><span class="tag">안정적</span></div><div class="item-row"><div><strong>IT 리뷰</strong><p>평균 광고 단가 1,200만 원</p></div><span class="tag">수익 우수</span></div><div class="item-row"><div><strong>일상/Vlog</strong><p>평균 광고 단가 400만 원</p></div><span class="tag">성장 양호</span></div></div>
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
      <div class="list-card"><h3>추천 최적 매칭 채널</h3><div class="item-row"><div><strong>뷰티풀 마인드</strong><p>뷰티/패션 · 88.4 CIV · 시뮬레이션 예산 대비 최적 매칭</p></div><button class="primary-button">제안하기</button></div></div>
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
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Settlement</p><h2>정산 및 채널 자본 조달</h2></div></div><div class="feature-grid"><div class="control-card"><h3>내 수익 및 정산금 현황</h3><div class="portfolio-stats"><div><span>누적 광고 정산액</span><strong>₩28,450,000</strong></div><div><span>누적 지분 분배금</span><strong>₩4,200,000</strong></div><div><span>출금 가능 잔액</span><strong>₩4,850,000</strong></div></div><button class="primary-button">출금 신청</button></div><div class="control-card"><h3>채널 지분 매도 신청</h3><label>매도 지분율 <output>5%</output></label><input type="range" min="1" max="20" value="5" /><button class="primary-button">스마트 계약 등록 신청</button></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Ad Slot Market</p><h2>채널 광고 구좌 선매수 마켓</h2></div></div><div class="list-card"><div class="item-row"><div><strong>뷰티풀 마인드 2026년 3분기 광고 구좌 3회 패키지</strong><p>₩22,000,000 · 정가 대비 15% 할인</p></div><span class="tag">독점 보장</span></div><div class="item-row"><div><strong>테크 인사이드 하반기 메인 브랜디드 1회 독점권</strong><p>₩11,000,000 · 얼리버드 딜</p></div><span class="tag">카테고리 독점</span></div></div>`;
    return;
  }
  root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Exchange</p><h2>채널 거래소 / IP 마켓플레이스</h2></div></div><div class="feature-grid"><div class="control-card"><h3>뷰티풀 마인드 지분 10%</h3><p>추정 평가 가치 ₩2.1억 · Escrow Secured</p><svg class="trade-chart" viewBox="0 0 320 92" role="img" aria-label="거래 추이"><polyline points="0,70 45,52 90,58 135,40 180,30 225,34 270,18 320,12" fill="none" stroke="currentColor" stroke-width="4"/></svg><div class="button-row"><button class="secondary-button">매수 Buy</button><button class="danger-button">매도 Sell</button></div></div><div class="list-card"><h3>실시간 체결 내역</h3><div class="item-row"><strong>12초 전 · 지분 1%</strong><span class="tag">₩2,050,000</span></div><div class="item-row"><strong>1분 전 · 지분 2%</strong><span class="tag">₩4,100,000</span></div><div class="item-row"><strong>10분 전 · 지분 0.5%</strong><span class="tag">₩1,025,000</span></div></div></div>`;
}

function renderInvest() {
  const root = document.querySelector("#investPage") || document.querySelector("#invest");
  if (!root) return;
  if (currentRole === "creator") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Funding</p><h2>내 프로젝트 펀딩 관리</h2></div></div><div class="feature-grid"><div class="control-card"><h3>뷰티풀 마인드 시즌3 제작 프로젝트</h3><p>목표 ₩50,000,000 · 현재 ₩41,000,000 · 달성률 82%</p><input type="range" min="0" max="100" value="82" disabled /></div><div class="list-card"><h3>실시간 펀딩 참여자</h3><div class="item-row"><strong>투자자 A님</strong><span>₩5,000,000</span></div><div class="item-row"><strong>투자자 B님</strong><span>₩10,000,000</span></div><div class="item-row"><strong>투자자 C님</strong><span>₩2,000,000</span></div></div></div>`;
    return;
  }
  if (currentRole === "advertiser") {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Partnership</p><h2>광고주 펀딩 연계 & 집행 실적</h2></div></div><div class="feature-grid"><div class="control-card"><h3>광고 제휴 혜택</h3><div class="item-row"><div><strong>PPL 매칭 우선권</strong><p>펀딩 성공 시즌 영상 스폰서십 단가 최대 20% 할인</p></div></div><div class="item-row"><div><strong>크로스 미디어 독점권</strong><p>굿즈 및 오프라인 행사 브랜드 노출 독점 보장</p></div></div></div><div class="list-card" id="portfolioList"></div></div>`;
  } else {
    root.innerHTML = `<div class="section-title"><div><p class="eyebrow">Fractional Investment</p><h2>조각 투자 & 내 투자 포트폴리오</h2></div></div><div class="feature-grid"><div class="control-card"><h3>콘텐츠 매칭 크라우드 펀딩</h3><div class="portfolio-stats"><div><span>누적 펀딩액</span><strong>₩42.8억</strong></div><div><span>평균 연배당률</span><strong>14.2%</strong></div><div><span>모집 성공률</span><strong>98.5%</strong></div></div><button class="primary-button">펀딩 참가하기</button></div><div class="list-card"><h3>보유 조각 지분 현황</h3><div class="sort-row"><button class="active" data-sort="default">기본</button><button data-sort="amount">투자 금액</button><button data-sort="date">최신순</button><button data-sort="trades">최다 거래</button></div><div id="portfolioList"></div></div></div>`;
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
