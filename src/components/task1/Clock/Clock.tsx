import React, { Component } from 'react';
import './Clock.css';

/**
 * Свойства для компонента Clock
 * @interface ClockProps
 */
interface ClockProps {
  name: string;
  timezoneOffset: number;
  onDelete: () => void;
}

/**
 * Состояние для компонента Clock
 * @interface ClockState
 */
interface ClockState {
  currentTime: Date;
}

/**
 * Компонент Clock для отображения текущего времени
 * @class Clock
 * @extends {Component<ClockProps, ClockState>}
 */
class Clock extends Component<ClockProps, ClockState> {
  intervalId: NodeJS.Timeout | null = null;

  /**
   * Инициализация состояния компонента Clock
   * @type {ClockState}
   */
  state: ClockState = {
    currentTime: new Date(1111, 11, 11),
  };

  componentDidMount() {
    this.intervalId = setInterval(this.tick, 1000);
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Обновляет текущее время на основе смещения часового пояса
   */
  tick = () => {
    const { timezoneOffset } = this.props;

    const currentDate = new Date(); // Получаем текущую дату и время
    const utc = currentDate.getTime() + (currentDate.getTimezoneOffset() * 60000); // Получаем время в миллисекундах в UTC
    const newDate = new Date(utc + (timezoneOffset * 60 * 60000)); // Добавляем смещение часового пояса в миллисекундах

    this.setState({ currentTime: newDate });
  };

  render() {
    const { name, onDelete } = this.props;
    const { currentTime } = this.state;

    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();

    const hourDegrees = hours * 30 + (minutes / 60) * 30; // Добавляем угол для плавного движения часовой стрелки
    const minuteDegrees = minutes * 6 + (seconds / 60) * 6; // Добавляем угол для плавного движения минутной стрелки
    const secondDegrees = seconds * 6; // Угол для секундной стрелки

    return (
      <div className="clock-container">
        <span className="clock-name">{name}</span>
        <div className="clock">
          <button className='clock-btn-remove' onClick={onDelete}>×</button>
          <div className="clock-face">
            <div
              className="hour"
              style={{ transform: `rotate(${hourDegrees}deg)` }}
            />
            <div
              className="minute"
              style={{ transform: `rotate(${minuteDegrees}deg)` }}
            />
            <div
              className="second"
              style={{ transform: `rotate(${secondDegrees}deg)` }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Clock;
