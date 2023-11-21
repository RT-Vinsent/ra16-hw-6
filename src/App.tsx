// import React from 'react';
import './App.css';
import WorldClock from './components/task1/WorldClock/WorldClock';

function App() {
  return (
    <>
      {/* шапка */}
      <header className='header'>
        <h1>Домашнее задание Жизненный цикл и работа с HTTP</h1>
        <h2>Задачи расположены последовательно в столбик</h2>
      </header>
      
      {/* Компонент задачи №1 */}
      <WorldClock />

      {/* Компонент задачи №2 */}
      {/* </> */}

      {/* Компонент задачи №3 */}
      {/* </> */}
      
      {/* Просто подвал */}
      <footer className='footer'><p>Просто подвал</p></footer>
    </>
  );
}

export default App;
