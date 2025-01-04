<?php

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

echo $processor->transformToXML($xmlMeteo);