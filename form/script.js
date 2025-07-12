document.getElementById("financeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const rawData = Object.fromEntries(new FormData(form));

  // Приведение типов
  const numericFields = [
    "investment",
    "loanPercent",
    "loanTerm",
    "loanHoliday",
    "revenue",
    "revenueGrowthPercent",
    "salaryExpense",
    "rentExpense",
    "suppliesExpense",
    "otherExpense",
    "horizon",
    "variableExpensesValue",
  ];

  numericFields.forEach((key) => {
    rawData[key] = rawData[key] === "" ? null : Number(rawData[key]);
  });

  rawData.variableExpensesIsPercent =
    rawData.variableExpensesIsPercent === "true";

  const data = { ...rawData };

  console.log("🚀 Отправка JSON:", data);
  document.getElementById("result").innerText = "Выполняется расчет...";

  try {
    const resp = await fetch("http://localhost:8088/api/finance/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error("Ошибка сервера");
    const result = await resp.json();

    document.getElementById("result").innerHTML = `
        <b>Чистая прибыль за срок планирования (NP):</b> ${result.totalNetProfit.toFixed(
          2
        )} тыс ₽<br>
        <b>Рентабельность инвестиций (ROI):</b> ${result.roi.toFixed(2)}%<br>
        <b>Срок окупаемости проекта (PP):</b> ${
          result.paybackMonth > 0
            ? result.paybackMonth + " месяцев"
            : "Не достигнута в горизонте планирования"
        }<br>
        <b>Операционная прибыль (EBITDA):</b> ${result.ebitda.toFixed(
          2
        )} тыс ₽<br>
        <b>Денежный поток (Cash Flow):</b> ${result.cashFlow.toFixed(
          2
        )} тыс ₽<br>
        <b>Точка безубыточности (Break Even):</b> ${
          result.breakEvenMonth > 0
            ? result.breakEvenMonth + " месяцев"
            : "Не достигнута"
        }
      `;
  } catch (err) {
    document.getElementById("result").innerText =
      "Ошибка при расчёте: " + err.message;
  }
});
