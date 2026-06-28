/**
 * Decision Mirror Main App Orchestrator
 */

// Application State
const state = {
  title: "",
  optionA: "",
  optionB: "",
  prosA: [""],
  consA: [""],
  prosB: [""],
  consB: [""],
  quiz: [3, 3, 3, 3, 3, 3] // Default slider values (1 to 5)
};

// DOM Elements
const screens = {
  landing: document.getElementById("landing-screen"),
  input: document.getElementById("input-screen"),
  proscons: document.getElementById("proscons-screen"),
  quiz: document.getElementById("quiz-screen"),
  loading: document.getElementById("loading-screen"),
  result: document.getElementById("result-screen")
};

const stepBar = document.getElementById("step-bar");
const stepProgressLine = document.getElementById("step-progress-line");
const stepDots = document.querySelectorAll(".step-dot");
const btnResetApp = document.getElementById("btn-reset-app");

/// 30+ Decision Examples (Both serious and casual/fun) with realistic pros and cons
const EXAMPLES = [
  { 
    label: "💼 이직 고민", 
    title: "이직을 준비 중인가요?", 
    a: "현재 회사에 머물기", 
    b: "새로운 회사로 이직하기",
    prosA: ["안정적인 급여와 체계적인 복지제도", "익숙한 업무와 편한 팀원들"],
    consA: ["성장이 정체되고 지루함", "연봉 인상 폭이 낮음"],
    prosB: ["새로운 도전과 빠른 커리어 성장", "연봉 상승의 기회"],
    consB: ["높은 스트레스와 업무 적응 기간 필요", "새 조직에 대한 불확실성"]
  },
  { 
    label: "🏠 이사 고민", 
    title: "이사를 할까 말까 고민하나요?", 
    a: "현재 집에 계속 살기", 
    b: "새로운 동네로 이사 가기",
    prosA: ["이사 비용 및 복비 절약", "익숙한 주변 인프라와 환경"],
    consA: ["좁은 공간이나 낡은 시설의 불편함", "기분 전환의 기회가 없음"],
    prosB: ["깔끔하고 더 넓은 주거 환경", "새로운 인프라와 신선한 변화"],
    consB: ["보증금 인상 및 대출 이자 부담", "포장 이사 및 주소 변경 등 복잡한 절차"]
  },
  { 
    label: "🛍️ 지름신 강림", 
    title: "이 물건 살까 말까 고민되나요?", 
    a: "지출을 아끼고 안 사기", 
    b: "지금 바로 구매하기",
    prosA: ["통장 잔고를 보존해 경제적 안정을 얻음", "불필요한 충동구매 방지"],
    consA: ["가지고 싶던 물건에 대한 아쉬움이 계속 남음", "소소한 일상의 재미 상실"],
    prosB: ["즉각적인 만족감과 삶의 질 향상", "가지고 싶던 소유 욕구 충족"],
    consB: ["다음 달 카드 명세서 충격", "얼마 지나지 않아 흥미가 식을 수 있음"]
  },
  { 
    label: "❤️ 연애 고민", 
    title: "이 남자(여자) 만날까 말까 고민되나요?", 
    a: "친구로 남거나 더 지켜보기", 
    b: "용기 내서 고백하고 만나기",
    prosA: ["안정적인 관계 유지 및 감정 소모 없음", "서로 부담 없이 친하게 지냄"],
    consA: ["특별한 사람을 놓칠 수 있는 아쉬움", "관계가 계속 애매모호하게 남음"],
    prosB: ["정서적인 유대감과 연애의 행복감", "서로에게 특별한 사람이 됨"],
    consB: ["성격 차이로 다투게 될 스트레스 우려", "이별 시 관계가 완전히 끝남"]
  },
  { 
    label: "🎓 진로 선택", 
    title: "대학원에 진학할까 취업을 할까?", 
    a: "즉시 취업하기", 
    b: "대학원에 진학하기",
    prosA: ["빠른 경제적 독립", "실무 경력을 일찍 시작함"],
    consA: ["학문적 전문성이 다소 부족할 수 있음", "커리어 고점에 조기 도달할 우려"],
    prosB: ["특정 분야의 깊이 있는 지식과 전문성 확보", "학위 메리트와 연구 기회"],
    consB: ["수년간 소득 없이 학비만 지출됨", "졸업 후 취업 경쟁력이 무조건 보장되진 않음"]
  },
  { 
    label: "📱 기기 구매", 
    title: "태블릿PC(아이패드 등)를 살까 말까?", 
    a: "기존 기기 계속 쓰기", 
    b: "새 태블릿PC 구매하기",
    prosA: ["지출 없이 목돈을 아낌", "기기 관리 스트레스 없음"],
    consA: ["작은 스마트폰 화면으로 볼 때 눈이 피로함", "생산적인 작업의 효율이 떨어짐"],
    prosB: ["필기 및 영상 감상으로 생산성 극대화", "다이어리 꾸미기 등 새로운 취미 시작"],
    consB: ["비싼 기깃값 대비 넷플릭스 머신이 될 확률 높음", "배터리 충전 등 기기 관리 귀찮음"]
  },
  { 
    label: "👛 지갑 색상", 
    title: "어떤 색깔 지갑을 살까?", 
    a: "무난한 블랙/네이비", 
    b: "밝은 유색(예: 옐로우/그린)",
    prosA: ["때가 타지 않아 오랫동안 깔끔함", "어떤 복장에도 단정하게 어울림"],
    consA: ["다소 흔하고 개성이 없어 보임"],
    prosB: ["가방 안에서 쉽게 찾을 수 있음", "돈을 부른다는 풍수적 의미나 독특한 개성"],
    consB: ["쉽게 질리거나 모서리 때가 잘 탐"]
  },
  { 
    label: "🐶 반려동물", 
    title: "반려동물 키울까 말까?", 
    a: "키우지 않고 자유롭게 살기", 
    b: "반려동물 입양하기",
    prosA: ["주말 장기 여행 등 시간 계획이 자유로움", "사료비, 병원비 등 지출 제로"],
    consA: ["반려동물이 주는 무조건적인 신뢰와 온기를 못 느낌"],
    prosB: ["매일 나를 반겨주는 소중한 가족이 생김", "반려동물과 교감하며 우울감 완화"],
    consB: ["매일 산책 및 배변 패드 정리 등 높은 책임감 필요", "병원비 등 생각보다 큰 고정 지출"]
  },
  { 
    label: "⛰️ 주말 나들이", 
    title: "내일 산을 갈까 바다를 갈까?", 
    a: "상쾌한 공기의 산으로 가기", 
    b: "탁 트인 넓은 바다로 가기",
    prosA: ["피톤치드를 마시며 유산소 운동 효과", "조용히 숲길을 걸으며 사색"],
    consA: ["등산 장비 챙기기 및 가파른 경사의 육체적 피로"],
    prosB: ["수평선을 보며 가슴이 뻥 뚫리는 기분", "해변 산책과 주변 해산물 맛집 탐방"],
    consB: ["주말 바닷가 인근 교통체증 및 해변 모래의 번거로움"]
  },
  { 
    label: "✈️ 휴가 계획", 
    title: "휴가 때 해외를 갈까 말까?", 
    a: "국내 여행 또는 호캉스", 
    b: "해외로 자유여행 떠나기",
    prosA: ["언어 장벽이 없어 편하고 안전함", "이동 시간이 짧아 피로가 덜함"],
    consA: ["매번 가던 익숙함 때문에 신선한 자극이 덜함"],
    prosB: ["완전히 새로운 환경과 문화에서 느끼는 해방감", "이국적인 풍경과 잊지 못할 추억"],
    consB: ["환율 부담 및 비행기 값 등 예산 초과 우려", "시차 적응과 장시간 비행의 피로"]
  },
  { 
    label: "🍜 오늘 점심", 
    title: "오늘 점심 뭐 먹지? 짜장면 vs 짬뽕", 
    a: "달콤 짭조름한 짜장면", 
    b: "얼큰하고 개운한 짬뽕",
    prosA: ["달고 고소한 춘장의 익숙한 행복감", "누구나 호불호 없이 든든한 한 끼"],
    consA: ["다 먹어갈 때쯤 약간 느끼해질 수 있음"],
    prosB: ["얼큰한 국물로 전날 숙취 해소 및 스트레스 경감", "각종 해산물과 채소 건더기의 시원함"],
    consB: ["매운 국물이 옷에 튈 걱정", "속에 약간의 자극을 줄 수 있음"]
  },
  { 
    label: "🏋️ 운동 시작", 
    title: "헬스장 등록할까 홈트할까?", 
    a: "헬스장 회원권 끊기", 
    b: "유튜브 보며 홈트레이닝",
    prosA: ["다양한 고성능 웨이트 기구 이용 가능", "운동하러 온 다른 사람들을 보며 자극"],
    consA: ["매번 헬스장까지 이동해야 하는 귀찮음", "비싼 월 회원권 가격"],
    prosB: ["시간 구애 없이 집에서 10분 만에 시작 가능", "추가 비용이 전혀 들지 않음"],
    consB: ["집에서는 의지가 약해져 도중에 눕게 됨", "잘못된 자세를 봐줄 강사가 없음"]
  },
  { 
    label: "☕ 음료 선택", 
    title: "아메리카노 vs 라떼?", 
    a: "시원하고 깔끔한 아메리카노", 
    b: "고소하고 든든한 라떼",
    prosA: ["깔끔한 맛으로 입안이 개운함", "칼로리가 낮아 체중 관리에 좋음"],
    consA: ["공복에 마시면 위장에 쓰릴 수 있음"],
    prosB: ["우유가 들어가 부드럽고 가벼운 허기를 때워줌", "고소하고 묵직한 바디감"],
    consB: ["우유로 인해 마신 뒤 입안이 텁텁함", "포화지방과 칼로리가 비교적 높음"]
  },
  { 
    label: "📖 도서 구매", 
    title: "종이책 살까 e-book 살까?", 
    a: "서점에서 종이책 구매", 
    b: "전자책(e-book) 다운로드",
    prosA: ["책장을 넘기는 물리적 감성과 인테리어 소장 효과", "눈 피로가 확실히 덜함"],
    consA: ["책 부피로 인해 외출 시 가방이 무거워짐", "보관 공간 차지"],
    prosB: ["스마트폰이나 리더기로 언제든 가볍게 소장 가능", "종이책보다 보통 가격이 저렴함"],
    consB: ["아날로그 소장 만족도가 떨어짐", "전자기기 배터리를 신경 써야 함"]
  },
  { 
    label: "🚗 출퇴근", 
    title: "자차로 출퇴근할까 대중교통 탈까?", 
    a: "내 차 타고 편하게 출퇴근", 
    b: "지하철/버스 대중교통 이용",
    prosA: ["만원 대중교통의 땀 냄새와 소음 차단", "나만의 공간에서 조용히 음악 들으며 이동"],
    consA: ["출퇴근 시간 상습 정체로 길바닥에서 시간 낭비", "유류비, 주차비, 보험료 등 유지비 상승"],
    prosB: ["정해진 정류장에 맞춰 정시 도착 확률 높음", "이동 중 독서나 폰 보기 가능, 저렴함"],
    consB: ["출퇴근 피크 타임 혼잡함으로 인한 스트레스", "비 내리는 날 도보 이동의 불편함"]
  },
  { 
    label: "💇 헤어스타일", 
    title: "머리 짧게 자를까 계속 기를까?", 
    a: "과감하게 단발로 컷트", 
    b: "긴 머리 스타일 고수하기",
    prosA: ["머리 감고 말리는 시간이 엄청 단축됨", "깔끔하고 세련된 인상으로 변신"],
    consA: ["자주 다듬지 않으면 머리가 뻗쳐서 지저분해짐"],
    prosB: ["묶기, 땋기, 웨이브 등 다양한 연출 가능", "바람 불 때 흩날리는 긴 머리 특유의 감성"],
    consB: ["머리 말리는데 시간과 전력이 많이 소모됨", "상한 머릿결 관리가 어려움"]
  },
  { 
    label: "🗣️ 영어 공부", 
    title: "학원 다닐까 독학할까?", 
    a: "영어 학원 수강", 
    b: "독학(인강/앱/미드)",
    prosA: ["정해진 시간에 가서 억지로라도 공부하게 됨", "원어민 강사에게 직접 피드백 받기 가능"],
    consA: ["매월 고정 수강료 부담", "진도가 타인에 맞춰져 있어 진도가 느리거나 빠를 수 있음"],
    prosB: ["내가 부족한 파트만 집중적으로 공부 가능", "이동 시간 낭비 없이 스케줄 조절 용이"],
    consB: ["스스로 계획을 실천하지 않으면 흐지부지됨", "틀린 표현을 고쳐줄 전문가가 부재함"]
  },
  { 
    label: "🛌 주말 계획", 
    title: "주말에 집콕할까 외출할까?", 
    a: "방 안에서 뒹굴며 집콕", 
    b: "친구 약속 잡고 외출",
    prosA: ["돈 쓸 일이 없고 완벽하게 신체 휴식", "방해받지 않고 온전한 힐링"],
    consA: ["일요일 밤 주말을 허무하게 보냈다는 자괴감"],
    prosB: ["지인들과 수다 떨며 대인관계 유지 및 리프레시", "맛집 투어나 쇼핑으로 새로운 활력"],
    consB: ["약속 한 번에 나가는 비용 부담", "외출 후 방전된 체력으로 월요병 도질 우려"]
  },
  { 
    label: "🎮 게임 구매", 
    title: "신작 스팀 게임 살까 말까?", 
    a: "할인 대기하며 보류", 
    b: "신작 바로 결제하기",
    prosA: ["불필요한 지출 방지", "이미 사둔 라이브러리 게임 클리어 기회"],
    consA: ["남들 다 실시간 플레이하며 후기 나눌 때 소외감"],
    prosB: ["출시 직후 스포일러 없이 가장 핫할 때 플레이", "고화질 그래픽과 신선한 시스템 경험"],
    consB: ["최적화 이슈 등 버그가 아직 남아있을 우려", "비싸게 샀지만 바빠서 장식품이 될 가능성"]
  },
  { 
    label: "🍽️ 저녁 모임", 
    title: "회식이나 모임에 갈까 말까?", 
    a: "불참하고 집으로 퇴근하기", 
    b: "모임에 참석하기",
    prosA: ["퇴근 후 온전한 개인 시간 확보", "감정 노동 피하기 가능"],
    consA: ["나중에 모임원들끼리만 친해질 때 오는 소외감"],
    prosB: ["사람들과 교류하며 새로운 정보 획득", "맛있는 음식과 술로 스트레스 발산"],
    consB: ["피할 수 없는 과음이나 늦은 귀가로 인한 다음 날 피로", "회비 부담"]
  },
  { 
    label: "⏱️ 모닝 루틴", 
    title: "아침 6시에 일어날까 7시에 일어날까?", 
    a: "아침 6시 기상 (미라클 모닝)", 
    b: "7시 기상 (피로 회복)",
    prosA: ["출근 전 1시간 독서나 명상 등 자기개발 시간 확보", "여유로운 아침 준비"],
    consA: ["오후에 식곤증이 더 강하게 밀려옴", "밤에 일찍 자야 해서 밤 여가 단축"],
    prosB: ["1시간 더 숙면하여 뇌의 피로가 덜함", "스트레스 감소"],
    consB: ["아침 시간이 빠듯해서 허겁지겁 출근해야 함", "지각 위험 증가"]
  },
  { 
    label: "📱 스마트폰", 
    title: "아이폰 살까 갤럭시 살까?", 
    a: "세련된 아이폰 구매", 
    b: "실용적인 갤럭시 구매",
    prosA: ["세련된 디자인과 감성적인 색감의 카메라", "부드러운 화면 전환 애니메이션과 긴 수명"],
    consA: ["통화 녹음이 기본 제공되지 않아 비즈니스상 불편", "삼성페이나 교통카드 기능 사용 제한"],
    prosB: ["통화 중 상시 녹음 및 요약 기능 지원", "공인인증서 활용이나 파일 관리가 엄청 편함"],
    consB: ["아이폰에 비해 중고가 방어가 아쉬움", "특유의 SNS 감성 카메라 톤이 다소 덜함"]
  },
  { 
    label: "💳 정기 구독", 
    title: "OTT 멤버십 계속 유지할까 해지할까?", 
    a: "구독 그대로 유지하기", 
    b: "일단 멤버십 해지하기",
    prosA: ["언제든 넷플릭스 켜서 볼 수 있는 심리적 편안함", "신작 릴리즈 날 바로 감상 가능"],
    consA: ["바빠서 일주일에 한 번도 안 봐도 고정 요금 청구"],
    prosB: ["매달 커피 한 잔 값 이상의 고정 지출 세이브", "안 보는데 나가는 돈 아까워할 필요 없음"],
    consB: ["보고 싶은 다큐나 영화가 생겼을 때 재결제해야 하는 번거로움"]
  },
  { 
    label: "🍳 저녁 준비", 
    title: "오늘 저녁 배달 시킬까 직접 요리할까?", 
    a: "배달 어플로 시키기", 
    b: "냉장고 털어 직접 요리하기",
    prosA: ["주방 도구 세척 및 설거지 노동 해방", "30분 만에 전문점 수준의 자극적이고 맛있는 음식 식사"],
    consA: ["배달비 포함 과도한 식비 유발", "플라스틱 일회용기 쓰레기 대량 발생"],
    prosB: ["신선한 식재료로 내 입맛과 건강에 맞게 조리", "배달 대비 절반 이하로 식비 아낌"],
    consB: ["조리 후 냄비, 그릇 설거지거리가 수북하게 쌓임", "장보고 손질하느라 1시간 가까이 소요"]
  },
  { 
    label: "💻 개발 공부", 
    title: "React 공부할까 Vue 공부할까?", 
    a: "React 공부하기", 
    b: "Vue.js 공부하기",
    prosA: ["구인 구직 수요가 압도적으로 1위", "방대한 커뮤니티와 수많은 라이브러리 지원"],
    consA: ["JSX나 상태 관리(Redux 등) 개념의 러닝커브가 높음"],
    prosB: ["HTML/CSS/JS 기본 지식만 있으면 하루 만에 화면 띄우기 가능", "프레임워크 자체의 가이드라인이 명확함"],
    consB: ["React에 비해 현업 실무 채용 공고가 상대적으로 적음"]
  },
  { 
    label: "🎁 친구 선물", 
    title: "실용적인 상품권 vs 정성 담긴 선물?", 
    a: "백화점/커피 모바일 상품권", 
    b: "직접 고른 실물 선물",
    prosA: ["받는 사람이 본인 취향대로 쓸 수 있어 실패 확률 0%", "보내는 즉시 전달 가능해 간편함"],
    consA: ["기억에 남지 않고 성의 없어 보일 수 있음"],
    prosB: ["정성과 시간이 깃들어 오랫동안 우정을 추억하게 함", "상대방 맞춤형 센스를 과시 가능"],
    consB: ["취향에 맞지 않는 물건이면 처치 곤란이 됨"]
  },
  { 
    label: "🎨 취미 미술", 
    title: "패드 드로잉 배울까 유화 배울까?", 
    a: "아이패드 디지털 드로잉", 
    b: "화실에서 진짜 유화 배우기",
    prosA: ["Ctrl+Z로 뒤로 가기가 쉬워 초보자에게 최적", "물감 냄새나 번거로운 붓 세척 과정 없음"],
    consA: ["화면 너머 디지털 픽셀이라 아날로그 감성이 없음"],
    prosB: ["캔버스 질감과 유화 특유의 꾸덕꾸덕한 붓맛 성취감", "완성 후 방에 멋지게 걸어둘 수 있는 실물 탄생"],
    consB: ["물감, 파레트, 오일 등 초기 재료 세팅 비용 부담", "옷이나 손에 묻기 쉬움"]
  },
  { 
    label: "🍺 주말 음주", 
    title: "금요일 저녁 술 한잔할까 논알콜로 보낼까?", 
    a: "시원한 캔맥주 마시기", 
    b: "시원한 보리차나 탄산수",
    prosA: ["일주일간 쌓인 격무의 스트레스가 날아가는 쾌감", "퇴근 후 깊은 숙면 가능"],
    consA: ["다음 날 두통 등 숙취로 주말 아침을 늦잠으로 날림"],
    prosB: ["토요일 아침 일찍 개운하게 눈떠서 긴 주말 알차게 활용", "술자리 비용 및 불필요한 안주 칼로리 절약"],
    consB: ["금요일 밤 특유의 취기가 주는 즐거운 해방감이 없음"]
  },
  { 
    label: "👖 패션 스타일", 
    title: "무난한 미니멀룩 vs 개성 있는 스트릿룩?", 
    a: "기본 슬랙스와 셔츠 조합", 
    b: "오버핏 그래픽티와 스니커즈",
    prosA: ["어느 자리에 가도 깔끔하고 호불호가 없음", "코디 고민 없이 빠르게 입을 수 있음"],
    consA: ["개성이 뚜렷하지 않아 평범한 인상을 남김"],
    prosB: ["스트릿 컬처에 대한 열정을 옷으로 멋지게 표현", "상대방에게 스타일리시하고 자유분방한 매력 어필"],
    consB: ["중요한 경조사나 엄숙한 면접 자리에 입고 가기 곤란함"]
  },
  { 
    label: "🏠 인테리어", 
    title: "방 구조를 바꿀까 말까?", 
    a: "기존 가구 배치 유지", 
    b: "책상과 침대 위치 완전히 변경",
    prosA: ["평소 다니던 최적화된 생활 동선 유지", "힘을 쓰거나 가구를 닦아낼 필요 없음"],
    consA: ["몇 달째 똑같은 방 풍경에 기분이 조금 무료함"],
    prosB: ["방에 올 때마다 이사 온 듯한 기분 전환 효과", "구석구석 묵은 먼지까지 싹 청소할 기회"],
    consB: ["가구 배치 구상과 땀 뻘뻘 흘리는 고난도 노동 유발"]
  }
];

