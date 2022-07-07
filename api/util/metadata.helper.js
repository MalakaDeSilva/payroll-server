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
    "OCT",
    "NOV",
    "DEC",
  ];

  const year = d.getFullYear();

  let code = year + monthCodes[d.getMonth()];

  return payCycle == "" ? code : payCycle;
}

module.exports = {
  getPayCycle,
};
