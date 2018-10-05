import React, { Component } from 'react'
import MapComponent from './MapComponent'
import { } from './App.css'

const APPID = '424f7cf176d78fb36b19fb14db47026e';
const PATH_BASE = 'https://api.openweathermap.org/data/2.5/weather';

const clothes = [
  {
    name: 'hat',
    tempmax: 7,
    tempmin: -100
  },
  {
    name: 'tank top',
    tempmax: 50,
    tempmin: 20
  },
  {
    name: 'short sleeve',
    tempmax: 20,
    tempmin: 13
  },
  {
    name: 'long sleeve',
    tempmax: 13,
    tempmin: -100
  },
  {
    name: 'shorts',
    tempmax: 100,
    tempmin: 10
  },
  {
    name: 'tights',
    tempmax: 10,
    tempmin: -100
  }
];


function isBetween(temp) {
  return function (item) {
    if ((temp-273.15) < item.maxtemp) {
      if ((temp-273.15) > item.mintemp) {
        return item;
    }
  }
}
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: 38.036273,
        lng: 23.787634
      },
      isMarkerShown: false,
      temp: null,
      wind: null,
      weather: [],
      clothes: clothes
    }
    this.getGeoLocation()
    //this.getWeather()
  }



  componentDidMount() {
    this.delayedShowMarker()

  }


  delayedShowMarker = () => {
    setTimeout(() => {
      //this.getGeoLocation()
      this.setState({ isMarkerShown: true })
    }, 5000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  getGeoLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          console.log(position.coords);
          this.setState(prevState => ({
            currentLatLng: {
              ...prevState.currentLatLng,
              lat: position.coords.latitude,
              lng: position.coords.longitude
            }
          }))
        }
      )
    } else {
      console.log("Geolocation Error");
    }
  }

  resetGeoLocation = () => {
    this.setState(prevState => ({
      currentLatLng: {
        ...prevState.currentLatLng,
        lat: 38.036273,
        lng: 23.787634
      }
    }))
  }

  getWeather = () => {
    fetch(`${PATH_BASE}?lat=${this.state.currentLatLng.lat}&lon=${this.state.currentLatLng.lng}&APPID=${APPID}`)
      .then(response => response.json())
      .then(data => this.setState({ weather: data.main }))
      .catch(error => error);
  }

  render() {
    const { currentLatLng, weather } = this.state;
    return (
      <div>
        <div>
          <MapComponent
            currentLocation={this.state.currentLatLng}
            isMarkerShown={this.state.isMarkerShown}
            onMarkerClick={this.handleMarkerClick}

          />
        </div>
        <div className="infopanel">
          <span>Lat:{currentLatLng.lat}</span>
          <span>Lat:{currentLatLng.lng}</span><br />
          <span>Temp:{weather.temp - 273.15}</span><br />
          <Button
            onClick={() => this.getGeoLocation()}
            className="button-inline"
          >
            Update
      </Button>
          <Button
            onClick={() => this.resetGeoLocation()}
            className="button-inline"
          >
            Reset
      </Button>
          <Button
            onClick={() => this.getWeather()}
            className="button-inline"
          >
            Get Weather
      </Button>
        </div>
        <div>
          <Table
            temp={weather.temp}
            clothes={clothes} />
        </div>
      </div>
    );
  }
}

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Table = ({ clothes, temp }) =>
  <div className="table">
    {clothes.filter(function(item) {
      return (temp-273.15) <= item.tempmax && (temp-273.15) >= item.tempmin;}).map(item =>
      <div key={item.name} className="table-row">
        <span style={{ width: '30%' }}>{item.name}</span>
      </div>
    )}
  </div>

export default App;
/*
*/