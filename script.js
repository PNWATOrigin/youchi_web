const page = document.body.dataset.page || "home";
const pageDefaultRole = document.body.dataset.roleDefault || { creator: "creator", investment: "investor" }[page];
const pageSubpageTitle = document.body.dataset.subpageTitle || "";
const parsedDefaultTab = Number(document.body.dataset.tabDefault || 0);
let currentRole = pageDefaultRole || localStorage.getItem("youchi-role") || "advertiser";
let loggedIn = localStorage.getItem("youchi-logged-in") === "true";
let currentAppTab = Number.isFinite(parsedDefaultTab) ? parsedDefaultTab : 0;
let workBasket = JSON.parse(localStorage.getItem("youchi-work-basket") || "[]");
let dismissedReviewNames = JSON.parse(localStorage.getItem("youchi-review-dismissed") || "[]");

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
    ["협업 제안", "campaign"],
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

const submenuGroups = {
  advertiser: {
    home: [
      ["AI 검색", ["AI 유튜버 검색", "추천 프롬프트", "최근 검색 결과"]],
      ["빠른 실행", ["후보 장바구니", "브랜드 핏 워치리스트"]],
    ],
    analysis: [
      ["점수 분석", ["CIV·팬덤 비교", "브랜드 안전성", "광고핏 랭킹"]],
      ["데이터", ["최근 점수표", "정밀 카드", "채널 상세 팝업"]],
    ],
    campaign: [
      ["캠페인", ["성과 및 계약 관리", "예산 시뮬레이터", "완료 리포트"]],
      ["제안", ["제안 후보함", "일괄 제안", "성과 KPI 설정"]],
    ],
    trade: [
      ["매칭", ["AI 채널 매칭", "매칭 조건", "유사 채널 추천"]],
      ["액션", ["후보 담기", "제안 보내기", "추천 팝업"]],
    ],
  },
  creator: {
    home: [
      ["운영", ["채널 홈", "핵심 상태", "신규 협업"]],
      ["지표", ["CIV 요약", "팬덤 상태"]],
    ],
    analysis: [],
    campaign: [
      ["협업 제안", ["협업 제안"]],
    ],
    trade: [],
    invest: [
      ["채널 운영", ["CIV 목표", "협업 일정"]],
    ],
  },
  investor: {
    home: [],
    analysis: [],
    campaign: [
      ["마켓", ["마켓", "검토함"]],
    ],
    trade: [],
  },
};

const subpageRoutes = {
  advertiser: {
    "AI 유튜버 검색": "advertiser-ai-search.html",
    "추천 프롬프트": "advertiser-ai-prompts.html",
    "최근 검색 결과": "advertiser-recent-results.html",
    "후보 장바구니": "advertiser-cart.html",
    "브랜드 핏 워치리스트": "advertiser-brand-watchlist.html",
    "CIV·팬덤 비교": "advertiser-civ-fandom.html",
    "브랜드 안전성": "advertiser-brand-safety.html",
    "광고핏 랭킹": "advertiser-ad-fit.html",
    "최근 점수표": "advertiser-score-table.html",
    "정밀 카드": "advertiser-channel-cards.html",
    "채널 상세 팝업": "advertiser-channel-detail.html",
    "성과 및 계약 관리": "advertiser-campaign-status.html",
    "예산 시뮬레이터": "advertiser-budget-simulator.html",
    "완료 리포트": "advertiser-completed-reports.html",
    "제안 후보함": "advertiser-proposal-cart.html",
    "일괄 제안": "advertiser-bulk-proposal.html",
    "성과 KPI 설정": "advertiser-kpi-settings.html",
    "AI 채널 매칭": "advertiser-ai-matching.html",
    "매칭 조건": "advertiser-matching-conditions.html",
    "유사 채널 추천": "advertiser-similar-recommend.html",
    "후보 담기": "advertiser-add-candidate.html",
    "제안 보내기": "advertiser-send-proposal.html",
    "추천 팝업": "advertiser-recommend-popup.html",
  },
  creator: {
    "채널 홈": "creator-home.html",
    "핵심 상태": "creator-core-status.html",
    "신규 협업": "creator-new-collabs.html",
    "CIV 요약": "creator-civ-summary.html",
    "팬덤 상태": "creator-fandom-status.html",
    "CIV진단": "creator-civ-diagnosis.html",
    "협업 제안": "creator-offers.html",
    "수익 정산": "creator-settlement.html",
    "협업 일정": "creator-schedule.html",
    "CIV 목표": "creator-civ-goal.html",
  },
  investor: {
    "리포트": "investor-report.html",
    "마켓": "investor-market.html",
    "검토함": "investor-review-box.html",
    "파트너십": "investor-partnership.html",
  },
};

const fileRouteMeta = Object.entries(subpageRoutes).reduce((acc, [role, routeMap]) => {
  Object.entries(routeMap).forEach(([title, file]) => {
    let tabIndex = appTabs[role].findIndex(([, key]) => submenuGroups[role]?.[key]?.some(([, items]) => items.includes(title)));
    if (role === "creator" && title === "CIV진단") tabIndex = 1;
    if (role === "creator" && title === "협업 제안") tabIndex = 2;
    if (role === "creator" && title === "수익 정산") tabIndex = 3;
    if (role === "investor" && title === "리포트") tabIndex = 1;
    if (role === "investor" && title === "마켓") tabIndex = 2;
    if (role === "investor" && title === "검토함") tabIndex = 2;
    if (role === "investor" && title === "파트너십") tabIndex = 3;
    acc[file] = { role, title, tabIndex: Math.max(0, tabIndex) };
  });
  return acc;
}, {});

const currentFileName = decodeURIComponent(location.pathname.split("/").pop() || "index.html");
const currentFileMeta = fileRouteMeta[currentFileName];
const routedSubpageTitle = pageSubpageTitle || currentFileMeta?.title || "";
if (currentFileMeta) {
  currentRole = currentFileMeta.role;
  currentAppTab = currentFileMeta.tabIndex;
}

function subpageHref(role, key, item) {
  return subpageRoutes[role]?.[item] || `${routeByKey[key] || "index.html"}#${encodeURIComponent(item)}`;
}

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

const recentVideos = [
  { title: "출근 전 10분 메이크업 루틴", date: "2026.05.22", views: 384000, likes: 18600, comments: 1240, retention: 68, positive: 84, civLift: 4.8, topic: "루틴·제품 노출", summary: "광고 구간 이탈이 낮고 제품 언급 이후 저장 반응이 높습니다.", reactions: ["발색이 자연스럽다", "제품명 다시 알려달라", "출근 전 루틴으로 따라하기 좋다"] },
  { title: "여름 쿠션 5종 지속력 비교", date: "2026.05.18", views: 612000, likes: 29100, comments: 2130, retention: 74, positive: 88, civLift: 6.2, topic: "비교 리뷰", summary: "비교형 콘텐츠라 구매 의도 댓글이 많고 브랜드 안전성이 높습니다.", reactions: ["비교표가 좋다", "2번 제품 궁금하다", "광고여도 정보가 많다"] },
  { title: "민감성 피부 기초 루틴 Q&A", date: "2026.05.13", views: 221000, likes: 9800, comments: 860, retention: 63, positive: 79, civLift: 3.1, topic: "팬덤 Q&A", summary: "댓글 밀도가 높고 재방문 팬덤 반응이 안정적입니다.", reactions: ["질문 답변 고맙다", "피부 타입별 추천 좋다", "다음 Q&A 기다린다"] },
  { title: "올리브영 세일 장바구니 공개", date: "2026.05.07", views: 497000, likes: 24400, comments: 1790, retention: 70, positive: 82, civLift: 5.5, topic: "커머스 전환", summary: "장바구니형 영상이라 링크 클릭과 저장 반응이 높습니다.", reactions: ["같이 장바구니 담았다", "가격대 설명 좋다", "재구매템 궁금하다"] },
  { title: "메이크업 초보가 피해야 할 실수", date: "2026.04.30", views: 328000, likes: 17100, comments: 1120, retention: 66, positive: 81, civLift: 4.2, topic: "교육형 숏폼", summary: "초보 타깃 반응이 좋고 브랜드 협찬 전환에 적합합니다.", reactions: ["설명이 쉽다", "짧아서 보기 좋다", "제품 추천도 해달라"] },
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
  const groups = submenuGroups[currentRole]?.[key] || [];
  if (!groups.length) return "";
  return `<div class="nav-flyout"><strong>${label}</strong>${groups.map(([title, items]) => `<section><b>${title}</b>${items.map((item) => `<a href="./${subpageHref(currentRole, key, item)}">${item}</a>`).join("")}</section>`).join("")}</div>`;
}

