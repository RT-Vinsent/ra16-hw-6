import React, { Component } from 'react';
import Clock from '../Clock/Clock';
import './WorldClock.css';

/**
 * Интерфейс для описания часов
 * @interface ClockInterface
 */
interface ClockInterface {
  name: string;
  timezoneOffset: number;
}

/**
 * Интерфейс для состояния компонента WorldClock
 * @interface WorldClockState
 */
interface WorldClockState {
  clocks: ClockInterface[];
  newClockName: string;
  newClockOffset: number;
}

/**
 * Компонент WorldClock, отображающий несколько часов
 * @class WorldClock
 * @extends {Component<{}, WorldClockState>}
 */
class WorldClock extends Component<{}, WorldClockState> {
  /**
   * Состояние компонента WorldClock
   * @type {WorldClockState}
   */
  state: WorldClockState = {
    clocks: [],
    newClockName: '',
    newClockOffset: 0,
  };

  /**
   * Проверяет, является ли переданное значение часовым поясом
   * @param {number} value - Проверяемое значение часового пояса
   * @returns {boolean} - Возвращает true, если значение часового пояса корректное
   */
  isValidTimeZone(value: number): value is number {
    return value >= -12 && value <= 12;
  }

  /**
   * Обрабатывает добавление нового часового пояса в список
   */
  handleAddClock = () => {
    const { newClockName, newClockOffset } = this.state;

    if (newClockName && this.isValidTimeZone(newClockOffset)) {
      const newClock: ClockInterface = {
        name: newClockName,
        timezoneOffset: newClockOffset,
      };
      setTimeout(() => {
        this.setState((prevState) => ({
          clocks: [...prevState.clocks, newClock],
          newClockName: '',
          newClockOffset: 0,
        }));
      }, 0);
    }
  };

  /**
   * Обрабатывает удаление часового пояса из списка
   * @param {number} index - Индекс удаляемого часового пояса
   */
  handleDeleteClock = (index: number) => {
    const { clocks } = this.state;
    const updatedClocks = [...clocks];
    updatedClocks.splice(index, 1);
    this.setState({ clocks: updatedClocks });
  };

  /**
   * Рендерит компонент WorldClock
   * @returns {JSX.Element} - Возвращает отрисованный компонент WorldClock
   */
  render(): JSX.Element {
    const { newClockName, newClockOffset, clocks } = this.state;

    return (
      <div className='container'>
        <h2>Мировые часы.</h2>
        
        <form className='clock-form' onSubmit={(e) => { e.preventDefault(); }}>
          <input
            type="text"
            placeholder="Название"
            value={newClockName}
            onChange={(e) => this.setState({ newClockName: e.target.value || '' })}
            required
          />
          <input
            type="number"
            placeholder="Временная зона"
            value={newClockOffset}
            onChange={(e) => this.setState({ newClockOffset: this.isValidTimeZone(parseInt(e.target.value)) ? parseInt(e.target.value) : 0 })}
          />
          <button onClick={this.handleAddClock}>Добавить</button>
        </form>
        <div className="clocks-container">
          {clocks.map((clock, index) => (
            <Clock
              key={index}
              name={clock.name}
              timezoneOffset={clock.timezoneOffset}
              onDelete={() => this.handleDeleteClock(index)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default WorldClock;
