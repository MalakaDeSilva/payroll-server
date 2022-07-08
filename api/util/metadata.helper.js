function getPayCycle(payCycle = "") {
  let d = new Date();

  const monthCodes = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OVT",
    "NOV",
    "DEC",
  ];

  const year = d.getFullYear();

  let code = year + monthCodes[d.getMonth()];

  return payCycle == "" ? code : payCycle;
}

function getMonthYearFromPayCycle(payCycle) {
  let months = new Map();
  months.set("JAN", "January");
  months.set("FEB", "February");
  months.set("MAR", "March");
  months.set("APR", "April");
  months.set("MAY", "May");
  months.set("JUN", "June");
  months.set("JUL", "July");
  months.set("AUG", "August");
  months.set("SEP", "September");
  months.set("OCT", "October");
  months.set("NOV", "Novembar");
  months.set("DEC", "Decembar");

  let year = payCycle.slice(0, 4);
  let month = months.get(payCycle.slice(4));

  return { year, month };
}

module.exports = {
  getPayCycle,
  getMonthYearFromPayCycle
};
