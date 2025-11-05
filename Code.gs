/**
 * Основной файл приложения для управления выговорами
 * Система автоматизации работы с дисциплинарными взысканиями
 */

// Константы для работы с Google Sheets
const SHEET_NAME = 'Выговоры';
const LOGS_SHEET = 'Логи';
const ACCESS_REQUESTS_SHEET = 'Запросы доступа';
const AUTH_USERS_SHEET = 'Авторизованные пользователи';
const SESSIONS_SHEET = 'Сессии';
const USERS_SHEET = 'Пользователи';
const RULES_SHEET = 'Правила';

// Роли пользователей
const ROLES = {
  SUPER_ADMIN: 'Супер-админ',
  ADMIN: 'Админ',
  USER: 'Пользователь'
};

// Настройки безопасности
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 часа в миллисекундах

// Discord Webhook URL TEST
// Discord Webhook URLs для разных каналов
// const DISCORD_WEBHOOK_VYGOVORY = 'https://discord.com/api/webhooks/1435323169874509915/i0HevDtLCuYVud9mBSSVBhdUQK02Yn2u6ap212Y0jXFwh4PnXzQiPdKU4IGTEIQ9yZdQ'; // 🚨выговоры
// const DISCORD_WEBHOOK_REMOVAL_REQUESTS = 'https://discord.com/api/webhooks/1435323251504185435/f1N5O28xRFN9VYD0IBHshd8zADdXvd0DxztFEXObQ43Vq93C1Ttu1Lu14NnhO4MmLApq'; // 🚨снятие-выговоров
// const DISCORD_WEBHOOK_REMOVAL_REPORTS = 'https://discord.com/api/webhooks/1435323325697232906/jKG00KrnyrAZF8UPHoE7eKM_s4QZ8gf9-ahVc-peJVpe43ZvW6Qr78TAcV7F57OBeF9N'; // 🚨отчетность-снятия-выговоров
// const DISCORD_WEBHOOK_APPEALS = 'https://discord.com/api/webhooks/1435323372555997195/M0ynoG-hsB5OswLxytIFqlJlgp_T7RhSDO-04rQVKe5OO8vZc7BPaXXjIWqGCZYJ6Mc0'; // 🚨обжалование-выговоров
// const DISCORD_WEBHOOK_ACCESS = 'https://discord.com/api/webhooks/1399319763460689951/T2LYeFalsgHIVPRRCuhP5D9gzIxys-LXlipRdrk-zwHAklG8ggWQfd3VpT7rFnnJ0PIu'; // Запрос доступа

// Discord Webhook URL
// Discord Webhook URLs для разных каналов
const DISCORD_WEBHOOK_VYGOVORY = 'https://discord.com/api/webhooks/1435373736982347938/HkbLyDTema7X8y0u8rGmY0fhm1YWPRz8-xcGjdrNk0FnJ4OyOWJb5HNfuM_fxXlvYTOF'; // 🚨выговоры
const DISCORD_WEBHOOK_REMOVAL_REQUESTS = 'https://discord.com/api/webhooks/1435374235672379574/9pS4e4TLFU71JaTUal75ylQW04bUH3PBLfGYKuo1BEDX_05egQvdACww2_R5afuxUPYs'; // 🚨снятие-выговоров
const DISCORD_WEBHOOK_REMOVAL_REPORTS = 'https://discord.com/api/webhooks/1435374397346283702/ZUcJLFak5G-oX5MfYdQjeHFQOX12u1P8v4fCmXUm6r60OBNbA8XeqTAk9dZMN7kSCZni'; // 🚨отчетность-снятия-выговоров
const DISCORD_WEBHOOK_APPEALS = 'https://discord.com/api/webhooks/1435374614669955112/wkNdAL8HFvGKWU1SYwMVl4I7mCJTJs1P64QbizBnl5i8C_Bb8EAWat3N85-PRlQf2gbu'; // 🚨обжалование-выговоров
const DISCORD_WEBHOOK_ACCESS = 'https://discord.com/api/webhooks/1435377961170767933/_WPZ7YO4NCJoWMErXm5Wiwnpv8C-xUSKlFB6W7UHdMr_fVSrzHyScMQFeI-yb_yhoiGO'; // Запрос доступа

// Старый webhook для обратной совместимости (можно удалить после проверки)
const DISCORD_WEBHOOK_URL = DISCORD_WEBHOOK_VYGOVORY;

// Логин учетной записи SDO (Discord ID этой учетной записи является ID роли, а не пользователя)
const SDO_ACCOUNT_LOGIN = 'Saspa_sdo_superuser';
const SDO_ROLE_ID = '827595931188068362'; // Discord ID роли "Старший состав"

// Типы выговоров
const VYGOVOR_TYPES = {
  VERBAL: 'VR',      // Устный
  WRITTEN: 'WR',     // Письменный
  STRICT: 'SR',      // Строгий
  FINE: 'Fine'       // Штраф
};

// Статусы выговоров
const STATUSES = {
  ACTIVE: 'Активен',
  PAID: 'Оплачен',
  WORKED: 'Отработан',
  APPEALED: 'Обжалован',
  ON_APPEAL: 'На обжаловании',
  REMOVED: 'Снят',
  AMNESTY: 'Амнистирован',
  IGNORED: 'Игнорирован' // Для просроченных выговоров, переведенных в следующий тип
};

/**
 * Инициализация - создание таблиц при первом запуске
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Управление выговорами')
    .addItem('Открыть веб-интерфейс', 'showSidebar')
    .addItem('Импорт из JSON', 'showImportDialog')
    .addSeparator()
    .addItem('Тест Discord Webhook', 'testDiscordWebhook')
    .addToUi();
}

/**
 * Показать веб-интерфейс (для использования в Google Sheets)
 */
function showSidebar() {
  // Функция getHTMLContent находится в UI.gs
  const htmlContent = getHTMLContent();
  const html = HtmlService.createHtml(htmlContent)
    .setWidth(1200)
    .setHeight(800)
    .setTitle('Система управления выговорами');
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Управление выговорами');
}

/**
 * Обработчик GET запросов для веб-приложения
 * Необходимо для развертывания как веб-приложение
 */
function doGet(e) {
  // Инициализировать базу данных при первом запуске
  try {
    getOrCreateSpreadsheet();
  } catch (error) {
    console.error('Ошибка инициализации:', error);
  }
  
  // Функция getHTMLContent находится в UI.gs
  const htmlContent = getHTMLContent();
  return HtmlService.createHtmlOutput(htmlContent)
    .setTitle('Система управления выговорами')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Обработчик POST запросов для веб-приложения
 */
function doPost(e) {
  return doGet(e);
}

/**
 * Получить или создать Spreadsheet
 */
function getOrCreateSpreadsheet() {
  let ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (!ss) {
    ss = SpreadsheetApp.create('База данных выговоров');
  }
  
  // Создать листы если их нет
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      'ID', 'Дата', 'Получатель', 'Discord ID получателя', 
      'Выдавший', 'Discord ID выдающего', 'Правило', 
      'Тип', 'Сумма', 'Часы отработки', 'Статус', 
      'Дата оплаты', 'Дата отработки', 'Дата снятия', 
      'Ссылка на сообщение', 'Комментарий', 'Обжалование', 
      'Доказательства', 'Доказательства обжалования', 'Создано', 'Обновлено', 
      'Уведомление о неоплате отправлено', 'Срок оплаты'
    ]);
    sheet.setFrozenRows(1);
    formatHeader(sheet);
  } else {
    // Миграция: добавить столбец "Доказательства обжалования" если его нет
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!headers.includes('Доказательства обжалования')) {
      // Найти индекс столбца "Доказательства"
      const evidenceIndex = headers.indexOf('Доказательства');
      if (evidenceIndex !== -1) {
        // Вставить новый столбец после "Доказательства"
        sheet.insertColumnAfter(evidenceIndex + 1);
        sheet.getRange(1, evidenceIndex + 2).setValue('Доказательства обжалования');
        Logger.log('Добавлен столбец "Доказательства обжалования" на позицию ' + (evidenceIndex + 2));
      }
    }
    
    // Миграция: добавить столбец "Срок оплаты" если его нет
    const updatedHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    if (!updatedHeaders.includes('Срок оплаты')) {
      // Добавляем столбец в конец
      const lastCol = sheet.getLastColumn();
      sheet.getRange(1, lastCol + 1).setValue('Срок оплаты');
      Logger.log('Добавлен столбец "Срок оплаты" на позицию ' + (lastCol + 1));
      
      // Для существующих выговоров с суммой > 0, устанавливаем срок = дата + 7 дней
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const amount = parseFloat(row[8]) || 0; // Столбец "Сумма"
        const vygovorDate = row[1]; // Столбец "Дата"
        
        if (amount > 0 && vygovorDate) {
          try {
            const deadline = new Date(vygovorDate);
            deadline.setDate(deadline.getDate() + 7); // +7 дней
            sheet.getRange(i + 1, lastCol + 1).setValue(deadline);
          } catch (e) {
            // Если ошибка преобразования даты, пропускаем
          }
        }
      }
      Logger.log('Установлены сроки оплаты для существующих выговоров');
    }
  }
  
  let logsSheet = ss.getSheetByName(LOGS_SHEET);
  if (!logsSheet) {
    logsSheet = ss.insertSheet(LOGS_SHEET);
    logsSheet.appendRow([
      'Дата', 'Действие', 'Пользователь', 'Discord ID', 
      'Детали', 'ID выговора', 'IP адрес'
    ]);
    logsSheet.setFrozenRows(1);
    formatHeader(logsSheet);
  }
  
  // Таблица авторизованных пользователей
  let authUsersSheet = ss.getSheetByName(AUTH_USERS_SHEET);
  if (!authUsersSheet) {
    authUsersSheet = ss.insertSheet(AUTH_USERS_SHEET);
    authUsersSheet.appendRow([
      'Логин', 'Хеш пароля', 'Имя', 'Discord ID', 'Роль', 'Дата добавления', 'Добавил'
    ]);
    authUsersSheet.setFrozenRows(1);
    formatHeader(authUsersSheet);
  }
  
  // Таблица сессий
  let sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
  if (!sessionsSheet) {
    sessionsSheet = ss.insertSheet(SESSIONS_SHEET);
    sessionsSheet.appendRow([
      'Токен', 'Логин', 'Дата создания', 'Дата истечения', 'IP адрес'
    ]);
    sessionsSheet.setFrozenRows(1);
    formatHeader(sessionsSheet);
  }
  
  // Таблица запросов доступа
  let requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
  if (!requestsSheet) {
    requestsSheet = ss.insertSheet(ACCESS_REQUESTS_SHEET);
    requestsSheet.appendRow([
      'Дата запроса', 'Логин', 'Имя', 'Discord ID', 
      'Причина запроса', 'Статус', 'Рассмотрел', 'Дата рассмотрения', 'Пароль (Base64)'
    ]);
    requestsSheet.setFrozenRows(1);
    formatHeader(requestsSheet);
  }
  
  // Таблица пользователей
  let usersSheet = ss.getSheetByName(USERS_SHEET);
  if (!usersSheet) {
    usersSheet = ss.insertSheet(USERS_SHEET);
    usersSheet.appendRow([
      'Имя', 'Discord ID', 'Дата добавления', 'Добавил'
    ]);
    usersSheet.setFrozenRows(1);
    formatHeader(usersSheet);
  }
  
  return ss;
}

/**
 * Форматирование заголовков
 */
function formatHeader(sheet) {
  const headerRange = sheet.getRange(1, 1, 1, sheet.getLastColumn());
  headerRange.setBackground('#4285f4');
  headerRange.setFontColor('#ffffff');
  headerRange.setFontWeight('bold');
  headerRange.setWrap(true);
}

/**
 * Создать новый выговор
 */
