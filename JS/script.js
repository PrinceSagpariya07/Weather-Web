const wrapper = document.querySelector(".wrapper"),
inputPart = wrapper.querySelector(".input-part"),
infoTxt = inputPart.querySelector(".info-txt"),
inputField = inputPart.querySelector("input"),
locationBtn = inputPart.querySelector("button"),
wIcon = document.querySelector(".weather-part img"),
arrowBack = wrapper.querySelector("header i");

const api_key = '5ead3606a494f8cb2ddad1a775098fcb';
let api;

inputField.addEventListener("keyup" , e => {
    // if user pressed enter btn and input value is not empty
    if(e.key == "Enter" && inputField.value != ""){
        requestApi(inputField.value);
    }
});

locationBtn.addEventListener("click" , () => {
    if(navigator.geolocation){      // if browser support geolocation api
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }
    else{
        alert("Your browser not support geolocation api");
    }
});

function onSuccess(position){
    // console.log(position);
    const {latitude, longitude} = position.coords; // getting latitude and longitude of the user device from coords obj
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${api_key}`;
    fetchData();
}

function onError(error){
    infoTxt.innerText = error.message;      // for error this "message" is come from json
    infoTxt.classList.add("error");
} 

function requestApi(city){
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${api_key}`;

    fetchData();
}

function fetchData(){
    infoTxt.innerText = "Getting weather details...";
    infoTxt.classList.add("pending");

    // getting api response and returning it with parsing into js obj and in another
    // then function calling weatherDetails function with passing api result as an argument
    fetch(api)
    .then(response => {
        return response.json();
        // console.log(response.json());
    })
    .then(data => {             
        weatherDetails(data);
        console.log(data);
    })
    .catch(error => {
        console.log("Error: " , error);
    });
}

function weatherDetails(info){
    infoTxt.classList.replace("pending","error");
    
    if(info.cod == "404"){
        infoTxt.innerText = `${inputField.value} isn't a valid city name`;
    }
    else{
        // let's get required properties value from the info object
        const city = info.name;
        const country = info.sys.country;
        const {description, id} = info.weather[0];
        const {feels_like, humidity, temp} = info.main;

        // using custom icon according to the id which api return us
        // id number according to icon see on openweather api
        if(id == 800){
            wIcon.src = "../image/clear.png";
        }
        else if(id >= 200 && id <= 232){
            wIcon.src = "../image/strom.png";
        }
        else if(id >= 600 && id <= 622){
            wIcon.src = "../image/snow.png";
        }
        else if(id >= 701 && id <= 781){
            wIcon.src = "../image/haze.png";
        }
        else if(id >= 801 && id <= 804){
            wIcon.src = "../image/cloud.png";
        }
        else if((id >= 300 && id <= 321) || (id >= 500 && id <= 531)){
            wIcon.src = "../image/rain.png";
        }

        // let's pass these values to a particular html element
        wrapper.querySelector(".temp .numb").innerText = Math.floor(temp);
        wrapper.querySelector(".weather").innerText = description;
        wrapper.querySelector(".location span").innerText = `${city}, ${country}`;
        wrapper.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
        wrapper.querySelector(".humidity span").innerText = `${humidity}%`;


        infoTxt.classList.remove("pending","error");
        wrapper.classList.add("active");
        // console.log(info);
    }
}

arrowBack.addEventListener("click" , () => {
    wrapper.classList.remove("active");
});