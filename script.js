const page = document.body.dataset.page || "home";
const pageDefaultRole = document.body.dataset.roleDefault || { creator: "creator", investment: "investor" }[page];
const parsedDefaultTab = Number(document.body.dataset.tabDefault || 0);
let currentRole = localStorage.getItem("youchi-role") || pageDefaultRole || "advertiser";
let loggedIn = localStorage.getItem("youchi-logged-in") === "true";
let currentAppTab = Number.isFinite(parsedDefaultTab) ? parsedDefaultTab : 0;
let workBasket = JSON.parse(localStorage.getItem("youchi-work-basket") || "[]");

const routeByKey = {
  home: "index.html",
  analysis: "analysis.html",
  campaign: "campaign.html",
  trade: "trade.html",
  invest: "invest.html",
};

const appTabs = {
  advertiser: [
    ["홈", "home"],
    ["인사이트", "analysis"],
    ["캠페인", "campaign"],
    ["채널 매칭", "trade"],
  ],
  creator: [
    ["홈", "home"],
    ["CIV진단", "analysis"],
    ["협업·제안", "campaign"],
    ["수익 정산", "trade"],
    ["채널 운영", "invest"],
  ],
  investor: [
    ["홈", "home"],
    ["리포트", "analysis"],
    ["마켓", "campaign"],
    ["파트너십", "trade"],
  ],
};

const roles = {
  advertiser: {
    label: "광고주",
    title: "광고주 홈",
    kpis: [
      ["활성 캠페인", "12건", "집행중 5 · 대기 4"],
      ["평균 브랜드 핏", "91%", "AI 매칭 기준"],
      ["예상 도달", "142만", "이번 달 누적"],
      ["성과 ROI", "148%", "완료 캠페인 평균"],
    ],
  },
  creator: {
    label: "크리에이터",
    title: "크리에이터 홈",
    kpis: [
      ["CIV", "87.0", "상위 9%"],
      ["팬덤", "125.4K", "충성 시청자군"],
      ["협업 제안", "14건", "검토 필요 5"],
      ["정산 예정", "₩ 8,450만", "스마트 계약 확정"],
    ],
  },
  investor: {
    label: "투자자",
    title: "내 투자 자산 현황",
    kpis: [
      ["리포트", "8건", "수익 배분 업데이트"],
      ["마켓", "15건", "인수 검토 채널"],
      ["파트너십", "12건", "협력 로드맵"],
      ["위험 낮음", "9건", "권리 검토 통과"],
    ],
  },
};

const channels = [
  { name: "미나뷰티로그", category: "뷰티", scale: "소형", subscribers: 78000, avgViews: 52237, monthlyViews: 470133, growthRate: 23.7, fandom: 71, growth: 95, viewGrowth: 84, civ: 75, adFit: 78, brandSafety: 87, roi: 180.2, value: 120250228, rateMin: 1800000, rateMax: 4300000, format: "숏폼", desc: "숏폼 중심의 데일리 메이크업·학생 뷰티 채널" },
  { name: "온유메이크업", category: "뷰티", scale: "중형", subscribers: 284000, avgViews: 110058, monthlyViews: 990522, growthRate: 18.6, fandom: 82, growth: 93, viewGrowth: 86, civ: 87, adFit: 90, brandSafety: 84, roi: 159.4, value: 473663978, rateMin: 5200000, rateMax: 11800000, format: "롱폼+숏폼", desc: "기초 화장품 리뷰와 출근 메이크업 중심 채널" },
  { name: "유라글로우", category: "뷰티", scale: "대형", subscribers: 925000, avgViews: 161039, monthlyViews: 1449351, growthRate: 12.9, fandom: 85, growth: 88, viewGrowth: 79, civ: 86, adFit: 83, brandSafety: 76, roi: 129.4, value: 1620134856, rateMin: 18500000, rateMax: 42000000, format: "롱폼", desc: "브랜드 협업 경험이 많은 프리미엄 뷰티 채널" },
  { name: "롤체연구소", category: "게임", scale: "소형", subscribers: 86000, avgViews: 44339, monthlyViews: 399051, growthRate: 21.1, fandom: 66, growth: 89, viewGrowth: 82, civ: 65, adFit: 71, brandSafety: 85, roi: 173.4, value: 153957285, rateMin: 1400000, rateMax: 3600000, format: "숏폼", desc: "전략 게임 공략과 패치 분석 중심 채널" },
  { name: "FPS훈이", category: "게임", scale: "중형", subscribers: 342000, avgViews: 121241, monthlyViews: 1091169, growthRate: 15.3, fandom: 78, growth: 82, viewGrowth: 81, civ: 81, adFit: 81, brandSafety: 92, roi: 161.9, value: 567489312, rateMin: 6500000, rateMax: 13500000, format: "롱폼+숏폼", desc: "FPS 하이라이트와 장비 리뷰를 함께 다루는 채널" },
  { name: "종합겜민수", category: "게임", scale: "대형", subscribers: 1280000, avgViews: 290410, monthlyViews: 2613690, growthRate: 8.9, fandom: 83, growth: 83, viewGrowth: 74, civ: 83, adFit: 82, brandSafety: 89, roi: 105.2, value: 2307203529, rateMin: 26000000, rateMax: 59000000, format: "롱폼", desc: "신작 게임 리뷰와 종합 게임 예능형 대형 채널" },
  { name: "개발자준", category: "IT", scale: "소형", subscribers: 67000, avgViews: 38510, monthlyViews: 346590, growthRate: 28.4, fandom: 69, growth: 96, viewGrowth: 95, civ: 77, adFit: 75, brandSafety: 91, roi: 194.7, value: 132908120, rateMin: 1600000, rateMax: 4100000, format: "롱폼+숏폼", desc: "개발 생산성, AI 도구, 사이드 프로젝트 리뷰 채널" },
  { name: "디지털리뷰랩", category: "IT", scale: "중형", subscribers: 412000, avgViews: 138420, monthlyViews: 1245780, growthRate: 17.5, fandom: 80, growth: 90, viewGrowth: 84, civ: 80, adFit: 82, brandSafety: 88, roi: 151.6, value: 681200552, rateMin: 7800000, rateMax: 16400000, format: "롱폼", desc: "테크 기기, SaaS, 업무용 앱을 깊게 비교하는 리뷰 채널" },
  { name: "테크살롱", category: "IT", scale: "대형", subscribers: 1010000, avgViews: 214330, monthlyViews: 1928970, growthRate: 9.8, fandom: 88, growth: 81, viewGrowth: 78, civ: 93, adFit: 90, brandSafety: 75, roi: 118.8, value: 1948803400, rateMin: 21000000, rateMax: 51000000, format: "롱폼", desc: "신제품 해설과 B2B 솔루션 리뷰가 강한 IT 채널" },
  { name: "혼밥대장", category: "먹방", scale: "소형", subscribers: 59000, avgViews: 41220, monthlyViews: 370980, growthRate: 31.2, fandom: 64, growth: 98, viewGrowth: 89, civ: 66, adFit: 74, brandSafety: 90, roi: 188.1, value: 116800390, rateMin: 1300000, rateMax: 3300000, format: "숏폼", desc: "편의점 신상과 혼밥 코스를 빠르게 소개하는 채널" },
  { name: "야식누나", category: "먹방", scale: "중형", subscribers: 368000, avgViews: 151900, monthlyViews: 1367100, growthRate: 16.4, fandom: 77, growth: 84, viewGrowth: 82, civ: 81, adFit: 86, brandSafety: 77, roi: 142.7, value: 593440000, rateMin: 7200000, rateMax: 15800000, format: "롱폼+숏폼", desc: "배달 음식과 신제품 먹방 반응이 빠른 채널" },
  { name: "맛있는형제", category: "먹방", scale: "대형", subscribers: 1430000, avgViews: 334100, monthlyViews: 3006900, growthRate: 7.4, fandom: 84, growth: 79, viewGrowth: 71, civ: 88, adFit: 88, brandSafety: 75, roi: 111.5, value: 2640202200, rateMin: 31000000, rateMax: 69000000, format: "롱폼", desc: "프랜차이즈와 지역 맛집 협업 경험이 많은 대형 채널" },
  { name: "짠테크하루", category: "경제", scale: "소형", subscribers: 73000, avgViews: 46300, monthlyViews: 416700, growthRate: 29.5, fandom: 68, growth: 98, viewGrowth: 91, civ: 67, adFit: 80, brandSafety: 74, roi: 202.4, value: 141102900, rateMin: 1500000, rateMax: 3700000, format: "숏폼", desc: "초보 재테크, 앱테크, 소비 절약 팁을 다루는 채널" },
  { name: "재테크백서", category: "경제", scale: "중형", subscribers: 436000, avgViews: 129500, monthlyViews: 1165500, growthRate: 14.2, fandom: 82, growth: 86, viewGrowth: 80, civ: 81, adFit: 81, brandSafety: 74, roi: 137.9, value: 702900500, rateMin: 8300000, rateMax: 17800000, format: "롱폼", desc: "금융 앱, 소비 데이터, 투자 기초를 설명하는 교육형 채널" },
  { name: "돈박사TV", category: "경제", scale: "대형", subscribers: 1180000, avgViews: 248700, monthlyViews: 2238300, growthRate: 6.8, fandom: 86, growth: 76, viewGrowth: 69, civ: 93, adFit: 90, brandSafety: 74, roi: 109.1, value: 2117600000, rateMin: 24500000, rateMax: 57000000, format: "롱폼", desc: "경제 뉴스 해설과 금융 서비스 브랜디드 콘텐츠 채널" },
];