function createVygovor(sessionToken, data) {
  // Проверка доступа
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    const timestamp = new Date();
    const id = Utilities.getUuid();
    
    // Преобразуем дату из строки ISO в объект Date
    let vygovorDate = new Date();
    if (data.date) {
      try {
        // Если дата передана как ISO строка
        vygovorDate = new Date(data.date);
        // Проверяем, что дата валидна
        if (isNaN(vygovorDate.getTime())) {
          vygovorDate = new Date();
        }
      } catch (e) {
        vygovorDate = new Date();
      }
    }
    
    // Преобразуем срок оплаты из строки ISO в объект Date
    let paymentDeadline = '';
    if (data.paymentDeadline) {
      try {
        const deadline = new Date(data.paymentDeadline);
        if (!isNaN(deadline.getTime())) {
          paymentDeadline = deadline;
        }
      } catch (e) {
        // Если ошибка, оставляем пустым
      }
    }
    
    const row = [
      id,
      vygovorDate,
      data.recipientName || '',
      data.recipientId || '',
      data.issuerName || '',
      data.issuerId || '',
      data.rule || '',
      data.type || VYGOVOR_TYPES.VERBAL,
      data.amount || 0,
      data.hours || 0,
      STATUSES.ACTIVE,
      '', // Дата оплаты
      '', // Дата отработки
      '', // Дата снятия
      data.messageLink || '',
      data.comment || '',
      '', // Обжалование
      data.evidenceLinks || '', // Доказательства
      '', // Доказательства обжалования (новый столбец)
      timestamp,
      timestamp,
      false, // Уведомление о неоплате отправлено
      paymentDeadline // Срок оплаты/отработки
    ];
    
    sheet.appendRow(row);
    
    // Логирование
    logAction({
      action: 'CREATE_VYGOVOR',
      userId: data.issuerId,
      userName: data.issuerName,
      details: `Создан выговор для ${data.recipientName}`,
      vygovorId: id
    });
    
    // Форматируем срок оплаты/отработки
    let paymentDeadlineStr = 'Нет';
    if (paymentDeadline) {
      try {
        const deadlineDate = new Date(paymentDeadline);
        if (!isNaN(deadlineDate.getTime())) {
          paymentDeadlineStr = deadlineDate.toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        }
      } catch (e) {
        // Если ошибка, оставляем "Нет"
      }
    }
    
    // Отправка в Discord с упоминанием получателя
    sendDiscordLog('🚨 Создан выговор', {
      'Получатель': data.recipientName,
      'Discord ID получателя': data.recipientId,
      'Выдавший': data.issuerName,
      'Discord ID выдавшего': data.issuerId,
      'Тип выговора': data.type,
      'Правило': data.rule,
      'Сумма штрафа': data.amount > 0 ? data.amount + '$' : 'Нет',
      'Срок оплаты/отработки': paymentDeadlineStr,
      'Дата выдачи': vygovorDate.toLocaleDateString('ru-RU'),
      'Доказательства': data.evidenceLinks || 'Не указаны',
      'ID выговора': id
    });
    
    return { success: true, id: id };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Обновить статус выговора
 */
function updateVygovorStatus(id, status, data = {}) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    // Найти строку с выговором
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        const rowIndex = i + 1;
        
        // Обновить статус (столбец K, индекс 10 -> колонка 11)
        sheet.getRange(rowIndex, 11).setValue(status);
        sheet.getRange(rowIndex, 20).setValue(new Date()); // Обновлено (столбец T, индекс 19 -> колонка 20)
        
        // Обновить дополнительные поля в зависимости от статуса
        if (status === STATUSES.PAID) {
          sheet.getRange(rowIndex, 12).setValue(new Date()); // Дата оплаты (столбец L, индекс 11 -> колонка 12)
          // Сбрасываем флаг уведомления при оплате
          sheet.getRange(rowIndex, 22).setValue(false); // Уведомление о неоплате (столбец V, индекс 21 -> колонка 22)
        } else if (status === STATUSES.WORKED) {
          sheet.getRange(rowIndex, 13).setValue(new Date()); // Дата отработки (столбец M, индекс 12 -> колонка 13)
        } else if (status === STATUSES.REMOVED || status === STATUSES.AMNESTY) {
          sheet.getRange(rowIndex, 14).setValue(new Date()); // Дата снятия (столбец N, индекс 13 -> колонка 14)
        }
        
        if (data.comment) {
          sheet.getRange(rowIndex, 16).setValue(data.comment);
        }
        
        // Логирование
        logAction({
          action: 'UPDATE_STATUS',
          userId: data.userId || '',
          userName: data.userName || '',
          details: `Статус изменен на: ${status}`,
          vygovorId: id
        });
        
        // Отправка в Discord
        sendDiscordLog('Обновлен статус выговора', {
          'ID': id,
          'Новый статус': status,
          'Пользователь': data.userName || 'Система'
        });
        
        return { success: true };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Подача заявки на снятие выговора (требует рассмотрения админом)
 */
function requestVygovorRemoval(id, removalData) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        const rowIndex = i + 1;
        const currentStatus = values[i][10] || STATUSES.ACTIVE;
        
        // Сохраняем данные заявки на снятие в комментарии (или можно добавить отдельный столбец)
        const removalInfo = {
          removalType: removalData.removalType || '',
          proof: removalData.proof || '',
          removedByName: removalData.removedByName || '',
          removedById: removalData.removedById || '',
          issuerName: removalData.issuerName || '',
          issuerId: removalData.issuerId || '',
          status: 'Ожидает рассмотрения',
          requestDate: new Date().toISOString(),
          reviewedBy: null,
          reviewDate: null,
          reviewDecision: null,
          reviewComment: null,
          previousStatus: currentStatus
        };
        
        // Сохраняем в комментарии (можно использовать отдельный столбец если добавить)
        const comment = JSON.stringify(removalInfo);
        sheet.getRange(rowIndex, 16).setValue(comment); // Комментарий в столбце P (индекс 15)
        sheet.getRange(rowIndex, 20).setValue(new Date());
        
        logAction({
          action: 'REQUEST_REMOVAL',
          userId: removalData.removedById,
          userName: removalData.removedByName,
          details: 'Заявка на снятие выговора',
          vygovorId: id
        });
        
        // Формируем теги Discord
        const recipientDiscordTag = values[i][3] === SDO_ROLE_ID ? '<@&' + values[i][3] + '>' : '<@' + values[i][3] + '>';
        const removerDiscordTag = removalData.removedById === SDO_ROLE_ID ? '<@&' + removalData.removedById + '>' : '<@' + removalData.removedById + '>';
        const issuerDiscordTag = (removalData.issuerId || values[i][5]) === SDO_ROLE_ID ? '<@&' + (removalData.issuerId || values[i][5]) + '>' : '<@' + (removalData.issuerId || values[i][5]) + '>';
        
        sendDiscordLog('🔔 Заявка на снятие выговора (требует рассмотрения)', {
          'Кто получил выговор': (values[i][2] || 'Не указано') + ' ' + recipientDiscordTag,
          'Discord ID получателя': values[i][3] || 'Не указано',
          'Кто снимает': (removalData.removedByName || 'Не указано') + ' ' + removerDiscordTag,
          'Discord ID снимающего': removalData.removedById || 'Не указано',
          'Выдавший': (removalData.issuerName || values[i][4] || 'Не указано') + ' ' + issuerDiscordTag,
          'Discord ID выдающего': removalData.issuerId || values[i][5] || 'Не указано',
          'Правило': values[i][6] || 'Не указано',
          'Тип выговора': values[i][7] || 'Не указано',
          'Тип снятия': removalData.removalType || 'Не указано',
          'Доказательства': removalData.proof || 'Нет'
        }, { vygovorId: id });
        
        return { success: true };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить все заявки на снятие (для админов)
 */
function getRemovals(sessionToken) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const removals = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const commentStr = row[15]; // Комментарий в столбце P (индекс 15)
      
      // Ищем все выговоры с данными заявки на снятие
      if (commentStr && commentStr.trim() !== '') {
        try {
          const removalInfo = JSON.parse(commentStr);
          
          // Проверяем, что это заявка на снятие (есть поле removalType и status)
          if (removalInfo.removalType && removalInfo.status) {
            // Форматируем дату
            let dateStr = 'Не указано';
            if (row[1]) {
              try {
                let dateValue = row[1];
                if (dateValue instanceof Date) {
                  if (!isNaN(dateValue.getTime())) {
                    const day = String(dateValue.getDate()).padStart(2, '0');
                    const month = String(dateValue.getMonth() + 1).padStart(2, '0');
                    const year = dateValue.getFullYear();
                    dateStr = day + '.' + month + '.' + year;
                  }
                } else if (typeof dateValue === 'string' && dateValue.trim()) {
                  const dateMatch = dateValue.trim().match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
                  if (dateMatch) {
                    dateStr = dateMatch[1].padStart(2, '0') + '.' + dateMatch[2].padStart(2, '0') + '.' + dateMatch[3];
                  }
                }
              } catch (e) {
                console.warn('Ошибка форматирования даты:', e);
              }
            }
            
            removals.push({
              vygovorId: row[0] || 'N/A',
              date: dateStr,
              recipient: row[2] || 'Не указано',
              recipientId: row[3] || 'N/A',
              issuer: row[4] || 'Не указано',
              issuerId: row[5] || 'N/A',
              type: row[7] || 'N/A',
              status: row[10] || 'Не указано',
              removalType: removalInfo.removalType || 'N/A',
              proof: removalInfo.proof || 'Нет',
              removedByName: removalInfo.removedByName || 'Не указано',
              removedById: removalInfo.removedById || 'N/A',
              removalStatus: removalInfo.status || 'Ожидает рассмотрения',
              requestDate: removalInfo.requestDate || '',
              reviewedBy: removalInfo.reviewedBy || null,
              reviewDate: removalInfo.reviewDate || null,
              reviewDecision: removalInfo.reviewDecision || null,
              reviewComment: removalInfo.reviewComment || null,
              previousStatus: removalInfo.previousStatus || STATUSES.ACTIVE
            });
          }
        } catch (e) {
          // Если не удалось распарсить JSON, пропускаем (это не заявка на снятие)
        }
      }
    }
    
    // Сортируем: сначала ожидающие рассмотрения, затем по дате заявки (новые сверху)
    removals.sort((a, b) => {
      if (a.removalStatus === 'Ожидает рассмотрения' && b.removalStatus !== 'Ожидает рассмотрения') return -1;
      if (a.removalStatus !== 'Ожидает рассмотрения' && b.removalStatus === 'Ожидает рассмотрения') return 1;
      return new Date(b.requestDate) - new Date(a.requestDate);
    });
    
    return { success: true, data: removals };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить количество ожидающих рассмотрения заявок на снятие (для счетчика в меню)
 */
function getPendingRemovalsCount(sessionToken) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа', count: 0 };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pendingCount = 0;
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const commentStr = row[15]; // Комментарий в столбце P (индекс 15)
      
      if (commentStr && commentStr.trim() !== '') {
        try {
          const removalInfo = JSON.parse(commentStr);
          if (removalInfo.removalType && removalInfo.status === 'Ожидает рассмотрения') {
            pendingCount++;
          }
        } catch (e) {
          // Если не удалось распарсить, пропускаем
        }
      }
    }
    
    return { success: true, count: pendingCount };
  } catch (error) {
    return { success: false, error: error.toString(), count: 0 };
  }
}

/**
 * Рассмотреть заявку на снятие (одобрить/отклонить)
 */
function reviewRemoval(sessionToken, vygovorId, decision, reviewComment) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    const adminName = adminAccess.userInfo ? adminAccess.userInfo.name : 'Система';
    
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === vygovorId) {
        const rowIndex = i + 1;
        const commentStr = values[i][15];
        
        if (!commentStr) {
          return { success: false, error: 'Заявка на снятие не найдена' };
        }
        
        const removalInfo = JSON.parse(commentStr);
        const previousStatus = removalInfo.previousStatus || STATUSES.ACTIVE;
        
        // Обновляем данные заявки
        removalInfo.status = decision === 'approved' ? 'Одобрено' : 'Отклонено';
        removalInfo.reviewedBy = adminName || adminLogin;
        removalInfo.reviewDate = new Date().toISOString();
        removalInfo.reviewDecision = decision;
        removalInfo.reviewComment = reviewComment || '';
        
        sheet.getRange(rowIndex, 16).setValue(JSON.stringify(removalInfo));
        
        // Меняем статус выговора в зависимости от решения
        if (decision === 'approved') {
          // При одобрении - устанавливаем правильный статус
          const removalType = removalInfo.removalType || 'Оплата';
          const status = removalType === 'Оплата' ? STATUSES.PAID : STATUSES.WORKED;
          
          sheet.getRange(rowIndex, 11).setValue(status); // Используем правильный статус
          
          // Проставляем соответствующую дату (Дата оплаты или Дата отработки)
          if (removalType === 'Оплата') {
            sheet.getRange(rowIndex, 12).setValue(new Date()); // Дата оплаты (столбец L, индекс 11)
            // Сбрасываем флаг уведомления при оплате
            sheet.getRange(rowIndex, 22).setValue(false); // Уведомление о неоплате (столбец V, индекс 21 -> колонка 22)
          } else {
            sheet.getRange(rowIndex, 13).setValue(new Date()); // Дата отработки (столбец M, индекс 12)
          }
          
          sheet.getRange(rowIndex, 14).setValue(new Date()); // Дата снятия
        } else {
          // При отклонении - возвращаем предыдущий статус
          const previousStatus = removalInfo.previousStatus || STATUSES.ACTIVE;
          sheet.getRange(rowIndex, 11).setValue(previousStatus);
        }
        
        sheet.getRange(rowIndex, 20).setValue(new Date());
        
        logAction({
          action: 'REVIEW_REMOVAL',
          userId: removalInfo.removedById || '',
          userName: adminLogin,
          details: 'Заявка на снятие ' + (decision === 'approved' ? 'одобрена' : 'отклонена') + ': ' + vygovorId,
          vygovorId: vygovorId
        });
        
        const vygovorData = values[i];
        
        // Формируем теги Discord
        const recipientDiscordTag = vygovorData[3] === SDO_ROLE_ID ? '<@&' + vygovorData[3] + '>' : '<@' + vygovorData[3] + '>';
        const removerDiscordTag = removalInfo.removedById === SDO_ROLE_ID ? '<@&' + removalInfo.removedById + '>' : '<@' + removalInfo.removedById + '>';
        const issuerDiscordTag = (removalInfo.issuerId || vygovorData[5]) === SDO_ROLE_ID ? '<@&' + (removalInfo.issuerId || vygovorData[5]) + '>' : '<@' + (removalInfo.issuerId || vygovorData[5]) + '>';
        
        const fields = {
          'Кто получил выговор': (vygovorData[2] || 'Не указано') + ' ' + recipientDiscordTag,
          'Discord ID получателя': vygovorData[3] || 'Не указано',
          'Кто снимает': (removalInfo.removedByName || 'Не указано') + ' ' + removerDiscordTag,
          'Discord ID снимающего': removalInfo.removedById || 'Не указано',
          'Выдавший': (removalInfo.issuerName || vygovorData[4] || 'Не указано') + ' ' + issuerDiscordTag,
          'Discord ID выдающего': removalInfo.issuerId || vygovorData[5] || 'Не указано',
          'Правило': vygovorData[6] || 'Не указано',
          'Тип выговора': vygovorData[7] || 'Не указано',
          'Тип снятия': removalInfo.removalType || 'Не указано',
          'Рассмотрел': adminName,
          'Решение': decision === 'approved' ? '✅ Одобрено' : '❌ Отклонено'
        };
        
        // Добавляем комментарий только если заявка отклонена
        if (decision !== 'approved') {
          fields['Комментарий рассмотревшего'] = reviewComment || 'Не указано';
        }
        
        sendDiscordLog((decision === 'approved' ? '✅ Заявка на снятие одобрена' : '❌ Заявка на снятие отклонена'), fields, { vygovorId: vygovorId });
        
        return { success: true };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Снятие выговора (оплата/отработка) - старый метод, оставлен для совместимости
 * @deprecated Используйте requestVygovorRemoval для подачи заявки
 */
function removeVygovor(id, removalType, proof, removedBy) {
  try {
    const status = removalType === 'Оплата' ? STATUSES.PAID : STATUSES.WORKED;
    
    const result = updateVygovorStatus(id, STATUSES.REMOVED, {
      comment: `Снят через ${removalType}. Доказательства: ${proof}`,
      userId: removedBy.discordId,
      userName: removedBy.name
    });
    
    if (result.success) {
      sendDiscordLog('Снят выговор', {
        'ID': id,
        'Тип снятия': removalType,
        'Снял': removedBy.name,
        'Доказательства': proof
      });
    }
    
    return result;
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Обжалование выговора
 */
function appealVygovor(id, appealData) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === id) {
        const rowIndex = i + 1;
        const previousStatus = values[i][10] || STATUSES.ACTIVE;
        
        // Меняем статус на "На обжаловании"
        sheet.getRange(rowIndex, 11).setValue(STATUSES.ON_APPEAL);
        
        // Сохраняем данные обжалования с информацией о статусе рассмотрения
        const appealInfo = {
          ...appealData,
          status: 'Ожидает рассмотрения',
          previousStatus: previousStatus,
          appealDate: new Date().toISOString(),
          reviewedBy: null,
          reviewDate: null,
          reviewDecision: null
        };
        
        // Сохраняем JSON обжалования в столбец Q (индекс 16)
        sheet.getRange(rowIndex, 17).setValue(JSON.stringify(appealInfo));
        // НЕ трогаем столбец R (индекс 17) - там хранятся оригинальные доказательства выговора
        
        // Сохраняем доказательства обжалования в отдельный столбец S (индекс 18)
        sheet.getRange(rowIndex, 19).setValue(appealData.proof || '');
        
        // Обновляем дату изменения в столбце T (индекс 19 -> колонка 20)
        sheet.getRange(rowIndex, 20).setValue(new Date());
        
        logAction({
          action: 'APPEAL_VYGOVOR',
          userId: appealData.userId,
          userName: appealData.userName,
          details: 'Обжалование выговора',
          vygovorId: id
        });
        
        // Отправка в Discord
        const recipientDiscordTag = values[i][3] === SDO_ROLE_ID ? '<@&' + values[i][3] + '>' : '<@' + values[i][3] + '>';
        const appealerDiscordTag = appealData.userId === SDO_ROLE_ID ? '<@&' + appealData.userId + '>' : '<@' + appealData.userId + '>';
        const issuerDiscordTag = values[i][5] === SDO_ROLE_ID ? '<@&' + values[i][5] + '>' : '<@' + values[i][5] + '>';
        
        sendDiscordLog('🔔 Обжалование выговора (требует рассмотрения)', {
          'Кто получил выговор': (values[i][2] || 'Не указано') + ' ' + recipientDiscordTag,
          'Discord ID получателя': values[i][3] || 'Не указано',
          'Кто обжалует': appealData.userName + ' ' + appealerDiscordTag,
          'Discord ID обжаловавшего': appealData.userId || 'Не указано',
          'Выдавший': (values[i][4] || 'Не указано') + ' ' + issuerDiscordTag,
          'Discord ID выдающего': values[i][5] || 'Не указано',
          'Правило': values[i][6] || 'Не указано',
          'Тип выговора': values[i][7] || 'Не указано',
          'Суть обжалования': appealData.reason,
          'Доказательства обжалования': appealData.proof || 'Нет'
        }, { vygovorId: id });
        
        return { success: true };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить все обжалования (для админов)
 */
function getAppeals(sessionToken) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const appeals = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const status = row[10]; // Статус в столбце K (индекс 10)
      const appealDataStr = row[16]; // Обжалование в столбце Q (индекс 16)
      
      // Ищем все выговоры с данными обжалования (независимо от текущего статуса)
      // Это позволит показывать как ожидающие рассмотрения, так и уже рассмотренные обжалования
      if (appealDataStr && appealDataStr.trim() !== '') {
        try {
          const appealData = JSON.parse(appealDataStr);
          
          // Форматируем дату
          let dateStr = 'Не указано';
          if (row[1]) {
            try {
              let dateValue = row[1];
              if (dateValue instanceof Date) {
                if (!isNaN(dateValue.getTime())) {
                  const day = String(dateValue.getDate()).padStart(2, '0');
                  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
                  const year = dateValue.getFullYear();
                  dateStr = day + '.' + month + '.' + year;
                }
              } else if (typeof dateValue === 'string' && dateValue.trim()) {
                const dateMatch = dateValue.trim().match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
                if (dateMatch) {
                  dateStr = dateMatch[1].padStart(2, '0') + '.' + dateMatch[2].padStart(2, '0') + '.' + dateMatch[3];
                }
              }
            } catch (e) {
              console.warn('Ошибка форматирования даты:', e);
            }
          }
          
          appeals.push({
            vygovorId: row[0] || 'N/A',
            date: dateStr,
            recipient: row[2] || 'Не указано',
            recipientId: row[3] || 'N/A',
            issuer: row[4] || 'Не указано',
            issuerId: row[5] || 'N/A',
            type: row[7] || 'N/A',
            rule: row[6] || 'Не указано',
            status: status,
            appealUserName: appealData.userName || 'Не указано',
            appealUserId: appealData.userId || 'N/A',
            appealReason: appealData.reason || 'Не указано',
            proof: row[17] || 'Нет', // Оригинальные доказательства выговора (столбец R)
            appealProof: row[18] || appealData.proof || 'Нет', // Доказательства обжалования (столбец S)
            appealStatus: appealData.status || 'Ожидает рассмотрения',
            previousStatus: appealData.previousStatus || STATUSES.ACTIVE,
            appealDate: appealData.appealDate || '',
            reviewedBy: appealData.reviewedBy || null,
            reviewDate: appealData.reviewDate || null,
            reviewDecision: appealData.reviewDecision || null,
            reviewComment: appealData.reviewComment || null
          });
        } catch (e) {
          // Если не удалось распарсить JSON, пропускаем
          console.warn('Ошибка парсинга данных обжалования для ID ' + row[0] + ':', e);
        }
      }
    }
    
    // Сортируем: сначала ожидающие рассмотрения, затем по дате обжалования (новые сверху)
    appeals.sort((a, b) => {
      if (a.appealStatus === 'Ожидает рассмотрения' && b.appealStatus !== 'Ожидает рассмотрения') return -1;
      if (a.appealStatus !== 'Ожидает рассмотрения' && b.appealStatus === 'Ожидает рассмотрения') return 1;
      return new Date(b.appealDate) - new Date(a.appealDate);
    });
    
    return { success: true, data: appeals };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить количество ожидающих рассмотрения обжалований (для счетчика в меню)
 */
function getPendingAppealsCount(sessionToken) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа', count: 0 };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let pendingCount = 0;
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const status = row[10]; // Статус в столбце K (индекс 10)
      
      // Ищем обжалованные выговоры (на обжаловании или уже рассмотренные)
      if (status === STATUSES.ON_APPEAL || status === 'На обжаловании' || status === STATUSES.APPEALED || status === 'Обжалован') {
        const appealDataStr = row[16]; // Обжалование в столбце Q (индекс 16)
        
        if (appealDataStr) {
          try {
            const appealData = JSON.parse(appealDataStr);
            // Проверяем статус рассмотрения обжалования (по умолчанию "Ожидает рассмотрения")
            const appealStatus = appealData.status || 'Ожидает рассмотрения';
            if (appealStatus === 'Ожидает рассмотрения') {
              pendingCount++;
            }
          } catch (e) {
            // Если не удалось распарсить, считаем, что ожидает рассмотрения
            pendingCount++;
          }
        } else {
          // Если статус "На обжаловании", но нет данных обжалования, считаем ожидающим
          if (status === STATUSES.ON_APPEAL || status === 'На обжаловании') {
            pendingCount++;
          }
        }
      }
    }
    
    return { success: true, count: pendingCount };
  } catch (error) {
    return { success: false, error: error.toString(), count: 0 };
  }
}

