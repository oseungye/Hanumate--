const userInput = document.getElementById("userInput");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");
const loadingBox = document.getElementById("loadingBox");
const loadingText = document.getElementById("loadingText");
const resultBox = document.getElementById("resultBox");
const actionRow = document.getElementById("actionRow");

const naturalTranslation = document.getElementById("naturalTranslation");
const pinyin = document.getElementById("pinyin");
const grammar = document.getElementById("grammar");
const feedback = document.getElementById("feedback");
const contextExpression = document.getElementById("contextExpression");
const culture = document.getElementById("culture");
const hsk = document.getElementById("hsk");

const copyBtn = document.getElementById("copyBtn");
const speakBtn = document.getElementById("speakBtn");
const saveBtn = document.getElementById("saveBtn");
const historyList = document.getElementById("historyList");
const todayPhrase = document.getElementById("todayPhrase");
const todayMeaning = document.getElementById("todayMeaning");

let selectedContext = "friend";
let currentResult = null;

const todayExpressions = [
  { cn: "没关系", ko: "괜찮아 / 신경 쓰지 마" },
  { cn: "辛苦了", ko: "수고했어" },
  { cn: "太好了", ko: "너무 좋다" },
  { cn: "我明白了", ko: "이해했어" },
  { cn: "慢慢来", ko: "천천히 해도 돼" }
];

const expressionDB = [
  {
    keys: ["안녕", "안녕하세요", "반가워", "你好", "您好"],
    translation: {
      friend: "你好！ / 嗨！",
      school: "大家好。",
      travel: "你好，请问……",
      sns: "嗨～",
      formal: "您好。"
    },
    pinyin: "nǐ hǎo / dà jiā hǎo",
    grammar: "你好는 가장 기본적인 인사 표현이며, 您好는 상대를 높이는 공식적 표현입니다.",
    feedback: "친구 사이에서 您好를 쓰면 지나치게 격식 있게 들릴 수 있습니다. 관계에 따라 표현을 조절해야 합니다.",
    culture: "중국어에서는 한국어처럼 존댓말 체계가 촘촘하지 않지만, 您을 사용하면 예의를 나타낼 수 있습니다.",
    hsk: "HSK 1"
  },
  {
    keys: ["고마워", "감사", "谢谢", "감사합니다"],
    translation: {
      friend: "谢谢！ / 谢啦！",
      school: "谢谢大家。",
      travel: "谢谢你。",
      sns: "谢谢啦～",
      formal: "非常感谢。"
    },
    pinyin: "xiè xie / fēi cháng gǎn xiè",
    grammar: "谢谢는 기본 감사 표현이고, 非常感谢는 더 정중한 표현입니다.",
    feedback: "한국어의 '감사합니다'를 항상 非常感谢로 번역하면 일상 대화에서는 다소 딱딱할 수 있습니다.",
    culture: "친구끼리는 谢啦처럼 가볍게 말할 수 있고, 발표나 공식 상황에서는 谢谢大家가 자연스럽습니다.",
    hsk: "HSK 1~2"
  },
  {
    keys: ["미안", "죄송", "对不起", "不好意思"],
    translation: {
      friend: "不好意思。 / 对不起。",
      school: "不好意思，我再说明一下。",
      travel: "不好意思，请问一下。",
      sns: "抱歉啦。",
      formal: "非常抱歉。"
    },
    pinyin: "bù hǎo yì si / duì bù qǐ",
    grammar: "对不起는 직접적인 사과, 不好意思는 가벼운 실례나 민망함을 표현할 때 자주 씁니다.",
    feedback: "모든 '미안해'를 对不起로만 번역하면 상황에 따라 무겁게 들릴 수 있습니다.",
    culture: "중국어 회화에서는 길을 물을 때도 不好意思를 먼저 붙여 자연스럽게 말을 시작합니다.",
    hsk: "HSK 2"
  },
  {
    keys: ["피곤", "힘들어", "累", "졸려"],
    translation: {
      friend: "我今天很累。",
      school: "我今天有点累。",
      travel: "走了很久，我有点累。",
      sns: "今天累死了。",
      formal: "我今天状态不太好。"
    },
    pinyin: "wǒ jīn tiān hěn lèi",
    grammar: "很累는 '매우 피곤하다'라는 뜻이며, 有点累는 '조금 피곤하다'처럼 완곡한 표현입니다.",
    feedback: "累死了는 실제로 죽는다는 뜻이 아니라 '너무 피곤하다'는 과장 표현입니다.",
    culture: "친한 사이에서는 累死了처럼 과장 표현을 쓰지만, 공식 상황에서는 状态不太好처럼 완곡하게 표현합니다.",
    hsk: "HSK 2~3"
  },
  {
    keys: ["배고파", "밥", "먹었어", "吃饭", "饿"],
    translation: {
      friend: "我饿了。 / 你吃饭了吗？",
      school: "我还没吃饭。",
      travel: "附近有好吃的吗？",
      sns: "饿了，想吃好吃的。",
      formal: "我还没有用餐。"
    },
    pinyin: "wǒ è le / nǐ chī fàn le ma",
    grammar: "了는 상태 변화나 완료를 나타내며, 我饿了는 '배고파졌다'는 느낌입니다.",
    feedback: "한국어의 '밥 먹었어?'는 중국어에서 你吃饭了吗？로 표현되며, 인사처럼 쓰이기도 합니다.",
    culture: "중국어권에서 吃饭了吗？는 실제 식사 여부뿐 아니라 가벼운 안부 인사로도 사용됩니다.",
    hsk: "HSK 1~2"
  },
  {
    keys: ["좋아", "좋다", "喜欢", "마음에 들어"],
    translation: {
      friend: "我喜欢这个。",
      school: "我认为这个很好。",
      travel: "这个地方很好。",
      sns: "太喜欢了！",
      formal: "我对此很满意。"
    },
    pinyin: "wǒ xǐ huān zhè ge",
    grammar: "喜欢은 '좋아하다'라는 동사이고, 好는 상태나 평가를 나타내는 형용사입니다.",
    feedback: "한국어 '좋아'는 상황에 따라 喜欢, 好, 不错 등으로 달라집니다.",
    culture: "중국어에서는 감정 표현을 할 때 太…了 구조를 자주 사용해 강조합니다.",
    hsk: "HSK 1~2"
  },
  {
    keys: ["눈치", "분위기", "상황 파악"],
    translation: {
      friend: "你要看气氛。",
      school: "需要根据情况来判断。",
      travel: "要注意当时的情况。",
      sns: "看气氛吧。",
      formal: "需要结合具体语境判断。"
    },
    pinyin: "kàn qì fēn / gēn jù qíng kuàng pàn duàn",
    grammar: "看气氛은 '분위기를 보다', 根据情况判断은 '상황에 따라 판단하다'라는 뜻입니다.",
    feedback: "'눈치'는 중국어로 한 단어로 완전히 대응되기 어렵기 때문에 직역하면 어색해집니다.",
    culture: "한국어의 '눈치'는 사회적 맥락을 강하게 포함하므로, 중국어에서는 상황에 따라 풀어서 표현하는 것이 자연스럽습니다.",
    hsk: "HSK 4 이상"
  },
  {
    keys: ["화이팅", "힘내", "加油", "응원"],
    translation: {
      friend: "加油！",
      school: "希望大家一起努力。",
      travel: "加油，别担心！",
      sns: "冲呀！加油！",
      formal: "祝你顺利。"
    },
    pinyin: "jiā yóu",
    grammar: "加油는 응원, 격려, 힘내라는 의미로 폭넓게 쓰입니다.",
    feedback: "한국어 '파이팅'을 그대로 음역하기보다 加油를 쓰는 것이 자연스럽습니다.",
    culture: "중국어권에서 加油는 시험, 경기, 발표 등 다양한 상황에서 쓰이는 대표적 응원 표현입니다.",
    hsk: "HSK 2"
  }
];