function firstSubHref(key) {
  if (currentRole === "creator" && key === "trade") return "creator-settlement.html";
  if (currentRole === "creator" && key === "analysis") return "creator-civ-diagnosis.html";
  if (currentRole === "investor" && key === "home") return "investment.html";
  if (currentRole === "investor" && key === "analysis") return "investor-report.html";
  if (currentRole === "investor" && key === "campaign") return "investor-market.html";
  if (currentRole === "investor" && key === "trade") return "investor-partnership.html";
  const first = submenuGroups[currentRole]?.[key]?.[0]?.[1]?.[0];
  return first ? subpageHref(currentRole, key, first) : routeByKey[key] || "index.html";
}

function renderTopMenu() {
  const tabs = appTabs[currentRole];
  return `<nav class="top-mega-menu" aria-label="상단 주요 메뉴">
    <div class="top-role-tabs" aria-label="대분류">
      ${Object.entries(roles).map(([key, role]) => `<button class="${key === currentRole ? "active" : ""}" type="button" data-top-role="${key}">${role.label}</button>`).join("")}
    </div>
    <div class="top-mid-tabs" aria-label="중분류">
      ${tabs.map(([label, key], index) => `<div class="top-menu-item"><button class="${index === currentAppTab ? "active" : ""}" type="button" data-app-tab="${index}" data-page-url="${firstSubHref(key)}">${label}</button>${navFlyout(label, key)}</div>`).join("")}
    </div>
  </nav>`;
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

function campaignSearchRow(offer, index) {
  const [title, company, price, product, status] = offer;
  const fit = 91 - index * 3;
  const deadline = ["D-5", "D-9", "D-12", "D-18", "D-24"][index % 5];
  return `<article class="creator-search-row" data-search-name="${title}" data-search-category="${company}">
    <div class="creator-search-row__main">
      <div class="avatar">${company.slice(0, 1)}</div>
      <div>
        <strong>${title}</strong>
        <p>${company} · ${price} · ${product} · ${status}</p>
      </div>
    </div>
    <div class="latest-score-board">
      ${scorePill("적합", `${fit}%`)}
      ${scorePill("마감", deadline)}
      ${scorePill("검수", index % 2 ? "보통" : "빠름")}
      ${scorePill("브랜드", index % 2 ? "중견" : "대기업")}
    </div>
    <div class="creator-search-row__actions">
      <button class="secondary-button" type="button">조건 보기</button>
      <button class="primary-button" type="button">협업 검토</button>
    </div>
  </article>`;
}

function campaignSearchExperience(rows = creatorOffers) {
  return `<section class="ai-search-panel role-search-panel">
    <div class="ai-search-copy">
      <p class="eyebrow">YOUCHI AI Search</p>
      <h2>크리에이터용 캠페인·기업 검색</h2>
      <p>브랜드명, 제품군, 보상 조건, 촬영 가능 일정으로 협업 후보를 찾습니다. 모바일 앱보다 더 많은 계약 조건과 검수 상태를 한 번에 비교하는 PC용 검색입니다.</p>
    </div>
    <div class="ai-search-box">
      <span>AI</span>
      <input id="campaignSearchInput" placeholder="예: 뷰티 브랜드, 2주 안 촬영 가능, 현금 보상 캠페인" />
      <button id="campaignSearchButton" type="button">검색</button>
    </div>
    <div class="prompt-chip-row">
      <button data-campaign-prompt="현금 보상 확정 캠페인">현금 보상 확정</button>
      <button data-campaign-prompt="뷰티 브랜드 촬영 조건">뷰티 브랜드</button>
      <button data-campaign-prompt="검수 빠른 기업">검수 빠른 기업</button>
      <button data-campaign-prompt="제품 수령 필요 없는 협업">제품 수령 없음</button>
    </div>
  </section>
  <section class="app-panel search-results-panel">
    <div class="panel-title-row"><h3>캠페인·기업 검색 결과</h3><span id="campaignResultCount">${rows.length}건</span></div>
    <div class="creator-search-list" id="campaignSearchList">${rows.map(campaignSearchRow).join("")}</div>
  </section>`;
}

function investorSearchRow(channel) {
  return `<article class="creator-search-row" data-search-name="${channel.name}" data-search-category="${channel.category}">
    <div class="creator-search-row__main">
      <div class="avatar">${channel.category.slice(0, 1)}</div>
      <div>
        <strong>${channel.name}</strong>
        <p>${channel.category} · 구독자 ${compactCount(channel.subscribers)} · 월조회 ${compactCount(channel.monthlyViews)} · ${channel.desc}</p>
      </div>
    </div>
    <div class="latest-score-board">
      ${scorePill("마켓", marketScore(channel))}
      ${scorePill("CIV", channel.civ)}
      ${scorePill("팬덤", channel.fandom)}
      ${scorePill("위험", channel.brandSafety >= 85 ? "낮음" : "검토")}
      ${scorePill("가치", krw(channel.value))}
    </div>
    <div class="creator-search-row__actions">
      <button class="secondary-button" data-detail-channel="${channel.name}">상세 보기</button>
      <button class="primary-button" data-work-action="review" data-channel="${channel.name}">검토함 담기</button>
    </div>
  </article>`;
}

function investorSearchExperience(rows = channelsTop(10, (a, b) => marketScore(b) - marketScore(a))) {
  return `<section class="ai-search-panel role-search-panel">
    <div class="ai-search-copy">
      <p class="eyebrow">YOUCHI AI Search</p>
      <h2>투자자용 채널 검색</h2>
      <p>채널 매매, 인수, 파트너십 검토에 필요한 마켓 점수, CIV, 팬덤, 수익 추정, 권리 위험을 함께 봅니다.</p>
    </div>
    <div class="ai-search-box">
      <span>AI</span>
      <input id="investorChannelSearch" placeholder="예: 성장률 높은 IT 채널, 권리 리스크 낮음, 마켓 점수 100 이상" />
      <button id="investorSearchButton" type="button">검색</button>
    </div>
    <div class="prompt-chip-row">
      <button data-investor-prompt="마켓 점수 100 이상 채널">마켓 100+</button>
      <button data-investor-prompt="권리 리스크 낮은 채널">리스크 낮음</button>
      <button data-investor-prompt="성장률 높은 소형 채널">성장형 소형</button>
      <button data-investor-prompt="PPL 적합 채널">PPL 적합</button>
    </div>
  </section>
  <section class="app-panel search-results-panel">
    <div class="panel-title-row"><h3>채널 검색 결과</h3><span id="investorResultCount">${rows.length}건</span></div>
    <div class="creator-search-list" id="investorSearchList">${rows.map(investorSearchRow).join("")}</div>
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
        <label>나의 롤모델<select><option>올리브영 뷰티 런칭형</option><option>무신사 크리에이터 커머스형</option><option>토스 금융 신뢰형</option><option>쿠팡 장바구니 추천형</option><option>직접 만든 모델</option></select></label>
        <label>롤모델 유사도<input type="range" min="0" max="100" value="72" /></label>
        <label>제외 키워드<input value="논란, 과장광고, 미표기" /></label>
        <label>우선 제안 포맷<select><option>롱폼 1 + 숏폼 3</option><option>숏폼 테스트 5편</option><option>라이브 커머스 연계</option><option>리뷰형 단독 영상</option></select></label>
      </div>
      <div class="role-model-panel">
        <div><span>롤모델 기준</span><strong>브랜드 안전 35%</strong><em>전환 30% · 팬덤 20% · 단가 15%</em></div>
        <div><span>현재 추천 방향</span><strong>비교 리뷰형</strong><em>구매 의도 댓글과 저장률이 높은 채널 우선</em></div>
        <div><span>자동 보정</span><strong>활성</strong><em>후보 담기 이후 유사 크리에이터 추천에 반영</em></div>
      </div>
      <div class="settings-flags">
        <label><input type="checkbox" checked /> 숏폼 포함</label>
        <label><input type="checkbox" checked /> 독점 노출 협의</label>
        <label><input type="checkbox" /> 오프라인 행사 연계</label>
        <label><input type="checkbox" checked /> 댓글 리스크 자동 검수</label>
        <label><input type="checkbox" checked /> 롤모델 유사 채널 우선</label>
        <label><input type="checkbox" /> 경쟁사 협업 이력 제외</label>
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
    if (role === "investor") {
      dismissedReviewNames = dismissedReviewNames.filter((name) => name !== base.name);
      localStorage.setItem("youchi-review-dismissed", JSON.stringify(dismissedReviewNames));
    }
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

function creatorChannelAnalytics() {
  const channel = channels[1];
  return `<section class="creator-analytics-hero">
    <div class="creator-profile-card">
      <div class="creator-avatar">온</div>
      <div>
        <p class="eyebrow">Creator Channel Analytics</p>
        <h2>온유메이크업</h2>
        <p>기초 메이크업, 비교 리뷰, 출근 루틴 중심의 뷰티 채널입니다. 협찬 검수 안정성이 높고 댓글 기반 구매 의도 신호가 꾸준합니다.</p>
        <div class="creator-profile-actions">
          <button class="secondary-button" data-work-action="open-creator-search" type="button">캠페인 검색</button>
          <button class="primary-button" data-app-tab="1" type="button">CIV 진단</button>
        </div>
      </div>
    </div>
    <div class="creator-stat-grid">
      ${appCard("구독자", compactCount(channel.subscribers), "최근 90일 +" + pct(channel.growthRate))}
      ${appCard("누적 조회", compactCount(channel.monthlyViews * 18), "월 조회 " + compactCount(channel.monthlyViews))}
      ${appCard("평균 조회", number(channel.avgViews), "구독자 대비 " + ((channel.avgViews / channel.subscribers) * 100).toFixed(1) + "%")}
      ${appCard("업로드", "1.6편/주", "최근 5개 영상 기준")}
      ${appCard("참여율", "4.9%", "댓글 반응 높음")}
      ${appCard("CIV", channel.civ, "팬덤 " + channel.fandom)}
    </div>
  </section>`;
}

function recentVideoPanel() {
  return `<section class="app-panel recent-video-panel">
    <div class="panel-title-row"><h3>최근 유튜브 영상</h3><span>분석 가능한 최신 5개</span></div>
    <div class="video-list">${recentVideos.map((video, index) => `<article class="video-row">
      <div class="video-thumb"><span>${index + 1}</span></div>
      <div class="video-main">
        <strong>${video.title}</strong>
        <p>${video.date} · ${video.topic} · 조회 ${compactCount(video.views)} · 좋아요 ${compactCount(video.likes)} · 댓글 ${number(video.comments)}</p>
        <div class="video-metrics">
          ${scorePill("유지율", `${video.retention}%`)}
          ${scorePill("긍정", `${video.positive}%`)}
          ${scorePill("CIV+", video.civLift)}
        </div>
      </div>
      <button class="secondary-button" data-video-detail="${index}" type="button">상세 분석</button>
    </article>`).join("")}</div>
  </section>`;
}

function showVideoDetailModal(index) {
  const video = recentVideos[Number(index)] || recentVideos[0];
  document.querySelector(".video-detail-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="video-detail-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-video-detail"></div>
    <div class="channel-detail-modal__panel">
      <div class="panel-title-row">
        <div><p class="eyebrow">Video Analysis</p><h2>${video.title}</h2><p class="modal-lead">${video.date} · ${video.topic}</p></div>
        <button class="icon-button" data-work-action="close-video-detail" aria-label="닫기">×</button>
      </div>
      <div class="detail-summary-grid">
        ${scorePill("조회", compactCount(video.views))}
        ${scorePill("좋아요", compactCount(video.likes))}
        ${scorePill("댓글", number(video.comments))}
        ${scorePill("유지율", `${video.retention}%`)}
        ${scorePill("긍정 반응", `${video.positive}%`)}
        ${scorePill("CIV 상승", `+${video.civLift}`)}
      </div>
      <div class="detail-layout">
        <section class="chart-card"><div class="panel-title-row"><h3>영상 반응 분석</h3><span>조회·댓글·저장 신호</span></div><div class="signal-grid"><div><span>초반 이탈 방어</span><strong>${video.retention}</strong><i style="--bar:${video.retention}%"></i></div><div><span>구매 의도 댓글</span><strong>${Math.round(video.positive * 0.62)}</strong><i style="--bar:${Math.round(video.positive * 0.62)}%"></i></div><div><span>협찬 적합</span><strong>${Math.round((video.positive + video.retention) / 2)}</strong><i style="--bar:${Math.round((video.positive + video.retention) / 2)}%"></i></div></div><p>${video.summary}</p></section>
        <section class="app-panel"><h3>댓글 반응</h3>${video.reactions.map((reaction) => `<div class="app-row"><span>${reaction}</span><strong>긍정</strong></div>`).join("")}</section>
      </div>
      <div class="detail-layout">
        <section class="app-panel"><h3>광고주 제안 포인트</h3><div class="app-row"><span>권장 캠페인 유형</span><strong>${video.topic}</strong></div><div class="app-row"><span>추천 노출 위치</span><strong>초반 35초 이후</strong></div><div class="app-row"><span>브랜드 안전성</span><strong>높음</strong></div></section>
        <section class="app-panel"><h3>다음 액션</h3><div class="button-row"><button class="secondary-button" data-work-action="open-creator-search">유사 캠페인 검색</button><button class="primary-button" data-app-tab="2">협업 제안 보기</button></div></section>
      </div>
    </div>
  </div>`);
}

