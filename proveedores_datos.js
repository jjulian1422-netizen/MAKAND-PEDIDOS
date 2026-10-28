// Base de Datos Maestra de Proveedores, Facturación, Precios y Cronograma Logístico
// Fusiona Tabla Comercial (Facturación + Precios + Negociadores) y Tabla Logística (Horas de llegada + Días de entrega + Transporte)

const CATALOGO_MAESTRO = [
  {
    id: "agr-severo",
    nombreComun: "Severo",
    razonSocialFactura: "SEPULVEDA HERNANDEZ SEVERO",
    contacto: "3134352409",
    ubicacion: "Vereda Pueblo Viejo",
    horaCampo: "",
    horaPlanta: "11:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Acelga", precio: 4000, unidadMedida: "caja", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-wilson",
    nombreComun: "Wilson",
    razonSocialFactura: "CACERES LEON WILSON YOANY",
    contacto: "3134649459",
    ubicacion: "Sector El Rosal - Lote 4",
    horaCampo: "",
    horaPlanta: "10:30",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Apio", precio: 10000, unidadMedida: "Doc", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-jesus",
    nombreComun: "Jesús",
    razonSocialFactura: "TERAN TRIVIÑO CAMILO",
    contacto: "3202732853",
    ubicacion: "Finca El Venado / San Isidro",
    horaCampo: "1er Adelanto 11:00 / 2do 14:30 / 3er 17:00",
    horaPlanta: "11:00",
    tiempoFinca: "30 min",
    responsableTransporte: "TRANSPORTE",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Brócoli", precio: 0, unidadMedida: "Unidades", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 50 DIAS", notas: "corte - con la fecha de la factura" }
    ]
  },
  {
    id: "agr-andres-cadena",
    nombreComun: "Andrés Cadena",
    razonSocialFactura: "AGROJAC SAS",
    contacto: "3102612129",
    ubicacion: "Vereda Bojacá - Finca San Isidro",
    horaCampo: "",
    horaPlanta: "11:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Coliflor", precio: 25000, unidadMedida: "Doc", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" },
      { producto: "Brócoli", precio: 0, unidadMedida: "Unidades", negociador: "Claudia Marquez", vigente: true, condicion: "CREDITO 45 DIAS", notas: "Entrega 12:00" },
      { producto: "H Verde (Lechuga)", precio: 950, unidadMedida: "Und", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "Miércoles, Jueves, Viernes a las 12:00" }
    ]
  },
  {
    id: "agr-juan-pablo",
    nombreComun: "Juan Pablo",
    razonSocialFactura: "PARRA AREVALO JUAN PABLO",
    contacto: "3213584936",
    ubicacion: "Vereda Subachoque - Parcela 12",
    horaCampo: "",
    horaPlanta: "11:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Cilantro", precio: 30000, unidadMedida: "At", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 45 DIAS", notas: "Pte pedido jefe de planta" }
    ]
  },
  {
    id: "agr-jose-tibaquicha",
    nombreComun: "José Tibaquicha",
    razonSocialFactura: "HORTALIZAS CHICHA S.A.S",
    contacto: "3123456701",
    ubicacion: "Vereda Chueca - Finca La Primavera",
    horaCampo: "09:30",
    horaPlanta: "11:00",
    tiempoFinca: "60 min",
    responsableTransporte: "TRANS/TERCERO",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Espinaca Bogotana", precio: 3200, unidadMedida: "Kg", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 40 DIAS", notas: "Lunes/Sábado/Domingo: Transporte; Martes a Viernes: Agricultor" }
    ]
  },
  {
    id: "agr-mario-acevedo",
    nombreComun: "Mario Acevedo",
    razonSocialFactura: "ACEVEDO GARCIA MARIO",
    contacto: "3046016685",
    ubicacion: "Vereda La Fuente - Finca Los Pinos",
    horaCampo: "",
    horaPlanta: "11:30",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CLAUDIA MARQUEZ",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Perejil Liso", precio: 700, unidadMedida: "Und", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 30 DIAS", notas: "" },
      { producto: "Perejil Crespo", precio: 700, unidadMedida: "Und", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 30 DIAS", notas: "" },
      { producto: "Espinaca", precio: 2250, unidadMedida: "Kg", negociador: "Maria Claudia Marquez O", vigente: true, condicion: "CREDITO 30 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-diego-castaneda",
    nombreComun: "Diego Castañeda",
    razonSocialFactura: "CASTAÑEDA VARGAS DIEGO ARMANDO",
    contacto: "3123202088",
    ubicacion: "Finca Hidropónica San Diego",
    horaCampo: "10:00",
    horaPlanta: "13:00",
    tiempoFinca: "30 min",
    responsableTransporte: "TRANSPORTE",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado"],
    productos: [
      { producto: "Espinaca Bolsa", precio: 3000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" },
      { producto: "Espinaca Baby", precio: 5232, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" },
      { producto: "Rúgula", precio: 5232, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-gabriel-castaneda",
    nombreComun: "Gabriel Castañeda",
    razonSocialFactura: "NIÑO NIÑO ANGELICA MARIA",
    contacto: "3022169155",
    ubicacion: "Finca Hidropónica El Mirador",
    horaCampo: "10:30",
    horaPlanta: "13:00",
    tiempoFinca: "30 min",
    responsableTransporte: "TRANSPORTE",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Espinaca Bolsa", precio: 3800, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Espinaca Baby", precio: 5450, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "$500 (+) festivos" },
      { producto: "Rúgula", precio: 5450, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-david-pachon",
    nombreComun: "David Pachón",
    razonSocialFactura: "CASTRO SALAMANCA FERNANDO",
    contacto: "3189012345",
    ubicacion: "Sector El Triunfo",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes"],
    productos: [
      { producto: "Tomate Cherry", precio: 5750, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "Cajas x 800g" }
    ]
  },
  {
    id: "agr-edward-parrado",
    nombreComun: "Edward Parrado",
    razonSocialFactura: "VELASQUEZ VELASQUEZ YENNY PATRICIA",
    contacto: "3201234567",
    ubicacion: "Invernaderos La Vega - Módulo A",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes"],
    productos: [
      { producto: "Tomate Cherry", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-gabriel-cruz",
    nombreComun: "Gabriel Cruz",
    razonSocialFactura: "CRUZ HERRERA JOSE GABRIEL",
    contacto: "3145678901",
    ubicacion: "Invernaderos La Vega - Módulo B",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes", "Viernes"],
    productos: [
      { producto: "Tomate Cherry", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-roberto-ramirez",
    nombreComun: "Roberto Ramírez",
    razonSocialFactura: "RAMIREZ CARVAJAL ROBERTO",
    contacto: "3167890123",
    ubicacion: "Vereda San José",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes", "Viernes"],
    productos: [
      { producto: "Tomate Cherry", precio: 5500, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Tomate Uvalina", precio: 5500, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-jaime-gonzalez",
    nombreComun: "Jaime González",
    razonSocialFactura: "GONZALEZ CASTAÑEDA HERMAN",
    contacto: "3119988771",
    ubicacion: "Invernaderos El Trébol",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes", "Viernes"],
    productos: [
      { producto: "Tomate Cherry", precio: 6250, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: false, condicion: "", notas: "Validar vigencia con Camilo" }
    ]
  },
  {
    id: "agr-fabian-rodriguez",
    nombreComun: "Fabián Rodríguez",
    razonSocialFactura: "RODRIGUEZ RODRIGUEZ FREDY FABIAN",
    contacto: "3154433221",
    ubicacion: "Sector El Paraíso",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Miercoles"],
    productos: [
      { producto: "Tomate Cherry", precio: 6000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Tomate Uvalina", precio: 6000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: false, condicion: "CREDITO 35 DIAS", notas: "No vigente" }
    ]
  },
  {
    id: "agr-oswaldo",
    nombreComun: "Oswaldo",
    razonSocialFactura: "CASAS BERNAL LUIS OSWALDO",
    contacto: "3176655443",
    ubicacion: "Vereda La Herradura",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Miercoles", "Sabado"],
    productos: [
      { producto: "Tomate Cherry", precio: 5500, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Tomate Uvalina", precio: 5500, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: false, condicion: "CREDITO 35 DIAS", notas: "No vigente" }
    ]
  },
  {
    id: "agr-juan-rodriguez",
    nombreComun: "Juan Rodríguez",
    razonSocialFactura: "RODRIGUEZ VELASQUEZ JUAN",
    contacto: "3182233445",
    ubicacion: "Vereda El Porvenir",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Miercoles"],
    productos: [
      { producto: "Tomate Cherry", precio: 6000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-sadith",
    nombreComun: "Sadith",
    razonSocialFactura: "CAMACHO SANCHEZ SADYD ORLANDO",
    contacto: "3168877665",
    ubicacion: "Finca El Encanto",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes"],
    productos: [
      { producto: "Tomate Cherry", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Tomate Uvalina", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-alejandro",
    nombreComun: "Alejandro",
    razonSocialFactura: "RINCON QUIROGA JOSE ALEJANDRO",
    contacto: "3139988112",
    ubicacion: "Vereda San Marcos",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Jueves"],
    productos: [
      { producto: "Tomate Cherry", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" },
      { producto: "Tomate Uvalina", precio: 5000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-ana-cely",
    nombreComun: "Ana Cely",
    razonSocialFactura: "VARGAS RODRIGUEZ ANA CELI",
    contacto: "3112114806",
    ubicacion: "Vereda El Retiro",
    horaCampo: "",
    horaPlanta: "12:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes", "Miercoles"],
    productos: [
      { producto: "H Verde (Lechuga)", precio: 910, unidadMedida: "Und", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" },
      { producto: "Morada Crespa Falbala", precio: 910, unidadMedida: "Und", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-jorge-baracaldo",
    nombreComun: "Jorge Baracaldo",
    razonSocialFactura: "BARACALDO RODRIGUEZ JORGE ELIECER",
    contacto: "3115302456",
    ubicacion: "Vereda La Cabaña",
    horaCampo: "",
    horaPlanta: "12:30",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Martes", "Jueves", "Viernes", "Sabado"],
    productos: [
      { producto: "H Verde (Lechuga)", precio: 965, unidadMedida: "Und", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-georgeth",
    nombreComun: "Georgeth",
    razonSocialFactura: "BIOESTRELLA S.A.S / HADDAD TRIGOS GEORGETTE",
    contacto: "3105544332",
    ubicacion: "Finca Bioestrella",
    horaCampo: "11:00",
    horaPlanta: "13:00",
    tiempoFinca: "60 min",
    responsableTransporte: "TRANSPORTE",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Jueves"],
    productos: [
      { producto: "H Verde (Lechuga)", precio: 925, unidadMedida: "Und", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 45 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-juan-jose-cuenca",
    nombreComun: "Juan José Cuenca",
    razonSocialFactura: "RAIZAC SAS",
    contacto: "3127766554",
    ubicacion: "Sector Raizac",
    horaCampo: "",
    horaPlanta: "11:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Lunes", "Miercoles", "Viernes"],
    productos: [
      { producto: "Espinaca", precio: 3609, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "" }
    ]
  },
  {
    id: "agr-henry-velasquez",
    nombreComun: "Henry Velásquez",
    razonSocialFactura: "VELASQUEZ PARRADO HENRY ALEXANDER",
    contacto: "3148877665",
    ubicacion: "Invernaderos del Sur",
    horaCampo: "",
    horaPlanta: "07:00",
    tiempoFinca: "",
    responsableTransporte: "TERCERO",
    encargadoLogistica: "CAMILO ROMERO",
    diasEntrega: ["Martes", "Viernes"],
    productos: [
      { producto: "Tomate Cherry", precio: 4000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: true, condicion: "CREDITO 35 DIAS", notas: "Recordar $$ de compra" },
      { producto: "Tomate Uvalina", precio: 6000, unidadMedida: "Kg", negociador: "Camilo Romero", vigente: false, condicion: "CREDITO 35 DIAS", notas: "No vigente" }
    ]
  },
  {
    id: "agr-ferrucas",
    nombreComun: "Finca Ferrucas",
    razonSocialFactura: "FINCA FERRUCAS S.A.S",
    contacto: "3100001122",
    ubicacion: "Finca Matriz Ferrucas",
    horaCampo: "Carros 1 a 8 (6:00 a 17:00)",
    horaPlanta: "08:30 a 19:00",
    tiempoFinca: "60 min",
    responsableTransporte: "TRANSPORTE",
    encargadoLogistica: "FINCA FERRUCAS",
    diasEntrega: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
    productos: [
      { producto: "Salanova Verde", precio: 0, unidadMedida: "Unidades", negociador: "Finca", vigente: true, condicion: "CULTIVO PROPIO", notas: "Carros 1 al 8" },
      { producto: "Salanova Morada", precio: 0, unidadMedida: "Unidades", negociador: "Finca", vigente: true, condicion: "CULTIVO PROPIO", notas: "Carros 1 al 8" }
    ]
  }
];

// Portafolio de productos clave para el Semáforo de Cobertura Diaria
const PORTAFOLIO_PRODUCTOS_CLAVE = [
  "Tomate Cherry",
  "Tomate Uvalina",
  "Brócoli",
  "Coliflor",
  "Apio",
  "Espinaca",
  "Espinaca Baby",
  "Espinaca Bolsa",
  "Rúgula",
  "Cilantro",
  "Acelga",
  "Perejil Liso",
  "Perejil Crespo",
  "H Verde (Lechuga)",
  "Salanova Verde",
  "Salanova Morada"
];

const CLIENTES_CATALOGO = [
  "General / Planta",
  "Alkosto",
  "Tiendas D1",
  "Tiendas Ara",
  "Fruver Mayorista",
  "Éxito / Carulla",
  "Plaza de Mercado"
];

const UNIDADES_CATALOGO = [
  "Kg",
  "Unidades",
  "Cajas",
  "Doc",
  "At",
  "corte",
  "Kilos bolsa",
  "Kilos baby"
];
