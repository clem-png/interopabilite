
/**
 ----------------------------------------------------------------
                            VARIABLES
 ----------------------------------------------------------------
 */

let fusion = [];
let adj = new Date();
let station = [];

//fetch('https://tabular-api.data.gouv.fr/api/resources/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5/data/?dep__exact=Auvergne et Rhône-Alpes').then(response => response.json()).then(data => console.log(data))

/**
 *
 *
 */
const egoux = document.getElementById('egoux');
const hospParDep = document.getElementById('hospParDep')

//Les foncitons

/**
 ----------------------------------------------------------------
                            FONCTIONS
 ----------------------------------------------------------------
 */
function dateSimilaire(d1,d2){
    return (
        d1.getDate() === d2.getDate() &&
        d1.getMonth() === d2.getMonth() &&
        d1.getFullYear() === d2.getFullYear()
    );
}

async function getPublicIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error("Erreur lors de la récupération de l'adresse IP :", error);
        throw error;
    }
}

async function getGeolocation(ip) {
    try {
        //marche pas celle la :
        //const response = await fetch(`https://ip-api.com/json/${ip}`);

        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const locationData = await response.json();
        return {
            lat: locationData.latitude,
            lon: locationData.longitude,
            postal: locationData.postal
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des données de géolocalisation :", error);
        throw error;
    }
}

async function initializeMap() {
    try {
        const ip = await getPublicIP();
        const { lat, lon, postal} = await getGeolocation(ip);

        const map = L.map('map').setView([lat, lon], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 13,
        }).addTo(map);

        fusion.forEach(f => {
            L.marker([f.info.lat, f.info.lon]).addTo(map)
                .bindPopup(`Nom : ${f.info.name} <br> Adresse : ${f.info.address} <br> Capacité max : ${f.info.capacity} <br> Vélos disponibles : ${f.status.num_bikes_available} <br> Dock disponibles : ${f.status.num_docks_available}`)
                .openPopup();
        });

        return { lat, lon, postal};
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la carte :", error);
    }
}

async function lectureMaxeville(p){
    let donnees = [];
    await fetch('https://tabular-api.data.gouv.fr/api/resources/2963ccb5-344d-4978-bdd3-08aaf9efe514/data/?page='+p+'&page_size=50')
        .then(response => response.json())
        .then(data => {
            donnees = data.data
                .filter(d => d.MAXEVILLE !== null)
                .map(d => ({
                    label: d.semaine,
                    valeur: d.MAXEVILLE
                }));
        }).catch(error => {
            return [];
        })
    return donnees;
}

async function lectureParDep(p,dep){

    const dureeStr = new Date(Date.now() - 3 * 365.25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    let donnees = [];
    await fetch('https://tabular-api.data.gouv.fr/api/resources/5c4e1452-3850-4b59-b11c-3dd51d7fb8b5/data/?dep__exact='+dep+'&date__greater='+dureeStr+'&page='+p+'&page_size=50')
        .then(response => response.json())
        .then(data => {
            donnees = data.data
                .map(d => ({
                    label: d.date,
                    valeur: d.hosp
                }));
        }).catch(error => {
            return [];
        })
    return donnees;
}

async function assemblageDonneMaxeville(){
    let p = 1;
    let donneesRegroupe = []
    while(true){
        let donnees = await lectureMaxeville(p);
        p++;
        if(donnees.length === 0){
            break;
        }
        donneesRegroupe = donneesRegroupe.concat(donnees);
    }
    return donneesRegroupe;
}

async function assemblageDonneParDep(dep){
    let p = 1;
    let donneesRegroupe = []
    while(true){
        let donnees = await lectureParDep(p,dep);
        p++;
        if(donnees.length === 0){
            break;
        }
        donneesRegroupe = donneesRegroupe.concat(donnees);
    }
    return donneesRegroupe;
}



/**
 ----------------------------------------------------------------
                    CRAPHE EGOUX MAXEVILLE
 ----------------------------------------------------------------
 */
let egouxMaxevilleDonnees = await assemblageDonneMaxeville();

let labelsEgoux = egouxMaxevilleDonnees.map(d => d.label);
let egouxValeurs = egouxMaxevilleDonnees.map(d => d.valeur);

new Chart(egoux, {
    type: 'line',
    data: {
        labels: labelsEgoux,
        datasets: [{
            label: 'Information Egoux Maxeville',
            data: egouxValeurs,
            fill: false,
            borderColor: 'red',
            backgroundColor: 'black',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Annees-Semaines'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Valeurs'
                },
                beginAtZero: true
            }
        }
    }
});

