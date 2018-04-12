$(document).ready(() => {

    $("#exportExcel").click(() => {

        let data = [{city: "Minsk", population: 100000}, {city: "Riga", population: 200000}];

        alasql('SELECT * INTO XLSX("cities.xlsx",{headers:true}) FROM ? ', [data]);
    });

});