const fallbackResult = {
  translation: {
    friend: "이 표현은 직접 데이터에 없지만, 친구 상황에서는 짧고 자연스럽게 표현하는 것이 좋습니다.",
    school: "이 표현은 발표 상황에서는 문장을 더 정중하고 명확하게 다듬는 것이 좋습니다.",
    travel: "이 표현은 여행 상황에서는 请问, 可以 같은 완곡한 표현을 함께 쓰면 자연스럽습니다.",
    sns: "이 표현은 SNS에서는 짧고 감정이 드러나는 표현으로 바꾸면 좋습니다.",
    formal: "이 표현은 공식 상황에서는 非常, 请, 麻烦您 같은 정중한 표현을 쓰는 것이 좋습니다."
  },
  pinyin: "입력 표현에 따라 달라집니다.",
  grammar: "입력한 표현은 데이터베이스에 없는 문장이므로, 핵심 단어를 중심으로 의미와 어순을 다시 확인해 보세요.",
  feedback: "중국어 학습자는 한국어 어순을 그대로 옮기거나, 맥락을 고려하지 않고 직역하는 오류를 자주 범합니다.",
  culture: "중국어는 상황, 관계, 말투에 따라 같은 의미도 다르게 표현됩니다. 단순 번역보다 사용 맥락을 함께 확인하는 것이 중요합니다.",
  hsk: "분석 필요"
};

function setTodayExpression() {
  const index = new Date().getDate() % todayExpressions.length;
  todayPhrase.textContent = todayExpressions[index].cn;
  todayMeaning.textContent = todayExpressions[index].ko;
}