function creatorSearchLauncher() {
  if (currentRole !== "creator") return "";
  return `<button class="floating-search-button" data-work-action="open-creator-search" type="button" aria-label="크리에이터 검색 열기"><span></span></button>`;
}

function creatorRoleModelPanel() {
  return `<section class="app-panel creator-model-panel">
    <div class="panel-title-row"><h3>나의 롤모델 설정</h3><span>CIV 비교 기준</span></div>
    <div class="settings-grid">
      <label>롤모델 유튜버<input value="회사원A" /></label>
      <label>비교 방식<select><option>뷰티 리뷰형</option><option>숏폼 성장형</option><option>커머스 전환형</option><option>팬덤 커뮤니티형</option></select></label>
      <label>비교 가중치<select><option>CIV 40 / 팬덤 30 / 조회 30</option><option>팬덤 우선</option><option>광고 안정성 우선</option></select></label>
      <label>비교 기간<select><option>최근 6개월</option><option>최근 3개월</option><option>최근 12개월</option></select></label>
    </div>
    <div class="button-row"><button class="secondary-button" type="button">롤모델 추가</button><button class="primary-button" type="button">롤모델과 비교</button></div>
  </section>`;
}

function creatorCivTrendPanel() {
  const channel = channels[1];
  const history = channelHistory(channel);
  const roleModel = history.map((point, index) => ({
    ...point,
    civ: Math.min(98, point.civ + 4 + index),
    fandom: Math.min(98, point.fandom + 3),
  }));
  return `<section class="app-panel">
    <div class="panel-title-row"><h3>점수 추세</h3><span>최근 6개월 · 롤모델 비교</span></div>
    <div class="detail-layout">
      <section class="chart-card"><div class="panel-title-row"><h3>내 채널 CIV</h3><span>현재 ${channel.civ}</span></div>${sparkline(history, "civ", "#727bee")}</section>
      <section class="chart-card"><div class="panel-title-row"><h3>롤모델 CIV</h3><span>목표 95</span></div>${sparkline(roleModel, "civ", "#16a34a")}</section>
    </div>
  </section>`;
}

function creatorAiAnalysisPanel(mode = "diagnosis") {
  const copy = {
    diagnosis: ["왜 이 점수가 나왔는지", "최근 비교 리뷰 영상의 댓글 긍정률은 높지만 업로드 간격이 흔들려 성장성 점수가 일부 깎였습니다. 롤모델 대비 부족한 부분은 월간 반복 포맷과 고정 업로드 슬롯입니다."],
    goal: ["목표 CIV 95 달성 AI 분석", "현재 CIV 87에서 95까지 올리려면 팬덤 반복 시청과 조회 성장성을 동시에 올려야 합니다. 비교 리뷰 2편, Q&A 1편, 숏폼 리마인드 3편을 4주 안에 묶는 플랜이 가장 효율적입니다."],
    action: ["AI 개선 제안", "롤모델 채널은 제품 비교표와 고정 댓글 링크 전환이 강합니다. 온유메이크업은 댓글 신뢰도는 좋으므로 영상 말미 CTA와 쇼츠 재활용 비중을 올리면 CIV 상승 속도가 빨라집니다."],
  }[mode] || ["AI 분석", "채널 운영 데이터를 기준으로 다음 액션을 정리했습니다."];
  return `<section class="app-panel ai-insight-panel">
    <div class="panel-title-row"><h3>${copy[0]}</h3><span>YOUCHI AI</span></div>
    <p>${copy[1]}</p>
    <div class="ai-action-grid">
      <div><span>1주차</span><strong>비교 리뷰 업로드</strong><em>CIV +1.8 예상</em></div>
      <div><span>2주차</span><strong>댓글 Q&A 수집</strong><em>팬덤 +2.1 예상</em></div>
      <div><span>3주차</span><strong>숏폼 3편 재가공</strong><em>조회 성장 +3.4 예상</em></div>
      <div><span>4주차</span><strong>협찬 가이드 정리</strong><em>안전성 유지</em></div>
    </div>
  </section>`;
}

function creatorCivDiagnosisView(title = "CIV진단") {
  return pageShell(`${subpageHead(roles.creator.label, "CIV진단", "정밀 점수판, 롤모델 비교, 점수 추세를 한 화면에서 확인합니다.")}<div class="pc-analysis-grid">${signalBoard(channels[1])}${creatorRoleModelPanel()}</div><section class="app-panel civ-reason-panel"><h3>왜 이 점수가 나왔는지</h3><p>YOUCHI AI는 최근 비교 리뷰 영상의 댓글 긍정률과 저장 반응을 높게 평가했습니다. 다만 업로드 간격이 일정하지 않아 성장성 점수가 일부 낮아졌고, 롤모델 채널 대비 고정 코너 반복성이 부족하다고 판단했습니다.</p></section>${creatorCivTrendPanel()}`);
}

