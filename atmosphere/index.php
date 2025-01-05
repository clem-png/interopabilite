<?php

//https://adresse.data.gouv.fr/api-doc/adresse

//echo $_SERVER['REMOTE_ADDR'];
$ip = '193.50.135.206';

//http://ip-api.com/php/?fields=61439

$bruteCo = file_get_contents('http://ip-api.com/json/'. $ip);
$jsonCo = json_decode($bruteCo);

$lat = strval($jsonCo->lat);
$lon = strval($jsonCo->lon);

$bruteMeteo = file_get_contents("https://www.infoclimat.fr/public-api/gfs/xml?_ll={$lat},{$lon}&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2");

$xmlMeteo = simplexml_load_string($bruteMeteo);

$xsl = new DOMDocument();
$xsl->load('meteo.xsl');

$processor = new XSLTProcessor();
$processor->importStylesheet($xsl);

$dateDemain = date('Y-m-d', strtotime('+1 day'));

$matin = $dateDemain . ' 07:00:00';
$midi = $dateDemain . ' 13:00:00';
$soir = $dateDemain . ' 19:00:00';

$processor->setParameter('', 'heureMatin', $matin);
$processor->setParameter('', 'heureMidi', $midi);
$processor->setParameter('', 'heureSoir', $soir);

$htmlMeteo = $processor->transformToXML($xmlMeteo);

echo <<<HTML
<!DOCTYPE HTML>
<html lang="fr">
<head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
    body{
    background-color: darkcyan;
    }
        img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }
        .meteo {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            margin: 20px 0;
        }
        .meteo > div {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #f9f9f9;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .meteo > div p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
        }
                #map {
            height: 100vh; 
        }
    </style>
</head>
<body>

$htmlMeteo

<div id="map"></div>
    <script>
    
        const timestampNow = Date.now();
        console.log(timestampNow);
    
        fetch('https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=')
            .then(response => response.json())
            .then(data => {
                console.log(data['features'][data['features'].length-1])
            });
    
        var lat = $lat;
        var long = $lon;

        var map = L.map('map').setView([lat, long], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        L.marker([lat, long]).addTo(map)
            .bindPopup('Votre position géographique actuelle.')
            .openPopup();
        
        
        
    </script>

</body>
</html>
HTML;

