//MAPA TASA PARO
google.load("visualization", { packages: ["geochart"] });
google.setOnLoadCallback(drawMarkersMap1);

function drawMarkersMap1() {
  var data = google.visualization.arrayToDataTable([
    ["Provincia", "TasaDeParo"],
    [{ v: "ES-GA", f: "Galicia" }, 12],
    [{ v: "ES-AS", f: "Asturias" }, 14],
    [{ v: "ES-CB", f: "Cantabria" }, 12],
    [{ v: "ES-PV", f: "Country Vasco" }, 10],
    [{ v: "ES-RI", f: "La Rioja" }, 10],
    [{ v: "ES-NC", f: "Navarra" }, 12],
    [{ v: "ES-AR", f: "Aragón" }, 12],
    [{ v: "ES-CT", f: "Cataluña" }, 14],
    [{ v: "ES-CL", f: "Castilla y León" }, 12],
    [{ v: "ES-MD", f: "Madrid" }, 14],
    [{ v: "ES-CM", f: "Castilla y la Mancha" }, 17],
    [{ v: "ES-VC", f: "Valencia" }, 16],
    [{ v: "ES-EX", f: "Extremadura" }, 21],
    [{ v: "ES-MC", f: "Murcia" }, 15],
    [{ v: "ES-AN", f: "Andalucía" }, 23],
    [{ v: "ES-CN", f: "Islas Canarias" }, 26],
    [{ v: "ES-IB", f: "Islas Baleares" }, 17],
  ]);

  var options = {
    region: "ES",
    resolution: "provinces",
    enableRegionInteractivity: "true",
    colorAxis: {
      values: [10, 12, 14, 15, 16, 17, 21, 23, 25],
      colors: [
        "#6A20EC",
        "#2045EC",
        "#20BBEC",
        "#20ECD0",
        "#20EC95",
        "#5BEC20",
        "#DDEC20",
        "#ECB120",
        "#e31b23",
      ],
    },
    legend: { textStyle: { color: "blue", fontSize: 16 } },
    backgroundColor: "#fff",
    // datalessRegionColor: '#BBB9B2',
    // defaultColor: '#f5f5f5',
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("chart_div")
  );
  chart.draw(data, options);

  function resizeHandler() {
    chart.draw(data, options);
  }
  if (window.addEventListener) {
    window.addEventListener("resize", resizeHandler, false);
  } else if (window.attachEvent) {
    window.attachEvent("onresize", resizeHandler);
  }
}

//MAPA Skills
google.load("visualization", { packages: ["geochart"] });
google.setOnLoadCallback(drawMarkersMap);

function drawMarkersMap() {
  var data = google.visualization.arrayToDataTable([
    ["Provincia", "Most demanded professions"],
    [
      {
        v: "ES-GA",
        f: "GALICIA. Carretilleros, comerciales, alimentación, oficios y operarios, perfiles IT, tecnicos de mantenimiento",
      },
      1,
    ],
    [{ v: "ES-AS", f: "ASTURIAS. Perfiles IT" }, 2],
    [
      {
        v: "ES-CB",
        f: "CANTABRIA. Oficios y operarios, fresadores, soldadores, caldereros",
      },
      3,
    ],
    [
      {
        v: "ES-PV",
        f: "Country VASCO. Oficios y operarios, técnicos y peones industriales, ingenieros industriales, personal sanitario, perfiles IT",
      },
      4,
    ],
    [
      {
        v: "ES-RI",
        f: "LA RIOJA. Técnicos de mantenimiento, electricistas, soldadores, fontaneros",
      },
      5,
    ],
    [
      {
        v: "ES-NC",
        f: "NAVARRA. Oficios y operarios, profesiones de impresión, troquelado, personal sanitario, perfiles IT",
      },
      6,
    ],
    [
      {
        v: "ES-AR",
        f: "ARAGÓN. Técnicos de mantenimiento, conductores, mecánicos, personal sanitario, comerciales",
      },
      7,
    ],
    [
      {
        v: "ES-CT",
        f: "CATALUÑA. Perfiles IT, comerciales, carretilleros, profesionales con idiomas",
      },
      8,
    ],
    [
      {
        v: "ES-CL",
        f: "CASTILLA Y LEÓN. Técnicos de mantenimiento, personal sanitario, soldadores, operarios cárnicos, electromecanicos, teleoperadores",
      },
      9,
    ],
    [
      {
        v: "ES-MD",
        f: "MADRID. Informáticos, carretilleros, oficios y operarios",
      },
      10,
    ],
    [
      {
        v: "ES-CM",
        f: "CASTILLA Y LA MANCHA. Soldadores, operarios cárnicos, carretilleros, técnicos y peones industriales",
      },
      11,
    ],
    [
      {
        v: "ES-VC",
        f: "VALENCIA. Ingenieros industriales, electromecánicos, carretilleros, oficios y operarios, tecnicos de mantenimiento, horneros",
      },
      12,
    ],
    [
      {
        v: "ES-EX",
        f: "EXTREMADURA. Perfiles IT, técnicos de laboratorio, personal sanitario, electromecánicos, técnicos de mantenimiento",
      },
      13,
    ],
    [
      {
        v: "ES-MC",
        f: "MURCIA. Personal sanitario, perfiles IT, oficios y operarios, profesionales con idiomas, carretilleros",
      },
      14,
    ],
    [
      {
        v: "ES-AN",
        f: "ANADALUCÍA. Perfiles IT, personal sanitario, técnicos de laboratorio, técnicos de mantenimiento, electromecánicos",
      },
      15,
    ],
    [
      {
        v: "ES-CN",
        f: "ISLAS CANARIAS. Comerciales, perfiles IT, electromecánicos, enfermeros",
      },
      16,
    ],
    [
      {
        v: "ES-IB",
        f: "ISLAS BALEARES. Personal sanitario, ingenieros industriales, oficios y operarios, profesionales con idiomas",
      },
      17,
    ],
  ]);

  var options = {
    region: "ES",
    resolution: "provinces",
    enableRegionInteractivity: "true",
    colorAxis: {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
      colors: [
        "#1FC1D7",
        "#2F68EB",
        "#fff",
        "#369C2A",
        "#E1D133",
        "#E15533",
        "#D21E13",
        "#E1F517",
        "#AA1EDA",
        "#DA1E2C",
        "#DA1E6B",
        "#DAC91E",
        "#050101",
        "#670D37",
        "#8CE69B",
        "#D5C509",
        "#842CC4",
      ],
    },
    backgroundColor: "#fff",
    // datalessRegionColor: '#BBB9B2',
    // defaultColor: '#f5f5f5',
  };

  var chart = new google.visualization.GeoChart(
    document.getElementById("chart_hab")
  );
  chart.draw(data, options);

  function resizeHandler() {
    chart.draw(data, options);
  }
  if (window.addEventListener) {
    window.addEventListener("resize", resizeHandler, false);
  } else if (window.attachEvent) {
    window.attachEvent("onresize", resizeHandler);
  }
}

