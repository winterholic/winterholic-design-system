const themeToggle = document.querySelector("[data-theme-toggle]");

themeToggle?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const next = current ? (current === "dark" ? "light" : "dark") : (prefersDark ? "light" : "dark");
  document.documentElement.dataset.theme = next;
  localStorage.setItem("nt-theme", next);
});

const onboardingSteps = [...document.querySelectorAll("[data-onboarding-step]")];
const stepNames = ["환영", "워크스페이스", "가져오기", "준비 완료"];
const stepLabel = document.querySelector("[data-step-label]");
const stepName = document.querySelector("[data-step-name]");
const stepProgress = document.querySelector("[data-step-progress]");
const backButton = document.querySelector("[data-onboarding-back]");
const skipButton = document.querySelector("[data-onboarding-skip]");
const nextButton = document.querySelector("[data-onboarding-next]");
let currentStep = 0;

function renderOnboarding() {
  onboardingSteps.forEach((step, index) => { step.hidden = index !== currentStep; });
  stepLabel.textContent = `${currentStep + 1} / ${onboardingSteps.length}`;
  stepName.textContent = stepNames[currentStep];
  stepProgress.style.transform = `scaleX(${(currentStep + 1) / onboardingSteps.length})`;
  backButton.hidden = currentStep === 0;
  skipButton.hidden = currentStep !== 2;
  nextButton.innerHTML = currentStep === onboardingSteps.length - 1
    ? '첫 페이지 열기<svg aria-hidden="true"><use href="#i-arrow"></use></svg>'
    : `${currentStep === 0 ? "시작하기" : "계속"}<svg aria-hidden="true"><use href="#i-arrow"></use></svg>`;
}

backButton?.addEventListener("click", () => {
  currentStep = Math.max(0, currentStep - 1);
  renderOnboarding();
});

nextButton?.addEventListener("click", () => {
  if (currentStep < onboardingSteps.length - 1) currentStep += 1;
  renderOnboarding();
});

skipButton?.addEventListener("click", () => {
  currentStep = onboardingSteps.length - 1;
  renderOnboarding();
});

const importTabs = [...document.querySelectorAll("[data-import-tab]")];
const importViews = [...document.querySelectorAll("[data-import-view]")];
const importPrimary = document.querySelector("[data-import-primary]");
const importLabels = { default: "파일 선택", progress: "백그라운드에서 계속", partial: "가져온 문서 열기" };

importTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const viewName = tab.dataset.importTab;
    importTabs.forEach((item) => item.setAttribute("aria-pressed", String(item === tab)));
    importViews.forEach((view) => { view.hidden = view.dataset.importView !== viewName; });
    importPrimary.textContent = importLabels[viewName];
  });
});

renderOnboarding();