function creatorOfferRows() {
  return creatorOffers.map(([title, company, price, product, status], index) => ({
    title,
    company,
    price,
    product,
    status,
    deadline: ["2026.06.03", "2026.06.08", "2026.06.12", "2026.06.16", "2026.06.22"][index],
    format: ["롱폼 1편 + 숏폼 2편", "릴스 3편", "롱폼 리뷰 1편", "사용기 2편", "시리즈 8편"][index],
    requirement: ["제품 사용 전후 비교", "민감성 피부 테스트", "브랜드 가이드 준수", "헤어 스타일링 장면 포함", "출근 루틴 자연 노출"][index],
    deliverable: ["초안 1회 검수 · 제품 링크 고정 댓글", "피부 타입별 전후컷 포함 · 릴스 썸네일 제공", "브랜드 키 메시지 3개 포함 · 노출 시간 60초 이상", "사용법 데모 · 헤어 전후 비교컷", "출근 루틴 시리즈 내 자연 삽입 · 주 2회 업로드"][index],
    contact: ["김서연 BM", "박민지 AE", "최유라 브랜드 매니저", "정도윤 캠페인 리드", "오하린 파트너 매니저"][index],
    received: ["2026.05.28 10:20", "2026.05.27 16:45", "2026.05.26 09:10", "2026.05.24 14:30", "2026.05.22 11:05"][index],
  }));
}

function creatorOfferBoard() {
  const rows = creatorOfferRows();
  return pageShell(`${subpageHead(roles.creator.label, "협업 제안", "광고주가 보낸 제안을 확인하고, 상세 조건을 보고 수락하거나 거절하는 화면입니다.")}
    <section class="offer-workbench">
      <div class="offer-list-panel">
        <div class="panel-title-row"><h3>받은 제안</h3><span>${rows.length}건</span></div>
        ${rows.map((offer, index) => `<article class="offer-card ${index === 0 ? "active" : ""}">
          <div><strong>${offer.title}</strong><p>${offer.company} · ${offer.price} · ${offer.status}</p></div>
          <span>${offer.deadline}</span>
        </article>`).join("")}
      </div>
      <div class="offer-detail-panel">
        <div class="panel-title-row"><h3>협업 제안</h3><span>상세보기로 조건 확인</span></div>
        ${rows.map((offer, index) => `<article class="offer-detail-card">
          <div class="offer-detail-head"><div><strong>${offer.title}</strong><p>${offer.company}</p></div><b>${offer.status}</b></div>
          <div class="offer-detail-grid">
            <div><span>제안 금액</span><strong>${offer.price}</strong></div>
            <div><span>제품</span><strong>${offer.product}</strong></div>
            <div><span>콘텐츠 형식</span><strong>${offer.format}</strong></div>
            <div><span>업로드 마감</span><strong>${offer.deadline}</strong></div>
          </div>
          <p>${offer.requirement}</p>
          <div class="button-row"><button class="secondary-button" type="button" data-offer-detail="${index}">상세보기</button><button class="danger-button" type="button">제안 거절</button><button class="primary-button" type="button">제안 받기</button></div>
        </article>`).join("")}
      </div>
    </section>`);
}

