import React, { Component } from 'react';
import './Chat.css';
import { v4 as uuidv4 } from 'uuid';
import Message from '../Message/Message';
import MessageForm from '../MessageForm/MessageForm';

/**
 * Интерфейс, представляющий структуру сообщения.
 * @interface
 */
interface MessageInterface {
  id: number;
  newMessage: string;
  UserId: string;
  color: string;
}

/**
 * Интерфейс, представляющий состояние компонента Chat.
 * @interface
 */
interface ChatState {
  lastId: number;
  messages: MessageInterface[];
  isLoading: boolean;
}

/**
 * Props интерфейс для компонента Chat (если используются какие-либо свойства).
 * @interface
 */
interface ChatProps { }

// URL для получения и отправки сообщений
const messageUrlFrom = process.env.REACT_APP_MESSAGES_URL_FROM;
const messageUrl = process.env.REACT_APP_MESSAGES_URL;

/**
 * Компонент чата, отвечающий за отображение сообщений и отправку новых сообщений.
 * @extends Component
 */
class Chat extends Component<ChatProps, ChatState> {
  private interval: NodeJS.Timeout | null = null;
  private currentUserId: string;
  private userColors: { [key: string]: string };

  /**
   * Конструктор компонента Chat.
   * @constructor
   * @param {ChatProps} props - Свойства компонента.
   */
  constructor(props: ChatProps) {
    super(props);
    this.state = {
      lastId: 0,
      messages: [],
      isLoading: false,
    };

    this.userColors = {};
    this.currentUserId = localStorage.getItem('currentUserId') || uuidv4();
    localStorage.setItem('currentUserId', this.currentUserId);
  }

  /**
   * Метод жизненного цикла, вызывается после монтирования компонента.
   * @async
   */
  async componentDidMount() {
    await this.loadMessages(this.state.lastId);
    this.startPolling(); // Запуск периодического опроса сервера
  }

  /**
   * Метод жизненного цикла для очистки всех запущенных процессов/интервалов перед размонтированием.
   */
  componentWillUnmount() {
    this.stopPolling();
  }

  /**
   * Запускает интервал опроса для загрузки сообщений через определенные промежутки времени.
   */
  startPolling = () => {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.loadMessages(this.state.lastId);
    }, 10000);
  };

  /**
   * Останавливает интервал опроса.
   */
  stopPolling = () => {
    if (!this.interval) return;
    clearInterval(this.interval);
  };

  /**
   * Метод для выполнения фетч запроса с заданными параметрами.
   * @async
   * @method
   * @param {string | undefined} url - URL для запроса.
   * @param {string} method - Метод запроса (GET, POST, DELETE и т.д.).
   * @param {any} headers - Заголовки запроса.
   * @param {any} body - Тело запроса.
   * @returns {Promise<Response | undefined>} - Промис с ответом или undefined в случае ошибки.
   */
  async fetchRequest(url: string | undefined, method: string, headers: any, body: any) {
    try {
      if (!url) { throw new Error('URL is not defined'); }

      // Создаем пустой объект для опций запроса
      const options: RequestInit = {};

      if (method) { options.method = method; }
      if (body) { options.body = body; }
      if (headers != null) { options.headers = headers; }

      const response = await fetch(url, options);

      if (!response.ok) { throw new Error('HTTP Error ' + response.status); }

      return response;
    } catch (error) { console.error(error); }
  }

  /**
   * Обрабатывает добавление нового сообщения в чат.
   * @param {string} newMessage - Новое содержание сообщения для добавления.
   */
  onAddMessage = async (newMessage: string) => {
    try {
      let newId = this.state.lastId;
      const formData: MessageInterface = {
        id: newId++,
        newMessage,
        UserId: this.currentUserId,
        color: '',
      };

      const response = await this.fetchRequest(messageUrl, 'POST', {
        'Content-Type': 'application/json',
      }, JSON.stringify(formData));

      if (!response) return;

      if (response.status === 204) {
        this.setState({ lastId: newId++ });
        await this.loadMessages(this.state.lastId);
      }
    } catch (error) { console.error(error); }
  };


  /**
   * Загружает сообщения с сервера.
   * @param {number} id - ID последнего загруженного сообщения.
   */
  loadMessages = async (id: number) => {
    try {
      if (this.state.isLoading) return; // Если запрос уже выполняется, просто выходим из функции
      this.setState({ isLoading: true });

      const response = await this.fetchRequest(`${messageUrlFrom}${id}`, 'GET', null, null);
      // console.log('loadMessages response', response);
      if (!response) return;

      const messages: MessageInterface[] = await response.json();
      const lastId = messages[messages.length - 1]?.id;

      this.setState((prevState) => {
        const existingIds = new Set<number>(prevState.messages.map((message) => message.id));
        const uniqueMessages = messages.filter((message) => !existingIds.has(message.id));

        const messagesWithColor = uniqueMessages.map((message) => {
          const color = this.getUserColor(message.UserId);
          return { ...message, color };
        });

        return {
          messages: [...prevState.messages, ...messagesWithColor],
          isLoading: false,
          lastId: lastId !== undefined ? lastId : prevState.lastId,
        };
      });

    } catch (error) { console.error(error); }
  };

  /**
   * Получает цвет пользователя на основе их идентификатора.
   * @param {string} userId - Идентификатор пользователя.
   * @returns {string} - Строка с шестнадцатеричным представлением цвета в формате "#RRGGBB".
   */
  getUserColor = (userId: string) => {
    // Проверяем, есть ли уже цвет для данного UserId
    if (this.userColors[userId]) {
      return this.userColors[userId]; // Возвращаем уже существующий цвет
    } else {
      // Генерируем хеш из userId
      const hash = userId.split('').reduce((acc, char) => {
        return char.charCodeAt(0) + ((acc << 5) - acc);
      }, 0);

      // Функция для получения компонентов цвета из хеша
      const getColorComponent = (x: number) => {
        return ((hash >> x) & 0xFF).toString(16).padStart(2, '0');
      };

      // Создаем цвет на основе хеша
      const color = `#${getColorComponent(0)}${getColorComponent(8)}${getColorComponent(16)}80`;
      this.userColors[userId] = color;

      return color;
    }
  };


  render() {
    const { messages } = this.state;

    return (
      <div className="container">
        <h2>Анонимный чат.</h2>
        <div className="chat-wrapper">
          <div className="chat-messages">
            {messages.map((message, index) => (
              <Message
                key={message.id}
                message={message}
                currentUserId={this.currentUserId}
              />
            ))}
          </div>
          <MessageForm onAddMessage={this.onAddMessage}></MessageForm>
        </div>
      </div>
    );
  }
}

export default Chat;