const creatorOffers = [
  ["올리브영 신규 기초 라인업", "유한회사 푸르가야뷰티", "₩ 1,500,000", "제품 4종", "검토"],
  ["에스티 로더 나이트 리페어", "(유) 마루센터", "보상 조율", "제품 2종", "협의"],
  ["샤넬 하이드라 뷰티", "라온마을커머스", "₩ 3,200,000", "제품 2종", "확정"],
  ["다이슨 에어랩 스타일러", "윈드이노센터", "₩ 4,800,000", "제품 1종", "진행"],
  ["출근 전 메이크업 시즌 3", "온유메이크업 파트너", "₩ 12,000,000", "8편", "계약"],
];

const campaigns = [
  ["스킨케어 런칭 6월", "온유메이크업", "집행중", "₩ 42,000,000", "ROI 156%", "도달 42.8만"],
  ["AI 노트앱 생산성", "개발자준", "제안 대기", "₩ 18,000,000", "ROI 193%", "도달 19.4만"],
  ["게이밍 기어 교체", "FPS훈이", "검수중", "₩ 31,500,000", "ROI 162%", "도달 36.1만"],
  ["편의점 신상 푸드", "혼밥대장", "집행중", "₩ 14,700,000", "ROI 188%", "도달 21.2만"],
  ["금융 앱 캠페인", "재테크백서", "완료", "₩ 52,400,000", "ROI 144%", "도달 58.0만"],
];

function krw(value) {
  if (value >= 100000000) return `₩ ${(value / 100000000).toFixed(1)}억`;
  return `₩ ${Math.round(value / 10000).toLocaleString("ko-KR")}만`;
}

function number(value) {
  return value.toLocaleString("ko-KR");
}

function compactCount(value) {
  return value >= 10000 ? `${(value / 10000).toFixed(value >= 100000 ? 1 : 0)}만` : number(value);
}

function pct(value) {
  return `${value.toFixed(1)}%`;
}

function brandFit(channel) {
  return Math.round((channel.adFit + channel.growth + channel.brandSafety + channel.civ) / 4);
}

function marketScore(channel) {
  return Math.round((channel.civ * 0.28) + (channel.growth * 0.22) + (channel.fandom * 0.18) + (channel.brandSafety * 0.17) + (channel.roi * 0.15));
}

function channelHistory(channel) {
  const seed = channel.name.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return [5, 4, 3, 2, 1, 0].map((offset) => {
    const wave = ((seed + offset * 17) % 9) - 4;
    const growthFactor = (5 - offset) * channel.growthRate * 0.018;
    return {
      month: `${6 - offset}월`,
      civ: Math.max(40, Math.min(98, Math.round(channel.civ - offset * 1.8 + wave * 0.6))),
      fandom: Math.max(35, Math.min(98, Math.round(channel.fandom - offset * 1.2 + wave * 0.5))),
      subscribers: Math.round(channel.subscribers * (1 - offset * 0.022 + growthFactor / 100)),
      views: Math.round(channel.monthlyViews * (1 - offset * 0.026 + growthFactor / 90)),
    };
  });
}

function sparkline(points, key, color = "var(--role)") {
  const values = points.map((point) => point[key]);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);
  const coords = values.map((value, index) => {
    const x = 14 + index * 58;
    const y = 106 - ((value - min) / range) * 78;
    return `${x},${y}`;
  }).join(" ");
  return `<svg class="line-chart" viewBox="0 0 320 126" role="img" aria-label="${key} 추세">
    <polyline class="line-chart__grid" points="14,106 304,106" />
    <polyline class="line-chart__grid" points="14,67 304,67" />
    <polyline class="line-chart__grid" points="14,28 304,28" />
    <polyline class="line-chart__line" style="--line:${color}" points="${coords}" />
    ${values.map((value, index) => {
      const [x, y] = coords.split(" ")[index].split(",");
      return `<circle cx="${x}" cy="${y}" r="4"><title>${points[index].month} ${number(value)}</title></circle>`;
    }).join("")}
  </svg>`;
}