// Dynamic rendering of example buttons
function renderExampleTags() {
  const container = document.getElementById("example-tags-container");
  if (!container) return;
  container.innerHTML = "";
  
  EXAMPLES.forEach(ex => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "tag-btn";
    btn.setAttribute("data-title", ex.title);
    btn.setAttribute("data-a", ex.a);
    btn.setAttribute("data-b", ex.b);
    
    // Store pros and cons as custom strings or attributes
    btn.setAttribute("data-prosa", JSON.stringify(ex.prosA || [""]));
    btn.setAttribute("data-consa", JSON.stringify(ex.consA || [""]));
    btn.setAttribute("data-prosb", JSON.stringify(ex.prosB || [""]));
    btn.setAttribute("data-consb", JSON.stringify(ex.consB || [""]));
    
    btn.textContent = ex.label;
    container.appendChild(btn);
  });
}

// Initialize application
document.addEventListener("DOMContentLoaded", () => {
  initEventListeners();
  renderExampleTags();
  loadSavedState();
  renderQuiz();
  updateNavigationUI();
});

// Load state from local storage
function loadSavedState() {
  const savedState = localStorage.getItem("decision_mirror_state");
  if (savedState) {
    try {
      const parsed = JSON.parse(savedState);
      Object.assign(state, parsed);
      
      // Update form inputs
      document.getElementById("input-title").value = state.title || "";
      document.getElementById("input-option-a").value = state.optionA || "";
      document.getElementById("input-option-b").value = state.optionB || "";
      
      // Show reset button if we have saved data
      if (state.title || state.optionA || state.optionB) {
        btnResetApp.style.display = "block";
      }
    } catch (e) {
      console.error("Error loading localStorage state:", e);
    }
  }
}