function showOfferDetailModal(index = 0) {
  const offer = creatorOfferRows()[Number(index)] || creatorOfferRows()[0];
  document.querySelector(".offer-detail-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="offer-detail-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-offer-detail"></div>
    <div class="channel-detail-modal__panel">
      <div class="panel-title-row">
        <div><p class="eyebrow">Collaboration Offer</p><h2>${offer.title}</h2><p class="modal-lead">${offer.company}에서 보낸 협업 제안 상세 조건입니다.</p></div>
        <button class="icon-button" data-work-action="close-offer-detail" aria-label="닫기">×</button>
      </div>
      <div class="offer-detail-grid offer-modal-summary">
        <div><span>제안 회사</span><strong>${offer.company}</strong></div>
        <div><span>담당자</span><strong>${offer.contact}</strong></div>
        <div><span>제품</span><strong>${offer.product}</strong></div>
        <div><span>제안 금액</span><strong>${offer.price}</strong></div>
        <div><span>받은 시간</span><strong>${offer.received}</strong></div>
        <div><span>마감일</span><strong>${offer.deadline}</strong></div>
        <div><span>콘텐츠 형식</span><strong>${offer.format}</strong></div>
        <div><span>현재 상태</span><strong>${offer.status}</strong></div>
      </div>
      <section class="app-panel offer-modal-brief"><h3>요청 내용</h3><p>${offer.requirement}</p><p>${offer.deliverable}</p></section>
      <div class="button-row modal-actions"><button class="danger-button" type="button">제안 거절</button><button class="secondary-button" type="button">조건 협의</button><button class="primary-button" type="button">제안 받기</button></div>
    </div>
  </div>`);
}

function creatorCivGoalView() {
  return pageShell(`${subpageHead(roles.creator.label, "CIV 목표", "목표치를 직접 입력하고, 목표 달성에 필요한 AI 실행안을 확인합니다.")}<section class="app-panel civ-goal-editor"><div class="panel-title-row"><h3>목표치 입력</h3><span>임의 목표 95점</span></div><div class="settings-grid"><label>현재 CIV<input value="87" readonly /></label><label>목표 CIV<input id="creatorCivGoalInput" type="number" value="95" min="70" max="100" /></label><label>달성 기간<select><option>4주</option><option>8주</option><option>12주</option></select></label><label>우선 전략<select><option>팬덤과 조회 성장 동시 개선</option><option>댓글 반응 우선</option><option>협찬 안전성 우선</option></select></label></div></section>${signalBoard(channels[1])}${creatorAiAnalysisPanel("goal")}${denseScoreTable([channels[1], channels[0], channels[2], channels[7]], "creator")}`);
}

function creatorScheduleBoard(title = "협업 일정") {
  const items = [
    ["협의중", "올리브영 기초 라인", "05.28", "06.03", "#727bee"],
    ["진행중", "여름 쿠션 비교 리뷰", "06.01", "06.14", "#16a34a"],
    ["촬영", "다이슨 스타일러", "06.05", "06.09", "#f59e0b"],
    ["편집", "출근 메이크업 시즌 3", "06.10", "06.18", "#ec4899"],
    ["업로드", "민감성 피부 Q&A", "06.16", "06.21", "#06b6d4"],
  ];
  return pageShell(`${subpageHead(roles.creator.label, title, "협업을 받은 날짜부터 업로드 마감일까지 한눈에 보이도록 일정형 보드로 정리했습니다.")}<section class="schedule-board">
    <div class="schedule-side">
      <div class="schedule-status-card"><span>협의중 일정</span><strong>2건</strong><em>조건 조율 필요</em></div>
      <div class="schedule-status-card active"><span>진행중 일정</span><strong>3건</strong><em>촬영·편집 진행</em></div>
      <div class="schedule-status-card"><span>마감 임박</span><strong>1건</strong><em>06.09 촬영본 제출</em></div>
      <div class="schedule-status-card"><span>업로드 예정</span><strong>2건</strong><em>다음 2주 안</em></div>
    </div>
    <div class="schedule-timeline">
      <div class="timeline-head">${["05.28", "06.01", "06.05", "06.10", "06.14", "06.18", "06.21"].map((day) => `<span>${day}</span>`).join("")}</div>
      ${items.map(([status, name, start, end, color], index) => `<div class="timeline-row"><span><b>${status}</b>${name}</span><div class="timeline-track"><i style="--start:${index * 9 + 4}%;--width:${34 + index * 5}%;--bar:${color}"><em>${start} → ${end}</em></i></div></div>`).join("")}
    </div>
  </section>`);
}

function investorReportView(title = "리포트") {
  const owned = channelsTop(8, (a, b) => b.value - a.value);
  const revenue = owned.slice(0, 5).map((channel, index) => ({
    channel,
    adRevenue: channel.rateMax * (6 + index),
    share: 12 + index * 3,
    valuationDelta: [8.4, 6.1, 4.8, -1.2, 3.6][index],
  }));
  return pageShell(`
    ${subpageHead(roles.investor.label, title, "데이터 기반의 자산 가치 변화 분석, 채널별 광고 수익과 배분 현황을 확인합니다.")}
    <section class="app-hero-card"><div><span>Asset Report</span><h2>내 투자 채널 리포트</h2><p>보유 중인 채널 IP의 가치, 광고 수익, 배분 예정 금액, 권리 위험을 한 화면에서 검토합니다.</p></div><div class="score-row">${scorePill("평가액", "₩ 42.7억")}${scorePill("월 광고 수익", "₩ 2.8억")}${scorePill("배분 예정", "₩ 6,420만")}</div></section>
    <div class="pc-work-grid">
      <section class="app-panel"><h3>자산 가치 변화</h3>${revenue.map(({ channel, valuationDelta }) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>${channel.category} · 구독자 ${compactCount(channel.subscribers)} · 현재 가치 ${krw(channel.value)}</em></span><strong>${valuationDelta > 0 ? "+" : ""}${valuationDelta}%</strong></div>`).join("")}</section>
      <section class="app-panel"><h3>광고 수익 배분</h3>${revenue.map(({ channel, adRevenue, share }) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>최근 광고 수익 ${krw(adRevenue)} · 보유 권리 ${share}%</em></span><strong>${krw(adRevenue * share / 100)}</strong></div>`).join("")}</section>
    </div>
    <section class="app-panel"><h3>리스크 메모</h3><div class="result-grid"><div><span>권리 서류 정상</span><strong>6건</strong></div><div><span>수익 배분 검수</span><strong>2건</strong></div><div><span>가격 재평가 필요</span><strong>1건</strong></div></div></section>
    ${denseScoreTable(owned, "investor")}
  `);
}

function investorMarketView(title = "마켓") {
  const market = channelsTop(15, (a, b) => marketScore(b) - marketScore(a));
  return pageShell(`
    ${subpageHead(roles.investor.label, title, "신규 우량 자산인 채널 IP를 발굴하고, CIV 데이터 기반의 공정 가격으로 채널 거래를 검토합니다.")}
    ${investorSearchExperience(market.slice(0, 10))}
    <section class="app-panel"><h3>검색 이후 매매 검토</h3><div class="result-grid"><div><span>검토함 담기</span><strong>후보 저장</strong></div><div><span>가격 산정</span><strong>CIV 기반</strong></div><div><span>인수 리포트</span><strong>즉시 생성</strong></div></div></section>
    ${detailedSettings("investor")}
    ${basketPanel("investor")}
    <section class="app-panel"><h3>마켓 필터</h3><div class="filter-grid"><select><option>전체 카테고리</option><option>뷰티</option><option>IT</option><option>게임</option><option>경제</option></select><select><option>전체 규모</option><option>소형</option><option>중형</option><option>대형</option></select><select><option>전체 가격대</option><option>3억 이하</option><option>3억~10억</option><option>10억 이상</option></select><input placeholder="채널명 검색" /></div></section>
    ${denseScoreTable(market, "investor")}
    <h3 class="app-section-title">인수 검토 카드</h3><div class="channel-grid">${market.slice(0, 9).map((channel) => channelCard(channel, "investor")).join("")}</div>
  `);
}

function investorReviewChannels() {
  const names = workBasket
    .filter((item) => item.role === "investor")
    .map((item) => item.name);
  const fallback = ["온유메이크업", "개발자준", "FPS훈이", "혼밥대장"];
  return [...new Set([...names, ...fallback])]
    .filter((name) => !dismissedReviewNames.includes(name))
    .map((name) => channels.find((channel) => channel.name === name))
    .filter(Boolean)
    .slice(0, 8);
}

function investorComparisonMarkup(leftName, rightName) {
  const left = channels.find((channel) => channel.name === leftName) || investorReviewChannels()[0] || channels[0];
  const right = channels.find((channel) => channel.name === rightName) || investorReviewChannels()[1] || channels[1];
  const rows = [
    ["CIV 점수", left.civ, right.civ],
    ["팬덤 점수", left.fandom, right.fandom],
    ["구독자 수", compactCount(left.subscribers), compactCount(right.subscribers)],
    ["월 조회수", compactCount(left.monthlyViews), compactCount(right.monthlyViews)],
    ["마켓 점수", marketScore(left), marketScore(right)],
    ["추정 가치", krw(left.value), krw(right.value)],
    ["예상 ROI", pct(left.roi), pct(right.roi)],
  ];
  return `<div class="comparison-board">
    <div class="comparison-head"><div><strong>${left.name}</strong><span>${left.category} · ${left.scale}</span></div><b>VS</b><div><strong>${right.name}</strong><span>${right.category} · ${right.scale}</span></div></div>
    ${rows.map(([label, a, b]) => `<div class="comparison-row"><span>${label}</span><strong>${a}</strong><strong>${b}</strong></div>`).join("")}
  </div>`;
}

function investorReviewBoxView(title = "검토함") {
  const reviewed = investorReviewChannels();
  const first = reviewed[0] || channels[0];
  const second = reviewed[1] || channels[1];
  const compareBlock = reviewed.length >= 2
    ? `<div class="compare-selectors">
          <label>채널 A<select id="compareChannelA">${reviewed.map((channel) => `<option ${channel.name === first.name ? "selected" : ""}>${channel.name}</option>`).join("")}</select></label>
          <label>채널 B<select id="compareChannelB">${reviewed.map((channel) => `<option ${channel.name === second.name ? "selected" : ""}>${channel.name}</option>`).join("")}</select></label>
        </div>
        <div id="investorComparisonPanel">${investorComparisonMarkup(first.name, second.name)}</div>`
    : `<p>비교하려면 검토함에 채널을 2개 이상 담아야 합니다.</p>`;
  return pageShell(`
    ${subpageHead(roles.investor.label, title, "검토함에 담은 크리에이터 채널을 매매 후보로 관리하고, 2개 채널을 직접 비교합니다.")}
    <section class="app-hero-card"><div><span>Review Box</span><h2>채널 매매 검토함</h2><p>마켓에서 담은 후보를 보고 매매 검토를 진행하거나 목록에서 제거합니다. 선택한 2개 채널은 CIV, 팬덤, 구독자 수 기준으로 나란히 비교합니다.</p></div><div class="score-row">${scorePill("검토 후보", `${reviewed.length}개`)}${scorePill("비교 기준", "7개")}${scorePill("추천 액션", "매매 검토")}</div></section>
    <div class="pc-work-grid review-workspace">
      <section class="app-panel">
        <div class="panel-title-row"><h3>검토함 목록</h3><span>${reviewed.length}개 채널</span></div>
        <div class="review-list">${reviewed.map((channel) => `<article class="review-channel-card">
          <div><strong>${channel.name}</strong><p>${channel.category} · ${compactCount(channel.subscribers)} · CIV ${channel.civ} · 팬덤 ${channel.fandom} · 가치 ${krw(channel.value)}</p></div>
          <div class="button-row"><button class="secondary-button" type="button" data-work-action="remove-review" data-channel="${channel.name}">목록에서 지우기</button><button class="primary-button" type="button" data-work-action="trade-review" data-channel="${channel.name}">매매 검토</button></div>
        </article>`).join("")}</div>
      </section>
      <section class="app-panel">
        <div class="panel-title-row"><h3>2개 채널 비교</h3><span>CIV · 팬덤 · 구독자</span></div>
        ${compareBlock}
      </section>
    </div>
  `);
}

function showTradeReviewModal(channelName) {
  const channel = channels.find((item) => item.name === channelName) || channels[0];
  document.querySelector(".recommend-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="recommend-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-modal"></div>
    <div class="recommend-modal__panel">
      <div class="panel-title-row"><div><p class="eyebrow">Trade Review</p><h2>${channel.name} 매매 검토</h2></div><button class="icon-button" data-work-action="close-modal" aria-label="닫기">×</button></div>
      <p class="modal-lead">CIV, 팬덤, 구독자 성장, 광고 수익 추정치 기준으로 채널 IP 매매를 검토합니다.</p>
      <div class="recommend-summary">${scorePill("CIV", channel.civ)}${scorePill("팬덤", channel.fandom)}${scorePill("구독자", compactCount(channel.subscribers))}${scorePill("공정가", krw(channel.value))}</div>
      <section class="app-panel"><h3>검토 결론</h3><p>성장성과 팬덤 점수가 안정적이어서 부분 권리 인수 또는 장기 수익 배분 계약 검토에 적합합니다. 최종 매매 전 최근 90일 광고 수익 증빙과 저작권 권리 범위를 확인해야 합니다.</p></section>
      <div class="button-row modal-actions"><button class="secondary-button" data-work-action="close-modal">보류</button><button class="danger-button" type="button">매매 제외</button><button class="primary-button" type="button" data-work-action="confirm-trade-review" data-channel="${channel.name}">매매 검토 진행</button></div>
    </div>
  </div>`);
}

