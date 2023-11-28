// import React from 'react';
import './App.css';
import WorldClock from './components/task1/WorldClock/WorldClock';
import Notes from './components/task2/Notes/Notes';
import Chat from './components/task3/Chat/Chat';

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
      <Notes />

      {/* Компонент задачи №3 */}
      <Chat />
      
      {/* Просто подвал */}
      <footer className='footer'><p>Просто подвал</p></footer>
    </>
  );
}

export default App;
