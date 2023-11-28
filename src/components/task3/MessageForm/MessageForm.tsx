import React, { Component, ChangeEvent, FormEvent } from 'react';
import './MessageForm.css';

/**
 * Props интерфейс для компонента MessageForm.
 */
interface MessageFormProps {
  onAddMessage: (newMessage: string) => Promise<void>;
}

/**
 * Состояние компонента MessageForm.
 */
interface MessageFormState {
  newMessage: string;
}

/**
 * Форма для отправки новых сообщений в чат.
 */
class MessageForm extends Component<MessageFormProps, MessageFormState> {
  constructor(props: MessageFormProps) {
    super(props);
    this.state = {
      newMessage: '',
    };
  }

  /**
   * Обработчик изменения в поле ввода сообщения.
   * @param {ChangeEvent<HTMLInputElement>} event - Событие изменения в поле ввода.
   */
  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMessage: event.target.value });
  };

  /**
   * Обработчик отправки формы с сообщением.
   * @param {FormEvent<HTMLFormElement>} event - Событие отправки формы.
   */
  handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { newMessage } = this.state;
    if (newMessage.trim() === '') return;

    try {
      await this.props.onAddMessage(newMessage);
      this.setState({ newMessage: '' });
    } catch (error) { console.error(error); }
  };

  render() {
    const { newMessage } = this.state;
    return (
      <form onSubmit={this.handleSubmit} className="chat-form">
        <input
          className="form-control"
          type="text"
          value={newMessage}
          onChange={this.handleInputChange}
        />
        <button type="submit" className="add-message-button">
          &#8680;
        </button>
      </form>
    );
  }
}

export default MessageForm;