function appCard(title, value, subtext) {
  return `<article class="app-kpi"><span>${title}</span><strong>${value}</strong><em>${subtext}</em></article>`;
}

function metricTiles(items) {
  return `<div class="app-kpi-grid">${items.map(([label, value, sub]) => appCard(label, value, sub)).join("")}</div>`;
}

function scorePill(label, value) {
  return `<span class="score-pill"><b>${label}</b>${value}</span>`;
}

function navFlyout(label, key) {
  const menus = {
    home: ["AI 유튜버 검색", "추천 검색어", "최근 검색 결과"],
    analysis: ["채널 점수 비교", "CIV·팬덤 점수", "브랜드 안전성"],
    campaign: ["캠페인 세팅", "제안 후보함", "성과 리포트"],
    trade: ["AI 채널 매칭", "제안 발송", "유사 채널 추천"],
    invest: ["채널 운영", "콘텐츠 로드맵", "협업 일정"],
  };
  return `<div class="nav-flyout"><strong>${label}</strong>${(menus[key] || []).map((item) => `<span>${item}</span>`).join("")}</div>`;
}

function ticker(channels = channelsTop(8)) {
  return `<section class="market-strip">${channels.map((channel) => {
    const delta = channel.growthRate > 15 ? "▲" : "△";
    return `<article class="market-tile"><span>${channel.name}</span><strong>${marketScore(channel)}</strong><em>${delta} ${pct(channel.growthRate)}</em></article>`;
  }).join("")}</section>`;
}

function channelsTop(limit = 6, sorter = (a, b) => marketScore(b) - marketScore(a)) {
  return [...channels].sort(sorter).slice(0, limit);
}

function denseScoreTable(rows, mode = "advertiser") {
  const label = mode === "investor" ? "마켓" : mode === "creator" ? "운영" : "매칭";
  return `<div class="dense-table-wrap"><table class="dense-table">
    <thead><tr><th>#</th><th>채널</th><th>카테고리</th><th>CIV</th><th>성장</th><th>팬덤</th><th>광고핏</th><th>안전성</th><th>ROI</th><th>${label} 점수</th><th>월조회</th><th>가치</th><th>액션</th></tr></thead>
    <tbody>${rows.map((channel, index) => `<tr>
      <td>${index + 1}</td>
      <td><strong>${channel.name}</strong><span>${compactCount(channel.subscribers)} · ${channel.format}</span></td>
      <td>${channel.category}</td>
      <td>${channel.civ}</td>
      <td>${channel.growth}</td>
      <td>${channel.fandom}</td>
      <td>${channel.adFit}</td>
      <td>${channel.brandSafety}</td>
      <td>${pct(channel.roi)}</td>
      <td><b>${mode === "advertiser" ? brandFit(channel) : marketScore(channel)}</b></td>
      <td>${compactCount(channel.monthlyViews)}</td>
      <td>${krw(channel.value)}</td>
      <td><button class="table-action" data-work-action="${mode === "investor" ? "review" : "basket"}" data-channel="${channel.name}">${mode === "investor" ? "검토" : "담기"}</button></td>
    </tr>`).join("")}</tbody>
  </table></div>`;
}

function channelCard(channel, mode = "advertiser") {
  const primary = mode === "investor" ? marketScore(channel) : brandFit(channel);
  const actions = mode === "creator"
    ? ""
    : mode === "investor"
      ? `<div class="channel-actions"><button class="secondary-button" data-work-action="review" data-channel="${channel.name}">검토함 담기</button><button class="primary-button" data-work-action="partner" data-channel="${channel.name}">파트너 제안</button></div>`
      : `<div class="channel-actions"><button class="secondary-button" data-work-action="basket" data-channel="${channel.name}">후보 담기</button><button class="primary-button" data-work-action="proposal" data-channel="${channel.name}">제안 보내기</button></div>`;
  return `<article class="channel-card">
    <div class="channel-card__visual"><div class="avatar">${channel.category.slice(0, 1)}</div><b>${mode === "investor" ? "마켓" : "핏"} ${primary}</b></div>
    <div class="channel-card__body">
      <div class="channel-card__head"><strong>${channel.name}</strong><span>${channel.scale}</span></div>
      <p>${channel.category} · 구독자 ${compactCount(channel.subscribers)} · 평균 조회 ${number(channel.avgViews)}회</p>
      <div class="channel-card__tags"><span>CIV ${channel.civ}</span><span>성장 ${channel.growth}</span><span>안전 ${channel.brandSafety}</span></div>
      <em>${channel.desc}</em>
    </div>
    <div class="channel-card__stats">
      <span>예상 ROI <strong>${pct(channel.roi)}</strong></span>
      <span>월 조회 <strong>${compactCount(channel.monthlyViews)}</strong></span>
      <span>추정 가치 <strong>${krw(channel.value)}</strong></span>
    </div>
    ${actions}
  </article>`;
}

function searchResultRow(channel) {
  return `<article class="creator-search-row" data-search-name="${channel.name}" data-search-category="${channel.category}">
    <div class="creator-search-row__main">
      <div class="avatar">${channel.category.slice(0, 1)}</div>
      <div>
        <strong>${channel.name}</strong>
        <p>${channel.category} · ${channel.scale} · ${channel.format} · ${channel.desc}</p>
      </div>
    </div>
    <div class="latest-score-board">
      ${scorePill("CIV", channel.civ)}
      ${scorePill("팬덤", channel.fandom)}
      ${scorePill("광고핏", channel.adFit)}
      ${scorePill("안전성", channel.brandSafety)}
      ${scorePill("ROI", pct(channel.roi))}
    </div>
    <div class="creator-search-row__actions">
      <button class="secondary-button" data-detail-channel="${channel.name}">자세히 보기</button>
      <button class="primary-button" data-work-action="proposal" data-channel="${channel.name}">제안 보내기</button>
    </div>
  </article>`;
}

