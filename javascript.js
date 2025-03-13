

//url https://www.meteosource.com/api/v1/free/point?place_id=london&sections=all&timezone=UTC&language=en&units=metric&key=YOUR-API-KEY

// Objeto para mapear códigos de clima a nombres de iconos
const weatherIcons = {
    // Días soleados/despejados
    1: '1.png',
    2: '2.png',

    // Nublado
    3: '3.png',
    4: '4.png',

    // Niebla
    5: '5.png',

    // Lluvia
    6: '6.png',
    7: '7.png',
    8: '8.png',

    // Nieve
    9: '9.png',
    10: '10.png',
    11: '11.png',

    // Tormentas
    12: '12.png',
    13: '13.png',
    14: '14.png',
    15: '15.png',
    16: '16.png',

    // Granizo
    17: '17.png',
    18: '18.png',
    19: '19.png',

    // Viento fuerte
    20: '20.png',
    21: '21.png',
    22: '22.png',

    // Calor extremo
    23: '23.png',
    24: '24.png',

    // Frío extremo
    25: '25.png',
    26: '26.png',

    // Otras condiciones
    27: '27.png',
    28: '28.png',
    29: '29.png',
    30: '30.png',
    31: '31.png',
    32: '32.png',
    33: '33.png',
    34: '34.png',
    35: '35.png',
    36: '36.png',

    // Valores por defecto para otros códigos
    default: 'unknown.svg'
};


const Directions = {
    N: 'North',
    S: 'South',
    E: 'East',
    W: 'West',

    NE: 'NorthEast',
    SE: 'SouthEast',
    SW: 'SouthWest',
    NW: 'NorthWest',

    NNE: 'North-NorthEast',
    ENE: 'East-NorthEast',
    ESE: 'East-SouthEast',
    SSE: 'South-SouthEast',
    SSW: 'South-SouthWest',
    WSW: 'West-SouthWest',
    WNW: 'West-NorthWest',
    NNW: 'North-NorthWest'
};


const API_KEY = 'KEY'

function getWeatherIcon(iconCode) {
    return weatherIcons[iconCode] || weatherIcons.default;
}

function getDirectionWind(code) {
    return Directions[code] || Directions.default;
}
function FormatFecha(dateString) {
    const [year, month, day] = dateString.split('-');
    const date = new Date(year, month - 1, day);
    
    const weekday = date.toLocaleDateString('en-us', { weekday: "long" });
    const numericDate = `${day}-${month}-${year}`;
    
    //return `${weekday} <br/> ${numericDate}`;

    return `${weekday} `;
}

let datosGlobales = null;



