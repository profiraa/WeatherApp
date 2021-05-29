//GLOBAL VARIABLES
const cityInput = document.getElementById('oras');
console.log(cityInput.value);
const vremeaBtn = document.getElementById('vremea');
console.log(vremeaBtn);
const prognozaBtn = document.getElementById('prognoza');
console.log(prognozaBtn);
const vremeaDiv = document.getElementById('now');
console.log(vremeaDiv.innerHTML);
const prognozaDiv = document.getElementById('next');

//"VREMEA ACUM" AREA
vremeaBtn.addEventListener('click', showWeather);

function showWeather() {
	const URL_CURRENT_WEATHER = "https://api.openweathermap.org/data/2.5/weather?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=";
     
	fetch(URL_CURRENT_WEATHER + cityInput.value)
		.then((res) => {
			return res.json();
		}).then((data) => {
			let output = '';
			let imgURL = 'http://openweathermap.org/img/w/';
			output = `
            <div class="card">
               <img src="${imgURL}${data.weather[0].icon}.png">
               <h3>Descriere: ${data.weather[0].description}</h3>
               <h3>Umiditate: ${data.main.humidity}%</h3>
               <h3>Presiune: ${data.main.pressure}mmHg</h3>
               <h3>Temperatura curenta: ${data.main.temp.toFixed(0)}°C</h3>
               <h3>Minima zilei: ${data.main.temp_min.toFixed(0)}°C</h3>
               <h3>Maxima zilei: ${data.main.temp_max.toFixed(0)}°C</h3>
            </div>
            `;
            document.getElementById('output').innerHTML = '';
			document.getElementById('output').innerHTML += output;

          //GOOGLE MAPS
          let map; 
          const center = {lat: data.coord.lat, lng: data.coord.lon};
          var script = document.createElement('script');
          script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBTsRoMbK_AzcgUMnMSwDzqel6jZ0VpYnY&callback=initMap';
          script.async = true;
  
          // Attach your callback function to the `window` object
          window.initMap = function() {
              // JS API is loaded and available
              map = new google.maps.Map(document.getElementById("map"), {
              center,
              zoom: 8,
          });
          new google.maps.Marker({
            position: center,
            map,
            title: cityInput.value,
          });
          }   
          // Append the 'script' element to 'head'
          document.head.appendChild(script);
		});
    }

//"VREMEA IN URMATOARELE ZILE" AREA
prognozaBtn.addEventListener('click', showForecast);

function showForecast() {
    const URL_FORECAST_WEATHER ='https://api.openweathermap.org/data/2.5/forecast?appid=69518b1f8f16c35f8705550dc4161056&units=metric&q=';
        fetch(URL_FORECAST_WEATHER + cityInput.value)
        .then((res)=> {
            return res.json()})
        .then(data => {
            var numarDePrognozeZiuaCurenta = 0;
			for (let i = 0; i < data.list.length; i++) {
				if (
					data.list[i].dt_txt.split(' ')[0] !==
					data.list[i + 1].dt_txt.split(' ')[0]
				) {
					numarDePrognozeZiuaCurenta = i + 1;
					break;
				}
			}
			console.log(numarDePrognozeZiuaCurenta);
			prognozaDiv.innerHTML = '';
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				0,
				numarDePrognozeZiuaCurenta - 1
			);
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta,
				numarDePrognozeZiuaCurenta + 7
			);
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 8,
				numarDePrognozeZiuaCurenta + 15
			);
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 16,
				numarDePrognozeZiuaCurenta + 23
			);
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 24,
				numarDePrognozeZiuaCurenta + 31
			);
			createPrognozaBoxDiv(
				data,
				prognozaDiv,
				numarDePrognozeZiuaCurenta + 32,
				data.list.length - 1
			);
		});
        function createPrognozaHoursOutput(day, hour, temp, description) {
            let output = `
            <div class="prognozaHours">
                <img id="image" src="calendar.png"
                <p class="date">${day}</p>

                <img id="image" src="clock.png"
                <p class="hour">${hour}</p>

                <img id="image" src="grade.png"
                <p class="temp">${temp.toFixed(0)}°C </p>
                <p class="desc">${description}</p>
           </div>
           `;
           console.log();
            return output;
        }
        
        function createPrognozaBoxDiv(data, divElement, startIndex, endIndex) {
            let prognozaBox = document.createElement('div');
            prognozaBox.classList.add('prognozaBox');
            for (let i = startIndex; i <= endIndex; i++) {
                prognozaBox.innerHTML += createPrognozaHoursOutput(
                    data.list[i].dt_txt.split(' ')[0],
                    data.list[i].dt_txt.split(' ')[1],
                    data.list[i].main.temp,
                    data.list[i].weather[0].description
                );
            }
            divElement.appendChild(prognozaBox);
        }
    }