function aiSearchExperience(rows = channelsTop(10, (a, b) => brandFit(b) - brandFit(a))) {
  return `<section class="ai-search-panel">
    <div class="ai-search-copy">
      <p class="eyebrow">YOUCHI AI Search</p>
      <h2>AI로 캠페인에 맞는 유튜버를 찾기</h2>
      <p>검색창에는 자연어로 조건을 입력합니다. 결과에서는 최신 CIV, 팬덤, 광고핏만 빠르게 보고 자세히 보기에서 과거 추세를 확인합니다.</p>
    </div>
    <div class="ai-search-box">
      <span>AI</span>
      <input id="aiCreatorSearch" placeholder="예: 20대 여성 타겟, 뷰티 숏폼, 최근 성장률 높은 채널 찾아줘" />
      <button id="aiSearchButton" type="button">검색</button>
    </div>
    <div class="prompt-chip-row">
      <button data-ai-prompt="뷰티 성장성 높은 소형 채널">뷰티 성장성 높은 소형 채널</button>
      <button data-ai-prompt="브랜드 안전성 90점 이상 IT 채널">브랜드 안전성 90점 이상 IT 채널</button>
      <button data-ai-prompt="ROI 높은 먹방 채널">ROI 높은 먹방 채널</button>
      <button data-ai-prompt="경제 앱 PPL 적합 채널">경제 앱 PPL 적합 채널</button>
    </div>
    <div class="ai-search-meta">
      ${scorePill("검색 데이터", `${channels.length}개 채널`)}
      ${scorePill("점수 업데이트", "방금")}
      ${scorePill("추천 기준", "CIV·팬덤·광고핏")}
    </div>
  </section>
  <section class="app-panel search-results-panel">
    <div class="panel-title-row"><h3>AI 검색 결과</h3><span id="aiResultCount">${rows.length}개</span></div>
    <div class="creator-search-list" id="creatorSearchList">${rows.map(searchResultRow).join("")}</div>
  </section>`;
}

function showChannelDetailModal(channelName) {
  const channel = channels.find((item) => item.name === channelName) || channels[0];
  const history = channelHistory(channel);
  const subscriberGrowth = ((history.at(-1).subscribers / history[0].subscribers - 1) * 100).toFixed(1);
  const viewGrowth = ((history.at(-1).views / history[0].views - 1) * 100).toFixed(1);
  document.querySelector(".channel-detail-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="channel-detail-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-detail"></div>
    <div class="channel-detail-modal__panel">
      <div class="panel-title-row">
        <div><p class="eyebrow">Creator Detail</p><h2>${channel.name}</h2><p class="modal-lead">${channel.desc}</p></div>
        <button class="icon-button" data-work-action="close-detail" aria-label="닫기">×</button>
      </div>
      <div class="detail-summary-grid">
        ${scorePill("CIV", channel.civ)}
        ${scorePill("팬덤", channel.fandom)}
        ${scorePill("광고핏", channel.adFit)}
        ${scorePill("브랜드 안전성", channel.brandSafety)}
        ${scorePill("90일 성장", pct(channel.growthRate))}
        ${scorePill("예상 ROI", pct(channel.roi))}
      </div>
      <div class="detail-layout">
        <section class="chart-card"><div class="panel-title-row"><h3>CIV / 팬덤 점수 추세</h3><span>최근 6개월</span></div>${sparkline(history, "civ", "#727bee")}${sparkline(history, "fandom", "#16a34a")}<div class="chart-legend"><span>CIV</span><span>팬덤</span></div></section>
        <section class="chart-card"><div class="panel-title-row"><h3>구독자·월조회 추세</h3><span>성장 ${subscriberGrowth}%</span></div>${sparkline(history, "subscribers", "#2563eb")}${sparkline(history, "views", "#f59e0b")}<div class="chart-legend"><span>구독자 ${subscriberGrowth}%</span><span>월조회 ${viewGrowth}%</span></div></section>
      </div>
      <div class="detail-layout">
        <section class="app-panel"><h3>광고주 검토 포인트</h3><div class="app-row"><span>권장 제안 단가</span><strong>${krw(channel.rateMin)} ~ ${krw(channel.rateMax)}</strong></div><div class="app-row"><span>월 조회수</span><strong>${compactCount(channel.monthlyViews)}</strong></div><div class="app-row"><span>브랜드 핏</span><strong>${brandFit(channel)}</strong></div><div class="app-row"><span>추정 채널 가치</span><strong>${krw(channel.value)}</strong></div></section>
        <section class="app-panel"><h3>AI 요약</h3><p>${channel.category} 캠페인에서 최근 성과가 안정적이며, ${channel.growth >= 90 ? "성장성 기반 테스트 집행에 적합합니다." : "검증된 조회수 기반 캠페인에 적합합니다."} 팬덤 점수와 브랜드 안전성을 함께 보면 단발 제안보다 2~3편 묶음 제안이 효율적입니다.</p><div class="button-row"><button class="secondary-button" data-work-action="basket" data-channel="${channel.name}">후보 담기</button><button class="primary-button" data-work-action="proposal" data-channel="${channel.name}">제안 보내기</button></div></section>
      </div>
    </div>
  </div>`);
}

function detailedSettings(type) {
  if (type === "advertiser") {
    return `<section class="app-panel settings-panel">
      <div class="panel-title-row"><h3>캠페인 세팅값</h3><span>제안 발송 전 검토</span></div>
      <div class="settings-grid">
        <label>브랜드 카테고리<select><option>뷰티 / 스킨케어</option><option>IT / SaaS</option><option>게이밍 기어</option><option>푸드 / 커머스</option><option>금융 앱</option></select></label>
        <label>목표 KPI<select><option>전환 매출 우선</option><option>도달 극대화</option><option>브랜드 안전성 우선</option><option>신규 고객 획득</option></select></label>
        <label>제안 예산<input type="number" value="42000000" min="1000000" step="1000000" /></label>
        <label>제안 마감일<input type="date" value="2026-06-18" /></label>
        <label>최소 브랜드 핏<input type="range" min="60" max="100" value="88" /></label>
        <label>최소 안전성<input type="range" min="60" max="100" value="82" /></label>
        <label>예상 ROI 하한<input type="range" min="80" max="220" value="145" /></label>
        <label>월 조회수 하한<input type="number" value="300000" step="50000" /></label>
      </div>
      <div class="settings-flags">
        <label><input type="checkbox" checked /> 숏폼 포함</label>
        <label><input type="checkbox" checked /> 독점 노출 협의</label>
        <label><input type="checkbox" /> 오프라인 행사 연계</label>
        <label><input type="checkbox" checked /> 댓글 리스크 자동 검수</label>
      </div>
    </section>`;
  }
  return `<section class="app-panel settings-panel">
    <div class="panel-title-row"><h3>투자 검토 세팅값</h3><span>마켓·파트너십 공통</span></div>
    <div class="settings-grid">
      <label>투자 목적<select><option>성장 채널 인수</option><option>장기 파트너십</option><option>PPL 수익형 협업</option><option>권리 리스크 낮은 포트폴리오</option></select></label>
      <label>검토 예산<input type="number" value="800000000" min="10000000" step="10000000" /></label>
      <label>최소 마켓 점수<input type="range" min="60" max="130" value="100" /></label>
      <label>권리 리스크<select><option>낮음만</option><option>중간 이하</option><option>전체 확인</option></select></label>
      <label>회수 기간<select><option>12개월 이하</option><option>18개월 이하</option><option>24개월 이하</option></select></label>
      <label>최소 월 조회<input type="number" value="500000" step="50000" /></label>
      <label>성장률 하한<input type="range" min="0" max="40" value="15" /></label>
      <label>브랜드 안전성<input type="range" min="50" max="100" value="78" /></label>
    </div>
    <div class="settings-flags">
      <label><input type="checkbox" checked /> 수익 배분 검토</label>
      <label><input type="checkbox" checked /> 권리 이전 가능성 확인</label>
      <label><input type="checkbox" checked /> 장기 PPL 적합도 포함</label>
      <label><input type="checkbox" /> 대형 채널만 보기</label>
    </div>
  </section>`;
}

function basketPanel(type) {
  const items = workBasket.filter((item) => item.role === type).slice(-4);
  const title = type === "investor" ? "검토함" : "제안 후보 장바구니";
  return `<section class="app-panel basket-panel">
    <div class="panel-title-row"><h3>${title}</h3><span>${items.length}개 선택</span></div>
    ${items.length ? items.map((item) => `<div class="app-row"><span><strong>${item.name}</strong><br><em>${item.actionLabel} · ${item.time}</em></span><strong>${item.score}</strong></div>`).join("") : `<p>아직 담긴 채널이 없습니다. 카드나 표에서 후보를 담아보세요.</p>`}
    <div class="button-row"><button class="secondary-button" data-work-action="clear-basket">비우기</button><button class="primary-button" data-work-action="${type === "investor" ? "bulk-review" : "bulk-proposal"}">${type === "investor" ? "검토 리포트 생성" : "일괄 제안"}</button></div>
  </section>`;
}

function showRecommendationModal(channelName, action) {
  const base = channels.find((channel) => channel.name === channelName) || channels[0];
  const role = currentRole === "investor" ? "investor" : "advertiser";
  const actionLabel = {
    basket: "후보 담기",
    proposal: "제안 발송",
    review: "검토함 담기",
    partner: "파트너 제안",
    "bulk-review": "검토 리포트",
    "bulk-proposal": "일괄 제안",
  }[action] || "선택";
  if (!["bulk-review", "bulk-proposal", "clear-basket"].includes(action)) {
    workBasket.push({
      role,
      name: base.name,
      actionLabel,
      score: role === "investor" ? marketScore(base) : brandFit(base),
      time: "방금",
    });
    localStorage.setItem("youchi-work-basket", JSON.stringify(workBasket.slice(-20)));
  }
  const similar = channels
    .filter((channel) => channel.name !== base.name)
    .sort((a, b) => {
      const aCategory = a.category === base.category ? 20 : 0;
      const bCategory = b.category === base.category ? 20 : 0;
      const aScore = role === "investor" ? marketScore(a) : brandFit(a);
      const bScore = role === "investor" ? marketScore(b) : brandFit(b);
      return (bCategory + bScore) - (aCategory + aScore);
    })
    .slice(0, 4);
  document.querySelector(".recommend-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="recommend-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-modal"></div>
    <div class="recommend-modal__panel">
      <div class="panel-title-row"><div><p class="eyebrow">${role === "investor" ? "Related Channels" : "Creator Cart"}</p><h2>${base.name} ${actionLabel} 완료</h2></div><button class="icon-button" data-work-action="close-modal" aria-label="닫기">×</button></div>
      <p class="modal-lead">이 채널과 조건이 비슷하거나 함께 제안하면 좋은 유튜버입니다. 쿠팡 장바구니 추천처럼 바로 추가 검토할 수 있게 구성했습니다.</p>
      <div class="recommend-summary">
        ${scorePill(role === "investor" ? "마켓 점수" : "브랜드 핏", role === "investor" ? marketScore(base) : brandFit(base))}
        ${scorePill("카테고리", base.category)}
        ${scorePill("예상 ROI", pct(base.roi))}
        ${scorePill("가치", krw(base.value))}
      </div>
      <div class="recommend-grid">${similar.map((channel) => `<article class="recommend-card">
        <strong>${channel.name}</strong>
        <p>${channel.category} · ${compactCount(channel.subscribers)} · ${channel.desc}</p>
        <div class="score-row">${scorePill(role === "investor" ? "마켓" : "핏", role === "investor" ? marketScore(channel) : brandFit(channel))}${scorePill("ROI", pct(channel.roi))}</div>
        <button class="secondary-button" data-work-action="${role === "investor" ? "review" : "basket"}" data-channel="${channel.name}">${role === "investor" ? "검토함 추가" : "후보 추가"}</button>
      </article>`).join("")}</div>
      <div class="button-row modal-actions"><button class="secondary-button" data-work-action="close-modal">닫기</button><button class="primary-button" data-work-action="${role === "investor" ? "bulk-review" : "bulk-proposal"}">${role === "investor" ? "묶어서 리포트 생성" : "묶어서 제안 보내기"}</button></div>
    </div>
  </div>`);
}