function showToast(message) {
  document.querySelector(".work-toast")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="work-toast" role="status">${message}</div>`);
  window.setTimeout(() => document.querySelector(".work-toast")?.remove(), 2600);
}

function investorPartnershipView(title = "파트너십") {
  const partners = channelsTop(8, (a, b) => ((b.growth + b.adFit + b.brandSafety) - (a.growth + a.adFit + a.brandSafety)));
  const steps = ["공동 PPL 패키지 설계", "분기별 콘텐츠 로드맵 협의", "수익 배분 조건 갱신", "브랜드 공동 제안서 발송"];
  return pageShell(`
    ${subpageHead(roles.investor.label, title, "협력 채널과의 동반 성장 로드맵 및 소통을 관리합니다.")}
    <section class="app-hero-card"><div><span>Partnership Desk</span><h2>협력 중인 채널 관리</h2><p>이미 협력 중인 채널의 성장 목표, 다음 미팅, PPL 적합도, 공동 제안 진행 상태를 관리합니다.</p></div><div class="score-row">${scorePill("협력 채널", "8건")}${scorePill("진행 로드맵", "12개")}${scorePill("이번 주 미팅", "4건")}</div></section>
    <div class="pc-work-grid">
      <section class="app-panel"><h3>협력 채널 리스트</h3>${partners.slice(0, 6).map((channel, index) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>${channel.category} · 성장 ${channel.growth} · PPL 적합 ${channel.adFit} · 다음 미팅 06.${10 + index}</em></span><strong>${index < 2 ? "진행중" : "관리중"}</strong></div>`).join("")}</section>
      <section class="app-panel"><h3>동반 성장 로드맵</h3>${steps.map((step, index) => `<div class="app-row"><span><strong>${step}</strong><br><em>${partners[index]?.name || partners[0].name} · 담당자 확인 필요</em></span><strong>${["협의", "진행", "검토", "대기"][index]}</strong></div>`).join("")}</section>
    </div>
    <section class="app-panel"><h3>소통 도구</h3><div class="filter-grid"><select><option>전체 협력 채널</option>${partners.slice(0, 5).map((channel) => `<option>${channel.name}</option>`).join("")}</select><select><option>로드맵 미팅</option><option>수익 배분 협의</option><option>PPL 공동 제안</option></select><input placeholder="메시지 제목" /><button class="primary-button" type="button">협력 채널에 보내기</button></div></section>
    ${denseScoreTable(partners, "investor")}
  `);
}

function showCreatorSearchModal() {
  document.querySelector(".creator-search-modal")?.remove();
  document.body.insertAdjacentHTML("beforeend", `<div class="creator-search-modal open" role="dialog" aria-modal="true">
    <div class="recommend-modal__backdrop" data-work-action="close-creator-search"></div>
    <div class="creator-search-modal__panel">
      <div class="panel-title-row">
        <div><p class="eyebrow">Creator Search Engine</p><h2>캠페인·기업 검색</h2><p class="modal-lead">크리에이터 화면에서는 검색기를 업무 화면과 분리해서 오른쪽 하단 도구로 띄웁니다.</p></div>
        <button class="icon-button" data-work-action="close-creator-search" aria-label="닫기">×</button>
      </div>
      ${campaignSearchExperience()}
    </div>
  </div>`);
  bindCampaignSearch();
  bindWorkActions();
}

function pageShell(content) {
  return `<div class="app-scroll">${content}</div>${creatorSearchLauncher()}`;
}

function renderFocusedSubpage(title) {
  const normalized = title || appTabs[currentRole]?.[currentAppTab]?.[0] || "홈";
  const roleName = roles[currentRole].label;
  const focusChannel = channelsTop(1, (a, b) => brandFit(b) - brandFit(a))[0];

  if (currentRole === "advertiser") {
    if (normalized === "AI 유튜버 검색") return pageShell(`${subpageHead(roleName, normalized, "광고주 홈의 핵심 검색 화면입니다. 최근 점수만 먼저 보고 상세 팝업에서 과거 추세를 확인합니다.")}${aiSearchExperience(channelsTop(10, (a, b) => brandFit(b) - brandFit(a)))}`);
    if (normalized === "추천 프롬프트") return pageShell(`${subpageHead(roleName, normalized, "자주 쓰는 AI 검색식을 저장해 광고주 팀 단위로 반복 검색합니다.")}${aiSearchExperience(channelsTop(6, (a, b) => b.growth - a.growth))}<section class="app-panel"><h3>저장 프롬프트</h3>${["20대 여성 뷰티, 숏폼 중심, 브랜드 안전성 85 이상", "B2B SaaS 리뷰 가능, IT 카테고리, 평균 조회 10만 이상", "저예산 테스트용 소형 채널, 성장률 20% 이상", "먹방 프랜차이즈 PPL, ROI 150% 이상"].map((text) => `<div class="app-row"><span>${text}</span><strong>실행</strong></div>`).join("")}</section>`);
    if (normalized === "최근 검색 결과") return pageShell(`${subpageHead(roleName, normalized, "최근 AI 검색에서 나온 후보를 다시 열어 제안과 후보 담기를 이어갑니다.")}<section class="app-panel"><h3>최근 검색 세션</h3>${["뷰티 성장형 소형 채널", "브랜드 안전성 높은 IT 리뷰어", "ROI 높은 먹방 채널", "금융 앱 캠페인 후보"].map((item, index) => `<div class="app-row"><span><strong>${item}</strong><br><em>${index + 2}시간 전 · 후보 ${6 + index}건</em></span><strong>다시 열기</strong></div>`).join("")}</section>${denseScoreTable(channelsTop(8, (a, b) => brandFit(b) - brandFit(a)), "advertiser")}`);
    if (["후보 장바구니", "제안 후보함", "후보 담기"].includes(normalized)) return pageShell(`${subpageHead(roleName, normalized, "후보를 담으면 비슷한 유튜버가 팝업으로 추천되고, 여기에서 일괄 제안으로 이어집니다.")}${basketPanel("advertiser")}<div class="channel-grid">${channelsTop(6, (a, b) => brandFit(b) - brandFit(a)).map((channel) => channelCard(channel, "advertiser")).join("")}</div>`);
    if (["브랜드 핏 워치리스트", "광고핏 랭킹"].includes(normalized)) return pageShell(`${subpageHead(roleName, normalized, "브랜드 핏, 광고 적합, 안전성, ROI를 정렬해서 후보를 좁힙니다.")}${denseScoreTable(channelsTop(12, (a, b) => brandFit(b) - brandFit(a)), "advertiser")}`);
    if (normalized === "CIV·팬덤 비교") {
      const rows = channelsTop(8, (a, b) => (b.civ + b.fandom) - (a.civ + a.fandom));
      return pageShell(`${subpageHead(roleName, normalized, "CIV와 팬덤 강도를 같이 보면서 광고 후 반응이 유지될 채널을 비교합니다.")}${ticker(rows)}${denseScoreTable(rows, "advertiser")}<div class="pc-analysis-grid">${signalBoard(rows[0])}${signalBoard(rows[1])}</div>`);
    }
    if (normalized === "브랜드 안전성") {
      const safe = channels.filter((channel) => channel.brandSafety >= 84).sort((a, b) => b.brandSafety - a.brandSafety);
      return pageShell(`${subpageHead(roleName, normalized, "협업 전 논란 위험, 카테고리 적합성, 검수 필요도를 따로 보는 화면입니다.")}<section class="app-panel"><h3>안전성 기준</h3><div class="result-grid"><div><span>안전성 90+</span><strong>${safe.filter((c) => c.brandSafety >= 90).length}건</strong></div><div><span>검수 필요</span><strong>${channels.filter((c) => c.brandSafety < 80).length}건</strong></div><div><span>즉시 제안</span><strong>${safe.length}건</strong></div></div></section>${denseScoreTable(safe, "advertiser")}`);
    }
    if (normalized === "최근 점수표") return pageShell(`${subpageHead(roleName, normalized, "CIV, 팬덤, 성장, 안전성, ROI를 주식 호가창처럼 촘촘하게 봅니다.")}${denseScoreTable(channelsTop(15, (a, b) => brandFit(b) - brandFit(a)), "advertiser")}`);
    if (normalized === "정밀 카드") return pageShell(`${subpageHead(roleName, normalized, "테이블보다 설명과 액션이 많은 카드형 후보 검토 화면입니다.")}<div class="channel-grid">${channelsTop(12, (a, b) => brandFit(b) - brandFit(a)).map((channel) => channelCard(channel, "advertiser")).join("")}</div>`);
    if (["채널 상세 팝업", "추천 팝업"].includes(normalized)) return pageShell(`${subpageHead(roleName, normalized, "상세 보기와 후보 담기 후 뜨는 추천 팝업을 바로 테스트합니다.")}<section class="app-panel"><h3>팝업 테스트 후보</h3>${channelsTop(6, (a, b) => brandFit(b) - brandFit(a)).map((channel) => `<div class="app-row"><span><strong>${channel.name}</strong><br><em>CIV ${channel.civ} · 팬덤 ${channel.fandom} · ROI ${pct(channel.roi)}</em></span><span class="button-row"><button class="secondary-button" data-detail-channel="${channel.name}">상세 보기</button><button class="primary-button" data-work-action="basket" data-channel="${channel.name}">후보 담기</button></span></div>`).join("")}</section>`);
    if (normalized === "성과 및 계약 관리") return pageShell(`${subpageHead(roleName, normalized, "진행, 검수, 계약, 성과 리포트를 광고주 업무 화면처럼 관리합니다.")}<section class="app-panel"><h3>캠페인 현황</h3>${campaigns.map(([name, channel, status, budget, roi, reach]) => `<div class="app-row"><span><strong>${name}</strong><br><em>${channel} · ${budget} · ${reach}</em></span><strong>${status}<br><em>${roi}</em></strong></div>`).join("")}</section>${denseScoreTable(channelsTop(6, (a, b) => b.roi - a.roi), "advertiser")}`);
    if (normalized === "예산 시뮬레이터") return pageShell(`${subpageHead(roleName, normalized, "예산과 기간을 조절해 예상 노출, 클릭, ROI, 매출을 계산합니다.")}<div class="pc-work-grid"><section class="app-panel"><h3>예산·성과 시뮬레이터</h3><label>캠페인 예산 <output id="budgetOutput">₩ 5,000,000</output></label><input id="budgetRange" type="range" min="1000000" max="50000000" value="5000000" step="1000000" /><label>캠페인 기간 <output id="durationOutput">4주</output></label><input id="durationRange" type="range" min="1" max="12" value="4" /><div class="result-grid" id="simResults"></div></section>${detailedSettings("advertiser")}</div>`);
    if (normalized === "완료 리포트") return pageShell(`${subpageHead(roleName, normalized, "완료 캠페인의 도달, ROI, 다음 추천 채널을 리포트로 정리합니다.")}<section class="app-panel"><h3>완료 리포트</h3>${campaigns.map(([name, channel, status, budget, roi, reach]) => `<div class="app-row"><span><strong>${name}</strong><br><em>${channel} · ${budget} · ${reach}</em></span><strong>${status}<br><em>${roi}</em></strong></div>`).join("")}</section>${ticker(channelsTop(6, (a, b) => b.roi - a.roi))}`);
    if (["일괄 제안", "제안 보내기"].includes(normalized)) return pageShell(`${subpageHead(roleName, normalized, "선택한 후보에게 한 번에 PPL 제안 조건을 발송합니다.")}${basketPanel("advertiser")}${detailedSettings("advertiser")}<section class="app-panel"><h3>발송 전 체크</h3><div class="result-grid"><div><span>선택 후보</span><strong>${Math.max(3, workBasket.length)}건</strong></div><div><span>예상 예산</span><strong>₩4,200만</strong></div><div><span>평균 핏</span><strong>89</strong></div></div></section>`);
    if (["성과 KPI 설정", "매칭 조건"].includes(normalized)) return pageShell(`${subpageHead(roleName, normalized, "광고주가 원하는 가중치와 제외 조건을 세밀하게 설정합니다.")}${detailedSettings("advertiser")}${denseScoreTable(channelsTop(8, (a, b) => brandFit(b) - brandFit(a)), "advertiser")}`);
    if (["AI 채널 매칭", "유사 채널 추천"].includes(normalized)) {
      const matches = channels.filter((channel) => channel.brandSafety >= 80).sort((a, b) => brandFit(b) - brandFit(a));
      return pageShell(`${subpageHead(roleName, normalized, "AI가 브랜드 조건에 맞는 채널과 비슷한 대체 후보를 같이 추천합니다.")}${aiSearchExperience(matches.slice(0, 8))}<div class="channel-grid">${matches.slice(0, 6).map((channel) => channelCard(channel, "advertiser")).join("")}</div>`);
    }
    return pageShell(`${subpageHead(roleName, normalized, "광고주 전용 세부 업무 화면입니다.")}${signalBoard(focusChannel)}${denseScoreTable(channelsTop(10, (a, b) => brandFit(b) - brandFit(a)), "advertiser")}`);
  }

  if (currentRole === "creator") {
    if (normalized === "채널 홈") return pageShell(`${subpageHead(roleName, normalized, "채널 프로필, 최근 영상, 댓글 반응, CIV 변화를 Playboard식 분석 보드로 봅니다.")}${creatorChannelAnalytics()}${recentVideoPanel()}<div class="pc-analysis-grid">${signalBoard(channels[1])}<section class="app-panel"><h3>채널 운영 메모</h3><div class="app-row"><span>다음 업로드 권장 시간</span><strong>금요일 18:00</strong></div><div class="app-row"><span>강한 콘텐츠 포맷</span><strong>비교 리뷰</strong></div><div class="app-row"><span>협찬 적합도</span><strong>뷰티·커머스 높음</strong></div></section></div>`);
    if (normalized === "CIV 목표") return creatorCivGoalView();
    if (normalized === "협업 일정") return creatorScheduleBoard(normalized);
    if (normalized.includes("CIV") || normalized.includes("점수") || normalized.includes("팬덤") || normalized.includes("카테고리") || normalized.includes("안전성") || normalized.includes("AI") || normalized.includes("핵심")) return creatorCivDiagnosisView();
    if (normalized.includes("협업") || normalized.includes("제안") || normalized.includes("제품") || normalized.includes("신규")) return creatorOfferBoard();
    if (normalized.includes("정산") || normalized.includes("입금") || normalized.includes("출금") || normalized.includes("계약") || normalized.includes("검수")) return pageShell(`${subpageHead(roleName, normalized, "계약, 검수, 입금 예정, 출금 신청을 분리해서 관리합니다.")}<div class="pc-work-grid"><section class="app-panel"><h3>정산 큐</h3><div class="app-row"><span><strong>스킨케어 협찬 6월</strong><br><em>검수 완료 · 2026.06.05 입금 예정</em></span><strong>₩18,000,000</strong></div><div class="app-row"><span><strong>헤어케어 스타일러</strong><br><em>촬영본 승인 · 2026.06.12 입금 예정</em></span><strong>₩4,800,000</strong></div><div class="app-row"><span><strong>출근 메이크업 시즌 3</strong><br><em>1차 콘텐츠 승인</em></span><strong>₩12,000,000</strong></div></section><section class="app-panel"><h3>계약 상태</h3><div class="result-grid"><div><span>스마트 계약</span><strong>4건</strong></div><div><span>검수 대기</span><strong>3건</strong></div><div><span>출금 가능</span><strong>₩4,850만</strong></div></div><button class="primary-button">출금 신청</button></section></div>`);
    return creatorScheduleBoard(normalized);
  }

  if (normalized.includes("검토함")) return investorReviewBoxView("검토함");
  if (normalized.includes("마켓") || normalized.includes("인수") || normalized.includes("검토") || normalized.includes("권리") || normalized.includes("가격")) return investorMarketView("마켓");
  if (normalized.includes("파트너") || normalized.includes("PPL") || normalized.includes("추천") || normalized.includes("유사")) return investorPartnershipView("파트너십");
  return investorReportView("리포트");
}

function subpageHead(roleName, title, description) {
  const eyebrow = roleName === roles.creator.label || roleName === roles.investor.label ? roleName : `${roleName} / 소분류`;
  return `<section class="page-head subpage-head"><div><p class="eyebrow">${eyebrow}</p><h2>${title}</h2><p>${description}</p></div></section>`;
}

function renderAppHome() {
  if (currentRole === "advertiser") {
    const top = channelsTop(5, (a, b) => brandFit(b) - brandFit(a));
    return pageShell(`
      ${aiSearchExperience(channelsTop(10, (a, b) => brandFit(b) - brandFit(a)))}
      <h3 class="app-section-title">핵심 지표</h3>
      ${metricTiles(roles.advertiser.kpis)}
      ${detailedSettings("advertiser")}
      <h3 class="app-section-title">실시간 인기 채널 랭킹</h3>
      <div class="app-rank-list">${top.map((channel, index) => `<button data-app-tab="1"><b>${index + 1}</b><span><strong>${channel.name}</strong><em>${channel.category} · 핏 ${brandFit(channel)} · ROI ${pct(channel.roi)} · 월조회 ${compactCount(channel.monthlyViews)}</em></span></button>`).join("")}</div>
      <h3 class="app-section-title">브랜드 핏 워치리스트</h3>
      ${denseScoreTable(top, "advertiser")}
    `);
  }
  if (currentRole === "creator") {
    return pageShell(`
      ${creatorChannelAnalytics()}
      ${recentVideoPanel()}
      <h3 class="app-section-title">핵심 상태</h3>
      ${metricTiles(roles.creator.kpis)}
      <div class="pc-work-grid">
        <section class="app-panel"><h3>신규 협업 제안</h3>${creatorOffers.map(([title, company, price, product, status]) => `<div class="app-row"><span><strong>${title}</strong><br><em>${company} · ${price} · ${product}</em></span><strong>${status}</strong></div>`).join("")}</section>
        ${signalBoard(channels[1])}
      </div>
    `);
  }
  return pageShell(`
    <section class="app-hero-card"><div><span>투자자 홈</span><h2>내 투자 자산 현황</h2><p>채널별 리포트, 마켓 가격, 파트너십 조건, 위험 점수를 촘촘하게 확인합니다.</p></div>${ticker(channelsTop(6))}</section>
    ${investorSearchExperience()}
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
      <section class="page-head"><div><p class="eyebrow">CIV Diagnosis</p><h2>CIV진단</h2><p>왜 이 점수가 나왔는지 보고, 롤모델 유튜버와 비교해 다음 액션을 정합니다.</p></div><div class="score-row">${scorePill("현재 CIV", "87.0")}${scorePill("목표", "95")}${scorePill("롤모델", "회사원A")}</div></section>
      <div class="pc-analysis-grid">${signalBoard(channels[1])}${creatorRoleModelPanel()}</div>
      <section class="app-panel civ-reason-panel"><h3>왜 이 점수가 나왔는지</h3><p>YOUCHI AI는 최근 비교 리뷰 영상의 댓글 긍정률과 저장 반응을 높게 평가했습니다. 다만 업로드 간격이 일정하지 않아 성장성 점수가 일부 낮아졌고, 롤모델 채널 대비 고정 코너 반복성이 부족하다고 판단했습니다.</p></section>
      ${creatorCivTrendPanel()}
    `);
  }
  return investorReportView("리포트");
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
    return creatorOfferBoard();
  }
  return investorMarketView("마켓");
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
  return investorPartnershipView("파트너십");
}