//SANKEY Skills
google.charts.load("current", { packages: ["sankey"] });
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  var data = new google.visualization.DataTable();
  data.addColumn("string", "From");
  data.addColumn("string", "To");
  data.addColumn("number", "Weight");
  data.addRows([
    ["Big Data", "Adm.Sistemas", 1497],
    ["Big Data", "Bases de datos", 1000],
    ["Big Data", "Python", 945],
    ["Big Data", "Ing.software", 1100],

    ["Data Science", "Bases de datos", 1800],
    ["Data Science", "Python", 1400],
    ["Data Science", "Matemáticas", 950],
    ["Data Science", "Estadística", 990],

    ["Ingeniero informático", "Ing.software", 1475],
    ["Ingeniero informático", "Matemáticas", 500],
    ["Ingeniero informático", "Sistemas computacionales", 1100],

    ["Programador", "Bases de datos", 500],
    ["Programador", "Javascript", 1500],
    ["Programador", "Git", 800],
    ["Programador", "Frontend", 1000],
    ["Programador", "Backend", 1000],

    ["Ingeniero industrial", "Matemáticas", 1010],
    ["Ingeniero industrial", "Logística", 1210],
    ["Ingeniero industrial", "Adm.operaciones", 1210],

    ["Account manager", "Adm.operaciones", 2000],
    ["Account manager", "Facturación", 1500],
    ["Account manager", "Cartera de clientes", 1300],
    ["Account manager", "Comercial", 1300],

    ["Resp.CiberSecurity", "Adm.Sistemas", 2200],
    ["Resp.CiberSecurity", "Capacidad analítica", 1100],
    ["Resp.CiberSecurity", "Ing.software", 900],
    ["Resp.CiberSecurity", "Ing.hardware", 900],

    ["Resp.RRHH", "Gestión de personal", 2000],
    ["Resp.RRHH", "Nóminas", 1400],
    ["Resp.RRHH", "Derecho laboral", 1400],
    ["Resp.RRHH", "Selección de personal", 1000],

    ["UX Manager", "Creatividad", 2000],
    ["UX Manager", "Psicología", 1000],
    ["UX Manager", "Capacidad analítica", 1800],
  ]);

  // Sets chart options.
  var options = {
    width: 650,
    height: 500,
  };

  // Instantiates and draws our chart, passing in some options.
  var chart = new google.visualization.Sankey(
    document.getElementById("sankey_basic")
  );
  chart.draw(data, options);

  function resizeHandler() {
    chart.draw(data, options);
  }
  if (window.addEventListener) {
    window.addEventListener("resize", resizeHandler, false);
  } else if (window.attachEvent) {
    window.attachEvent("onresize", resizeHandler);
  }
}