/**
 * Рассмотреть обжалование (одобрить/отклонить)
 */
function reviewAppeal(sessionToken, vygovorId, decision, reviewComment) {
  if (!hasProtectedAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    const adminName = adminAccess.userInfo ? adminAccess.userInfo.name : 'Система';
    
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === vygovorId) {
        const rowIndex = i + 1;
        const appealDataStr = values[i][16];
        
        if (!appealDataStr) {
          return { success: false, error: 'Обжалование не найдено' };
        }
        
        const appealData = JSON.parse(appealDataStr);
        const previousStatus = appealData.previousStatus || STATUSES.ACTIVE;
        
        // Обновляем данные обжалования
        appealData.status = decision === 'approved' ? 'Одобрено' : 'Отклонено';
        appealData.reviewedBy = adminName || adminLogin; // Сохраняем полное имя, если есть
        appealData.reviewDate = new Date().toISOString();
        appealData.reviewDecision = decision;
        appealData.reviewComment = reviewComment || '';
        
        sheet.getRange(rowIndex, 17).setValue(JSON.stringify(appealData));
        
        // Меняем статус выговора в зависимости от решения
        if (decision === 'approved') {
          // При одобрении - снимаем выговор
          sheet.getRange(rowIndex, 11).setValue(STATUSES.REMOVED);
          sheet.getRange(rowIndex, 14).setValue(new Date()); // Дата снятия
        } else {
          // При отклонении - возвращаем предыдущий статус
          sheet.getRange(rowIndex, 11).setValue(previousStatus);
        }
        
        sheet.getRange(rowIndex, 20).setValue(new Date());
        
        logAction({
          action: 'REVIEW_APPEAL',
          userId: appealData.userId || '',
          userName: adminLogin,
          details: 'Обжалование ' + (decision === 'approved' ? 'одобрено' : 'отклонено') + ': ' + vygovorId,
          vygovorId: vygovorId
        });
        
        // 🔍 ОТЛАДКА: Отправка уведомления о рассмотрении обжалования
        Logger.log('=== НАЧАЛО ОТПРАВКИ УВЕДОМЛЕНИЯ О РАССМОТРЕНИИ ОБЖАЛОВАНИЯ ===');
        Logger.log('Решение: ' + (decision === 'approved' ? 'ОДОБРЕНО' : 'ОТКЛОНЕНО'));
        Logger.log('ID выговора: ' + vygovorId);
        Logger.log('Рассмотрел: ' + adminName);
        Logger.log('Комментарий: ' + (reviewComment || 'Не указано'));
        
        try {
          const vygovorAppealData = values[i];
          Logger.log('Вызов sendDiscordLog для рассмотрения обжалования...');
          
          // Формируем теги Discord
          const recipientDiscordTag = vygovorAppealData[3] === SDO_ROLE_ID ? '<@&' + vygovorAppealData[3] + '>' : '<@' + vygovorAppealData[3] + '>';
          const appealerDiscordTag = appealData.userId === SDO_ROLE_ID ? '<@&' + appealData.userId + '>' : '<@' + appealData.userId + '>';
          const issuerDiscordTag = vygovorAppealData[5] === SDO_ROLE_ID ? '<@&' + vygovorAppealData[5] + '>' : '<@' + vygovorAppealData[5] + '>';
          
          const fields = {
            'Кто получил выговор': (vygovorAppealData[2] || 'Не указано') + ' ' + recipientDiscordTag,
            'Discord ID получателя': vygovorAppealData[3] || 'Не указано',
            'Кто обжаловал': (appealData.userName || 'Не указано') + ' ' + appealerDiscordTag,
            'Discord ID обжаловавшего': appealData.userId || 'Не указано',
            'Выдавший': (vygovorAppealData[4] || 'Не указано') + ' ' + issuerDiscordTag,
            'Discord ID выдающего': vygovorAppealData[5] || 'Не указано',
            'Правило': vygovorAppealData[6] || 'Не указано',
            'Тип выговора': vygovorAppealData[7] || 'Не указано',
            'Рассмотрел': adminName,
            'Решение': decision === 'approved' ? '✅ Одобрено' : '❌ Отклонено'
          };
          
          // Добавляем комментарий только если обжалование отклонено
          if (decision !== 'approved') {
            fields['Комментарий рассмотревшего'] = reviewComment || 'Не указано';
          }
          
          sendDiscordLog((decision === 'approved' ? '✅ Обжалование одобрено' : '❌ Обжалование отклонено'), fields, { vygovorId: vygovorId });
          
          Logger.log('✅ Уведомление о рассмотрении обжалования отправлено успешно');
        } catch (discordError) {
          Logger.log('❌ КРИТИЧЕСКАЯ ОШИБКА отправки в Discord (рассмотрение): ' + discordError.toString());
          Logger.log('Stack trace: ' + discordError.stack);
        }
        
        Logger.log('=== КОНЕЦ ОТПРАВКИ УВЕДОМЛЕНИЯ О РАССМОТРЕНИИ ОБЖАЛОВАНИЯ ===');
        
        return { success: true };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить выговор по ID
 */
function getVygovorById(id) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    if (!values || values.length < 2) {
      return { success: false, error: 'Нет данных в таблице', data: null };
    }
    
    const headers = values[0];
    
    // Ищем строку с нужным ID
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[0] === id) {
        const vygovor = {};
        headers.forEach((header, index) => {
          if (header) {
            let value = row[index];
            
            // Безопасная обработка дат - преобразуем Date в строку ISO для сериализации
            if (header.toLowerCase().includes('дата') || header.toLowerCase().includes('date') || 
                header.toLowerCase().includes('создано') || header.toLowerCase().includes('обновлено') ||
                header.toLowerCase().includes('срок')) {
              if (value) {
                try {
                  if (value instanceof Date) {
                    if (!isNaN(value.getTime())) {
                      value = value.toISOString();
                    } else {
                      value = '';
                    }
                  } else if (typeof value === 'string' && value.trim()) {
                    const dateStr = value.trim();
                    const dateTimeMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/);
                    if (dateTimeMatch) {
                      const day = parseInt(dateTimeMatch[1]);
                      const month = parseInt(dateTimeMatch[2]) - 1;
                      const year = parseInt(dateTimeMatch[3]);
                      const hour = parseInt(dateTimeMatch[4]);
                      const minute = parseInt(dateTimeMatch[5]);
                      const second = parseInt(dateTimeMatch[6]);
                      const dateObj = new Date(year, month, day, hour, minute, second);
                      if (!isNaN(dateObj.getTime())) {
                        value = dateObj.toISOString();
                      } else {
                        value = dateStr;
                      }
                    } else {
                      const dateMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
                      if (dateMatch) {
                        const day = parseInt(dateMatch[1]);
                        const month = parseInt(dateMatch[2]) - 1;
                        const year = parseInt(dateMatch[3]);
                        const dateObj = new Date(year, month, day);
                        if (!isNaN(dateObj.getTime())) {
                          value = dateObj.toISOString();
                        } else {
                          value = dateStr;
                        }
                      } else {
                        const parsed = new Date(dateStr);
                        if (!isNaN(parsed.getTime())) {
                          value = parsed.toISOString();
                        } else {
                          value = dateStr;
                        }
                      }
                    }
                  } else {
                    value = '';
                  }
                } catch (dateError) {
                  value = value && typeof value === 'string' ? value : '';
                }
              } else {
                value = '';
              }
            }
            
            vygovor[header] = value !== undefined ? value : '';
          }
        });
        
        if (!vygovor.ID && row[0]) {
          vygovor.ID = row[0];
        }
        
        return { success: true, data: vygovor };
      }
    }
    
    return { success: false, error: 'Выговор не найден', data: null };
  } catch (error) {
    return { success: false, error: error.toString(), data: null };
  }
}

/**
 * Получить все выговоры пользователя
 */
function getUserVygovory(discordId) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const headers = values[0];
    const userVygovory = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Проверить получателя или выдающего
      if (row[3] === discordId || row[5] === discordId) {
        const vygovor = {};
        headers.forEach((header, index) => {
          vygovor[header] = row[index];
        });
        userVygovory.push(vygovor);
      }
    }
    
    return { success: true, data: userVygovory };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить статистику пользователя
 */
