// class APIHandler {
//     constructor(baseUrl) {
//         this.BASE_URL = baseUrl
//     }
// }

// const jobsAPI = new APIHandler (`${HOST_CHARTS}`)

// const getDataInfo = (url) => {
//     axios
//         .get(url)
//         .then((response) => {
//             //console.log(response.data.results)
//             const generalData = response.data
//             //console.log(generalData)

//             //LOCATION
//             const location = Object.values(generalData).map((jobLocation) => jobLocation['locations'])
//             //console.log (location)
//             const defLocations = location.map((jl) => jl['0'])
//             //console.log(defLocations)
//             const xAxis = defLocations.map((jl) => jl['name'])
//             //console.log(xAxis)

//             const remoteLength = xAxis.filter(place => place === 'Flexible / Remote').length
//             //console.log (remoteLength)

//             //CATEGORIES
//             const yAxis = Object.values(generalData).map((jobName) => jobName['name'])
//             //console.log(yAxis)

//             paintData1(remoteLength, xAxis.length - remoteLength)
//             paintData2(remoteLength, xAxis.length - remoteLength)

//         })
//         .catch((e)=> console.log(e))
// }

//Telecommuting actualmente
new Chart(document.getElementById("circleGraphic").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: ["Telecommuting", "Presencial"],
    datasets: [
      {
        data: [1000, 600],
        backgroundColor: ["#20ECAB", "#20ABEC"],
      },
    ],
  },
});

//Telecommuting years anteriores
new Chart(document.getElementById("circleGraphic2").getContext("2d"), {
  type: "doughnut",
  data: {
    labels: ["Telecommuting", "Presencial"],
    datasets: [
      {
        data: [300, 1800],
        backgroundColor: ["#20ECAB", "#20ABEC"],
      },
    ],
  },
});

//Profesiones mas demandadas
new Chart(document.getElementById("lineGraphic"), {
  type: "line",
  data: {
    labels: [2014, 2015, 2016, 2017, 2018, 2019],
    datasets: [
      {
        data: [31, 13, 1, 3, 5, 1],
        label: "Big Data",
        borderColor: "#3e95cd",
        fill: false,
      },
      {
        data: [, , , 18, 6, 2],
        label: "Data Science",
        borderColor: "#8e5ea2",
        fill: false,
      },
      {
        data: [43, , , 1, 2, 3],
        label: "Ingeniero Informático",
        borderColor: "#3cba9f",
        fill: false,
      },
      {
        data: [, , , , 3, 4],
        label: "Operarios cualificados",
        borderColor: "#e8c3b9",
        fill: false,
      },
      {
        data: [7, 1, 24, 16, 4, 5],
        label: "Ingeniero Industrial",
        borderColor: "#c45850",
        fill: false,
      },
      {
        data: [1, , , 4, 1, 6],
        label: "Account Manager",
        borderColor: "#CAEC20",
        fill: false,
      },
    ],
  },
  options: {
    title: {
      display: true,
      text: "Ranking de Most demanded professions (2014 - 2019)",
    },
  },
});

//Most demanded professions2
new Chart(document.getElementById("bar-chart-horizontal"), {
  type: "horizontalBar",
  data: {
    labels: [
      "Big Data",
      "Data Science",
      "Comercial Digital",
      "Ing. informático",
      "Programador",
      "Ing. Industrial",
      "Operarios cualificados",
      "Resp. ciberSecurity",
      "Resp. HR",
      "CTO",
      "Desarrollador aplicaciones multimedia",
      "Especialistas e-commerce development",
      "Senior key account manager",
      "Ing. de proyectos",
      "Médico",
      "UX manager",
      "Consultor",
    ],

    datasets: [
      {
        label: "Most demanded professions en un futuro próximo",
        backgroundColor: [
          "#3e95cd",
          "#8e5ea2",
          "#3cba9f",
          "#e8c3b9",
          "#c45850",
          "#CAEC20",
          "#ECA220",
          "#1FD7BB",
          "#1F40D7",
          "#D11FD7",
          "#D71F43",
          "#D7B31F",
          "#811FD7",
          "#1FD1D7",
          "#78D71F",
          "#971FD7",
          "#1FC1D7",
        ],
        data: [
          11.24, 9.55, 5.06, 4.49, 4.49, 3.93, 3.37, 3.37, 2.81, 2.25, 2.25,
          2.25, 2.25, 2.25, 2.25, 2.25, 2.25,
        ],
      },
    ],
  },
  options: {
    legend: { display: false },
    title: {
      display: true,
      text: "Most demanded professions en un futuro próximo (de 2 a 3 years)",
    },
  },
});

//getDataInfo(`http://localhost:8000/results`)