/**
 ----------------------------------------------------------------
                        QUALITE AIR
 ----------------------------------------------------------------
 */

fetch('https://services3.arcgis.com/Is0UwT37raQYl9Jj/arcgis/rest/services/ind_grandest/FeatureServer/0/query?where=lib_zone%3D%27Nancy%27&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=*&returnGeometry=true&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=')
    .then(response => response.json())
    .then(data => {

        for(let temp of data['features']) {

            let dateAtmo = new Date(temp['attributes']['date_ech']);

            if (dateSimilaire(adj, dateAtmo)) {
                document.getElementById('carre').style.backgroundColor = temp['attributes'].coul_qual;
            }

        }
    });

/**
 fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json')
 .then(response => response.json())
 .then(data => {
 console.log(data['data']['stations'])
 });

 fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json')
 .then(response => response.json())
 .then(data => {
 console.log(data['data']['stations'])
 });
 **/

/**
 ----------------------------------------------------------------
                        VELO
 ----------------------------------------------------------------
 */

Promise.all([
    fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_information.json')
        .then(response => response.json()),
    fetch('https://api.cyclocity.fr/contracts/nancy/gbfs/station_status.json')
        .then(response => response.json())
]).then(([infoData, statusData]) => {

    const stationInfo = infoData['data']['stations'];
    const stationStatus = statusData['data']['stations'];

    const statusMap = new Map();
    stationStatus.forEach(status => {
        statusMap.set(status.station_id,{
            num_docks_available: status.num_docks_available,
            num_bikes_available: status.num_bikes_available,
        });
    });

    fusion = stationInfo.map(info => ({
        info,
        status: statusMap.get(info.station_id),
    }));
}).catch(error => {
    console.error('Erreur lors de la récupération des données :', error);
});

const { lat, lon, postal} = await initializeMap();

/**
 ----------------------------------------------------------------
                            METEO
 ----------------------------------------------------------------
 */

fetch('https://www.infoclimat.fr/public-api/gfs/json?_ll='+lat+','+lon+'&_auth=ARsDFFIsBCZRfFtsD3lSe1Q8ADUPeVRzBHgFZgtuAH1UMQNgUTNcPlU5VClSfVZkUn8AYVxmVW0Eb1I2WylSLgFgA25SNwRuUT1bPw83UnlUeAB9DzFUcwR4BWMLYwBhVCkDb1EzXCBVOFQoUmNWZlJnAH9cfFVsBGRSPVs1UjEBZwNkUjIEYVE6WyYPIFJjVGUAZg9mVD4EbwVhCzMAMFQzA2JRMlw5VThUKFJiVmtSZQBpXGtVbwRlUjVbKVIuARsDFFIsBCZRfFtsD3lSe1QyAD4PZA%3D%3D&_c=19f3aa7d766b6ba91191c8be71dd1ab2')
    .then(response => response.json())
    .then(data => {
        let date = adj.toISOString().split('T')[0];
        date += ' 13:00:00'

        const jsonMap = new Map();

        for (const key in data) {
            jsonMap.set(key, data[key]);
        }

        let res = jsonMap.get(date);

        if(res === undefined){
            console.log('Pas de données disponibles pour la meteo à cette date')
        }else{
            if(res.pluie > 0 && res.vent_moyen['10m'] > 20){
                document.getElementById('carreMeteo').style.backgroundColor ='red';
            }else if(res.pluie > 0 || res.vent_moyen['10m'] > 20){
                document.getElementById('carreMeteo').style.backgroundColor = 'orange';
            }else{
                document.getElementById('carreMeteo').style.backgroundColor = 'green';
            }
        }
    });

/**
 ---------------------------------------------------------------
 *                      GRAPHE COVID PAR DEP
  ----------------------------------------------------------------
 */

let codePostal = '';
try{
    codePostal = postal.substring(0,2);
}catch (e) {
    codePostal = '54';
}

let donneesDep = await assemblageDonneParDep(codePostal);

let labelsCovid = donneesDep.map(d => d.label);
let valeurCovid = donneesDep.map(d => d.valeur);

new Chart(hospParDep, {
    type: 'line',
    data: {
        labels: labelsCovid,
        datasets: [{
            label: 'Informations Hospitalisation depuis 3ans en '+codePostal,
            data: valeurCovid,
            fill: false,
            borderColor: 'orange',
            backgroundColor: 'black',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Annees'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Valeurs'
                },
                beginAtZero: true
            }
        }
    }
});