// Save state to local storage
function saveState() {
  localStorage.setItem("decision_mirror_state", JSON.stringify(state));
  if (state.title || state.optionA || state.optionB) {
    btnResetApp.style.display = "block";
  } else {
    btnResetApp.style.display = "none";
  }
}

// Reset state
function resetApp() {
  if (confirm("정말 처음부터 다시 작성하시겠습니까? 저장된 내용이 초기화됩니다.")) {
    localStorage.removeItem("decision_mirror_state");
    state.title = "";
    state.optionA = "";
    state.optionB = "";
    state.prosA = [""];
    state.consA = [""];
    state.prosB = [""];
    state.consB = [""];
    state.quiz = [3, 3, 3, 3, 3, 3];
    
    // Clear inputs
    document.getElementById("input-title").value = "";
    document.getElementById("input-option-a").value = "";
    document.getElementById("input-option-b").value = "";
    
    // Clear dynamic pros/cons
    renderDynamicLists();
    
    // Reset sliders
    const sliders = document.querySelectorAll(".range-slider");
    sliders.forEach((slider, idx) => {
      slider.value = 3;
      state.quiz[idx] = 3;
    });

    btnResetApp.style.display = "none";
    navigateTo("landing");
  }
}

// Screen Routing Function
function navigateTo(screenId) {
  // Hide all screens
  Object.values(screens).forEach(screen => {
    screen.classList.remove("active");
  });

  // Show target screen after animation delay
  const target = screens[screenId];
  if (target) {
    target.classList.add("active");
  }

  updateNavigationUI(screenId);
}