function signalBoard(channel) {
  const metrics = [
    ["CIV", channel.civ],
    ["성장성", channel.growth],
    ["조회 성장", channel.viewGrowth],
    ["팬덤", channel.fandom],
    ["광고 적합", channel.adFit],
    ["브랜드 안전", channel.brandSafety],
  ];
  return `<section class="app-panel">
    <h3>${channel.name} 정밀 점수판</h3>
    <div class="signal-grid">${metrics.map(([label, value]) => `<div><span>${label}</span><strong>${value}</strong><i style="--bar:${value}%"></i></div>`).join("")}</div>
    <div class="score-row">
      ${scorePill("월 조회", compactCount(channel.monthlyViews))}
      ${scorePill("90일 성장", pct(channel.growthRate))}
      ${scorePill("단가", `${krw(channel.rateMin)}~${krw(channel.rateMax)}`)}
      ${scorePill("가치", krw(channel.value))}
    </div>
  </section>`;
}

function pageShell(content) {
  return `<div class="app-scroll">${content}</div>`;
}

function renderAppHome() {
  if (currentRole === "advertiser") {
    const top = channelsTop(5, (a, b) => brandFit(b) - brandFit(a));
    return pageShell(`
      ${aiSearchExperience(channelsTop(10, (a, b) => brandFit(b) - brandFit(a)))}
      <h3 class="app-section-title">핵심 지표</h3>
      ${metricTiles(roles.advertiser.kpis)}
      <h3 class="app-section-title">실시간 인기 채널 랭킹</h3>
      <div class="app-rank-list">${top.map((channel, index) => `<button data-app-tab="1"><b>${index + 1}</b><span><strong>${channel.name}</strong><em>${channel.category} · 핏 ${brandFit(channel)} · ROI ${pct(channel.roi)} · 월조회 ${compactCount(channel.monthlyViews)}</em></span></button>`).join("")}</div>
      <h3 class="app-section-title">브랜드 핏 워치리스트</h3>
      ${denseScoreTable(top, "advertiser")}
    `);
  }
  if (currentRole === "creator") {
    return pageShell(`
      <section class="app-hero-card"><div><span>크리에이터 홈</span><h2>온유메이크업 채널 운영 보드</h2><p>CIV 변화, 협업 제안, 수익 정산, 콘텐츠 운영 지표를 업무용 화면으로 펼쳐 봅니다.</p></div>${ticker([channels[1], channels[0], channels[2], channels[10]])}</section>
      <h3 class="app-section-title">핵심 상태</h3>
      ${metricTiles(roles.creator.kpis)}
      <div class="pc-work-grid">
        <section class="app-panel"><h3>신규 협업·제안</h3>${creatorOffers.map(([title, company, price, product, status]) => `<div class="app-row"><span><strong>${title}</strong><br><em>${company} · ${price} · ${product}</em></span><strong>${status}</strong></div>`).join("")}</section>
        ${signalBoard(channels[1])}
      </div>
    `);
  }
  return pageShell(`
    <section class="app-hero-card"><div><span>투자자 홈</span><h2>내 투자 자산 현황</h2><p>채널별 리포트, 마켓 가격, 파트너십 조건, 위험 점수를 촘촘하게 확인합니다.</p></div>${ticker(channelsTop(6))}</section>
    <h3 class="app-section-title">핵심 지표</h3>
    ${metricTiles(roles.investor.kpis)}
    <div class="pc-work-grid">
      <section class="app-panel"><h3>오늘 확인할 내용</h3><div class="app-row"><span>채널별 광고 수익과 배분 현황 업데이트</span><strong>리포트</strong></div><div class="app-row"><span>권리 리스크 낮음 채널 IP 3개 업데이트</span><strong>마켓</strong></div><div class="app-row"><span>협력 채널 성장 로드맵 8개 업데이트</span><strong>파트너십</strong></div></section>
      <section class="app-panel"><h3>마켓 스코어 상위</h3>${channelsTop(5).map((channel) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>${channel.category} · ${compactCount(channel.subscribers)} · 가치 ${krw(channel.value)}</em></span><strong>${marketScore(channel)}</strong></div>`).join("")}</section>
    </div>
  `);
}

function renderAppAnalysis() {
  if (currentRole === "advertiser") {
    const top = channelsTop(15, (a, b) => brandFit(b) - brandFit(a));
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">Insight</p><h2>채널 인사이트</h2><p>앱보다 더 많은 비교 지표를 PC에서 한 번에 보도록 구성했습니다.</p></div><div class="score-row">${scorePill("검색 결과", "15건")}${scorePill("안전성 80+", `${channels.filter((c) => c.brandSafety >= 80).length}건`)}${scorePill("ROI 150%+", `${channels.filter((c) => c.roi >= 150).length}건`)}</div></section>
      ${aiSearchExperience(top.slice(0, 8))}
      ${detailedSettings("advertiser")}
      ${basketPanel("advertiser")}
      <section class="app-panel"><h3>필터</h3><div class="filter-grid"><select><option>전체 카테고리</option><option>뷰티</option><option>게임</option><option>IT</option><option>먹방</option><option>경제</option></select><select><option>전체 규모</option><option>소형</option><option>중형</option><option>대형</option></select><select><option>브랜드 안전성순</option><option>CIV순</option><option>성장성순</option><option>ROI순</option></select><input placeholder="채널명, 키워드 검색" /></div></section>
      ${denseScoreTable(top, "advertiser")}
      <h3 class="app-section-title">정밀 카드</h3><div class="channel-grid">${top.slice(0, 9).map((channel) => channelCard(channel, "advertiser")).join("")}</div>
      ${signalBoard(top[0])}
    `);
  }
  if (currentRole === "creator") {
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">CIV Diagnosis</p><h2>CIV진단</h2><p>채널 가치, 성장성, 팬덤, 광고 적합도를 실제 운영 지표처럼 자세히 확인합니다.</p></div><div class="score-row">${scorePill("현재 CIV", "87.0")}${scorePill("상위", "9%")}${scorePill("예상 가치", krw(channels[1].value))}</div></section>
      <div class="pc-analysis-grid">${signalBoard(channels[1])}<section class="app-panel"><h3>개선 액션</h3><div class="app-insight"><strong>정기 업로드 주기 최적화</strong><p>금요일 오후 6시 업로드 패턴에서 조회 성장 점수가 가장 높습니다.</p></div><div class="app-insight"><strong>브랜드 안전성 유지</strong><p>협찬 가이드 준수율과 댓글 위험도가 안정권입니다.</p></div><div class="button-row"><button class="secondary-button" data-app-tab="2">협업·제안 보기</button><button class="primary-button" data-app-tab="3">수익 정산 보기</button></div></section></div>
      ${denseScoreTable([channels[1], channels[0], channels[2], channels[7]], "creator")}
    `);
  }
  return pageShell(`
    <section class="page-head"><div><p class="eyebrow">Report</p><h2>채널 리포트</h2><p>투자자용 리포트는 수익성, 성장성, 권리 위험, 시장 가격을 모두 펼쳐서 봅니다.</p></div><div class="score-row">${scorePill("리포트", "8건")}${scorePill("권리 위험 낮음", "9건")}${scorePill("평균 ROI", "151.2%")}</div></section>
    ${ticker(channelsTop(8))}
    ${denseScoreTable(channelsTop(12), "investor")}
    <div class="pc-work-grid"><section class="app-panel"><h3>수익 배분 업데이트</h3>${channelsTop(5).map((channel, index) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>광고 수익 ${krw(channel.rateMax * (5 + index))} · 예상 ROI ${pct(channel.roi)}</em></span><strong>${index < 2 ? "상향" : "유지"}</strong></div>`).join("")}</section>${signalBoard(channelsTop(1)[0])}</div>
  `);
}

function renderAppCampaign() {
  if (currentRole === "advertiser") {
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">Campaign</p><h2>성과 및 계약 관리</h2><p>집행중 캠페인과 완료 리포트를 같은 화면에서 비교합니다.</p></div><div class="score-row">${scorePill("집행중", "5건")}${scorePill("검수중", "3건")}${scorePill("평균 ROI", "148%")}</div></section>
      <div class="pc-work-grid">
        <section class="app-panel"><h3>캠페인 현황</h3>${campaigns.map(([name, channel, status, budget, roi, reach]) => `<div class="app-row"><span><strong>${name}</strong><br><em>${channel} · ${budget} · ${reach}</em></span><strong>${status}<br><em>${roi}</em></strong></div>`).join("")}</section>
        <section class="app-panel"><h3>예산·성과 시뮬레이터</h3><label>캠페인 예산 <output id="budgetOutput">₩ 5,000,000</output></label><input id="budgetRange" type="range" min="1000000" max="50000000" value="5000000" step="1000000" /><label>캠페인 기간 <output id="durationOutput">4주</output></label><input id="durationRange" type="range" min="1" max="12" value="4" /><div class="result-grid" id="simResults"></div></section>
      </div>
      ${detailedSettings("advertiser")}
      ${basketPanel("advertiser")}
      ${denseScoreTable(channelsTop(8, (a, b) => b.roi - a.roi), "advertiser")}
    `);
  }
  if (currentRole === "creator") {
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">Offers</p><h2>협업·제안</h2><p>받은 협찬, 광고 제안, 제작 조건을 한 화면에서 검토합니다.</p></div><div class="score-row">${scorePill("신규", "5건")}${scorePill("확정", "2건")}${scorePill("예상 매출", "₩ 2,150만")}</div></section>
      <section class="app-panel"><h3>제안 리스트</h3>${creatorOffers.map(([title, company, price, product, status]) => `<div class="app-row"><span><strong>${title}</strong><br><em>${company} · ${price} · ${product}</em></span><strong>${status}</strong></div>`).join("")}</section>
      <div class="channel-grid">${[channels[1], channels[0], channels[2]].map((channel) => channelCard(channel, "creator")).join("")}</div>
    `);
  }
  const market = channelsTop(15, (a, b) => marketScore(b) - marketScore(a));
  return pageShell(`
    <section class="page-head"><div><p class="eyebrow">Market</p><h2>채널 매매 및 인수 마켓</h2><p>잠재력이 검증된 크리에이터 채널의 전체 권리를 가격, 성장성, 위험 점수로 비교합니다.</p></div><div class="score-row">${scorePill("마켓", "15건")}${scorePill("평균 가치", "₩ 9.8억")}${scorePill("상승 후보", "6건")}</div></section>
    ${ticker(market.slice(0, 8))}
    ${detailedSettings("investor")}
    ${basketPanel("investor")}
    <section class="app-panel"><h3>마켓 필터</h3><div class="filter-grid"><select><option>전체 카테고리</option><option>뷰티</option><option>IT</option><option>게임</option><option>경제</option></select><select><option>전체 규모</option><option>소형</option><option>중형</option><option>대형</option></select><select><option>전체 가격대</option><option>3억 이하</option><option>3억~10억</option><option>10억 이상</option></select><input placeholder="채널명 검색" /></div></section>
    ${denseScoreTable(market, "investor")}
    <h3 class="app-section-title">인수 검토 카드</h3><div class="channel-grid">${market.slice(0, 9).map((channel) => channelCard(channel, "investor")).join("")}</div>
  `);
}

