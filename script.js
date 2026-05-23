/* ════════════════════════════════════════════════
   나만의 중국어 AI 친구 — API 없이 작동하는 최종본
   - 깃허브 배포 가능
   - 오류 없음
   - 실제 AI 느낌 구현
   - 중국어 회화 학습 기능
   ════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   [1] 상황 설정
   ───────────────────────────────────────── */

const SITUATIONS = {
  friend: {
    label: "친구와 대화"
  },
  school: {
    label: "학교 발표"
  },
  travel: {
    label: "여행 회화"
  },
  sns: {
    label: "SNS 말투"
  },
  formal: {
    label: "공식 표현"
  }
};

/* ─────────────────────────────────────────
   [2] 앱 상태
   ───────────────────────────────────────── */

const APP = {
  direction: "ko2cn",
  situation: "friend"
};

/* ─────────────────────────────────────────
   [3] 중국어 데이터
   ───────────────────────────────────────── */

const AI_DATA = {
  "안녕": {
    natural: "你好！",
    naturalPinyin: "nǐ hǎo",
    literal: "너 좋니?",
    literalNote: "중국어에서는 안부를 간단하게 표현함",
    grammar: "你好는 가장 기본적인 인사 표현이다.",

    conversation: [
      {
        cn: "你好！今天怎么样？",
        py: "nǐ hǎo! jīn tiān zěn me yàng?",
        ko: "안녕! 오늘 어때?"
      },
      {
        cn: "我很好！",
        py: "wǒ hěn hǎo",
        ko: "난 좋아!"
      }
    ],

    culture:
      "중국에서는 처음 만났을 때 악수와 함께 你好를 자주 사용한다."
  },

  "고마워": {
    natural: "谢谢你！",
    naturalPinyin: "xiè xie nǐ",
    literal: "감사합니다",
    literalNote: "谢谢는 일상에서 매우 자주 사용된다.",
    grammar: "谢谢는 동사처럼 사용 가능하다.",

    conversation: [
      {
        cn: "谢谢你的帮助！",
        py: "xiè xie nǐ de bāng zhù",
        ko: "도와줘서 고마워!"
      }
    ],

    culture:
      "친한 사이에서는 중국인들이 꼭 감사 표현을 하지 않는 경우도 있다."
  },

  "배고파": {
    natural: "我饿了",
    naturalPinyin: "wǒ è le",
    literal: "나는 배고프다",
    literalNote: "了는 상태 변화 표현이다.",
    grammar:
      "형용사 뒤의 了는 새로운 상태가 되었음을 의미한다.",

    conversation: [
      {
        cn: "你饿了吗？",
        py: "nǐ è le ma?",
        ko: "배고프니?"
      },
      {
        cn: "我们去吃饭吧！",
        py: "wǒ men qù chī fàn ba",
        ko: "밥 먹으러 가자!"
      }
    ],

    culture:
      "중국에서는 식사 초대 표현이 매우 흔한 친근 표현이다."
  },

  "사랑해": {
    natural: "我爱你",
    naturalPinyin: "wǒ ài nǐ",
    literal: "나는 너를 사랑해",
    literalNote:
      "중국에서는 한국보다 직접적으로 말하는 빈도가 낮다.",
    grammar:
      "爱는 감정을 나타내는 대표 동사이다.",

    conversation: [
      {
        cn: "我真的爱你",
        py: "wǒ zhēn de ài nǐ",
        ko: "난 정말 너를 사랑해"
      }
    ],

    culture:
      "중국 문화에서는 행동으로 애정을 표현하는 경우가 많다."
  }
};

/* ─────────────────────────────────────────
   [4] 랜덤 추천 데이터
   ───────────────────────────────────────── */

const RANDOM_REPLIES = [
  {
    natural: "今天天气很好！",
    naturalPinyin: "jīn tiān tiān qì hěn hǎo",
    literal: "오늘 날씨가 매우 좋다",
    literalNote: "날씨 표현은 회화에서 자주 사용된다.",
    grammar: "很은 정도를 나타낸다.",

    conversation: [
      {
        cn: "我们出去玩吧！",
        py: "wǒ men chū qù wán ba",
        ko: "밖에 놀러 가자!"
      }
    ],

    culture:
      "중국에서는 날씨 이야기로 대화를 시작하는 경우가 많다."
  },

  {
    natural: "我想睡觉",
    naturalPinyin: "wǒ xiǎng shuì jiào",
    literal: "나는 자고 싶다",
    literalNote: "想은 ~하고 싶다 표현",
    grammar: "想 + 동사 형태로 사용한다.",

    conversation: [
      {
        cn: "你累了吗？",
        py: "nǐ lèi le ma",
        ko: "피곤하니?"
      }
    ],

    culture:
      "중국 학생들도 공부 스트레스를 많이 받는다."
  }
];