// Update Step Indicators and Navigation visibility
function updateNavigationUI(currentScreenId = "landing") {
  // Header logo home button
  const logo = document.getElementById("logo-home");
  logo.onclick = (e) => {
    e.preventDefault();
    navigateTo("landing");
  };

  // Step indicator visibility
  if (currentScreenId === "input" || currentScreenId === "proscons" || currentScreenId === "quiz") {
    stepBar.style.display = "block";
  } else {
    stepBar.style.display = "none";
  }

  // Update dots status and connection line
  stepDots.forEach(dot => {
    const stepNum = parseInt(dot.getAttribute("data-step"));
    dot.classList.remove("active", "completed");

    if (currentScreenId === "input") {
      stepProgressLine.style.width = "0%";
      if (stepNum === 1) dot.classList.add("active");
    } else if (currentScreenId === "proscons") {
      stepProgressLine.style.width = "50%";
      if (stepNum === 1) dot.classList.add("completed");
      if (stepNum === 2) dot.classList.add("active");
    } else if (currentScreenId === "quiz") {
      stepProgressLine.style.width = "100%";
      if (stepNum < 3) dot.classList.add("completed");
      if (stepNum === 3) dot.classList.add("active");
    }
  });
}

// Event Listeners Registration
function initEventListeners() {
  btnResetApp.addEventListener("click", resetApp);
  document.getElementById("btn-restart-final").addEventListener("click", () => {
    localStorage.removeItem("decision_mirror_state");
    location.reload();
  });

  // Step 1: Landing
  document.getElementById("btn-start").addEventListener("click", () => {
    navigateTo("input");
  });

  // Example Tags Auto-fill (Event Delegation)
  const tagsContainer = document.getElementById("example-tags-container");
  if (tagsContainer) {
    tagsContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".tag-btn");
      if (!btn) return;

      const title = btn.getAttribute("data-title");
      const optionA = btn.getAttribute("data-a");
      const optionB = btn.getAttribute("data-b");

      const inputTitle = document.getElementById("input-title");
      const inputOptA = document.getElementById("input-option-a");
      const inputOptB = document.getElementById("input-option-b");

      inputTitle.value = title;
      inputOptA.value = optionA;
      inputOptB.value = optionB;

      // Update state
      state.title = title;
      state.optionA = optionA;
      state.optionB = optionB;
      
      // Parse and load custom pros & cons if available
      try {
        state.prosA = JSON.parse(btn.getAttribute("data-prosa")) || [""];
        state.consA = JSON.parse(btn.getAttribute("data-consa")) || [""];
        state.prosB = JSON.parse(btn.getAttribute("data-prosb")) || [""];
        state.consB = JSON.parse(btn.getAttribute("data-consb")) || [""];
      } catch (err) {
        // Fallback to empty if parse fails
        state.prosA = [""];
        state.consA = [""];
        state.prosB = [""];
        state.consB = [""];
      }
      
      saveState();
    });
  }

  // Step 2: Inputs
  document.getElementById("btn-input-back").addEventListener("click", () => {
    navigateTo("landing");
  });
  document.getElementById("btn-input-next").addEventListener("click", () => {
    const titleVal = document.getElementById("input-title").value.trim();
    const optAVal = document.getElementById("input-option-a").value.trim();
    const optBVal = document.getElementById("input-option-b").value.trim();

    if (!titleVal || !optAVal || !optBVal) {
      alert("고민 주제와 선택지 A, B를 모두 작성해주세요.");
      return;
    }

    state.title = titleVal;
    state.optionA = optAVal;
    state.optionB = optBVal;
    saveState();

    // Prepare Header Names for next screens
    document.getElementById("badge-option-a").textContent = "선택지 A";
    document.getElementById("badge-option-b").textContent = "선택지 B";
    document.getElementById("header-option-a").textContent = optAVal;
    document.getElementById("header-option-b").textContent = optBVal;

    // Render initial dynamic lists
    renderDynamicLists();
    navigateTo("proscons");
  });

  // Step 3: Pros & Cons Add Buttons
  document.getElementById("btn-add-pro-a").addEventListener("click", () => addListItem("prosA", "list-pros-a"));
  document.getElementById("btn-add-con-a").addEventListener("click", () => addListItem("consA", "list-cons-a"));
  document.getElementById("btn-add-pro-b").addEventListener("click", () => addListItem("prosB", "list-pros-b"));
  document.getElementById("btn-add-con-b").addEventListener("click", () => addListItem("consB", "list-cons-b"));

  document.getElementById("btn-proscons-back").addEventListener("click", () => {
    navigateTo("input");
  });
  
  document.getElementById("btn-proscons-next").addEventListener("click", () => {
    // Collect non-empty list items
    state.prosA = collectListItems("list-pros-a");
    state.consA = collectListItems("list-cons-a");
    state.prosB = collectListItems("list-pros-b");
    state.consB = collectListItems("list-cons-b");

    // Validation: Require at least 1 item for each
    if (state.prosA.length === 0 || state.consA.length === 0 || 
        state.prosB.length === 0 || state.consB.length === 0) {
      alert("각 선택지별로 최소 1개 이상의 장점과 단점을 입력해주세요.");
      return;
    }

    saveState();
    navigateTo("quiz");
  });

  // Step 4: Quiz
  document.getElementById("btn-quiz-back").addEventListener("click", () => {
    navigateTo("proscons");
  });

  document.getElementById("btn-quiz-submit").addEventListener("click", () => {
    // Read slider values
    const sliders = document.querySelectorAll(".range-slider");
    sliders.forEach((slider, idx) => {
      state.quiz[idx] = parseInt(slider.value) || 3;
    });

    saveState();
    runFakeLoading();
  });
}

