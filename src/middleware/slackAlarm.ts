import axios from 'axios';
import config from '../config';
import { logger } from '../config/logger';

const API_TOKEN = config.slackAlarm;

const colors = {
  primary: '#007bff',
  info: '#17a2b8',
  success: '#28a745',
  warning: '#ffc107',
  danger: '#dc3545'
};

export interface SlackMrkdwnFormat {
  title: string;
  value: string;
}

export interface SlackMessageFormat {
  color: string;
  title: string;
  text: string;
  fields?: SlackMrkdwnFormat[];
  timestamp?: string;
  footer?: string;
}

export interface SlackMessage {
  mrkdwn: boolean;
  text: string;
  attachments: SlackMessageFormat[];
}

const getChannels = () => {
  return {
    production: API_TOKEN
  };
};

const sendMessage = async (message: SlackMessageFormat) => {
  if (!message) {
    logger.error('메시지 포멧이 없습니다.');
    return;
  }

  const data: SlackMessage = {
    mrkdwn: true,
    text: '',
    attachments: []
  };

  if (!message.title && !message.text) {
    logger.error('메시지 내용이 없습니다.');
    return;
  }

  message.footer = `From API Server [${config.env}]`;
  data.attachments.push(message);

  axios({
    url: getChannels().production,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    data
  });
};

export default { sendMessage, colors };
