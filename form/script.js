document.getElementById("financeForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const rawData = Object.fromEntries(new FormData(form));

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

  document.getElementById("result").innerHTML =
    '<i class="fa fa-spinner fa-spin"></i> Выполняется расчет...';

  try {
    const resp = await fetch("http://localhost:8088/api/finance/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!resp.ok) throw new Error("Ошибка сервера");
    const result = await resp.json();

    document.getElementById("result").innerHTML = `
      <div><b>Чистая прибыль (NP):</b> ${result.totalNetProfit.toFixed(
        2
      )} тыс ₽</div>
      <div><b>Рентабельность инвестиций (ROI):</b> ${result.roi.toFixed(
        2
      )}%</div>
      <div><b>Срок окупаемости (PP):</b> ${
        result.paybackMonth > 0
          ? result.paybackMonth + " месяцев"
          : "Не достигнута"
      }</div>
      <div><b>EBITDA:</b> ${result.ebitda.toFixed(2)} тыс ₽</div>
      <div><b>Cash Flow:</b> ${result.cashFlow.toFixed(2)} тыс ₽</div>
      <div><b>Точка безубыточности:</b> ${
        result.breakEvenMonth > 0
          ? result.breakEvenMonth + " месяцев"
          : "Не достигнута"
      }</div>
    `;
  } catch (err) {
    document.getElementById("result").innerText =
      "Ошибка при расчёте: " + err.message;
  }
});