function renderDynamicLists() {
  const optAName = state.optionA || "선택지 A";
  const optBName = state.optionB || "선택지 B";

  const placeholderProA = `예: '${optAName}'의 장점 / 긍정적 측면`;
  const placeholderConA = `예: '${optAName}'의 단점 / 우려되는 측면`;
  const placeholderProB = `예: '${optBName}'의 장점 / 긍정적 측면`;
  const placeholderConB = `예: '${optBName}'의 단점 / 우려되는 측면`;

  renderListContainer("prosA", "list-pros-a", placeholderProA);
  renderListContainer("consA", "list-cons-a", placeholderConA);
  renderListContainer("prosB", "list-pros-b", placeholderProB);
  renderListContainer("consB", "list-cons-b", placeholderConB);
}

function renderListContainer(stateKey, listId, placeholder) {
  const container = document.getElementById(listId);
  container.innerHTML = "";
  
  const items = state[stateKey];
  if (items.length === 0) {
    items.push("");
  }

  items.forEach((val, idx) => {
    createListItemElement(container, stateKey, val, placeholder);
  });
}

function createListItemElement(container, stateKey, value, placeholder) {
  const itemDiv = document.createElement("div");
  itemDiv.className = "dynamic-item";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "form-control";
  input.placeholder = placeholder;
  input.value = value;
  
  // Save content changes on typing
  input.addEventListener("input", () => {
    const parent = input.parentElement.parentElement;
    state[stateKey] = Array.from(parent.querySelectorAll(".form-control")).map(inp => inp.value.trim());
    saveState();
  });

  const btnDel = document.createElement("button");
  btnDel.className = "btn-icon-del";
  btnDel.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>`;
  
  btnDel.addEventListener("click", () => {
    const parentContainer = itemDiv.parentElement;
    itemDiv.remove();
    // Re-sync state
    state[stateKey] = Array.from(parentContainer.querySelectorAll(".form-control")).map(inp => inp.value.trim());
    saveState();
  });

  itemDiv.appendChild(input);
  itemDiv.appendChild(btnDel);
  container.appendChild(itemDiv);
}

function addListItem(stateKey, listId) {
  const container = document.getElementById(listId);
  let placeholder = "항목 입력";
  if (stateKey.startsWith("pros")) placeholder = "예: 긍정적인 요소 추가";
  if (stateKey.startsWith("cons")) placeholder = "예: 부정적인 요소 추가";

  createListItemElement(container, stateKey, "", placeholder);
  state[stateKey].push("");
  saveState();
}

function collectListItems(listId) {
  const container = document.getElementById(listId);
  return Array.from(container.querySelectorAll(".form-control"))
    .map(input => input.value.trim())
    .filter(val => val !== "");
}

// Render quiz items dynamically
function renderQuiz() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "";

  window.quizQuestions.forEach((q, idx) => {
    const initialVal = state.quiz[idx] !== undefined ? state.quiz[idx] : 3;

    const quizItem = document.createElement("div");
    quizItem.className = "quiz-item";
    quizItem.innerHTML = `
      <div class="quiz-header">
        <span class="quiz-number">Q${idx + 1}</span>
        <span class="quiz-question">${q.text}</span>
      </div>
      <div class="slider-container">
        <input type="range" class="range-slider" min="1" max="5" value="${initialVal}" id="slider-${q.id}">
        <div class="slider-labels">
          <span>1 (${q.minLabel})</span>
          <span>3 (보통)</span>
          <span>5 (${q.maxLabel})</span>
        </div>
      </div>
    `;

    container.appendChild(quizItem);
  });
}

// Fake 2-seconds Loading animation
function runFakeLoading() {
  navigateTo("loading");
  const loadingMsg = document.getElementById("loading-message");
  
  const messages = [
    "당신의 고민을 분석 중...",
    "편향 여부 확인 중...",
    "추천안을 생성 중..."
  ];

  let currentMsgIdx = 0;
  loadingMsg.textContent = messages[currentMsgIdx];

  const msgInterval = setInterval(() => {
    currentMsgIdx = (currentMsgIdx + 1) % messages.length;
    loadingMsg.textContent = messages[currentMsgIdx];
  }, 650);

  setTimeout(() => {
    clearInterval(msgInterval);
    renderReport();
  }, 2000);
}

// Generate and Render final analysis report
let radarChartInstance = null;
function renderReport() {
  // 1. Run scoring algorithm
  const result = window.calculateScore(state);
  const biases = window.analyzeBias(state.quiz);
  const recommendation = window.generateRecommendation(state, result.scoreA, result.scoreB);

  // 2. Set text content
  document.getElementById("result-topic").textContent = `[${state.title}] 분석 리포트`;
  
  document.getElementById("result-name-a").textContent = state.optionA;
  document.getElementById("result-score-a").textContent = `${result.scoreA}점`;
  
  document.getElementById("result-name-b").textContent = state.optionB;
  document.getElementById("result-score-b").textContent = `${result.scoreB}점`;

  // Bar chart animation
  const barA = document.getElementById("bar-result-a");
  const barB = document.getElementById("bar-result-b");
  barA.style.width = "0%";
  barB.style.width = "0%";

  setTimeout(() => {
    barA.style.width = `${result.scoreA}%`;
    barB.style.width = `${result.scoreB}%`;
  }, 100);

  // 3. Highlight Winner Card
  const cardA = document.getElementById("card-result-a");
  const cardB = document.getElementById("card-result-b");
  cardA.classList.remove("winner");
  cardB.classList.remove("winner");

  if (result.scoreA > result.scoreB) {
    cardA.classList.add("winner");
  } else {
    cardB.classList.add("winner");
  }

  // 4. Render Cognitive Biases
  const biasContainer = document.getElementById("result-bias-container");
  biasContainer.innerHTML = "";
  if (biases.length === 0) {
    biasContainer.innerHTML = `
      <div style="color: var(--success); font-weight: 500; font-size: 0.95rem; display: flex; align-items: center; gap: 0.35rem; width: 100%;">
        ✅ 특별한 부정적 심리 편향이 감지되지 않았습니다. 비교적 합리적인 인지 상태입니다.
      </div>`;
  } else {
    biases.forEach(bias => {
      const badgeClass = bias.level === "위험" ? "btn-danger" : "badge-warning";
      const badgeIcon = bias.level === "위험" ? "🚨" : "⚠️";
      
      const badgeDiv = document.createElement("div");
      badgeDiv.style.width = "100%";
      badgeDiv.style.marginBottom = "0.75rem";
      badgeDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem;">
          <span class="badge ${badgeClass}">${badgeIcon} ${bias.title}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); line-height: 1.4; padding-left: 0.5rem;">${bias.description}</p>
      `;
      biasContainer.appendChild(badgeDiv);
    });
  }

  // 5. Render Recommendation Advice
  document.getElementById("recommendation-title").textContent = recommendation.title;
  document.getElementById("recommendation-desc").textContent = recommendation.text;

  // 6. Draw Radar Chart using Chart.js
  drawRadarChart();

  navigateTo("result");
}

