const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const requestLogger = (req, res, next) => {
  const dateStr = getFormattedDate();
  const logFile = path.join(logsDir, `request_log_${dateStr}.log`);
  
  const originalSend = res.send;
  const originalJson = res.json;
  
  let resBody;

  res.send = function (body) {
    resBody = body;
    originalSend.call(this, body);
  };

  res.json = function (body) {
    resBody = body;
    originalJson.call(this, body);
  };

  res.on('finish', () => {
    let parsedResBody = resBody;
    try {
      if (typeof resBody === 'string') {
        parsedResBody = JSON.parse(resBody);
      }
    } catch (e) {
      // Keep it as string if it's not JSON
    }

    const logData = {
      timestamp: new Date().toISOString(),
      request: {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        headers: req.headers,
        query: req.query,
        body: req.body,
        params: req.params
      },
      response: {
        statusCode: res.statusCode,
        headers: res.getHeaders(),
        body: parsedResBody
      }
    };

    const logEntry = JSON.stringify(logData) + '\n';

    fs.appendFile(logFile, logEntry, (err) => {
      if (err) console.error('Failed to write request log:', err);
    });
  });

  next();
};

const orderPaymentLogger = (message, data = {}) => {
  const dateStr = getFormattedDate();
  const logFile = path.join(logsDir, `order_payment_log_${dateStr}.log`);
  const logEntry = `[${new Date().toISOString()}] ${message} | Data: ${JSON.stringify(data)}\n`;

  fs.appendFile(logFile, logEntry, (err) => {
    if (err) console.error('Failed to write order payment log:', err);
  });
};

module.exports = {
  requestLogger,
  orderPaymentLogger
};