function getUserStats(discordId) {
  try {
    const ss = getOrCreateSpreadsheet();
    const vygovorySheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = vygovorySheet.getDataRange();
    const values = dataRange.getValues();
    
    let issued = 0;      // Выдал
    let received = 0;    // Получил
    let paid = 0;        // Оплатил
    let worked = 0;      // Отработал
    let appealed = 0;    // Обжаловал
    let removed = 0;     // Снято
    let active = 0;      // Активных
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Выдал
      if (row[5] === discordId) {
        issued++;
      }
      
      // Получил
      if (row[3] === discordId) {
        received++;
        
        if (row[10] === STATUSES.PAID) paid++;
        if (row[10] === STATUSES.WORKED) worked++;
        if (row[10] === STATUSES.APPEALED || row[10] === STATUSES.ON_APPEAL) appealed++;
        if (row[10] === STATUSES.REMOVED || row[10] === STATUSES.AMNESTY) removed++;
        if (row[10] === STATUSES.ACTIVE) active++;
      }
    }
    
    return {
      success: true,
      stats: {
        issued,
        received,
        paid,
        worked,
        appealed,
        removed,
        active
      }
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Проверка инициализации системы
 */
function checkSystemInitialized() {
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    if (!authSheet || authSheet.getLastRow() < 2) {
      return { initialized: false };
    }
    
    return { initialized: true };
  } catch (error) {
    return { initialized: false, error: error.toString() };
  }
}

/**
 * Получить общую статистику с фильтрацией по датам
 */
function getGlobalStats(dateFrom, dateTo) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const stats = {
      total: 0,
      active: 0,
      paid: 0,
      worked: 0,
      appealed: 0,
      removed: 0,
      closed: 0, // Закрытые (все кроме активных и на рассмотрении)
      processedAppeals: 0, // Обработанные обжалования
      processedRemovals: 0, // Обработанные снятия
      byType: {
        VR: 0,
        WR: 0,
        SR: 0,
        SR2: 0,
        Suspension: 0,
        Retest: 0,
        Dismissal: 0
      },
      byMonth: {},
      totalAmount: 0,
      totalHours: 0,
      unpaid: [],
      unpaidCount: 0,
      unpaidAmount: 0
    };
    
    // Устанавливаем границы фильтрации
    let filterFrom = null;
    let filterTo = null;
    
    if (dateFrom) {
      filterFrom = new Date(dateFrom);
      filterFrom.setHours(0, 0, 0, 0);
    }
    if (dateTo) {
      filterTo = new Date(dateTo);
      filterTo.setHours(23, 59, 59, 999);
    }
    
    // Подсчет статистики
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (!row[1]) continue; // Пропускаем если нет даты
      
      let vygovorDate;
      try {
        // Безопасная обработка даты
        if (row[1] instanceof Date) {
          vygovorDate = row[1];
          if (isNaN(vygovorDate.getTime())) {
            console.warn('Невалидная дата в строке ' + i + ', пропускаем');
            continue;
          }
        } else if (row[1]) {
          // Пытаемся распарсить строку как дату
          vygovorDate = new Date(row[1]);
          if (isNaN(vygovorDate.getTime())) {
            // Если не удалось распарсить, пробуем формат DD.MM.YYYY
            const dateStr = String(row[1]).trim();
            const dateMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
            if (dateMatch) {
              const day = parseInt(dateMatch[1]);
              const month = parseInt(dateMatch[2]) - 1; // Месяцы с 0
              const year = parseInt(dateMatch[3]);
              vygovorDate = new Date(year, month, day);
              if (isNaN(vygovorDate.getTime())) {
                console.warn('Не удалось распарсить дату в строке ' + i + ': ' + dateStr);
                continue;
              }
            } else {
              console.warn('Невалидная дата в строке ' + i + ': ' + dateStr);
              continue;
            }
          }
        } else {
          // Нет даты, пропускаем
          continue;
        }
      } catch (e) {
        console.warn('Ошибка обработки даты в строке ' + i + ':', e);
        continue;
      }
      
      const status = row[10]; // Статус в столбце K (индекс 10)
      const type = row[7]; // Тип в столбце H (индекс 7)
      const amount = parseFloat(row[8]) || 0; // Сумма в столбце I (индекс 8)
      const hours = parseFloat(row[9]) || 0; // Часы в столбце J (индекс 9)
      
      // Проверка фильтра по дате
      if (filterFrom && vygovorDate < filterFrom) continue;
      if (filterTo && vygovorDate > filterTo) continue;
      
      stats.total++;
      
      // Статистика по статусам и типам (приводим к строке для надежности)
      const statusStr = String(status || '').trim();
      const typeStr = String(type || '').trim();
      
      // Статистика по статусам
      if (statusStr === STATUSES.ACTIVE || statusStr === 'Активен') stats.active++;
      if (statusStr === STATUSES.PAID || statusStr === 'Оплачен') stats.paid++;
      if (statusStr === STATUSES.WORKED || statusStr === 'Отработан') stats.worked++;
      if (statusStr === STATUSES.APPEALED || statusStr === 'Обжалован' || statusStr === STATUSES.ON_APPEAL || statusStr === 'На обжаловании') stats.appealed++;
      if (statusStr === STATUSES.REMOVED || statusStr === 'Снят' || statusStr === STATUSES.AMNESTY || statusStr === 'Амнистирован') stats.removed++;
      
      // Статистика по типам
      if (typeStr === VYGOVOR_TYPES.VERBAL || typeStr === 'VR') {
        stats.byType.VR++;
      } else if (typeStr === VYGOVOR_TYPES.WRITTEN || typeStr === 'WR') {
        stats.byType.WR++;
      } else if (typeStr === VYGOVOR_TYPES.STRICT || typeStr === 'SR') {
        stats.byType.SR++;
      } else if (typeStr === 'SR2') {
        stats.byType.SR2++;
      } else if (typeStr === 'Suspension') {
        stats.byType.Suspension++;
      } else if (typeStr === 'Retest') {
        stats.byType.Retest++;
      } else if (typeStr === 'Dismissal') {
        stats.byType.Dismissal++;
      }
      
      // Статистика по месяцам
      const monthKey = vygovorDate.getFullYear() + '-' + String(vygovorDate.getMonth() + 1).padStart(2, '0');
      if (!stats.byMonth[monthKey]) {
        stats.byMonth[monthKey] = 0;
      }
      stats.byMonth[monthKey]++;
      
      // Общие суммы
      stats.totalAmount += amount;
      stats.totalHours += hours;
      
      // Проверка обработанных обжалований (столбец 16 - "Обжалование")
      const appealDataStr = row[16]; // Столбец Q (индекс 16)
      if (appealDataStr && appealDataStr.trim() !== '') {
        try {
          const appealData = JSON.parse(appealDataStr);
          if (appealData.status === 'Одобрено' || appealData.status === 'Отклонено') {
            stats.processedAppeals++;
          }
        } catch (e) {
          // Если не удалось распарсить JSON, пропускаем
        }
      }
      
      // Проверка обработанных снятий (столбец 15 - "Комментарий")
      const commentStr = row[15]; // Столбец P (индекс 15)
      if (commentStr && commentStr.trim() !== '') {
        try {
          const removalInfo = JSON.parse(commentStr);
          // Проверяем, что это заявка на снятие (есть поле removalType и status)
          if (removalInfo.removalType && removalInfo.status) {
            if (removalInfo.status === 'Одобрено' || removalInfo.status === 'Отклонено') {
              stats.processedRemovals++;
            }
          }
        } catch (e) {
          // Если не удалось распарсить JSON, это не заявка на снятие, пропускаем
        }
      }
      
      // Проверка на неоплаченные выговоры (все активные выговоры с суммой > 0)
      if ((statusStr === STATUSES.ACTIVE || statusStr === 'Активен') && amount > 0) {
        const paymentDate = row[11] ? new Date(row[11]) : null; // Дата оплаты в столбце L (индекс 11)
        // Столбец 22 (индекс 21) - Уведомление о неоплате отправлено
        // Явно преобразуем в булево значение (обрабатываем как true/false, строки "TRUE"/"FALSE", и т.д.)
        let notificationSent = false;
        const notificationValue = row[21];
        // Проверяем явно на false, true, и строковые значения
        // ВАЖНО: Если в столбце 22 находится Date объект - это ошибка (дата должна быть в столбце 21)
        // В таком случае считаем как false (уведомление не отправлено)
        if (notificationValue instanceof Date) {
          // Это ошибка - в столбце уведомлений записана дата, а не булево значение
          notificationSent = false;
          Logger.log('⚠️ ОШИБКА: В столбце "Уведомление о неоплате отправлено" (row[21]) находится дата вместо булева значения для ID: ' + row[0]);
        } else if (notificationValue === true || notificationValue === 'TRUE' || notificationValue === 'true' || notificationValue === '1') {
          notificationSent = true;
        } else if (notificationValue === false || notificationValue === 'FALSE' || notificationValue === 'false' || notificationValue === '0' || notificationValue === '' || notificationValue === null || notificationValue === undefined) {
          notificationSent = false;
        } else if (typeof notificationValue === 'boolean') {
          notificationSent = notificationValue;
        } else if (typeof notificationValue === 'string') {
          notificationSent = notificationValue.toUpperCase().trim() === 'TRUE' || notificationValue.trim() === '1';
        } else {
          // Для любых других значений (числа, объекты и т.д.) преобразуем в булево
          notificationSent = Boolean(notificationValue);
        }
        const paymentDeadline = row[22] ? new Date(row[22]) : null; // Срок оплаты в столбце W (индекс 22)
        
        // Если не оплачен (нет даты оплаты)
        if (!paymentDate) {
          // Проверяем, истек ли срок оплаты
          const now = new Date();
          const isOverdue = paymentDeadline && paymentDeadline < now;
          
          // Считаем только просроченные как "проигнорированные"
          if (isOverdue) {
            stats.unpaidCount++;
            stats.unpaidAmount += amount;
            
            // Для передачи в UI используем только сериализуемые данные (без Date объектов)
            stats.unpaid.push({
              id: String(row[0] || ''),
              dateStr: Utilities.formatDate(vygovorDate, Session.getScriptTimeZone(), 'dd.MM.yyyy'),
              deadlineStr: paymentDeadline ? Utilities.formatDate(paymentDeadline, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm') : '',
              recipientName: String(row[2] || ''),
              recipientId: String(row[3] || ''),
              amount: amount,
              type: typeStr,
              notificationSent: Boolean(notificationSent),
              daysOverdue: paymentDeadline ? Math.floor((now - paymentDeadline) / (1000 * 60 * 60 * 24)) : 0
            });
          }
        }
      }
    }
    
    // Вычисляем количество закрытых (все кроме активных и на рассмотрении)
    stats.closed = stats.total - stats.active - stats.appealed;
    
    return { success: true, stats: stats };
  } catch (error) {
    Logger.log('❌ Ошибка в getGlobalStats: ' + error.toString());
    Logger.log('Stack trace: ' + error.stack);
    return { success: false, error: error.toString() };
  }
}

/**
 * Автоматическая проверка просроченных выговоров (для триггера)
 * Запускается раз в день в 09:00
 */
function dailyCheckUnpaidVygovory() {
  try {
    Logger.log('=== Запуск автоматической проверки неоплаченных выговоров ===');
    
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    if (!sheet || sheet.getLastRow() < 2) {
      Logger.log('Нет данных для проверки');
      return { success: true, message: 'Нет данных' };
    }
    
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    const unpaidList = [];
    
    // Проходим по всем выговорам
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      const statusStr = row[10] ? String(row[10]) : '';
      const amount = parseFloat(row[8]) || 0;
      const typeStr = row[7] ? String(row[7]) : '';
      
      // Проверяем только активные с суммой > 0
      if ((statusStr === STATUSES.ACTIVE || statusStr === 'Активен') && amount > 0) {
        const paymentDate = row[11] ? new Date(row[11]) : null;
        // Столбец 22 (индекс 21) - Уведомление о неоплате отправлено
        // Явно преобразуем в булево значение
        let notificationSent = false;
        const notificationValue = row[21];
        // Проверяем явно на false, true, и строковые значения
        // ВАЖНО: Если в столбце 22 находится Date объект - это ошибка (дата должна быть в столбце 21)
        // В таком случае считаем как false (уведомление не отправлено)
        if (notificationValue instanceof Date) {
          // Это ошибка - в столбце уведомлений записана дата, а не булево значение
          notificationSent = false;
          Logger.log('⚠️ ОШИБКА: В столбце "Уведомление о неоплате отправлено" (row[21]) находится дата вместо булева значения для ID: ' + row[0]);
        } else if (notificationValue === true || notificationValue === 'TRUE' || notificationValue === 'true' || notificationValue === '1') {
          notificationSent = true;
        } else if (notificationValue === false || notificationValue === 'FALSE' || notificationValue === 'false' || notificationValue === '0' || notificationValue === '' || notificationValue === null || notificationValue === undefined) {
          notificationSent = false;
        } else if (typeof notificationValue === 'boolean') {
          notificationSent = notificationValue;
        } else if (typeof notificationValue === 'string') {
          notificationSent = notificationValue.toUpperCase().trim() === 'TRUE' || notificationValue.trim() === '1';
        } else {
          // Для любых других значений (числа, объекты и т.д.) преобразуем в булево
          notificationSent = Boolean(notificationValue);
        }
        const vygovorDate = row[1] ? new Date(row[1]) : new Date();
        const paymentDeadline = row[22] ? new Date(row[22]) : null;
        
        // Если не оплачен
        if (!paymentDate) {
          // Проверяем, истек ли срок оплаты
          const now = new Date();
          const isOverdue = paymentDeadline && paymentDeadline < now;
          
          // Отправляем уведомление только для просроченных
          if (isOverdue) {
            unpaidList.push({
              id: row[0],
              date: vygovorDate,
              deadline: paymentDeadline,
              recipientName: row[2] || '',
              recipientId: row[3] || '',
              amount: amount,
              type: typeStr,
              notificationSent: notificationSent,
              daysOverdue: Math.floor((now - paymentDeadline) / (1000 * 60 * 60 * 24))
            });
          }
        }
      }
    }
    
    Logger.log('Найдено неоплаченных выговоров: ' + unpaidList.length);
    
    if (unpaidList.length > 0) {
      const result = checkAndSendUnpaidNotifications(unpaidList);
      Logger.log('Результат отправки уведомлений: ' + JSON.stringify(result));
      return result;
    }
    
    return { success: true, message: 'Нет неоплаченных выговоров' };
  } catch (error) {
    Logger.log('Ошибка автоматической проверки: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Создать триггер для автоматической проверки (запускать вручную один раз)
 */
function setupDailyTrigger() {
  // Удаляем старые триггеры для этой функции
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'dailyCheckUnpaidVygovory') {
      ScriptApp.deleteTrigger(trigger);
    }
  });
  
  // Создаем новый триггер - каждый день в 09:00
  ScriptApp.newTrigger('dailyCheckUnpaidVygovory')
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();
  
  Logger.log('✅ Триггер создан: dailyCheckUnpaidVygovory будет запускаться каждый день в 09:00');
  return { success: true, message: 'Триггер создан успешно' };
}

/**
 * Проверка и отправка уведомлений о неоплаченных выговорах
 */
