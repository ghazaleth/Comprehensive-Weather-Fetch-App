let weatherForm = document.getElementById('weatherForm')
let card = document.getElementById('card')
let errorDisplay = document.getElementById('errorDisplay')
let apiKey = "2232101b7a4c133da51de8620fc86462"

weatherForm.addEventListener('submit', async (event) =>{
    card.textContent = ''
    event.preventDefault()
    let cityEntered = document.getElementById('cityEntered').value;
    if(cityEntered == ''){
        displayError('Please enter a city  🏙️ !');
        return ;
    }
    
    try{
        let response = await fetchData(cityEntered);
        console.log(response);
        card.style.display = 'flex';
        displayData(response)
    }

    catch(error){
        displayError(error)
    } 
})

async function fetchData(city){
    let ApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    let response = await fetch(ApiUrl);
    
    if(!response.ok){
        throw new Error("Couldn't fetch data ❌, try again !")
    }
    else{
        return await response.json()
    }
}

function displayError(error){
    card.style.display = 'flex';
    errorDisplay.textContent = error;
    errorDisplay.style.fontFamily = 'MV Boli';
    errorDisplay.style.fontSize = '20px'
    errorDisplay.style.color = 'red';
    card.appendChild(errorDisplay);
}

 async function displayData(data){
    const {name : city,
        main: {temp, humidity, feels_like},
        weather : [{description, id}],
        sys: {country, sunrise, sunset},
        timezone : timezone
        } = data;
    // console.log(country, sunrise, sunset, feels_like)
    // console.log(sunset);
    //Name
    let cityDisplay = document.createElement('p');
    cityDisplay.id = 'cityDisplay'
    cityDisplay.textContent = city;
    card.appendChild(cityDisplay);

    // Standard temperature
    let tempDisplay = document.createElement('p');
    tempDisplay.id = 'tempDisplay'
    tempDisplay.textContent = `${(temp - 273.15).toFixed()}°C`;
    card.appendChild(tempDisplay);

    // Humidity
    let humidityDisplay = document.createElement('p');
    humidityDisplay.id = 'humidityDisplay'
    humidityDisplay.textContent = `Humidity : ${humidity} %`;
    card.appendChild(humidityDisplay);

    // Feels Like
    let feelsLikeDisplay = document.createElement('p');
    feelsLikeDisplay.id = 'feelsLikeDisplay'
    feelsLikeDisplay.textContent = `Feels like : ${(feels_like - 273.15).toFixed()}°C`;
    card.appendChild(feelsLikeDisplay);
    
    // Description
    let descriptionDisplay = document.createElement('p');
    descriptionDisplay.id = 'descriptionDisplay'
    descriptionDisplay.textContent = description;
    descriptionDisplay.style.maxHeight = '40px';
    descriptionDisplay.style.display = 'flex'
    card.appendChild(descriptionDisplay);
    

    // The country : 
    let countryCode = country;
    let countryDisplay = document.createElement('p');
    countryDisplay.id = 'countryCodeDisplay';

    // Fetch the country for ISO3166-1.alpha2.json
    let actualCountry = await fetchCountry(countryCode)
    cityDisplay.textContent += `, ${actualCountry}`
  
    
    // Get the date of the location
    
    let locationDateDisplay = document.createElement('p');
    locationDateDisplay.id = 'locationDateDisplay';
    card.appendChild(locationDateDisplay)

    function setting(){
        let locationDate = getLocationDate(timezone);
        let locationDateString = locationDate.toDateString();
        let locationHour = pad(locationDate.getHours());
        let locationMins = pad(locationDate.getMinutes());
        let locationsecs = pad(locationDate.getSeconds());

        locationDateDisplay.textContent = `${locationDateString}, ${locationHour}:${locationMins}:${locationsecs}`;
    }
    
    setInterval(setting, 1000)

    // Now, the sunrise and/or the sunset
    // let locationDate = getLocationDate(timezone).getTime();
    // console.log(new Date(Date.now() + sunset*1000));
    displayEmoji(description, descriptionDisplay)
}

async function fetchCountry(countryCode){
    let countriesCode = await fetch('ISO3166-1.alpha2.json');
    countriesCode = await countriesCode.json();
    const countryName = await countriesCode[countryCode];
    return await countryName
}

function getLocationDate(timezone){
    let locationDate;
    let actualDate = (new Date()).toString()
    let firstSlice;
    let minus;
    if(actualDate.indexOf('+') == -1){
        firstSlice = actualDate.slice(actualDate.indexOf('-') + 1);
        minus = true;
    }
    else{
        firstSlice = actualDate.slice(actualDate.indexOf('+') + 1);
    }
    
    let gmt = firstSlice.slice(0, firstSlice.indexOf(' '));
    gmt = Number(gmt);
    gmt = gmt / 100;

    /* The previous part get the user current gmt+value or gmt-value, I get this 'value'
    So if somebody hasn't the same timezone than me, it still works.*/
    
    if(minus){
        locationDate = new Date(Date.now() + timezone * 1000 + 3600000 * gmt)
    }
    else{
        locationDate = new Date(Date.now() + timezone * 1000 - 3600000 * gmt)
    }
    return locationDate;
}

function pad(unit){
    return unit < 10 ? "0" + unit : unit;
}

function displayEmoji(description, descriptionDisplay){
    let divIcon = document.createElement('div');
    divIcon.style.display = 'inline-block'
    let weatherIcon = document.createElement("img");
    weatherIcon.style.height = '50px'
    weatherIcon.style.width = '50px';
    weatherIcon.style.position = 'relative';
    weatherIcon.style.top += '-3vh'

    switch(description){
        case "clear sky":
            weatherIcon.src = "./icons/01d.png";
            break
        case "few clouds":
            weatherIcon.src = "./icons/02d.png";
            break;
        case "scattered clouds":
            weatherIcon.src = "./icons/03d.png";
            break;
        case "broken clouds":
            weatherIcon.src = "./icons/04d.png";
            break;
        case "shower rain":
            weatherIcon.src = "./icons/09d.png";
            break;
        case "rain":
            weatherIcon.src = "./icons/10d.png";
            break; 
        case "thunderstorm":
            weatherIcon.src = "./icons/11d.png";
            break;      
        case "snow":
            weatherIcon.src = "./icons/13d.png";
            break; 
        case "mist":
            weatherIcon.src = "./icons/50d.png";
            break;
        case "overcast clouds":
            weatherIcon.src = "./icons/11d.png";
            break;
        case "light rain":
            weatherIcon.src = "./icons/10d.png";
            break;
        
        default:
            weatherIcon.src = "./icons/";
            break;
    }
    divIcon.appendChild(weatherIcon);
    descriptionDisplay.appendChild(divIcon);
}

/*All parameters I will need : for the temperature : 
I will need the TEMP, FEEL_LIKE, 

After I will need in sys : COUNTRY(code  ISO 3166-1 alpha-2, that I will put in a json file), sunrise and sunset to display
and display them dependly of the fact that it is actually day of night, with theM

Exemple: display the sunset is the sunrise is actually passed (day), and the sunrise if the. Watever, maybe I will display them if it is an our left

In wind, I need DEG and SPEED*/