async function getBigData(city) {

    try {
        //tomamos la informacion de la ciudad que se busca
        const ResponseCity = await fetch(`https://www.meteosource.com/api/v1/free/find_places?text=${city}&key=${API_KEY}`)
        const dataCity = await ResponseCity.json();
        console.log(dataCity);
        
        if(!dataCity || !dataCity.length || dataCity === undefined ){
            return 'Ingrese una ciudad Valida'
        }

        //tomamos el dato que queremos en este caso el primero para devolverlo en la siguiente endpoint
        //Ejemplo : la ciudad que se ingresa es Londres/London entonces place_id tendra el valor de london
        const places_id = dataCity[9].place_id

        const WeatherCity = await fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${places_id}&sections=daily&timezone=UTC&language=en&units=metric&key=${API_KEY}`);
        const WeatherResposne = await WeatherCity.json();
        console.log(WeatherResposne);
        

        //creamos un objeto que almacene la informacion que queremos
        return {
            cityInfo: {
                name: dataCity[0].name,
                country: dataCity[0].country,
                place_id: dataCity[0].place_id,
                time_zone: dataCity[0].timezone,

            },

            weather: WeatherResposne
        }


        
    } catch (error) {
        throw error
    }
    
}


getBigData('Spain').then(data => console.log(data));


const formulario = document.getElementById('formulario');
const inputTexto = document.getElementById('texto');
const resultado = document.getElementById('resultado');
const card = document.getElementById('card');
const detalle = document.getElementById('detalle');
const modalBody = document.getElementById("modal-body");
const closeModal = document.getElementById("close-modal");


formulario.onsubmit = async function (e) {
    e.preventDefault();
    const city = inputTexto.value.trim();

    if (city === undefined || city === "") {
        return resultado.innerText = 'ingresa una ciudad ';
    }

    const data = await getBigData(city)
    if (data) {
        datosGlobales = data;
      
        const pronostico = data.weather.daily.data.map((dia,index) => {
            const { day, weather, summary, icon,all_day } = dia
            const iconPath = `/img/${getWeatherIcon(icon)}`;
            const newDate = FormatFecha(day)

          
            
            return `
            <div class="card" data-index="${index} >
                <section class="weather-card">
                     <div class="icon">
                        <img src="${iconPath}" alt="${weather}" class="weather-icon">
                        <span>${all_day.temperature}°C </span>
                     </div>    
                                        
                 
                    <div class="day">${newDate}</div>
  
                </section>
            </div>`
        }).join("")

        const Today = data?.weather?.daily?.data?.slice(0,1).map((dia,index) => {
            const { day, weather, summary, icon,all_day } = dia
            const iconPath = `/img/${getWeatherIcon(icon)}`;
            const newDate = FormatFecha(day)
            const DirectionWind = getDirectionWind(all_day.wind.dir)
          
            

          
             
            return `
            <div class="card-today" data-index="${index}" >
                <section class="weather-card-today">
                        <div class="day-today">
                             ${newDate}

                            <div class="icon-today">
                                <div class="image-icon">
                                    <img src="${iconPath}" alt="${weather}" class="weather-icon-today">
                                    
                                    <div class="temp-container">
                                        <span>${all_day.temperature}°C </span>
                                        <div class="speed">
                                             <div><i class="fa-solid fa-wind"></i> ${all_day.wind.speed}mph</div>
                                            <div><i class="fa-solid fa-signs-post"></i> ${DirectionWind}</div>
                                            
                                        </div>
                                       
                                    </div>
                                    
                                    
                                </div>
                                
                                
                               

                            </div> 
                         
                        </div>
                      
                          
                        <div class="temperature-container-today">
                            <span><i class="fa-solid fa-temperature-low"></i>${all_day.temperature_min}C° </span>
                           
                            <span><i class="fa-solid fa-temperature-high"></i>${all_day.temperature_max}C°</span>
                            <div class="precipitacion-cont">
                                <div><i class="fa-solid fa-cloud-showers-heavy"></i>${all_day.precipitation?.total}% <span>${all_day.precipitation?.type}</span></div>
                            <div>
                            
                            
                           
                        
                        </div>
                    
          
                </section>
            </div>`
        }).join("")

        const newDate = FormatFecha(data.weather.daily.data[0].day)
        return resultado.innerHTML = `
        <article class="container-weather">
            <section class="container-city">
                <section class="container-info-city">
                        <div>
                                <div class="city">${city}</div>
                                <div class="country">${data.cityInfo.country}</div>
                        </div>
                       
                  
                    
                </section>

                <section class="tod">
                    ${Today}
                </section>

               
            </section>
            
            <div class="container-card">${pronostico}</div>
           
                
        </article>
        `;
      
    }
}

// handler que al hacer click actualiza la informacion del card
resultado.onclick = function (e) {
    const forecastCard = e.target.closest(".card");
    if (forecastCard) {
        const index = parseInt(forecastCard.dataset.index);
        swapTodayCard(index);
    }
};

function swapTodayCard(index) {
    if (!datosGlobales?.weather?.daily?.data) return;
    
    // Toda la informacion del dia seleccionado
    const selectedDay = datosGlobales.weather.daily.data[index]; 
    const iconPath = `/img/${getWeatherIcon(selectedDay.icon)}`;
    const newDate = FormatFecha(selectedDay.day);
    const DirectionWind = getDirectionWind(selectedDay.all_day.wind.dir);

    // crea un nuevo card para suplantar al que esta por defecto 
    const newTodayCard = `
<div class="card-today" data-index="${index}" >
                <section class="weather-card-today">
                        <div class="day-today">
                             ${newDate}

                            <div class="icon-today">
                                <div class="image-icon">
                                    <img src="${iconPath}"  class="weather-icon-today">
                                    
                                    <div class="temp-container">
                                        <span>${selectedDay.all_day.temperature}°C </span>
                                        <div class="speed">
                                             <div><i class="fa-solid fa-wind"></i>${selectedDay.all_day.wind.speed}mph</div>
                                            <div><i class="fa-solid fa-signs-post"></i> ${DirectionWind}</div>
                                            
                                        </div>
                                       
                                    </div>
                                    
                                    
                                </div>
                                
                                
                               

                            </div> 
                         
                        </div>
                      
                          
                        <div class="temperature-container-today">
                            <span><i class="fa-solid fa-temperature-low"></i>${selectedDay.all_day.temperature_min}C° </span>
                           
                            <span><i class="fa-solid fa-temperature-high"></i>${selectedDay.all_day.temperature_max}C°</span>
                            <div class="precipitacion-cont">
                                <div><i class="fa-solid fa-cloud-showers-heavy"></i>${selectedDay.all_day.precipitation?.total}% <span>${selectedDay.all_day.precipitation?.type}</span></div>
                            <div>
                            
                            
                           
                        
                        </div>
                    
          
                </section>
            </div>
        
        `
        
        
        ;

    // Find the container that holds the Today card
    const containerCity = document.querySelector('.container-city');
    const todaySection = containerCity.querySelector('section:nth-child(2)');
    
    // Update the Today card section with the new card
    todaySection.innerHTML = newTodayCard;

    // Update the forecast cards to reflect the change
    
}













// async function getData(ciudad) {
//     try {
//         const response = await fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${ciudad}&sections=all&timezone=UTC&language=en&units=metric&key=${API_KEY}`);

//         const success = await response.json()
//         return success; // Retornas los datos directamente
//     } catch (error) {
//         console.error("Error al obtener los datos:", error);
//     }
// }


// async function getDataCity(ciudad) {
//     //https://www.meteosource.com/api/v1/free/find_places?text=london&key=YOUR-API-KEY
//     try {
//         const response = await fetch(`https://www.meteosource.com/api/v1/free/find_places?text=${ciudad}&key=${API_KEY}`);

//         const success = await response.json()
//         return success; // Retornas los datos directamente
//     } catch (error) {
//         console.error("Error al obtener los datos:", error);
//     }

    
// }
