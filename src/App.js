import React, { Component } from 'react'
import MapComponent from './MapComponent'
import { } from './App.css'

import '@zendeskgarden/react-ranges/dist/styles.css';
import '@zendeskgarden/react-toggles/dist/styles.css';

import { ThemeProvider } from '@zendeskgarden/react-theming';
import { RangeField, Hint, Range, Message } from '@zendeskgarden/react-ranges';
import { Toggle, Label } from '@zendeskgarden/react-toggles';




const APPID = `${process.env.REACT_APP_WEATHER_API_KEY}`;
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
    tempmin: 13,
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
    tempmax: 9,
    tempmin: -100
  }
];



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      currentLatLng: {
        lat: 38.036273,
        lng: 23.787634
      },
      isMarkerShown: true,
      weather: [],
      clothes: clothes,
      tempadjust: 0,
      isCelcius: true,
      promiseIsResolved: false
    }

  }


  componentWillMount() {

  }

  componentDidMount() {
    this.getGeoLocation();
  }


  delayedShowMarker = () => {
    setTimeout(() => {
      //this.getGeoLocation()
      this.setState({ isMarkerShown: true })
    }, 1000)
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
          this.getWeather();
        }
      )
    } else {
      console.log("Geolocation Error");
    }
    console.log('Geolocating')
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
      .then(data => this.setState({ weather: data }))
      .then(data => this.setState({ promiseIsResolved: true }))
      .catch(error => error);
    console.log('Fetching weather')
  }


  useCelcius = () => {
  }

  getValidationType = isCelcius => (isCelcius ? 'success' : 'success');
  getValidationMessage = isCelcius =>
    isCelcius ? 'Celcius' : 'Fahrenheit';

  render() {
    if (!this.state.promiseIsResolved) { return (<ThemeProvider><div><div className="infopanel"><h1>Waiting for location</h1>Accept location request and wait for response</div></div></ThemeProvider>) }
    console.log('Rendering');
    const { currentLatLng, weather, isCelcius } = this.state;

    return (
      <ThemeProvider>
        <div>
          <div>
            <MapComponent
              currentLocation={this.state.currentLatLng}
              isMarkerShown={this.state.isMarkerShown}
              onMarkerClick={this.handleMarkerClick}

            />
          </div>
          <div className="infopanel">
            <span className="faded">Closest weather station:</span>
            <h1 className="red">{weather.name} {(weather.main.temp - 273.15).toFixed(2)}º<b>{isCelcius ? ('C') : ('F')}</b><img src={`http://openweathermap.org/img/w/${weather.weather[0].icon}.png`} /> </h1>
            <span>Lat:{currentLatLng.lat.toFixed(4)} </span>
            <span>Lng:{currentLatLng.lng.toFixed(4)}</span><br />
            <h3>
            {weather.weather[0].description} Wind: {weather.wind.speed}m/s</h3>
            <div className="hidden"><Toggle checked={this.state.isCelcius} onChange={event => this.setState({ isCelcius: event.target.checked })}>
              <Label>Units</Label>
              <Message validation={this.getValidationType(this.state.isCelcius)}>
                {this.getValidationMessage(this.state.isCelcius)}
              </Message>
            </Toggle><br />
            
            
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
      </Button></div>
<div className="hidden">
            <RangeField>
              <Hint>
                Move range to view changes. [value="
    {this.state.tempadjust}
                "]
  </Hint>
              <Range
                min={-5}
                max={5}
                step={1}
                value={this.state.tempadjust}
                onChange={event => this.setState({ tempadjust: event.target.value })}
              />
            </RangeField>


            <Table
              temp={weather.main.temp + this.state.tempadjust}
              clothes={clothes} />
          </div>

          </div>

        </div>
      </ThemeProvider>
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
    {temp}
    {clothes.filter(function (item) {
      return (temp - 273.15) <= item.tempmax && (temp - 273.15) >= item.tempmin;
    }).map(item =>
      <div key={item.name} className="table-row">
        <span style={{ width: '30%' }}>{item.name}</span>
      </div>
    )}
  </div>



export default App;
/*
*/