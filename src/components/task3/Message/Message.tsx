import React, { Component, RefObject } from 'react';
import './Message.css';

/**
 * Интерфейс, представляющий структуру сообщения.
 */
interface MessageProps {
  message: {
    id: number;
    newMessage: string;
    UserId: string;
    color: string;
  };
  currentUserId: string;
}

/**
 * Компонент, отображающий отдельное сообщение в чате.
 */
class Message extends Component<MessageProps> {
  private messageRef: RefObject<HTMLDivElement>; // Ссылка на DOM-элемент сообщения

  constructor(props: MessageProps) {
    super(props);
    this.messageRef = React.createRef();
  }

  /**
   * После монтирования компонента скроллит к последнему сообщению, то есть текущее.
   */
  componentDidMount() {
    this.scrollToBottom();
  }

  /**
   * Прокручивает к последнему сообщению, то есть текущий.
   */
  scrollToBottom = () => {
    if (this.messageRef.current) {
      this.messageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /**
   * Рендеринг компонента.
   * @returns {JSX.Element} Возвращает JSX-элемент сообщения.
   */
  render(): JSX.Element {
    const { message, currentUserId } = this.props;
    const isCurrentUserMessage = message.UserId === currentUserId;

    // Определяем класс сообщения в зависимости от того, принадлежит ли оно текущему пользователю
    const messageClassName = isCurrentUserMessage ? 'current-user-message' : 'other-user-message';

    // Стиль сообщения определяется его цветом
    const messageStyle = { backgroundColor: message.color };

    return (
      <div className={`chat-message-wrapper ${messageClassName}`}>
        <div
          ref={this.messageRef} // Привязываем ссылку на DOM-элемент к messageRef
          className='chat-message'
          id={String(message.id)} // Приведем ID к строке, так как HTML ID ожидает строку
          style={messageStyle}
        >
          {message.newMessage}
        </div>
      </div>
    );
  }
}

export default Message;
