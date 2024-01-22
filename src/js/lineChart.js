async function initializeChart() {
  var ctx = document.getElementById("Chart").getContext("2d");
  if (window.myChart) window.myChart.destroy();
  var lineChartData = {
    labels: ["0", "15", "30", "45", "60", "75", "90"],
    datasets: [
      {
        label: labelYellow,
        borderColor: "rgba(220,180,0,1)",
        pointBackgroundColor: "rgba(220,180,0,1)",
        data: dataYellow,
        tension: 0.1,
      },
      {
        label: labelRed,
        borderColor: "rgba(193, 27, 33, 1)",
        pointBackgroundColor: "rgba(193, 27, 33, 1)",
        data: dataRed,
        tension: 0.1,
      },
    ],
  };

  window.myChart = new Chart(ctx, {
    type: "line",
    data: lineChartData,
    options: {
      animations: false,
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 4,
          max: 24,
          title: {
            display: true,
            text: "Concrete Slump (cm)",
            font: { size: 14, family: "Montserrat" },
          },
        },
        x: {
          title: {
            display: true,
            text: "Time (min)",
            font: { size: 14, family: "Montserrat" },
          },
          /*        grid: {
            display: false
          } */
        },
      },
      plugins: {
        legend: { display: true, labels: { usePointStyle: true } },
        title: {
          display: true,
          color: "#000",
          text: titleText,
          font: { size: 16, family: "Montserrat" },
        },
      },
    },
  });
}

window.onload = async function () {
  initializeChart();
  await new Promise((resolve) => setTimeout(resolve, 100));
  initializeChart();
};

window.onresize = async function () {
  initializeChart();
  await new Promise((resolve) => setTimeout(resolve, 100));
  initializeChart();
};