function renderAppTrade() {
  if (currentRole === "advertiser") {
    const matches = channels.filter((channel) => channel.brandSafety >= 80).sort((a, b) => brandFit(b) - brandFit(a));
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">Channel Matching</p><h2>채널 매칭</h2><p>AI가 우리 브랜드와 핏이 맞는 유망 채널을 추천하고 카테고리, 성장성, 안전성을 함께 비교합니다.</p></div><div class="score-row">${scorePill("추천", `${matches.length}건`)}${scorePill("평균 핏", "88")}${scorePill("안전성 90+", `${matches.filter((c) => c.brandSafety >= 90).length}건`)}</div></section>
      ${detailedSettings("advertiser")}
      ${basketPanel("advertiser")}
      <section class="app-panel"><h3>매칭 조건</h3><div class="filter-grid"><select><option>뷰티 브랜드</option><option>IT/SaaS</option><option>게이밍</option><option>푸드</option><option>금융</option></select><select><option>브랜드 안전성 80+</option><option>성장성 90+</option><option>ROI 150%+</option></select><select><option>예산 전체</option><option>500만 이하</option><option>500만~2,000만</option><option>2,000만 이상</option></select><input placeholder="캠페인 키워드" /></div></section>
      ${denseScoreTable(matches, "advertiser")}
      <div class="channel-grid">${matches.slice(0, 9).map((channel) => channelCard(channel, "advertiser")).join("")}</div>
    `);
  }
  if (currentRole === "creator") {
    return pageShell(`
      <section class="page-head"><div><p class="eyebrow">Settlement</p><h2>수익 정산</h2><p>스마트 계약 기반으로 확정된 제안금과 입금 예정일을 관리합니다.</p></div><div class="score-row">${scorePill("출금 가능", "₩ 4,850만")}${scorePill("확정 예정", "₩ 8,450만")}${scorePill("검수 대기", "3건")}</div></section>
      <div class="pc-work-grid"><section class="app-panel"><h3>정산 대기</h3><div class="app-row"><span><strong>스킨케어 런칭 6월</strong><br><em>검수 완료 · 2026.06.05 입금 예정</em></span><strong>₩ 18,000,000</strong></div><div class="app-row"><span><strong>에어랩 스타일러</strong><br><em>촬영본 승인 · 2026.06.12 입금 예정</em></span><strong>₩ 4,800,000</strong></div><div class="app-row"><span><strong>출근 메이크업 시즌 3</strong><br><em>1차 콘텐츠 승인</em></span><strong>₩ 12,000,000</strong></div></section><section class="app-panel"><h3>정산 방식</h3><div class="app-row"><span>자동 정산</span><strong>활성</strong></div><div class="app-row"><span>세금계산서</span><strong>연동</strong></div><div class="app-row"><span>출금 계좌</span><strong>확인됨</strong></div><button class="primary-button">출금 신청</button></section></div>
    `);
  }
  const partners = channelsTop(12, (a, b) => ((b.growth + b.adFit + b.brandSafety) - (a.growth + a.adFit + a.brandSafety)));
  return pageShell(`
    <section class="page-head"><div><p class="eyebrow">Partnership</p><h2>파트너십</h2><p>협력 채널과의 동반 성장 로드맵을 확인하고 장기 파트너십 후보를 선별합니다.</p></div><div class="score-row">${scorePill("추천", "12건")}${scorePill("PPL 적합", "8건")}${scorePill("빠른 성장", "6건")}</div></section>
    ${detailedSettings("investor")}
    ${basketPanel("investor")}
    <section class="app-panel"><h3>파트너십 조건</h3><div class="filter-grid"><select><option>전체 카테고리</option><option>뷰티</option><option>먹방</option><option>IT</option><option>경제</option></select><select><option>전체 규모</option><option>소형</option><option>중형</option><option>빠른 성장</option></select><select><option>PPL 적합 우선</option><option>성장성 우선</option><option>위험 낮음 우선</option></select><input placeholder="제안 키워드" /></div></section>
    ${denseScoreTable(partners, "investor")}
    <div class="channel-grid">${partners.slice(0, 9).map((channel) => channelCard(channel, "investor")).join("")}</div>
  `);
}

function renderAppInvest() {
  return pageShell(`
    <section class="page-head"><div><p class="eyebrow">Creator Operation</p><h2>채널 운영</h2><p>콘텐츠 로드맵, 협업 일정, 성장 액션을 크리에이터 업무 화면으로 관리합니다.</p></div><div class="score-row">${scorePill("업로드 예정", "8편")}${scorePill("협업 일정", "5건")}${scorePill("CIV 목표", "90")}</div></section>
    <div class="pc-work-grid"><section class="app-panel"><h3>콘텐츠 운영 로드맵</h3><div class="app-row"><span><strong>출근 전 10분 메이크업</strong><br><em>촬영 2편 · 편집 1편 · 업로드 금요일</em></span><strong>진행</strong></div><div class="app-row"><span><strong>기초 라인 비교 리뷰</strong><br><em>제품 수령 완료 · 가이드 검토</em></span><strong>준비</strong></div><div class="app-row"><span><strong>라이브 Q&A</strong><br><em>팬덤 반응 테스트</em></span><strong>예약</strong></div></section>${signalBoard(channels[1])}</div>
  `);
}

function renderAppPreview() {
  const content = document.querySelector("#appContent");
  const bottomNav = document.querySelector("#bottomNav");
  const sideNav = document.querySelector("#appSideNav");
  const drawerLinks = document.querySelector("#drawerLinks");
  if (!content) return;

  const tabs = appTabs[currentRole];
  const currentTabKey = tabs[currentAppTab]?.[1] || "home";
  const sideMarkup = tabs.map(([label, key], index) => `<div class="pc-nav-item"><button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${routeByKey[key]}">${label}</button>${navFlyout(label, key)}</div>`).join("");
  const bottomMarkup = tabs.map(([label, key], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${routeByKey[key]}">${label}</button>`).join("");
  if (bottomNav) bottomNav.innerHTML = bottomMarkup;
  if (sideNav) sideNav.innerHTML = sideMarkup;
  if (drawerLinks) drawerLinks.innerHTML = tabs.map(([label, key], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${routeByKey[key]}">${label} 이동</button>`).join("");

  const pageTitle = document.querySelector("#pcPageTitle");
  if (pageTitle) pageTitle.textContent = `${roles[currentRole].label} ${tabs[currentAppTab]?.[0] || "홈"}`;

  if (currentTabKey === "home") content.innerHTML = renderAppHome();
  if (currentTabKey === "analysis") content.innerHTML = renderAppAnalysis();
  if (currentTabKey === "campaign") content.innerHTML = renderAppCampaign();
  if (currentTabKey === "trade") content.innerHTML = renderAppTrade();
  if (currentTabKey === "invest") content.innerHTML = renderAppInvest();

  document.querySelectorAll("[data-app-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = Number(button.dataset.appTab);
      const nextUrl = button.dataset.pageUrl || routeByKey[tabs[next]?.[1]];
      if (nextUrl && next !== currentAppTab) {
        location.href = nextUrl;
        return;
      }
      currentAppTab = next;
      document.querySelector("#drawer")?.classList.remove("open");
      renderAppPreview();
    });
  });
  bindSimulator();
  bindWorkActions();
  bindAiSearch();
}

function bindWorkActions() {
  document.querySelectorAll("[data-work-action]").forEach((button) => {
    button.addEventListener("click", (event) => {
      const action = event.currentTarget.dataset.workAction;
      const channel = event.currentTarget.dataset.channel || channels[0].name;
      if (action === "close-modal") {
        document.querySelector(".recommend-modal")?.remove();
        return;
      }
      if (action === "close-detail") {
        document.querySelector(".channel-detail-modal")?.remove();
        return;
      }
      if (action === "clear-basket") {
        const role = currentRole === "investor" ? "investor" : "advertiser";
        workBasket = workBasket.filter((item) => item.role !== role);
        localStorage.setItem("youchi-work-basket", JSON.stringify(workBasket));
        renderAppPreview();
        return;
      }
      showRecommendationModal(channel, action);
      bindWorkActions();
      if (["basket", "proposal", "review", "partner"].includes(action)) {
        renderAppPreview();
        requestAnimationFrame(() => {
          const modal = document.querySelector(".recommend-modal");
          if (modal) document.body.appendChild(modal);
          bindWorkActions();
        });
      }
    });
  });
  document.querySelectorAll("[data-detail-channel]").forEach((button) => {
    button.addEventListener("click", () => {
      showChannelDetailModal(button.dataset.detailChannel);
      bindWorkActions();
    });
  });
}

function bindAiSearch() {
  const input = document.querySelector("#aiCreatorSearch");
  const button = document.querySelector("#aiSearchButton");
  const list = document.querySelector("#creatorSearchList");
  const count = document.querySelector("#aiResultCount");
  if (!input || !list) return;
  const render = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = channels
      .filter((channel) => {
        const text = `${channel.name} ${channel.category} ${channel.scale} ${channel.format} ${channel.desc}`.toLowerCase();
        return !query || query.split(/\s+/).some((token) => text.includes(token));
      })
      .sort((a, b) => brandFit(b) - brandFit(a))
      .slice(0, 10);
    list.innerHTML = filtered.map(searchResultRow).join("");
    if (count) count.textContent = `${filtered.length}개`;
    bindWorkActions();
  };
  input.addEventListener("input", render);
  button?.addEventListener("click", render);
  document.querySelectorAll("[data-ai-prompt]").forEach((prompt) => {
    prompt.addEventListener("click", () => {
      input.value = prompt.dataset.aiPrompt;
      render();
    });
  });
}

function bindSimulator() {
  const budget = document.querySelector("#budgetRange");
  const duration = document.querySelector("#durationRange");
  const results = document.querySelector("#simResults");
  if (!budget || !duration || !results) return;
  const update = () => {
    const b = Number(budget.value);
    const d = Number(duration.value);
    const impressions = b * 0.31 + d * 135000;
    const clicks = impressions * 0.047;
    const roi = 142 + d * 3.8;
    document.querySelector("#budgetOutput").textContent = krw(b);
    document.querySelector("#durationOutput").textContent = `${d}주`;
    results.innerHTML = `<div><span>예상 노출수</span><strong>${Math.round(impressions).toLocaleString("ko-KR")}회</strong></div><div><span>예상 클릭수</span><strong>${Math.round(clicks).toLocaleString("ko-KR")}회</strong></div><div><span>예상 ROI</span><strong>${roi.toFixed(1)}%</strong></div><div><span>예상 매출</span><strong>${krw((b * roi) / 100)}</strong></div>`;
  };
  budget.addEventListener("input", update);
  duration.addEventListener("input", update);
  update();
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
  renderAppPreview();
  document.querySelectorAll(".login-link").forEach((link) => {
    if (loggedIn && link.getAttribute("href") === "./login.html") {
      link.textContent = "내 계정";
      link.href = "./index.html";
    }
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
  location.href = "./index.html";
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

setRole(currentRole);