function checkAndSendUnpaidNotifications(unpaidList) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
        // Найти индекс столбца с уведомлениями (столбец V, индекс 21 -> колонка 22)
    const notificationColumnIndex = 21; // Индекс массива, для getRange нужно +1

    let notificationsSent = 0;
    const updates = []; // Массив для батч-обновления

    unpaidList.forEach(unpaid => {
      // Отправляем уведомление только если еще не отправлено
      if (!unpaid.notificationSent) {
        // Найти строку в таблице
        for (let i = 1; i < values.length; i++) {
          if (values[i][0] === unpaid.id) {
            const rowIndex = i + 1;
            
            // Отправить уведомление в Discord
            const deadlineStr = unpaid.deadline ? unpaid.deadline.toLocaleString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }) : 'Не указан';
            
            sendDiscordLog('⚠️ Неоплаченный выговор (ПРОСРОЧЕН)', {
              'ID выговора': unpaid.id,
              'Получатель': unpaid.recipientName || 'Не указано',
              'Discord ID': '<@' + (unpaid.recipientId || 'Не указано') + '>',
              'Сумма штрафа': unpaid.amount + '$',
              'Тип': unpaid.type,
              'Дата выдачи': unpaid.date.toLocaleDateString('ru-RU'),
              'Срок оплаты был': deadlineStr,
              'Дней просрочки': unpaid.daysOverdue || 0,
              '⚠️ Требует срочной оплаты': 'Да'
            });
            
            // Сохраняем информацию для обновления (колонка 22 - Уведомление о неоплате отправлено)
            updates.push({
              rowIndex: rowIndex,
              columnIndex: 22,
              value: true
            });
            notificationsSent++;
            
            // Логирование
            logAction({
              action: 'UNPAID_NOTIFICATION',
              userId: unpaid.recipientId || '',
              userName: unpaid.recipientName || '',
              details: `Отправлено уведомление о неоплате для ${unpaid.recipientName}`,
              vygovorId: unpaid.id,
              login: 'Система'
            });
            
            break;
          }
        }
      }
    });
    
    // Выполняем все обновления
    if (updates.length > 0) {
      updates.forEach(update => {
        sheet.getRange(update.rowIndex, update.columnIndex).setValue(update.value);
      });
      // Принудительно сохраняем изменения
      SpreadsheetApp.flush();
    }
    
    return { success: true, notificationsSent: notificationsSent };
  } catch (error) {
    console.error('Ошибка отправки уведомлений:', error);
    Logger.log('❌ Ошибка отправки уведомлений: ' + error.toString());
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить список всех выговоров
 */
function getAllVygovory(filters = {}) {
  // Всегда возвращаем объект, НИКОГДА null
  let result = { success: false, error: 'Неизвестная ошибка', data: [] };
  
  try {
    // Всегда возвращаем объект, даже при ошибках
    if (!filters || typeof filters !== 'object') {
      filters = {};
    }
    
    const ss = getOrCreateSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Не удалось получить доступ к таблице', data: [] };
    }
    
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { success: false, error: 'Лист "Выговоры" не найден', data: [] };
    }
    
    let values;
    try {
      const dataRange = sheet.getDataRange();
      if (!dataRange) {
        return { success: false, error: 'Не удалось получить диапазон данных', data: [] };
      }
      values = dataRange.getValues();
    } catch (rangeError) {
      return { success: false, error: 'Ошибка чтения данных: ' + rangeError.toString(), data: [] };
    }
    
    if (!values || values.length < 2) {
      return { success: true, data: [] }; // Нет данных, но это не ошибка
    }
    
    const headers = values[0];
    const allVygovory = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Пропускать полностью пустые строки
      if (!row || row.length === 0) {
        console.log('Пропуск строки ' + i + ': пустая строка');
        continue;
      }
      
      // Проверяем наличие даты, но не обязательно пропускаем если её нет
      // Просто продолжаем обработку
      if (!row[1]) {
        console.log('Строка ' + i + ': нет даты в ячейке [1], но продолжаем');
      }
      
      // Применять фильтры (с учетом возможных пробелов и регистра)
      let match = true;
      
      if (filters.status) {
        const rowStatus = String(row[10] || '').trim();
        const filterStatus = String(filters.status).trim();
        // Гибкое сравнение статусов
        const statusMatch = (
          rowStatus === filterStatus ||
          (rowStatus === STATUSES.ACTIVE && filterStatus === 'Активен') ||
          (rowStatus === 'Активен' && filterStatus === STATUSES.ACTIVE) ||
          (rowStatus === STATUSES.PAID && filterStatus === 'Оплачен') ||
          (rowStatus === 'Оплачен' && filterStatus === STATUSES.PAID) ||
          (rowStatus === STATUSES.WORKED && filterStatus === 'Отработан') ||
          (rowStatus === 'Отработан' && filterStatus === STATUSES.WORKED) ||
          (rowStatus === STATUSES.APPEALED && filterStatus === 'Обжалован') ||
          (rowStatus === 'Обжалован' && filterStatus === STATUSES.APPEALED) ||
          (rowStatus === STATUSES.ON_APPEAL && filterStatus === 'На обжаловании') ||
          (rowStatus === 'На обжаловании' && filterStatus === STATUSES.ON_APPEAL) ||
          (rowStatus === STATUSES.ON_APPEAL && (filterStatus === STATUSES.APPEALED || filterStatus === 'Обжалован')) ||
          ((rowStatus === STATUSES.APPEALED || rowStatus === 'Обжалован') && (filterStatus === STATUSES.ON_APPEAL || filterStatus === 'На обжаловании')) ||
          (rowStatus === STATUSES.REMOVED && filterStatus === 'Снят') ||
          (rowStatus === 'Снят' && filterStatus === STATUSES.REMOVED)
        );
        if (!statusMatch) {
          match = false;
        }
      }
      
      if (filters.discordId) {
        const rowRecipientId = String(row[3] || '').trim();
        const rowIssuerId = String(row[5] || '').trim();
        const filterId = String(filters.discordId).trim();
        if (rowRecipientId !== filterId && rowIssuerId !== filterId) {
          match = false;
        }
      }
      
      if (filters.type) {
        const rowType = String(row[7] || '').trim();
        const filterType = String(filters.type).trim();
        if (rowType !== filterType) {
          match = false;
        }
      }
      
      if (filters.id) {
        const rowId = String(row[0] || '').trim();
        const filterId = String(filters.id).trim().toLowerCase();
        // Поиск по ID - проверяем, содержит ли ID искомую подстроку (нечувствительно к регистру)
        if (!rowId.toLowerCase().includes(filterId)) {
          match = false;
        }
      }
      
      if (match) {
        try {
          const vygovor = {};
          let hasError = false;
          
          headers.forEach((header, index) => {
            if (header && !hasError) {
              try {
                let value = row[index];
                
                // Безопасная обработка дат - преобразуем Date в строку ISO для сериализации
                if (header.toLowerCase().includes('дата') || header.toLowerCase().includes('date') || 
                    header.toLowerCase().includes('создано') || header.toLowerCase().includes('обновлено') ||
                    header.toLowerCase().includes('срок')) {
                  if (value) {
                    try {
                      // Если это объект Date, преобразуем в ISO строку для передачи через API
                      if (value instanceof Date) {
                        if (!isNaN(value.getTime())) {
                          // Преобразуем в ISO строку для безопасной сериализации
                          value = value.toISOString();
                        } else {
                          value = '';
                        }
                      } else if (typeof value === 'string' && value.trim()) {
                        // Если это строка, пытаемся распарсить разные форматы
                        const dateStr = value.trim();
                        
                        // Формат: DD.MM.YYYY HH:MM:SS (например, "03.11.2025 18:57:42")
                        const dateTimeMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})\s+(\d{1,2}):(\d{1,2}):(\d{1,2})/);
                        if (dateTimeMatch) {
                          const day = parseInt(dateTimeMatch[1]);
                          const month = parseInt(dateTimeMatch[2]) - 1;
                          const year = parseInt(dateTimeMatch[3]);
                          const hour = parseInt(dateTimeMatch[4]);
                          const minute = parseInt(dateTimeMatch[5]);
                          const second = parseInt(dateTimeMatch[6]);
                          const dateObj = new Date(year, month, day, hour, minute, second);
                          if (!isNaN(dateObj.getTime())) {
                            value = dateObj.toISOString();
                          } else {
                            // Если не удалось распарсить, оставляем исходную строку
                            value = dateStr;
                          }
                        } else {
                          // Формат: DD.MM.YYYY (только дата)
                          const dateMatch = dateStr.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
                          if (dateMatch) {
                            const day = parseInt(dateMatch[1]);
                            const month = parseInt(dateMatch[2]) - 1;
                            const year = parseInt(dateMatch[3]);
                            const dateObj = new Date(year, month, day);
                            if (!isNaN(dateObj.getTime())) {
                              value = dateObj.toISOString();
                            } else {
                              value = dateStr;
                            }
                          } else {
                            // Пробуем стандартный парсинг Date
                            const parsed = new Date(dateStr);
                            if (!isNaN(parsed.getTime())) {
                              value = parsed.toISOString();
                            } else {
                              // Оставляем исходную строку
                              value = dateStr;
                            }
                          }
                        }
                      } else {
                        // Для других типов оставляем как есть или пустую строку
                        value = '';
                      }
                    } catch (dateError) {
                      // Если произошла ошибка при обработке даты, оставляем исходное значение как строку
                      value = value && typeof value === 'string' ? value : '';
                    }
                  } else {
                    value = '';
                  }
                }
                
                vygovor[header] = value !== undefined ? value : '';
              } catch (fieldError) {
                console.warn('Ошибка обработки поля ' + header + ' в строке ' + i + ':', fieldError);
                // Устанавливаем пустое значение для проблемного поля
                vygovor[header] = '';
              }
            }
          });
          
          // Добавляем ID из первого столбца для удобства
          if (!vygovor.ID && row[0]) {
            vygovor.ID = row[0];
          }
          
          allVygovory.push(vygovor);
        } catch (rowError) {
          // Если ошибка при обработке строки, логируем и продолжаем
          // Продолжаем обработку следующих строк
        }
      }
    }
    
    // Всегда возвращаем объект, даже при ошибках
    result = { success: true, data: allVygovory };
  } catch (error) {
    // Всегда возвращаем объект с ошибкой, никогда null
    const errorMessage = error && error.toString ? error.toString() : 'Неизвестная ошибка';
    result = { success: false, error: errorMessage, data: [] };
  } finally {
    // Убеждаемся, что мы всегда возвращаем объект
    if (!result || typeof result !== 'object' || result === null) {
      result = { success: false, error: 'Критическая ошибка: функция вернула невалидный результат', data: [] };
    }
    // Проверяем, что data существует и является массивом
    if (!result.data || !Array.isArray(result.data)) {
      result.data = [];
    }
    // Проверяем, что success существует
    if (typeof result.success !== 'boolean') {
      result.success = false;
    }
  }
  
  // Финальная проверка перед возвратом
  if (!result || result === null || typeof result !== 'object') {
    result = { success: false, error: 'Критическая ошибка сериализации', data: [] };
  }
  
  // Переворачиваем массив - данные снизу вверх (новые сверху)
  if (result.success && Array.isArray(result.data)) {
    result.data.reverse();
  }
  
  return result;
}

/**
 * Получить таблицу статистики (все выговоры в формате таблицы)
 */
function getStatisticsTable() {
  try {
    const ss = getOrCreateSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Не удалось получить доступ к таблице', data: [] };
    }
    
    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { success: false, error: 'Лист "Выговоры" не найден', data: [] };
    }
    
    let values;
    try {
      const dataRange = sheet.getDataRange();
      if (!dataRange) {
        return { success: false, error: 'Не удалось получить диапазон данных', data: [] };
      }
      values = dataRange.getValues();
    } catch (rangeError) {
      return { success: false, error: 'Ошибка чтения данных: ' + rangeError.toString(), data: [] };
    }
    
    if (!values || values.length < 2) {
      return { success: true, data: [] };
    }
    
    const statisticsData = [];
    
    // Обрабатываем данные снизу вверх
    for (let i = values.length - 1; i >= 1; i--) {
      const row = values[i];
      
      // Пропускать полностью пустые строки
      if (!row || row.length === 0) {
        continue;
      }
      
      // Форматируем дату
      let dateStr = 'Не указано';
      if (row[1]) {
        try {
          let dateValue = row[1];
          if (dateValue instanceof Date) {
            if (!isNaN(dateValue.getTime())) {
              const day = String(dateValue.getDate()).padStart(2, '0');
              const month = String(dateValue.getMonth() + 1).padStart(2, '0');
              const year = dateValue.getFullYear();
              dateStr = day + '.' + month + '.' + year;
            }
          } else if (typeof dateValue === 'string' && dateValue.trim()) {
            // Формат: DD.MM.YYYY HH:MM:SS или DD.MM.YYYY
            const dateTimeMatch = dateValue.trim().match(/(\d{1,2})\.(\d{1,2})\.(\d{4})/);
            if (dateTimeMatch) {
              dateStr = dateTimeMatch[1].padStart(2, '0') + '.' + dateTimeMatch[2].padStart(2, '0') + '.' + dateTimeMatch[3];
            } else {
              const parsed = new Date(dateValue);
              if (!isNaN(parsed.getTime())) {
                const day = String(parsed.getDate()).padStart(2, '0');
                const month = String(parsed.getMonth() + 1).padStart(2, '0');
                const year = parsed.getFullYear();
                dateStr = day + '.' + month + '.' + year;
              }
            }
          }
        } catch (e) {
          console.warn('Ошибка форматирования даты:', e);
        }
      }
      
      const statisticRow = {
        ID: row[0] || 'N/A',
        Дата: dateStr,
        Получатель: row[2] || 'Не указано',
        'Discord ID получателя': row[3] || 'N/A',
        Выдавший: row[4] || 'Не указано',
        'Discord ID выдающего': row[5] || 'N/A'
      };
      
      statisticsData.push(statisticRow);
    }
    
    return { success: true, data: statisticsData };
  } catch (error) {
    return { success: false, error: error.toString(), data: [] };
  }
}

/**
 * Логирование действий
 */
function logAction(logData) {
  try {
    const ss = getOrCreateSpreadsheet();
    const logsSheet = ss.getSheetByName(LOGS_SHEET);
    
    logsSheet.appendRow([
      new Date(),
      logData.action,
      logData.userName || '',
      logData.userId || '',
      logData.details || '',
      logData.vygovorId || '',
      logData.login || ''
    ]);
    
    return { success: true };
  } catch (error) {
    console.error('Ошибка логирования:', error);
    return { success: false };
  }
}

/**
 * Получить все логи (только для админов и супер-админов)
 */
function getAllLogs(sessionToken, options = {}) {
  // Проверка доступа - только для админов и супер-админов
  if (!hasAdminAccess(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const logsSheet = ss.getSheetByName(LOGS_SHEET);
    const dataRange = logsSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Пропускаем заголовок
    const logs = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      
      // Форматирование даты
      let dateStr = '';
      if (row[0]) {
        try {
          const date = new Date(row[0]);
          dateStr = Utilities.formatDate(date, Session.getScriptTimeZone(), 'dd.MM.yyyy HH:mm:ss');
        } catch (e) {
          dateStr = row[0].toString();
        }
      }
      
      logs.push({
        date: dateStr,
        action: row[1] ? String(row[1]) : '',
        userName: row[2] ? String(row[2]) : 'Не указан',
        userId: row[3] ? String(row[3]) : '',
        details: row[4] ? String(row[4]) : '',
        vygovorId: row[5] ? String(row[5]) : '',
        ipAddress: row[6] ? String(row[6]) : ''
      });
    }
    
    // Сортировка по дате (новые первые)
    logs.reverse();
    
    // Пагинация (опционально)
    const limit = options.limit || 100; // По умолчанию 100 последних записей
    const limitedLogs = logs.slice(0, limit);
    
    return { 
      success: true, 
      logs: limitedLogs,
      total: logs.length
    };
  } catch (error) {
    Logger.log('Ошибка получения логов: ' + error.toString());
    return { 
      success: false, 
      error: error.toString(),
      logs: [],
      total: 0
    };
  }
}

/**
 * Определяет webhook URL по типу сообщения
 * @param {string} title - Заголовок сообщения
 * @returns {string} Webhook URL для соответствующего канала
 */
function getDiscordWebhookUrl(title) {
  const titleLower = title.toLowerCase();
  
  // 🚨выговоры - Создан выговор
  if (titleLower.includes('создан выговор') || titleLower.includes('неоплаченный выговор')) {
    return DISCORD_WEBHOOK_VYGOVORY;
  }
  
  // 🚨снятие-выговоров - Заявка на снятие выговора (требует рассмотрения)
  if (titleLower.includes('заявка на снятие выговора') && titleLower.includes('требует рассмотрения')) {
    return DISCORD_WEBHOOK_REMOVAL_REQUESTS;
  }
  
  // 🚨отчетность-снятия-выговоров - Заявка на снятие одобрена/отклонена
  if ((titleLower.includes('заявка на снятие одобрена') || titleLower.includes('заявка на снятие отклонена')) && 
      !titleLower.includes('требует рассмотрения')) {
    return DISCORD_WEBHOOK_REMOVAL_REPORTS;
  }
  
  // 🚨обжалование-выговоров - Обжалование выговора (требует рассмотрения), одобрено, отклонено
  if (titleLower.includes('обжалование выговора') || 
      titleLower.includes('обжалование одобрено') || 
      titleLower.includes('обжалование отклонено')) {
    return DISCORD_WEBHOOK_APPEALS;
  }
  
  // Запрос доступа - Новый запрос, одобрен, отклонен, роль изменена
  if (titleLower.includes('новый запрос на доступ') || 
      titleLower.includes('запрос на доступ одобрен') || 
      titleLower.includes('запрос на доступ отклонен') ||
      titleLower.includes('роль пользователя изменена') ||
      titleLower.includes('создан первый супер-администратор') ||
      titleLower.includes('создан новый пользователь') ||
      titleLower.includes('данные пользователя обновлены') ||
      titleLower.includes('пользователь удален') ||
      titleLower.includes('пользователь разлогинен')) {
    return DISCORD_WEBHOOK_ACCESS;
  }
  
  // По умолчанию используем канал выговоров
  return DISCORD_WEBHOOK_VYGOVORY;
}

/**
 * Улучшенная функция отправки уведомлений в Discord
 * @param {string} title - Заголовок сообщения
 * @param {object} fields - Поля для embed
 * @param {object} options - Дополнительные опции (color, mentions, footer, thumbnail, webhookUrl)
 */
