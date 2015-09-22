$(function () {

    function convertSVGImgToPNG(img, width, height){
        var canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);

        return canvas.toDataURL("image/png");
    }

    function convertBase64ToBinary(base64Data){
        var binaryStr = atob(base64Data);
        var length = binaryStr.length;
        var binary = new Uint8Array(length);
        for(var i=0; i < length; i++){
            binary[i] = binaryStr.charCodeAt(i);
        }
        return binary;
    }

    function saveFile(fileName, dataUrl){
        var fileType = dataUrl.substring(5, dataUrl.indexOf(';'));
        var headerEnd = dataUrl.indexOf(',');
        var base64Data = dataUrl.substring(headerEnd +1);
        var binary = convertBase64ToBinary(base64Data);
        var blob = new Blob([binary], {type: fileType});
        var url = window.URL.createObjectURL(blob);
        var downloadLink = document.createElement("a");
        downloadLink.style = "display: none";
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(downloadLink);
    }

    $('#exportButton').click(function(){
        var $chartDiv = $('#chartContainer div');
        var svgDom = $chartDiv.html();
        var svgData = 'data:image/svg+xml;base64,'+ btoa(svgDom);
        var img = new Image();
        img.onload = function(){
            var pngUrl = convertSVGImgToPNG(img, $chartDiv.width(), $chartDiv.height());
            saveFile('chart.png', pngUrl);
        };
        img.src = svgData;
    });

    $('#chartContainer').highcharts({
        chart: {
            type: 'area'
        },
        credits: false,
        title: {
            text: 'US and USSR nuclear stockpiles'
        },
        subtitle: {
            text: 'Source: <a href="http://thebulletin.metapress.com/content/c4120650912x74k7/fulltext.pdf">' +
                'thebulletin.metapress.com</a>'
        },
        xAxis: {
            allowDecimals: false,
            labels: {
                formatter: function () {
                    return this.value; // clean, unformatted number for year
                }
            }
        },
        yAxis: {
            title: {
                text: 'Nuclear weapon states'
            },
            labels: {
                formatter: function () {
                    return this.value / 1000 + 'k';
                }
            }
        },
        tooltip: {
            pointFormat: '{series.name} produced <b>{point.y:,.0f}</b><br/>warheads in {point.x}'
        },
        plotOptions: {
            area: {
                pointStart: 1940,
                marker: {
                    enabled: false,
                    symbol: 'circle',
                    radius: 2,
                    states: {
                        hover: {
                            enabled: true
                        }
                    }
                }
            }
        },
        series: [{
            name: 'USA',
            data: [null, null, null, null, null, 6, 11, 32, 110, 235, 369, 640,
                1005, 1436, 2063, 3057, 4618, 6444, 9822, 15468, 20434, 24126,
                27387, 29459, 31056, 31982, 32040, 31233, 29224, 27342, 26662,
                26956, 27912, 28999, 28965, 27826, 25579, 25722, 24826, 24605,
                24304, 23464, 23708, 24099, 24357, 24237, 24401, 24344, 23586,
                22380, 21004, 17287, 14747, 13076, 12555, 12144, 11009, 10950,
                10871, 10824, 10577, 10527, 10475, 10421, 10358, 10295, 10104]
        }, {
            name: 'USSR/Russia',
            data: [null, null, null, null, null, null, null, null, null, null,
                5, 25, 50, 120, 150, 200, 426, 660, 869, 1060, 1605, 2471, 3322,
                4238, 5221, 6129, 7089, 8339, 9399, 10538, 11643, 13092, 14478,
                15915, 17385, 19055, 21205, 23044, 25393, 27935, 30062, 32049,
                33952, 35804, 37431, 39197, 45000, 43000, 41000, 39000, 37000,
                35000, 33000, 31000, 29000, 27000, 25000, 24000, 23000, 22000,
                21000, 20000, 19000, 18000, 18000, 17000, 16000]
        }]
    });
});
