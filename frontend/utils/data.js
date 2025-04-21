const lineChartOpts_quotes = {
  chart: {
    height: 380,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#34c38f", "#556ee6", "#34c38f"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [3, 3],
    curve: "straight",
  },
  series: [
    {
      name: "High - 2018",
      data: [221, 894, 500, 700, 190, 550, 950],
    },
    {
      name: "Low - 2018",
      data: [14, 11, 16, 12, 17, 13, 12],
    },
  ],
  title: {
    text: "Quotes",
    align: "left",
    style: {
      fontWeight: "500",
    },
  },
  grid: {
    row: {
      colors: ["transparent", "transparent"],
      opacity: 0.2,
    },
    borderColor: "#9ca3af20",
  },
  markers: {
    size: 6,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    title: {
      text: "Month",
    },
  },
  yaxis: {
    title: {
      text: "",
    },
    min: 100,
    max: 1000,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};

const lineChartOpts_sales = {
  chart: {
    height: 380,
    type: "line",
    zoom: {
      enabled: false,
    },
    toolbar: {
      show: false,
    },
  },
  colors: ["#556ee6", "#34c38f"],
  dataLabels: {
    enabled: false,
  },
  stroke: {
    width: [3, 3],
    curve: "straight",
  },
  series: [
    {
      name: "High - 2018",
      data: [221, 794, 300, 400, 890, 750, 650],
    },
    {
      name: "Low - 2018",
      data: [14, 11, 16, 12, 17, 13, 12],
    },
  ],
  title: {
    text: "Sales",
    align: "left",
    style: {
      fontWeight: "500",
    },
  },
  grid: {
    row: {
      colors: ["transparent", "transparent"],
      opacity: 0.2,
    },
    borderColor: "#9ca3af20",
  },
  markers: {
    size: 6,
  },
  xaxis: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    title: {
      text: "Month",
    },
  },
  yaxis: {
    title: {
      text: "",
    },
    min: 100,
    max: 1000,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
    floating: true,
    offsetY: -25,
    offsetX: -5,
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        chart: {
          toolbar: {
            show: false,
          },
        },
        legend: {
          show: false,
        },
      },
    },
  ],
};
const defaultEvents = [
  // {
  //   id: "1",
  //   title: "Interview - Backend Engineer",
  //   start: new Date(),
  //   className: "bg-success",
  // },
  // {
  //   id: "2",
  //   title: "Phone Screen - Frontend Engineer",
  //   start: new Date().setDate(new Date().getDate() + 2),
  //   className: "bg-info",
  // },
  // {
  //   id: "3",
  //   title: "Meeting with John Deo",
  //   start: new Date().setDate(new Date().getDate() + 2),
  //   end: new Date().setDate(new Date().getDate() + 4),
  //   className: "bg-warning",
  // },
  // {
  //   id: "4",
  //   title: "Buy a Theme",
  //   start: new Date().setDate(new Date().getDate() + 4),
  //   end: new Date().setDate(new Date().getDate() + 5),
  //   className: "bg-primary",
  // },
];

export { lineChartOpts_quotes, lineChartOpts_sales, defaultEvents };
