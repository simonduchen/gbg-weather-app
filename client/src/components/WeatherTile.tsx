import './WeatherTile.css';

export interface WeatherTileProps {
  day: string,
  temperature: number
  feelsLike: number
  icon: string 
  description: string
  additionalTemps?: AdditionalTemps
}

interface AdditionalTemps {
  median: number,
  min: number,
  max: number
}


export default function WeatherTile(props: WeatherTileProps) {

  const iconUrl = `http://openweathermap.org/img/wn/${props.icon}@2x.png`;

  return (
    <div className='tile-container'>
      {/* Day title */}
      <div className='flex-row'>
        <span className='flex-col-left bold-text'>{props.day}</span>
      </div>
      {/* Temperature and weather-icon */}
      <div className='flex-row temp'>
        <span className='flex-col-left'>{props.temperature}<span className='secondary-text'>°C</span></span>
        <div className='icon-container'>
          <img src={iconUrl} alt='weather-icon'></img>
        </div>
      </div>
      {/* Description text*/}
      <div className='flex-row-reversed'>
        <span className='flex-col-right secondary-text'>{props.description}</span>
      </div>
      {/* Feels like temperature*/}
      <div className='flex-row-reversed secondary-text'>
        <span>
          feels like
          <span className='bold-text'> {props.feelsLike}
            <span className='secondary-text'>°C</span>
          </span>
        </span>
      </div>
      {/* Additional temp calcs */}
      {props?.additionalTemps && 
      <div className='additional-temps'>
        <div className='flex-row secondary-text'>Daily temps</div>
        <div className='flex-row'>
          <span className='flex-col-right'>Median:</span>
          <span className='flex-col-left fill'>{props.additionalTemps.median}<span className='secondary-text'>°C</span></span>
        </div>
        <div className='flex-row'>
          <span className='flex-col-right'>Max:</span>
          <span className='col flex-col-left fill'>{props.additionalTemps.max}<span className='secondary-text'>°C</span></span>
        </div>
        <div className='flex-row'>
          <span className='flex-col-right'>Min:</span>
          <span className='flex-col-left fill'>{props.additionalTemps.min}<span className='secondary-text'>°C</span></span>
        </div>
      </div>}
      

    </div>
  );
}