function drawRadarChart() {
  const ctx = document.getElementById("radarChart").getContext("2d");
  
  if (radarChartInstance) {
    radarChartInstance.destroy();
  }

  // Map state quiz metrics:
  // 안정성 (Q1), 보상 (Q2), 성장 (Q3), 사회적 시선 (Q4), 리스크 감수 (6-Q5), 스트레스 (Q6)
  const stability = state.quiz[0];
  const reward = state.quiz[1];
  const growth = state.quiz[2];
  const social = state.quiz[3];
  const riskTaking = 6 - state.quiz[4]; // Invert loss aversion (Q5) to show active risk-tolerance
  const stress = state.quiz[5];

  radarChartInstance = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['안정 지향', '보상 가치', '도전/성장', '사회적 의식', '리스크 수용', '스트레스 지수'],
      datasets: [{
        label: '나의 의사결정 지표',
        data: [stability, reward, growth, social, riskTaking, stress],
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#6366f1'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true,
            color: 'rgba(226, 232, 240, 0.8)'
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.8)'
          },
          suggestedMin: 1,
          suggestedMax: 5,
          ticks: {
            stepSize: 1,
            display: false // Hide text numbers on grid
          },
          pointLabels: {
            font: {
              family: 'Plus Jakarta Sans',
              size: 11,
              weight: 'bold'
            },
            color: '#1e293b'
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}