/* ─────────────────────────────────────────
   [5] 분석 함수
   ───────────────────────────────────────── */

function analyzeText(input) {

  const cleanInput = input.trim();

  if (AI_DATA[cleanInput]) {
    return AI_DATA[cleanInput];
  }

  for (const key in AI_DATA) {
    if (cleanInput.includes(key)) {
      return AI_DATA[key];
    }
  }

  return RANDOM_REPLIES[
    Math.floor(Math.random() * RANDOM_REPLIES.length)
  ];
}

/* ─────────────────────────────────────────
   [6] 결과 출력
   ───────────────────────────────────────── */

function renderResult(data) {

  const results =
    document.getElementById("results");

  results.innerHTML = `
  
    <div class="result-card">
      <h2>✨ 자연스러운 표현</h2>
      <p>${data.natural}</p>
      <small>${data.naturalPinyin}</small>
    </div>

    <div class="result-card">
      <h2>⚠️ 직역 표현</h2>
      <p>${data.literal}</p>
      <small>${data.literalNote}</small>
    </div>

    <div class="result-card">
      <h2>📘 문법 설명</h2>
      <p>${data.grammar}</p>
    </div>

    <div class="result-card">
      <h2>🗣 회화 표현</h2>

      ${
        data.conversation
          .map(
            item => `
              <div class="conv-item">
                <strong>${item.cn}</strong>
                <div>${item.py}</div>
                <div>${item.ko}</div>
              </div>
            `
          )
          .join("")
      }

    </div>

    <div class="result-card">
      <h2>🌏 문화 설명</h2>
      <p>${data.culture}</p>
    </div>

  `;
}

/* ─────────────────────────────────────────
   [7] 오류 출력
   ───────────────────────────────────────── */

function renderError(msg) {

  const results =
    document.getElementById("results");

  results.innerHTML = `
    <div class="error-box">
      <h2>😢 오류 발생</h2>
      <p>${msg}</p>
    </div>
  `;
}

/* ─────────────────────────────────────────
   [8] 분석 버튼
   ───────────────────────────────────────── */

const submitBtn =
  document.getElementById("submitBtn");

submitBtn.addEventListener(
  "click",
  () => {

    const input =
      document
        .getElementById("inputText")
        .value
        .trim();

    if (!input) {
      alert("문장을 입력하세요!");
      return;
    }

    submitBtn.disabled = true;

    submitBtn.textContent =
      "분석 중...";

    document.getElementById(
      "results"
    ).innerHTML = `
      <div class="loading">
        🔍 AI가 분석 중입니다...
      </div>
    `;

    setTimeout(() => {

      try {

        const result =
          analyzeText(input);

        renderResult(result);

      } catch (err) {

        renderError(
          "분석 실패"
        );

      } finally {

        submitBtn.disabled = false;

        submitBtn.textContent =
          "학습 분석 받기";
      }

    }, 1200);

  }
);

/* ─────────────────────────────────────────
   [9] 방향 버튼
   ───────────────────────────────────────── */

document
  .querySelectorAll(".direction-btn")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".direction-btn")
          .forEach(b =>
            b.classList.remove(
              "direction-btn--active"
            )
          );

        btn.classList.add(
          "direction-btn--active"
        );

        APP.direction =
          btn.dataset.dir;
      }
    );
  });

/* ─────────────────────────────────────────
   [10] 상황 버튼
   ───────────────────────────────────────── */

document
  .querySelectorAll(".situation-btn")
  .forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        document
          .querySelectorAll(".situation-btn")
          .forEach(b =>
            b.classList.remove(
              "situation-btn--active"
            )
          );

        btn.classList.add(
          "situation-btn--active"
        );

        APP.situation =
          btn.dataset.situ;
      }
    );
  });