function sendDiscordLog(title, fields, options = {}) {
  // Определяем webhook URL по типу сообщения
  const webhookUrl = options.webhookUrl || getDiscordWebhookUrl(title);
  
  // Проверяем, что webhook URL настроен
  if (!webhookUrl || !webhookUrl.includes('discord.com/api/webhooks')) {
    console.warn('Discord webhook URL не настроен или неверен');
    return;
  }
  
  try {
    // Определяем цвет embed в зависимости от типа сообщения
    let embedColor = options.color || 0x4285f4; // Синий по умолчанию
    if (title.includes('✅') || title.includes('одобрен')) {
      embedColor = 0x43a047; // Зеленый
    } else if (title.includes('❌') || title.includes('отклонен')) {
      embedColor = 0xe53935; // Красный
    } else if (title.includes('🔔') || title.includes('требует рассмотрения')) {
      embedColor = 0xff9800; // Оранжевый
    } else if (title.includes('Создан выговор')) {
      embedColor = 0xf44336; // Красный
    }
    
    // Добавляем описание с ID выговора, если он указан
    let description = '';
    if (options.vygovorId) {
      description = '**ID выговора:** `' + options.vygovorId + '`';
    }
    
    // Создаем embed
    const embed = {
      title: title,
      description: description || undefined,
      color: embedColor,
      fields: Object.keys(fields)
        .filter(key => {
          // Скрываем отдельные поля Discord ID, так как они уже включены в объединенные поля
          const keyLower = key.toLowerCase();
          return !(keyLower === 'discord id получателя' || 
                   keyLower === 'discord id обжаловавшего' || 
                   keyLower === 'discord id выдающего' ||
                   keyLower === 'discord id снимающего');
        })
        .map(key => {
          let value = fields[key];
          // Преобразуем значение в строку если это не строка
          if (value === null || value === undefined) {
            value = 'Не указано';
          } else {
            value = String(value);
          }
          
          return {
            name: key,
            value: value,
            inline: key !== 'Комментарий' && key !== 'Причина' && key !== 'Доказательства' && key !== 'Описание' && key !== 'Причина обжалования' && key !== 'Доказательства обжалования' && key !== 'Комментарий рассмотревшего' && key !== 'Суть обжалования'
          };
        }),
      timestamp: new Date().toISOString(),
      footer: options.footer || {
        text: 'Система управления выговорами SASPA'
      }
    };
    
    // Добавляем thumbnail если указан
    if (options.thumbnail) {
      embed.thumbnail = { url: options.thumbnail };
    }
    
    // Формируем mentions для content
    let contentMentions = '';
    const mentionedUsers = [];
    const mentionedRoles = [];
    
    // Получаем Discord ID роли SDO из базы, если нужно упомянуть роль
    let sdoRoleId = null;
    if (options.mentionRole) {
      Logger.log('Запрос на упоминание роли SDO...');
      try {
        const ss = getOrCreateSpreadsheet();
        const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
        if (authSheet && authSheet.getLastRow() > 1) {
          const authData = authSheet.getDataRange().getValues();
          Logger.log('Ищем учетную запись: ' + SDO_ACCOUNT_LOGIN);
          for (let i = 1; i < authData.length; i++) {
            if (authData[i][0] === SDO_ACCOUNT_LOGIN) {
              sdoRoleId = authData[i][3]; // Discord ID из столбца D
              Logger.log('Найден ID роли SDO: ' + sdoRoleId);
              break;
            }
          }
          if (!sdoRoleId) {
            Logger.log('ПРЕДУПРЕЖДЕНИЕ: Не найдена учетная запись ' + SDO_ACCOUNT_LOGIN);
          }
        }
      } catch (error) {
        Logger.log('ОШИБКА получения SDO роли: ' + error.toString());
      }
    }
    
    // Ищем Discord ID в полях (теперь они могут быть как отдельные, так и встроенные в текст)
    let recipientId = null;
    
    // Проверяем отдельные поля Discord ID
    const recipientIdKey = Object.keys(fields).find(k => 
      k.toLowerCase() === 'discord id получателя' || 
      k.toLowerCase() === 'discord id наказываемого'
    );
    if (recipientIdKey && fields[recipientIdKey]) {
      recipientId = String(fields[recipientIdKey]);
    }
    
    // Если не нашли отдельное поле, ищем встроенные теги
    if (!recipientId) {
      const recipientFieldKey = Object.keys(fields).find(k => 
        k.toLowerCase() === 'кто получил выговор' || 
        k.toLowerCase() === 'получатель'
      );
      if (recipientFieldKey && fields[recipientFieldKey]) {
        const match = String(fields[recipientFieldKey]).match(/<@&?(\d{17,19})>/);
        if (match) recipientId = match[1];
      }
    }
    
    // Добавляем получателя в упоминания
    if (recipientId && recipientId.match(/^\d{17,19}$/)) {
      if (recipientId === SDO_ROLE_ID) {
        contentMentions += `<@&${recipientId}> `;
        mentionedRoles.push(recipientId);
      } else {
        contentMentions += `<@${recipientId}> `;
        mentionedUsers.push(recipientId);
      }
    }
    
    // Добавляем второе упоминание (обжалующий, снимающий или выдавший)
    // НО только если это НЕ тот же человек, что получатель
    let secondMentionAdded = false;
    let secondMentionId = null;
    
    // Приоритет 1: Обжалующий/снимающий
    const appealerIdKey = Object.keys(fields).find(k => 
      k.toLowerCase() === 'discord id обжаловавшего' ||
      k.toLowerCase() === 'discord id снимающего'
    );
    if (appealerIdKey && fields[appealerIdKey]) {
      secondMentionId = String(fields[appealerIdKey]);
    }
    
    // Если не нашли, ищем встроенный тег
    if (!secondMentionId) {
      const appealerFieldKey = Object.keys(fields).find(k => 
        k.toLowerCase() === 'кто обжалует' || 
        k.toLowerCase() === 'кто обжаловал' ||
        k.toLowerCase() === 'кто снимает'
      );
      if (appealerFieldKey && fields[appealerFieldKey]) {
        const match = String(fields[appealerFieldKey]).match(/<@&?(\d{17,19})>/);
        if (match) secondMentionId = match[1];
      }
    }
    
    // Добавляем второе упоминание если нашли и оно отличается от первого
    if (secondMentionId && secondMentionId.match(/^\d{17,19}$/) && secondMentionId !== recipientId) {
      if (secondMentionId === SDO_ROLE_ID) {
        contentMentions += `<@&${secondMentionId}> `;
        mentionedRoles.push(secondMentionId);
      } else {
        contentMentions += `<@${secondMentionId}> `;
        mentionedUsers.push(secondMentionId);
      }
      secondMentionAdded = true;
    }
    
    // Приоритет 2: Выдавший (если обжалующего нет)
    if (!secondMentionAdded) {
      let issuerId = null;
      const issuerIdKey = Object.keys(fields).find(k =>
        k.toLowerCase() === 'discord id выдавшего' ||
        k.toLowerCase() === 'discord id выдающего'
      );
      if (issuerIdKey && fields[issuerIdKey]) {
        issuerId = String(fields[issuerIdKey]);
      }
      
      // Если не нашли, ищем встроенный тег
      if (!issuerId) {
        const issuerFieldKey = Object.keys(fields).find(k => k.toLowerCase() === 'выдавший');
        if (issuerFieldKey && fields[issuerFieldKey]) {
          const match = String(fields[issuerFieldKey]).match(/<@&?(\d{17,19})>/);
          if (match) issuerId = match[1];
        }
      }
      
      if (issuerId && issuerId.match(/^\d{17,19}$/) && issuerId !== recipientId) {
        if (issuerId === SDO_ROLE_ID) {
          contentMentions += `<@&${issuerId}> `;
          mentionedRoles.push(issuerId);
        } else {
          contentMentions += `<@${issuerId}> `;
          mentionedUsers.push(issuerId);
        }
      }
    }
    
    // Убираем дубликаты
    const uniqueUsers = [...new Set(mentionedUsers)];
    const uniqueRoles = [...new Set(mentionedRoles)];
    
    const payload = {
      content: contentMentions.trim() || undefined,
      embeds: [embed]
    };
    
    // Добавляем allowed_mentions только если есть упоминания
    // Discord требует массивы строк, а не пустые массивы
    if (uniqueUsers.length > 0 || uniqueRoles.length > 0) {
      payload.allowed_mentions = {
        parse: [] // Отключаем автоматический парсинг
      };
      
      // Добавляем массивы только если они не пустые
      if (uniqueUsers.length > 0) {
        payload.allowed_mentions.users = uniqueUsers;
      }
      if (uniqueRoles.length > 0) {
        payload.allowed_mentions.roles = uniqueRoles;
      }
    }
    
    const requestOptions = {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
      muteHttpExceptions: true
    };
    
    Logger.log('Отправка в Discord webhook: ' + title);
    Logger.log('Упоминания: ' + (contentMentions || 'Нет'));
    Logger.log('Уникальные пользователи: ' + JSON.stringify(uniqueUsers));
    Logger.log('Уникальные роли: ' + JSON.stringify(uniqueRoles));
    Logger.log('allowed_mentions: ' + JSON.stringify(payload.allowed_mentions || 'не указано'));
    Logger.log('Отправка в Discord webhook: ' + title + ' (URL: ' + webhookUrl.substring(0, 50) + '...)');
    
    const response = UrlFetchApp.fetch(webhookUrl, requestOptions);
    const responseCode = response.getResponseCode();
    
    // Логируем ответ для отладки
    if (responseCode === 200 || responseCode === 204) {
      Logger.log('✅ Discord уведомление отправлено успешно: ' + title + ' (код: ' + responseCode + ')');
    } else {
      Logger.log('❌ Ошибка Discord webhook (код ' + responseCode + '): ' + response.getContentText());
    }
  } catch (error) {
    Logger.log('❌ КРИТИЧЕСКАЯ ОШИБКА отправки в Discord: ' + error.toString());
  }
}

/**
 * Тестовая функция для проверки Discord webhook
 * Можно запустить из редактора скриптов или добавить в меню
 */
function testDiscordWebhook() {
  sendDiscordLog('🧪 Тестовое сообщение', {
    'Статус': '✅ Webhook работает корректно!',
    'Время': new Date().toLocaleString('ru-RU'),
    'Система': 'Управление выговорами'
  });
  
  SpreadsheetApp.getUi().alert('Тестовое сообщение отправлено в Discord! Проверьте канал.');
}

/**
 * Хеширование пароля с помощью SHA-256
 */
function hashPassword(password) {
  const rawHash = Utilities.computeDigest(
    Utilities.DigestAlgorithm.SHA_256,
    password,
    Utilities.Charset.UTF_8
  );
  return rawHash.map(byte => ('0' + (byte & 0xFF).toString(16)).slice(-2)).join('');
}

/**
 * Проверка доступа пользователя по токену сессии
 */
function checkUserAccess(sessionToken) {
  try {
    if (!sessionToken) {
      return { hasAccess: false, role: null, userInfo: null };
    }
    
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return { hasAccess: false, role: null, userInfo: null };
    }
    
    // Проверяем сессию
    const sessionsData = sessionsSheet.getDataRange().getValues();
    let validSession = null;
    
    for (let i = 1; i < sessionsData.length; i++) {
      const row = sessionsData[i];
      const token = row[0];
      const expirationDate = new Date(row[3]);
      
      if (token === sessionToken && new Date() < expirationDate) {
        validSession = {
          token: token,
          login: row[1],
          createdAt: row[2],
          expirationDate: expirationDate
        };
        break;
      } else if (token === sessionToken && new Date() >= expirationDate) {
        // Сессия истекла, удаляем её
        sessionsSheet.deleteRow(i + 1);
        return { hasAccess: false, role: null, userInfo: null, message: 'Сессия истекла' };
      }
    }
    
    if (!validSession) {
      return { hasAccess: false, role: null, userInfo: null };
    }
    
    // Получаем информацию о пользователе
    if (!authSheet || authSheet.getLastRow() < 2) {
      return { hasAccess: false, role: null, userInfo: null };
    }
    
    const authData = authSheet.getDataRange().getValues();
    for (let i = 1; i < authData.length; i++) {
      const row = authData[i];
      if (row[0] === validSession.login) {
        return {
          hasAccess: true,
          role: row[4] || ROLES.USER,
          userInfo: {
            login: row[0],
            name: row[2] || '',
            discordId: row[3] || ''
          }
        };
      }
    }
    
    return { hasAccess: false, role: null, userInfo: null };
  } catch (error) {
    console.error('Ошибка проверки доступа:', error);
    return { hasAccess: false, role: null, userInfo: null, error: error.toString() };
  }
}

/**
 * Авторизация пользователя
 */
function loginUser(login, password) {
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    if (!authSheet || authSheet.getLastRow() < 2) {
      return { success: false, error: 'Нет зарегистрированных пользователей' };
    }
    
    const passwordHash = hashPassword(password);
    const authData = authSheet.getDataRange().getValues();
    
    // Ищем пользователя
    let userFound = null;
    for (let i = 1; i < authData.length; i++) {
      const row = authData[i];
      if (row[0] === login && row[1] === passwordHash) {
        userFound = {
          login: row[0],
          name: row[2] || '',
          discordId: row[3] || '',
          role: row[4] || ROLES.USER
        };
        break;
      }
    }
    
    if (!userFound) {
      return { success: false, error: 'Неверный логин или пароль' };
    }
    
    // Разрешаем множественные сессии для одного логина (для общих УЗ)
    // removeUserSessions(login); // Закомментировано для поддержки одновременных входов
    
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    // Создаем новую сессию
    const sessionToken = Utilities.getUuid();
    const now = new Date();
    const expirationDate = new Date(now.getTime() + SESSION_DURATION);
    
    sessionsSheet.appendRow([
      sessionToken,
      login,
      now,
      expirationDate,
      '' // IP адрес (можно добавить при необходимости)
    ]);
    
    // Очищаем истекшие сессии других пользователей (опционально, для оптимизации)
    cleanupExpiredSessions();
    
    logAction({
      action: 'LOGIN',
      userId: userFound.discordId || '',
      userName: userFound.name || login,
      details: 'Пользователь вошел в систему'
    });
    
    return {
      success: true,
      sessionToken: sessionToken,
      userInfo: userFound
    };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Выход из системы
 */
function logoutUser(sessionToken) {
  try {
    if (!sessionToken) {
      return { success: false, error: 'Токен сессии не предоставлен' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return { success: true };
    }
    
    const dataRange = sessionsSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === sessionToken) {
        // Получаем информацию о пользователе ДО удаления сессии
        const login = values[i][1];
        
        // Получаем данные пользователя из листа авторизованных пользователей
        const authUsersSheet = ss.getSheetByName(AUTH_USERS_SHEET);
        let userName = login;
        let userId = '';
        
        if (authUsersSheet && authUsersSheet.getLastRow() >= 2) {
          const authData = authUsersSheet.getDataRange().getValues();
          for (let j = 1; j < authData.length; j++) {
            if (authData[j][0] === login) {
              userName = authData[j][2] || login; // Имя из столбца C (индекс 2)
              userId = authData[j][3] || ''; // Discord ID из столбца D (индекс 3)
              break;
            }
          }
        }
        
        // Логируем выход
        logAction({
          action: 'LOGOUT',
          userId: userId,
          userName: userName,
          details: `Выход из системы (${login})`,
          login: login
        });
        
        // Удаляем сессию
        sessionsSheet.deleteRow(i + 1);
        return { success: true };
      }
    }
    
    return { success: true };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Очистка истекших сессий
 */
function cleanupExpiredSessions() {
  try {
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return;
    }
    
    const dataRange = sessionsSheet.getDataRange();
    const values = dataRange.getValues();
    const now = new Date();
    
    // Удаляем с конца, чтобы индексы не сбились
    for (let i = values.length - 1; i >= 1; i--) {
      const expirationDate = new Date(values[i][3]);
      if (now >= expirationDate) {
        sessionsSheet.deleteRow(i + 1);
      }
    }
  } catch (error) {
    console.error('Ошибка очистки сессий:', error);
  }
}

/**
 * Удаление всех сессий конкретного пользователя
 */
function removeUserSessions(login) {
  try {
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return;
    }
    
    const dataRange = sessionsSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Удаляем с конца, чтобы индексы не сбились
    for (let i = values.length - 1; i >= 1; i--) {
      if (values[i][1] === login) {
        sessionsSheet.deleteRow(i + 1);
      }
    }
  } catch (error) {
    console.error('Ошибка удаления сессий пользователя:', error);
  }
}

/**
 * Продление срока действия сессии (вызывается при активности пользователя)
 */