function renderAppInvest() {
  return pageShell(`
    <section class="page-head"><div><p class="eyebrow">Creator Operation</p><h2>채널 운영</h2><p>CIV 목표와 협업 일정을 같이 보면서 촬영, 편집, 업로드 마감 흐름을 관리합니다.</p></div><div class="score-row">${scorePill("목표 CIV", "95")}${scorePill("협업 일정", "5건")}${scorePill("마감 임박", "1건")}</div></section>
    <section class="app-panel civ-goal-editor"><div class="panel-title-row"><h3>목표치 입력</h3><span>임의 목표 95점</span></div><div class="settings-grid"><label>현재 CIV<input value="87" readonly /></label><label>목표 CIV<input type="number" value="95" min="70" max="100" /></label><label>달성 기간<select><option>4주</option><option>8주</option><option>12주</option></select></label><label>우선 전략<select><option>팬덤과 조회 성장 동시 개선</option><option>댓글 반응 우선</option><option>협찬 안전성 우선</option></select></label></div></section>
    ${signalBoard(channels[1])}
    ${creatorAiAnalysisPanel("goal")}
    ${creatorScheduleBoard("협업 일정").replace('<div class="app-scroll">', '').replace('</div><button class="floating-search-button" data-work-action="open-creator-search" type="button" aria-label="크리에이터 검색 열기"><span></span></button>', '')}
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
  const sideMarkup = tabs.map(([label, key], index) => `<div class="pc-nav-item"><button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${firstSubHref(key)}">${label}</button>${navFlyout(label, key)}</div>`).join("");
  const bottomMarkup = tabs.map(([label, key], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${firstSubHref(key)}">${label}</button>`).join("");
  if (bottomNav) bottomNav.innerHTML = bottomMarkup;
  if (sideNav) sideNav.innerHTML = sideMarkup;
  if (drawerLinks) drawerLinks.innerHTML = tabs.map(([label, key], index) => `<button class="${index === currentAppTab ? "active" : ""}" data-app-tab="${index}" data-page-url="${firstSubHref(key)}">${label} 이동</button>`).join("");
  const topbar = document.querySelector(".pc-topbar");
  if (topbar) {
    let menu = topbar.querySelector("#topMegaMenuMount");
    if (!menu) {
      menu = document.createElement("div");
      menu.id = "topMegaMenuMount";
      topbar.insertBefore(menu, document.querySelector("#roleCycleButton"));
    }
    menu.innerHTML = renderTopMenu();
  }

  const hashTitle = routedSubpageTitle || decodeURIComponent(location.hash.replace(/^#/, "") || "");
  const pageTitle = document.querySelector("#pcPageTitle");
  if (pageTitle) pageTitle.textContent = `${roles[currentRole].label} ${hashTitle || tabs[currentAppTab]?.[0] || "홈"}`;
  if (hashTitle) {
    content.innerHTML = renderFocusedSubpage(hashTitle);
  } else {
    if (currentTabKey === "home") content.innerHTML = renderAppHome();
    if (currentTabKey === "analysis") content.innerHTML = renderAppAnalysis();
    if (currentTabKey === "campaign") content.innerHTML = renderAppCampaign();
    if (currentTabKey === "trade") content.innerHTML = renderAppTrade();
    if (currentTabKey === "invest") content.innerHTML = renderAppInvest();
  }

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
  document.querySelectorAll("[data-top-role]").forEach((button) => {
    button.addEventListener("click", () => setRole(button.dataset.topRole, { goHome: true }));
  });
  bindSimulator();
  bindWorkActions();
  bindAiSearch();
  bindCampaignSearch();
  bindInvestorSearch();
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
      if (action === "open-creator-search") {
        showCreatorSearchModal();
        return;
      }
      if (action === "close-creator-search") {
        document.querySelector(".creator-search-modal")?.remove();
        return;
      }
      if (action === "close-video-detail") {
        document.querySelector(".video-detail-modal")?.remove();
        return;
      }
      if (action === "close-offer-detail") {
        document.querySelector(".offer-detail-modal")?.remove();
        return;
      }
      if (action === "clear-basket") {
        const role = currentRole === "investor" ? "investor" : "advertiser";
        workBasket = workBasket.filter((item) => item.role !== role);
        localStorage.setItem("youchi-work-basket", JSON.stringify(workBasket));
        renderAppPreview();
        return;
      }
      if (action === "remove-review") {
        workBasket = workBasket.filter((item) => !(item.role === "investor" && item.name === channel));
        dismissedReviewNames = [...new Set([...dismissedReviewNames, channel])];
        localStorage.setItem("youchi-work-basket", JSON.stringify(workBasket));
        localStorage.setItem("youchi-review-dismissed", JSON.stringify(dismissedReviewNames));
        renderAppPreview();
        return;
      }
      if (action === "trade-review") {
        showTradeReviewModal(channel);
        bindWorkActions();
        return;
      }
      if (action === "confirm-trade-review") {
        document.querySelector(".recommend-modal")?.remove();
        showToast(`${channel} 매매 검토가 시작됐습니다. 담당자 검토 알림을 보냈습니다.`);
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
  document.querySelectorAll("[data-video-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      showVideoDetailModal(button.dataset.videoDetail);
      bindWorkActions();
    });
  });
  document.querySelectorAll("[data-offer-detail]").forEach((button) => {
    button.addEventListener("click", () => {
      showOfferDetailModal(button.dataset.offerDetail);
      bindWorkActions();
    });
  });
  bindInvestorReviewBox();
}

function bindInvestorReviewBox() {
  const left = document.querySelector("#compareChannelA");
  const right = document.querySelector("#compareChannelB");
  const panel = document.querySelector("#investorComparisonPanel");
  if (!left || !right || !panel) return;
  const update = () => {
    panel.innerHTML = investorComparisonMarkup(left.value, right.value);
  };
  left.addEventListener("change", update);
  right.addEventListener("change", update);
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

function bindCampaignSearch() {
  const input = document.querySelector("#campaignSearchInput");
  const button = document.querySelector("#campaignSearchButton");
  const list = document.querySelector("#campaignSearchList");
  const count = document.querySelector("#campaignResultCount");
  if (!input || !list) return;
  const render = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = creatorOffers
      .filter((offer) => {
        const text = offer.join(" ").toLowerCase();
        return !query || query.split(/\s+/).some((token) => text.includes(token));
      })
      .slice(0, 10);
    list.innerHTML = filtered.map(campaignSearchRow).join("");
    if (count) count.textContent = `${filtered.length}건`;
  };
  input.addEventListener("input", render);
  button?.addEventListener("click", render);
  document.querySelectorAll("[data-campaign-prompt]").forEach((prompt) => {
    prompt.addEventListener("click", () => {
      input.value = prompt.dataset.campaignPrompt;
      render();
    });
  });
}

function bindInvestorSearch() {
  const input = document.querySelector("#investorChannelSearch");
  const button = document.querySelector("#investorSearchButton");
  const list = document.querySelector("#investorSearchList");
  const count = document.querySelector("#investorResultCount");
  if (!input || !list) return;
  const render = () => {
    const query = input.value.trim().toLowerCase();
    const filtered = channels
      .filter((channel) => {
        const text = `${channel.name} ${channel.category} ${channel.scale} ${channel.format} ${channel.desc}`.toLowerCase();
        return !query || query.split(/\s+/).some((token) => text.includes(token));
      })
      .sort((a, b) => marketScore(b) - marketScore(a))
      .slice(0, 10);
    list.innerHTML = filtered.map(investorSearchRow).join("");
    if (count) count.textContent = `${filtered.length}건`;
    bindWorkActions();
  };
  input.addEventListener("input", render);
  button?.addEventListener("click", render);
  document.querySelectorAll("[data-investor-prompt]").forEach((prompt) => {
    prompt.addEventListener("click", () => {
      input.value = prompt.dataset.investorPrompt;
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

function setRole(role, options = {}) {
  const roleChanged = currentRole !== role;
  currentRole = role;
  localStorage.setItem("youchi-role", role);
  if (options.goHome) {
    currentAppTab = 0;
    if (page !== "home" || roleChanged) {
      location.href = "./index.html";
      return;
    }
  }
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
  button.addEventListener("click", () => setRole(button.dataset.roleButton, { goHome: true }));
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
  setRole(keys[(keys.indexOf(currentRole) + 1) % keys.length], { goHome: true });
});

window.addEventListener("hashchange", () => {
  renderAppPreview();
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