function findBestMatch(input) {
  const normalized = input.toLowerCase().trim();

  let best = null;
  let score = 0;

  expressionDB.forEach(item => {
    let currentScore = 0;

    item.keys.forEach(key => {
      if (normalized.includes(key.toLowerCase())) {
        currentScore += key.length;
      }
    });

    if (currentScore > score) {
      score = currentScore;
      best = item;
    }
  });

  return best || fallbackResult;
}

function analyzeExpression(input) {
  const result = findBestMatch(input);
  const translated = result.translation[selectedContext] || result.translation.friend;

  const directWarning = input.includes("눈치") || input.includes("정") || input.includes("화이팅")
    ? "이 표현은 문화적 의미가 강해 직역하면 어색할 수 있습니다."
    : "이 표현은 상황에 따라 말투를 조절하면 더 자연스럽습니다.";

  return {
    natural: translated,
    pinyin: result.pinyin,
    grammar: result.grammar,
    feedback: `${result.feedback} ${directWarning}`,
    context: makeContextComparison(result),
    culture: result.culture,
    hsk: result.hsk
  };
}

function makeContextComparison(result) {
  if (!result.translation) return "상황별 표현을 추가 학습해 보세요.";

  return `
친구: ${result.translation.friend}
발표: ${result.translation.school}
여행: ${result.translation.travel}
SNS: ${result.translation.sns}
공식: ${result.translation.formal}
  `.trim();
}

function showLoading(callback) {
  const steps = [
    "표현을 분석하는 중...",
    "맥락을 확인하는 중...",
    "학습자 오류 유형을 점검하는 중...",
    "상황별 표현을 정리하는 중..."
  ];

  loadingBox.classList.remove("hidden");
  resultBox.classList.add("hidden");
  actionRow.classList.add("hidden");

  let step = 0;
  loadingText.textContent = steps[step];

  const interval = setInterval(() => {
    step += 1;
    if (step < steps.length) {
      loadingText.textContent = steps[step];
    } else {
      clearInterval(interval);
      loadingBox.classList.add("hidden");
      callback();
    }
  }, 450);
}

function renderResult(result) {
  currentResult = result;

  naturalTranslation.textContent = result.natural;
  pinyin.textContent = result.pinyin;
  grammar.textContent = result.grammar;
  feedback.textContent = result.feedback;
  contextExpression.textContent = result.context;
  culture.textContent = result.culture;
  hsk.textContent = result.hsk;

  resultBox.classList.remove("hidden");
  actionRow.classList.remove("hidden");
}

function saveHistory(input, result) {
  const history = JSON.parse(localStorage.getItem("yujingHistory") || "[]");
  history.unshift({
    input,
    output: result.natural,
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("yujingHistory", JSON.stringify(history.slice(0, 5)));
  renderHistory();
}

function renderHistory() {
  const history = JSON.parse(localStorage.getItem("yujingHistory") || "[]");

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<li>아직 학습 기록이 없습니다.</li>";
    return;
  }

  history.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.input}</strong><br><span>${item.output}</span>`;
    historyList.appendChild(li);
  });
}

document.querySelectorAll(".context").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".context").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedContext = btn.dataset.context;
  });
});

analyzeBtn.addEventListener("click", () => {
  const input = userInput.value.trim();

  if (!input) {
    alert("분석할 표현을 입력해 주세요.");
    return;
  }

  showLoading(() => {
    const result = analyzeExpression(input);
    renderResult(result);
    saveHistory(input, result);
  });
});

clearBtn.addEventListener("click", () => {
  userInput.value = "";
  resultBox.classList.add("hidden");
  actionRow.classList.add("hidden");
});

copyBtn.addEventListener("click", async () => {
  if (!currentResult) return;

  await navigator.clipboard.writeText(currentResult.natural);
  copyBtn.textContent = "복사됨";
  setTimeout(() => {
    copyBtn.textContent = "복사";
  }, 1200);
});

speakBtn.addEventListener("click", () => {
  if (!currentResult) return;

  const utterance = new SpeechSynthesisUtterance(currentResult.natural);
  utterance.lang = "zh-CN";
  speechSynthesis.speak(utterance);
});

saveBtn.addEventListener("click", () => {
  if (!currentResult) return;

  const saved = JSON.parse(localStorage.getItem("yujingSaved") || "[]");
  saved.unshift(currentResult);
  localStorage.setItem("yujingSaved", JSON.stringify(saved.slice(0, 10)));

  saveBtn.textContent = "저장됨";
  setTimeout(() => {
    saveBtn.textContent = "즐겨찾기 저장";
  }, 1200);
});

setTodayExpression();
renderHistory();