function renewSession(sessionToken) {
  try {
    if (!sessionToken) {
      return { success: false, error: 'Токен не указан' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return { success: false, error: 'Сессия не найдена' };
    }
    
    const dataRange = sessionsSheet.getDataRange();
    const values = dataRange.getValues();
    const now = new Date();
    
    for (let i = 1; i < values.length; i++) {
      const token = values[i][0];
      const expirationDate = new Date(values[i][3]);
      
      // Находим сессию и проверяем, не истекла ли она
      if (token === sessionToken && now < expirationDate) {
        // Продлеваем сессию
        const newExpirationDate = new Date(now.getTime() + SESSION_DURATION);
        sessionsSheet.getRange(i + 1, 4).setValue(newExpirationDate);
        
        return { 
          success: true, 
          expirationDate: newExpirationDate 
        };
      }
    }
    
    return { success: false, error: 'Сессия не найдена или истекла' };
  } catch (error) {
    console.error('Ошибка продления сессии:', error);
    return { success: false, error: error.toString() };
  }
}

/**
 * Проверка, является ли пользователь супер-админом
 */
function isSuperAdmin(sessionToken) {
  const access = checkUserAccess(sessionToken);
  return access.hasAccess && access.role === ROLES.SUPER_ADMIN;
}

/**
 * Проверка доступа администратора (для админов и супер-админов)
 */
function hasAdminAccess(sessionToken) {
  const access = checkUserAccess(sessionToken);
  return access.hasAccess && (access.role === ROLES.SUPER_ADMIN || access.role === ROLES.ADMIN);
}

/**
 * Проверка, есть ли у пользователя доступ к защищенным функциям
 */
function hasProtectedAccess(sessionToken) {
  const access = checkUserAccess(sessionToken);
  return access.hasAccess && (access.role === ROLES.SUPER_ADMIN || access.role === ROLES.ADMIN || access.role === ROLES.USER);
}

/**
 * Создать запрос на доступ
 */
function requestAccess(requestData) {
  try {
    const ss = getOrCreateSpreadsheet();
    const discordId = String(requestData.discordId || '').trim();
    
    // Проверяем, нет ли уже пользователя с таким Discord ID в авторизованных пользователях
    const authUsersSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    if (authUsersSheet && authUsersSheet.getLastRow() > 1 && discordId) {
      const authDataRange = authUsersSheet.getDataRange();
      const authValues = authDataRange.getValues();
      
      for (let i = 1; i < authValues.length; i++) {
        const row = authValues[i];
        const rowDiscordId = String(row[3] || '').trim(); // Discord ID в столбце D (индекс 3)
        if (discordId && rowDiscordId === discordId) {
          return { success: false, error: 'Пользователь с таким Discord ID уже зарегистрирован в системе' };
        }
      }
    }
    
    // Проверяем, нет ли уже активного запроса (по Discord ID)
    const requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
    
    if (requestsSheet && requestsSheet.getLastRow() > 1) {
      const dataRange = requestsSheet.getDataRange();
      const values = dataRange.getValues();
      
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        // Проверяем незавершенные запросы по Discord ID
        const rowDiscordId = String(row[3] || '').trim(); // Discord ID в столбце D (индекс 3)
        if (discordId && rowDiscordId === discordId && (row[5] === 'Ожидает' || !row[5])) {
          return { success: false, error: 'У вас уже есть активный запрос на доступ' };
        }
      }
    }
    
    // Кодируем пароль в Base64 перед сохранением (можно расшифровать при одобрении)
    const encodedPassword = requestData.password ? Utilities.base64Encode(requestData.password) : '';
    
    // Добавляем новый запрос
    requestsSheet.appendRow([
      new Date(),
      requestData.login || '', // Логин
      requestData.name || '',
      requestData.discordId || '',
      requestData.reason || 'Запрос доступа к системе управления выговорами',
      'Ожидает',
      '',
      '',
      encodedPassword // Закодированный пароль (Base64)
    ]);
    
    // Отправляем уведомление в Discord с упоминанием роли SDO
    sendDiscordLog('🔔 Новый запрос на доступ', {
      'Имя': requestData.name || 'Не указано',
      'Discord ID': requestData.discordId || 'Не указано',
      'Логин': requestData.login || 'Не указано',
      'Причина': requestData.reason || 'Не указано',
      'Дата запроса': new Date().toLocaleString('ru-RU')
    }, { mentionRole: true });
    
    logAction({
      action: 'REQUEST_ACCESS',
      userId: requestData.discordId || '',
      userName: requestData.name || requestData.discordId || '',
      details: 'Запрошен доступ к системе'
    });
    
    return { success: true, message: 'Запрос отправлен. Ожидайте одобрения.' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Создать первого супер-админа
 */
function createSuperAdmin(login, password, name, discordId) {
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    // Проверяем, есть ли уже пользователи
    if (authSheet && authSheet.getLastRow() > 1) {
      return { success: false, error: 'Пользователи уже существуют. Используйте интерфейс управления для создания новых пользователей.' };
    }
    
    const passwordHash = hashPassword(password);
    
    authSheet.appendRow([
      login,
      passwordHash,
      name || 'Супер-администратор',
      discordId || '',
      ROLES.SUPER_ADMIN,
      new Date(),
      'Система'
    ]);
    
    sendDiscordLog('👑 Создан первый супер-администратор', {
      'Логин': login,
      'Имя': name || 'Супер-администратор'
    });
    
    return { success: true, message: 'Супер-администратор создан успешно' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить все запросы на доступ (только для супер-админа)
 */
function getAccessRequests(sessionToken) {
  try {
    if (!isSuperAdmin(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа. Требуется роль Супер-админ' };
    }
    
    const ss = getOrCreateSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Не удалось получить доступ к таблице' };
    }
    
    const requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
    
    if (!requestsSheet) {
      // Если лист не существует, создаем его
      initializeSheets();
      return { success: true, data: [] };
    }
    
    if (requestsSheet.getLastRow() < 2) {
      return { success: true, data: [] };
    }
    
    const dataRange = requestsSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (!values || values.length === 0) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    
    if (!headers || headers.length === 0) {
      return { success: true, data: [] };
    }
    
    const requests = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const request = {};
      headers.forEach((header, index) => {
        // Скрываем закодированный пароль из ответа для безопасности
        if (header === 'Пароль (Base64)' || header === 'Хеш пароля' || header === 'Пароль') {
          request[header] = '***скрыто***';
          return;
        }
        
        let value = row[index];
        // Преобразуем даты в строки для сериализации
        if (value instanceof Date) {
          if (!isNaN(value.getTime())) {
            value = value.toISOString();
          } else {
            value = null;
          }
        }
        request[header] = value;
      });
      requests.push(request);
    }
    
    return { success: true, data: requests };
  } catch (error) {
    return { success: false, error: 'Ошибка загрузки запросов: ' + error.toString() };
  }
}

/**
 * Получить количество ожидающих рассмотрения запросов на доступ (для счетчика в меню)
 */
function getPendingAccessRequestsCount(sessionToken) {
  try {
    if (!isSuperAdmin(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа', count: 0 };
    }
    
    const ss = getOrCreateSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Не удалось получить доступ к таблице', count: 0 };
    }
    
    const requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
    
    if (!requestsSheet || requestsSheet.getLastRow() < 2) {
      return { success: true, count: 0 };
    }
    
    const dataRange = requestsSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (!values || values.length === 0) {
      return { success: true, count: 0 };
    }
    
    const headers = values[0];
    const statusIndex = headers.indexOf('Статус');
    
    if (statusIndex === -1) {
      return { success: true, count: 0 };
    }
    
    let pendingCount = 0;
    for (let i = 1; i < values.length; i++) {
      const status = values[i][statusIndex];
      if (!status || status === 'Ожидает' || String(status).trim() === '') {
        pendingCount++;
      }
    }
    
    return { success: true, count: pendingCount };
  } catch (error) {
    return { success: false, error: error.toString(), count: 0 };
  }
}

/**
 * Одобрить запрос на доступ
 */
function approveAccessRequest(sessionToken, requestId) {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    const dataRange = requestsSheet.getDataRange();
    const values = dataRange.getValues();
    
    // Получаем информацию об админе
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Находим запрос по логину или индексу строки
    let found = false;
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowLogin = row[1]; // Логин
      
      // Можно искать по логину, имени, Discord ID или по индексу строки (если requestId - это номер строки)
      const rowName = row[2] || ''; // Имя
      const rowDiscordId = row[3] || ''; // Discord ID
      if (rowLogin === requestId || rowName === requestId || rowDiscordId === requestId || (typeof requestId === 'number' && i === requestId)) {
        const rowIndex = i + 1;
        
        // Обновляем статус запроса
        requestsSheet.getRange(rowIndex, 6).setValue('Одобрен');
        requestsSheet.getRange(rowIndex, 7).setValue(adminLogin);
        requestsSheet.getRange(rowIndex, 8).setValue(new Date());
        
        // Берем логин и пароль из запроса
        const userLogin = row[1] || 'user_' + Utilities.getUuid().substring(0, 8);
        // Расшифровываем пароль из запроса (Base64)
        const encodedPassword = row[8] || '';
        let userPassword;
        if (encodedPassword && encodedPassword !== '') {
          try {
            // Base64 decode возвращает массив байтов (number[]), преобразуем в строку
            const decodedBytes = Utilities.base64Decode(encodedPassword);
            // Нормализуем байты (конвертируем отрицательные значения)
            const normalizedBytes = decodedBytes.map(function(b) {
              return b < 0 ? b + 256 : b;
            });
            // Преобразуем массив байтов в строку
            userPassword = String.fromCharCode.apply(null, normalizedBytes);
          } catch (e) {
            // Если ошибка декодирования, генерируем новый пароль
            console.error('Ошибка декодирования пароля:', e);
            userPassword = Utilities.getUuid().substring(0, 12);
          }
        } else {
          userPassword = Utilities.getUuid().substring(0, 12);
        }
        // Убеждаемся, что пароль - строка перед хешированием
        if (typeof userPassword !== 'string') {
          userPassword = String(userPassword);
        }
        const passwordHash = hashPassword(userPassword);
        
        // Добавляем в авторизованные пользователи с ролью Админ
        authSheet.appendRow([
          userLogin,
          passwordHash,
          row[2] || '', // Имя
          row[3] || '', // Discord ID
          ROLES.ADMIN, // Автоматически ставим роль Админ
          new Date(),
          adminLogin
        ]);
        
        found = true;
        
        // Уведомление в Discord с упоминанием пользователя
        sendDiscordLog('✅ Запрос на доступ одобрен', {
          'Логин': userLogin,
          'Имя': row[2] || 'Не указано',
          'Discord ID': row[3] || 'Не указано',
          'Роль': 'Админ',
          'Одобрил': adminLogin,
          'Дата одобрения': new Date().toLocaleString('ru-RU')
        });
        
        logAction({
          action: 'APPROVE_ACCESS',
          userId: row[3] || '',
          userName: adminLogin,
          details: `Одобрен доступ для ${userLogin}`
        });
        
        return { 
          success: true, 
          message: 'Доступ предоставлен',
          login: userLogin,
          password: userPassword // Возвращаем пароль для передачи пользователю
        };
        
        break;
      }
    }
    
    if (!found) {
      return { success: false, error: 'Запрос не найден' };
    }
    
    return { success: false, error: 'Запрос не обработан' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Отклонить запрос на доступ
 */
function rejectAccessRequest(sessionToken, requestId, reason = '') {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const requestsSheet = ss.getSheetByName(ACCESS_REQUESTS_SHEET);
    
    const dataRange = requestsSheet.getDataRange();
    const values = dataRange.getValues();
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Декодируем HTML-сущности в requestId (если они есть)
    let requestIdStr = String(requestId || '').trim();
    // Простая замена HTML-сущностей обратно в символы (на случай если были экранированы)
    requestIdStr = requestIdStr
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&nbsp;/g, ' ')
      .trim();
    
    let found = false;
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowLogin = String(row[1] || '').trim(); // Логин
      const rowName = String(row[2] || '').trim(); // Имя
      const rowDiscordId = String(row[3] || '').trim(); // Discord ID
      const rowStatus = String(row[5] || '').trim(); // Статус (столбец F, индекс 5)
      
      // Проверяем, что запрос еще не обработан (статус "Ожидает" или пустой)
      const isPending = !rowStatus || rowStatus === 'Ожидает' || rowStatus === '';
      
      // Можно искать по логину, имени, Discord ID или по индексу строки (если requestId - это номер строки)
      const matches = rowLogin === requestIdStr || 
                      rowName === requestIdStr || 
                      rowDiscordId === requestIdStr || 
                      (typeof requestId === 'number' && i === requestId);
      
      if (matches && isPending) {
        const rowIndex = i + 1;
        
        requestsSheet.getRange(rowIndex, 6).setValue('Отклонен');
        requestsSheet.getRange(rowIndex, 7).setValue(adminLogin);
        requestsSheet.getRange(rowIndex, 8).setValue(new Date());
        
        if (reason) {
          // Можно добавить причину в отдельное поле или комментарий
          const currentReason = requestsSheet.getRange(rowIndex, 5).getValue();
          requestsSheet.getRange(rowIndex, 5).setValue(currentReason + ' [Отклонено: ' + reason + ']');
        }
        
        found = true;
        
        sendDiscordLog('❌ Запрос на доступ отклонен', {
          'Логин': rowLogin,
          'Имя': rowName || 'Не указано',
          'Discord ID': rowDiscordId || 'Не указано',
          'Причина отклонения': reason || 'Не указана',
          'Отклонил': adminLogin,
          'Дата отклонения': new Date().toLocaleString('ru-RU')
        });
        
        logAction({
          action: 'REJECT_ACCESS',
          userId: rowDiscordId || '',
          userName: adminLogin,
          details: `Отклонен доступ для ${rowLogin}`
        });
        
        break;
      }
    }
    
    if (!found) {
      // Проверяем, может быть запрос уже обработан
      for (let i = 1; i < values.length; i++) {
        const row = values[i];
        const rowLogin = String(row[1] || '').trim();
        const rowName = String(row[2] || '').trim();
        const rowDiscordId = String(row[3] || '').trim();
        const rowStatus = String(row[5] || '').trim();
        const requestIdStr = String(requestId || '').trim();
        
        const matches = rowLogin === requestIdStr || 
                        rowName === requestIdStr || 
                        rowDiscordId === requestIdStr;
        
        if (matches && rowStatus && rowStatus !== 'Ожидает' && rowStatus !== '') {
          return { success: false, error: 'Запрос уже обработан (статус: ' + rowStatus + ')' };
        }
      }
      return { success: false, error: 'Запрос не найден. Проверьте, что запрос еще не обработан.' };
    }
    
    return { success: true, message: 'Запрос отклонен' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить список всех авторизованных пользователей (для супер-админа)
 */
function getAuthorizedUsers(sessionToken) {
  try {
    if (!isSuperAdmin(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа. Требуется роль Супер-админ' };
    }
    
    const ss = getOrCreateSpreadsheet();
    if (!ss) {
      return { success: false, error: 'Не удалось получить доступ к таблице' };
    }
    
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    if (!authSheet) {
      // Если лист не существует, создаем его
      initializeSheets();
      return { success: true, data: [] };
    }
    
    if (authSheet.getLastRow() < 2) {
      return { success: true, data: [] };
    }
    
    const dataRange = authSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (!values || values.length === 0) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    
    if (!headers || headers.length === 0) {
      return { success: true, data: [] };
    }
    
    const users = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const user = {};
      headers.forEach((header, index) => {
        // Не возвращаем хеш пароля в списке
        if (header !== 'Хеш пароля') {
          let value = row[index];
          // Преобразуем даты в строки для сериализации
          if (value instanceof Date) {
            if (!isNaN(value.getTime())) {
              value = value.toISOString();
            } else {
              value = null;
            }
          }
          user[header] = value;
        }
      });
      users.push(user);
    }
    
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: 'Ошибка загрузки пользователей: ' + error.toString() };
  }
}

/**
 * Удалить пользователя из авторизованных (только для супер-админа)
 */
function removeUser(sessionToken, login) {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    const dataRange = authSheet.getDataRange();
    const values = dataRange.getValues();
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === login) {
        authSheet.deleteRow(i + 1);
        
        // Удаляем все сессии этого пользователя
        removeUserSessions(login);
        
        sendDiscordLog('🗑️ Пользователь удален', {
          'Логин': login,
          'Удалил': adminLogin
        });
        
        logAction({
          action: 'REMOVE_USER',
          userId: '',
          userName: adminLogin,
          details: `Удален пользователь ${login}`
        });
        
        return { success: true, message: 'Пользователь удален' };
      }
    }
    
    return { success: false, error: 'Пользователь не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Разлогинить пользователя по логину (удалить все его сессии) - только для супер-админа
 */
function logoutUserByLogin(sessionToken, login) {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const sessionsSheet = ss.getSheetByName(SESSIONS_SHEET);
    
    if (!sessionsSheet || sessionsSheet.getLastRow() < 2) {
      return { success: true, message: 'Сессии не найдены' };
    }
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    const dataRange = sessionsSheet.getDataRange();
    const values = dataRange.getValues();
    
    let sessionsDeleted = 0;
    // Удаляем сессии снизу вверх, чтобы индексы не сбивались
    for (let i = values.length - 1; i >= 1; i--) {
      if (values[i][1] === login) { // Столбец с логином (индекс 1)
        sessionsSheet.deleteRow(i + 1);
        sessionsDeleted++;
      }
    }
    
    sendDiscordLog('🚪 Пользователь разлогинен', {
      'Логин': login,
      'Удалил сессии': adminLogin,
      'Количество сессий': sessionsDeleted.toString()
    });
    
    logAction({
      action: 'LOGOUT_USER',
      userId: '',
      userName: adminLogin,
      details: `Разлогинен пользователь ${login}, удалено сессий: ${sessionsDeleted}`
    });
    
    return { success: true, message: `Удалено сессий: ${sessionsDeleted}` };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Изменить роль пользователя (только для супер-админа)
 */
function changeUserRole(sessionToken, login, newRole) {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    const dataRange = authSheet.getDataRange();
    const values = dataRange.getValues();
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === login) {
        const rowIndex = i + 1;
        authSheet.getRange(rowIndex, 5).setValue(newRole); // Роль в столбце 5
        
        sendDiscordLog('🔐 Роль пользователя изменена', {
          'Логин': login,
          'Новая роль': newRole,
          'Изменил': adminLogin
        });
        
        logAction({
          action: 'CHANGE_ROLE',
          userId: '',
          userName: adminLogin,
          details: `Изменена роль ${login} на ${newRole}`
        });
        
        return { success: true, message: 'Роль изменена' };
      }
    }
    
    return { success: false, error: 'Пользователь не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Обновить данные пользователя (имя, Discord ID, роль) - только для супер-админа
 */
function updateUser(sessionToken, login, newName, newDiscordId, newRole) {
  if (!isSuperAdmin(sessionToken)) {
    return { success: false, error: 'Недостаточно прав доступа' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    const dataRange = authSheet.getDataRange();
    const values = dataRange.getValues();
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Проверка роли
    if (!newRole || !['Пользователь', 'Админ', 'Супер-админ'].includes(newRole)) {
      return { success: false, error: 'Неверная роль' };
    }
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === login) {
        const rowIndex = i + 1;
        
        // Обновляем имя (столбец 3, индекс 2)
        if (newName !== undefined && newName !== null) {
          authSheet.getRange(rowIndex, 3).setValue(newName);
        }
        
        // Обновляем Discord ID (столбец 4, индекс 3)
        if (newDiscordId !== undefined && newDiscordId !== null) {
          authSheet.getRange(rowIndex, 4).setValue(newDiscordId);
        }
        
        // Обновляем роль (столбец 5, индекс 4)
        authSheet.getRange(rowIndex, 5).setValue(newRole);
        
        const changes = [];
        if (newName !== undefined && newName !== null) changes.push('Имя: ' + newName);
        if (newDiscordId !== undefined && newDiscordId !== null) changes.push('Discord ID: ' + newDiscordId);
        changes.push('Роль: ' + newRole);
        
        sendDiscordLog('✏️ Данные пользователя обновлены', {
          'Логин': login,
          'Изменения': changes.join(', '),
          'Изменил': adminLogin
        });
        
        logAction({
          action: 'UPDATE_USER',
          userId: '',
          userName: adminLogin,
          details: `Обновлены данные пользователя ${login}: ${changes.join(', ')}`
        });
        
        return { success: true, message: 'Данные пользователя обновлены' };
      }
    }
    
    return { success: false, error: 'Пользователь не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Создать нового пользователя (только для супер-админа)
 */
function createUser(sessionToken, login, password, name, discordId, role) {
  const access = checkUserAccess(sessionToken);
  if (!access || !access.hasAccess) {
    return { success: false, error: 'Необходима авторизация' };
  }
  
  // Проверяем права: только Админ или Супер-админ могут создавать пользователей
  const userRole = access.role;
  if (userRole !== ROLES.ADMIN && userRole !== ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Недостаточно прав доступа. Требуется роль Админ или Супер-админ' };
  }
  
  // Админы не могут создавать супер-админов
  if (userRole === ROLES.ADMIN && role === ROLES.SUPER_ADMIN) {
    return { success: false, error: 'Админы не могут создавать супер-админов' };
  }
  
  try {
    const ss = getOrCreateSpreadsheet();
    const authSheet = ss.getSheetByName(AUTH_USERS_SHEET);
    
    // Проверяем, не существует ли уже такой логин или Discord ID
    if (authSheet && authSheet.getLastRow() > 1) {
      const dataRange = authSheet.getDataRange();
      const values = dataRange.getValues();
      
      // Индексы столбцов: 0 - Логин, 3 - Discord ID
      for (let i = 1; i < values.length; i++) {
        const rowLogin = values[i][0];
        const rowDiscordId = values[i][3] || '';
        
        // Проверка на дубликат логина
        if (rowLogin === login) {
          return { success: false, error: 'Пользователь с таким логином уже существует' };
        }
        
        // Проверка на дубликат Discord ID (если Discord ID указан)
        if (discordId && discordId.trim() !== '' && rowDiscordId && rowDiscordId.toString().trim() === discordId.trim()) {
          return { success: false, error: 'Пользователь с таким Discord ID уже существует' };
        }
      }
    }
    
    const passwordHash = hashPassword(password);
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Нормализуем роль
    let finalRole = role || ROLES.USER;
    if (finalRole === 'Пользователь') finalRole = ROLES.USER;
    if (finalRole === 'Админ') finalRole = ROLES.ADMIN;
    if (finalRole === 'Супер-админ') finalRole = ROLES.SUPER_ADMIN;
    
    authSheet.appendRow([
      login,
      passwordHash,
      name || '',
      discordId || '',
      finalRole,
      new Date(),
      adminLogin
    ]);
    
    // Если указан Discord ID, также добавляем в лист "Пользователи"
    if (discordId && discordId.trim() !== '') {
      const usersSheet = ss.getSheetByName(USERS_SHEET);
      if (usersSheet) {
        let discordIdExists = false;
        let existingRowIndex = -1;
        
        // Проверяем, не существует ли уже такой Discord ID в листе "Пользователи"
        if (usersSheet.getLastRow() > 1) {
          const usersDataRange = usersSheet.getDataRange();
          const usersValues = usersDataRange.getValues();
          
          // Индекс столбца Discord ID в листе "Пользователи" = 1
          for (let i = 1; i < usersValues.length; i++) {
            const existingDiscordId = usersValues[i][1] || '';
            if (existingDiscordId.toString().trim() === discordId.trim()) {
              discordIdExists = true;
              existingRowIndex = i + 1; // +1 так как индексы строк начинаются с 1
              break;
            }
          }
        }
        
        if (discordIdExists && existingRowIndex > 0) {
          // Если Discord ID уже существует в листе "Пользователи", обновляем имя
          usersSheet.getRange(existingRowIndex, 1).setValue(name || ''); // Обновляем имя
          usersSheet.getRange(existingRowIndex, 3).setValue(new Date()); // Обновляем дату
          usersSheet.getRange(existingRowIndex, 4).setValue(adminLogin); // Обновляем того, кто добавил
        } else {
          // Если Discord ID не найден, добавляем нового пользователя
          usersSheet.appendRow([
            name || '',
            discordId,
            new Date(),
            adminLogin
          ]);
        }
      }
    }
    
    sendDiscordLog('👤 Создан новый пользователь', {
      'Логин': login,
      'Имя': name || 'Не указано',
      'Роль': role || ROLES.USER,
      'Создал': adminLogin
    });
    
    logAction({
      action: 'CREATE_USER',
      userId: '',
      userName: adminLogin,
      details: `Создан пользователь ${login}`
    });
    
    return { success: true, message: 'Пользователь создан успешно' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Добавить пользователя в лист "Пользователи" (только имя и Discord ID)
 */
function addUserToSheet(sessionToken, name, discordId) {
  try {
    if (!hasProtectedAccess(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа' };
    }
    
    if (!name || !discordId || name.trim() === '' || discordId.trim() === '') {
      return { success: false, error: 'Имя и Discord ID обязательны для заполнения' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const usersSheet = ss.getSheetByName(USERS_SHEET);
    
    if (!usersSheet) {
      return { success: false, error: 'Лист "Пользователи" не найден' };
    }
    
    // Проверяем, не существует ли уже такой Discord ID
    if (usersSheet.getLastRow() > 1) {
      const dataRange = usersSheet.getDataRange();
      const values = dataRange.getValues();
      
      // Индекс столбца Discord ID = 1
      for (let i = 1; i < values.length; i++) {
        const existingDiscordId = values[i][1] || '';
        if (existingDiscordId.toString().trim() === discordId.trim()) {
          return { success: false, error: 'Пользователь с таким Discord ID уже существует' };
        }
      }
    }
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Добавляем пользователя в лист "Пользователи"
    usersSheet.appendRow([
      name.trim(),
      discordId.trim(),
      new Date(),
      adminLogin
    ]);
    
    logAction({
      action: 'ADD_USER_TO_SHEET',
      userId: discordId,
      userName: adminLogin,
      details: `Добавлен пользователь: ${name} (${discordId})`
    });
    
    return { success: true, message: 'Пользователь успешно добавлен' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить всех пользователей из листа "Пользователи" (для админов)
 */
function getUsers(sessionToken) {
  try {
    if (!hasProtectedAccess(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const usersSheet = ss.getSheetByName(USERS_SHEET);
    
    if (!usersSheet || usersSheet.getLastRow() < 2) {
      return { success: true, data: [] };
    }
    
    const dataRange = usersSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (!values || values.length < 2) {
      return { success: true, data: [] };
    }
    
    const headers = values[0];
    const users = [];
    
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const user = {};
      headers.forEach((header, index) => {
        let value = row[index];
        if (value instanceof Date) {
          if (!isNaN(value.getTime())) {
            value = value.toISOString();
          } else {
            value = null;
          }
        }
        user[header] = value;
      });
      users.push(user);
    }
    
    return { success: true, data: users };
  } catch (error) {
    return { success: false, error: 'Ошибка загрузки пользователей: ' + error.toString() };
  }
}

/**
 * Обновить пользователя в листе "Пользователи" (для админов)
 */
function updateUserFromSheet(sessionToken, discordId, newName) {
  try {
    if (!hasProtectedAccess(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const usersSheet = ss.getSheetByName(USERS_SHEET);
    const dataRange = usersSheet.getDataRange();
    const values = dataRange.getValues();
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Находим пользователя по Discord ID
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowDiscordId = row[1] || ''; // Discord ID в столбце B (индекс 1)
      
      if (rowDiscordId === discordId) {
        const rowIndex = i + 1;
        
        // Обновляем имя (столбец A, индекс 0)
        if (newName !== undefined && newName !== null) {
          usersSheet.getRange(rowIndex, 1).setValue(newName);
        }
        
        logAction({
          action: 'UPDATE_USER_SHEET',
          userId: '',
          userName: adminLogin,
          details: `Обновлен пользователь: ${newName} (Discord ID: ${discordId})`
        });
        
        return { success: true, message: 'Пользователь обновлен' };
      }
    }
    
    return { success: false, error: 'Пользователь не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Удалить пользователя из листа "Пользователи" (для админов)
 */
function deleteUserFromSheet(sessionToken, discordId) {
  try {
    if (!hasProtectedAccess(sessionToken)) {
      return { success: false, error: 'Недостаточно прав доступа' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const usersSheet = ss.getSheetByName(USERS_SHEET);
    const dataRange = usersSheet.getDataRange();
    const values = dataRange.getValues();
    
    const adminAccess = checkUserAccess(sessionToken);
    const adminLogin = adminAccess.userInfo ? adminAccess.userInfo.login : 'Система';
    
    // Находим пользователя по Discord ID
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      const rowDiscordId = row[1] || ''; // Discord ID в столбце B (индекс 1)
      
      if (rowDiscordId === discordId) {
        const rowIndex = i + 1;
        const userName = row[0] || 'Неизвестно';
        
        usersSheet.deleteRow(rowIndex);
        
        logAction({
          action: 'DELETE_USER_SHEET',
          userId: '',
          userName: adminLogin,
          details: `Удален пользователь: ${userName} (Discord ID: ${discordId})`
        });
        
        return { success: true, message: 'Пользователь удален' };
      }
    }
    
    return { success: false, error: 'Пользователь не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Получить следующий тип выговора на основе текущего
 */
function getNextVygovorType(currentType) {
  const typeMap = {
    'VR': 'WR',
    'WR': 'SR',
    'SR': 'SR2',
    'SR2': 'Suspension',
    'Suspension': 'Retest',
    'Retest': 'Dismissal',
    'Dismissal': 'Dismissal' // Максимальный тип, остается прежним
  };
  
  return typeMap[currentType] || 'WR'; // По умолчанию WR, если тип неизвестен
}

/**
 * Перевод просроченного выговора в следующий тип
 * Меняет статус на "Игнорирован" и возвращает данные для создания нового выговора
 */
function escalateOverdueVygovor(vygovorId, sessionToken) {
  try {
    // Проверка доступа
    const access = checkUserAccess(sessionToken);
    if (!access || !access.hasAccess) {
      return { success: false, error: 'Доступ запрещен' };
    }
    
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    const headers = values[0];
    
    // Найти выговор
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === vygovorId) {
        const row = values[i];
        const rowIndex = i + 1;
        
        // Получаем данные выговора
        const currentType = row[7] || 'VR'; // Тип (столбец H, индекс 7)
        const amount = parseFloat(row[8]) || 0; // Сумма (столбец I, индекс 8)
        const recipientName = row[2] || ''; // Получатель (столбец C, индекс 2)
        const recipientId = row[3] || ''; // Discord ID получателя (столбец D, индекс 3)
        const issuerName = row[4] || ''; // Выдавший (столбец E, индекс 4)
        const issuerId = row[5] || ''; // Discord ID выдающего (столбец F, индекс 5)
        const rule = row[6] || ''; // Правило (столбец G, индекс 6)
        
        // Получаем следующий тип
        const nextType = getNextVygovorType(currentType);
        
        // Меняем статус на "Игнорирован"
        sheet.getRange(rowIndex, 11).setValue(STATUSES.IGNORED); // Статус (столбец K, индекс 10)
        sheet.getRange(rowIndex, 20).setValue(new Date()); // Обновлено (столбец T, индекс 19)
        
        // Формируем причину для нового выговора
        const reason = 'Не оплата выданного дисциплинарного взыскания с ID ' + vygovorId + ' в установленный срок.';
        
        // Логирование действия
        logAction({
          action: 'ESCALATE_OVERDUE_VYGOVOR',
          userId: access.userInfo ? access.userInfo.discordId : '',
          userName: access.userInfo ? access.userInfo.name : 'Система',
          details: 'Просроченный выговор ' + vygovorId + ' переведен в статус "Игнорирован", создан новый выговор типа ' + nextType,
          vygovorId: vygovorId
        });
        
        return {
          success: true,
          data: {
            recipientName: recipientName,
            recipientId: recipientId,
            issuerName: issuerName,
            issuerId: issuerId,
            rule: reason,
            type: nextType,
            amount: 0, // Не заполняем автоматически
            hours: 0,
            paymentDeadline: '', // Не заполняем автоматически
            evidenceLinks: 'Не требуется для этого взыскания',
            oldVygovorId: vygovorId,
            oldVygovorType: currentType
          }
        };
      }
    }
    
    return { success: false, error: 'Выговор не найден' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

