/**
 * Функции импорта данных из JSON файлов
 */

/**
 * Показать диалог импорта
 */
function showImportDialog() {
  const html = HtmlService.createHtml(`
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
      .form-group {
        margin-bottom: 15px;
      }
      label {
        display: block;
        margin-bottom: 5px;
        font-weight: bold;
      }
      textarea {
        width: 100%;
        height: 300px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-family: monospace;
      }
      button {
        padding: 10px 20px;
        background: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      button:hover {
        background: #1976d2;
      }
    </style>
    <h2>Импорт данных из JSON</h2>
    <p>Вставьте содержимое JSON файла:</p>
    <form id="importForm">
      <div class="form-group">
        <label>Тип данных:</label>
        <select id="importType" required>
          <option value="vygovory">Выговоры</option>
          <option value="snyatie">Снятие выговоров</option>
          <option value="obzhalovanie">Обжалования</option>
          <option value="otchetnost">Отчетность о снятии</option>
        </select>
      </div>
      <div class="form-group">
        <label>JSON данные:</label>
        <textarea id="jsonData" required></textarea>
      </div>
      <button type="submit">Импортировать</button>
    </form>
    <div id="result"></div>
    <script>
      document.getElementById('importForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const type = document.getElementById('importType').value;
        const data = document.getElementById('jsonData').value;
        
        google.script.run
          .withSuccessHandler(function(result) {
            document.getElementById('result').innerHTML = 
              '<p style="color: green;">' + result.message + '</p>';
          })
          .withFailureHandler(function(error) {
            document.getElementById('result').innerHTML = 
              '<p style="color: red;">Ошибка: ' + error.message + '</p>';
          })
          .importJSON(type, data);
      });
    </script>
  `)
    .setWidth(600)
    .setHeight(500);
  
  SpreadsheetApp.getUi().showModalDialog(html, 'Импорт данных');
}

/**
 * Импорт JSON данных
 */
function importJSON(type, jsonString) {
  try {
    const data = JSON.parse(jsonString);
    
    if (!Array.isArray(data)) {
      return { success: false, message: 'JSON должен быть массивом объектов' };
    }
    
    let imported = 0;
    let errors = 0;
    
    switch (type) {
      case 'vygovory':
        imported = importVygovory(data);
        break;
      case 'snyatie':
        imported = importSnyatie(data);
        break;
      case 'obzhalovanie':
        imported = importObzhalovanie(data);
        break;
      case 'otchetnost':
        imported = importOtchetnost(data);
        break;
      default:
        return { success: false, message: 'Неизвестный тип данных' };
    }
    
    return {
      success: true,
      message: `Импортировано записей: ${imported}. Ошибок: ${errors}`
    };
  } catch (error) {
    return { success: false, message: 'Ошибка парсинга JSON: ' + error.toString() };
  }
}

/**
 * Импорт выговоров из JSON
 */
function importVygovory(data) {
  const ss = getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  let imported = 0;
  
  // Получить все существующие ID
  const existingIds = new Set();
  if (sheet.getLastRow() > 1) {
    const idRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    idRange.forEach(row => {
      if (row[0]) existingIds.add(row[0]);
    });
  }
  
  data.forEach(item => {
    try {
      // Парсинг сообщения о выговоре
      const content = item.content || '';
      
      // Извлечь информацию из content
      // Формат: <@ID> \n25.X. Описание\nНаказание: Тип - Сумма$ / Часы\nОплату необходимо произвести до дата
      
      const mentionMatch = content.match(/<@(\d+)>/);
      const ruleMatch = content.match(/25\.(\d+(?:\.\d+)?)/);
      const typeMatch = content.match(/Наказание:\s*(?:Устный|Письменный|Строгий)\s*выговор|Штраф/);
      const amountMatch = content.match(/(\d+)\s*\$/);
      const hoursMatch = content.match(/(\d+)\s*час/);
      const dateMatch = content.match(/до\s+(\d{2}\.\d{2}\.\d{4})/);
      
      if (!mentionMatch) return; // Пропустить если нет упоминания
      
      const recipientId = mentionMatch[1];
      const rule = ruleMatch ? '25.' + ruleMatch[1] : '';
      
      // Определить тип
      let type = VYGOVOR_TYPES.VERBAL;
      if (content.includes('Письменный')) type = VYGOVOR_TYPES.WRITTEN;
      else if (content.includes('Строгий')) type = VYGOVOR_TYPES.STRICT;
      else if (content.includes('Штраф')) type = VYGOVOR_TYPES.FINE;
      
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
      const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
      
      // Парсинг даты
      let vygovorDate = new Date(item.timestamp);
      if (dateMatch) {
        const dateParts = dateMatch[1].split('.');
        vygovorDate = new Date(dateParts[2], dateParts[1] - 1, dateParts[0]);
      }
      
      const id = item.id || Utilities.getUuid();
      
      // Пропустить если уже существует
      if (existingIds.has(id)) return;
      
      const author = item.author || {};
      const issuerName = author.global_name || author.username || 'Неизвестно';
      const issuerId = author.id || '';
      
      // Получить имя получателя (потребуется дополнительная обработка)
      const recipientName = 'Неизвестно'; // Можно попробовать получить из других источников
      
      const row = [
        id,
        vygovorDate,
        recipientName,
        recipientId,
        issuerName,
        issuerId,
        rule,
        type,
        amount,
        hours,
        STATUSES.ACTIVE,
        '',
        '',
        '',
        `https://discord.com/channels/${item.channel_id || ''}/${item.id || ''}`,
        content,
        '',
        '',
        new Date(item.timestamp),
        new Date()
      ];
      
      sheet.appendRow(row);
      imported++;
    } catch (error) {
      console.error('Ошибка импорта выговора:', error, item);
    }
  });
  
  return imported;
}

/**
 * Импорт снятия выговоров
 */
function importSnyatie(data) {
  const ss = getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  let updated = 0;
  
  data.forEach(item => {
    try {
      const embed = item.embeds && item.embeds[0];
      if (!embed || !embed.description) return;
      
      const description = embed.description;
      
      // Парсинг данных из embed
      const nameMatch = description.match(/\*\*Ваше Имя и Фамилия\*\*\*\n(.+)/);
      const issuerMatch = description.match(/\*\*Имя и Фамилия сотрудника выдавшего взыскание\?\*\*\n(.+)/);
      const linkMatch = description.match(/discord\.com\/channels\/[\d\/]+\/(\d+)/);
      const typeMatch = description.match(/\*\*Тип наказания:\*\*\n(.+)/);
      const removalTypeMatch = description.match(/\*\*Тип снятия\*\*\n(.+)/);
      const proofMatch = description.match(/\*\*Док-ва отработки\/оплаты.*?\*\*\n(.+?)(?:\n|$)/);
      
      if (!nameMatch || !linkMatch) return;
      
      const recipientName = nameMatch[1].trim();
      const vygovorMessageId = linkMatch[1];
      const removalType = removalTypeMatch ? removalTypeMatch[1].trim() : 'Оплата';
      const proof = proofMatch ? proofMatch[1].trim() : '';
      
      // Найти выговор по ссылке
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      for (let i = 1; i < values.length; i++) {
        const messageLink = values[i][14] || '';
        if (messageLink.includes(vygovorMessageId)) {
          const rowIndex = i + 1;
          
          // Обновить статус
          const status = removalType === 'Оплата' ? STATUSES.PAID : STATUSES.WORKED;
          sheet.getRange(rowIndex, 11).setValue(STATUSES.REMOVED);
          sheet.getRange(rowIndex, 12).setValue(removalType === 'Оплата' ? new Date(item.timestamp) : '');
          sheet.getRange(rowIndex, 13).setValue(removalType === 'Отработка' ? new Date(item.timestamp) : '');
          sheet.getRange(rowIndex, 14).setValue(new Date(item.timestamp));
          sheet.getRange(rowIndex, 16).setValue(`Снят через ${removalType}. Доказательства: ${proof}`);
          sheet.getRange(rowIndex, 20).setValue(new Date());
          
          updated++;
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка импорта снятия:', error, item);
    }
  });
  
  return updated;
}

/**
 * Импорт обжалований
 */
function importObzhalovanie(data) {
  const ss = getOrCreateSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  let updated = 0;
  
  data.forEach(item => {
    try {
      const embed = item.embeds && item.embeds[0];
      if (!embed || !embed.description) return;
      
      const description = embed.description;
      
      const nameMatch = description.match(/\*\*Имя Фамилия\*\*\n(.+)/);
      const dateMatch = description.match(/\*\*Дата получения дисциплинарного взыскания\*\*\n(.+)/);
      const reasonMatch = description.match(/\*\*За что получили дисциплинарное взыскание.*?\*\*\n(.+?)(?:\n|$)/);
      const proofMatch = description.match(/\*\*Доказательства невиновности\*\*\n(.+?)(?:\n|$)/);
      const linkMatch = description.match(/discord\.com\/channels\/[\d\/]+\/(\d+)/);
      
      if (!nameMatch || !dateMatch) return;
      
      const recipientName = nameMatch[1].trim();
      const appealDate = dateMatch[1].trim();
      const reason = reasonMatch ? reasonMatch[1].trim() : '';
      const proof = proofMatch ? proofMatch[1].trim() : '';
      const vygovorMessageId = linkMatch ? linkMatch[1] : '';
      
      // Найти выговор
      const dataRange = sheet.getDataRange();
      const values = dataRange.getValues();
      
      for (let i = 1; i < values.length; i++) {
        const vygovorName = values[i][2] || '';
        const messageLink = values[i][14] || '';
        
        if ((vygovorName === recipientName || messageLink.includes(vygovorMessageId)) && 
            values[i][10] === STATUSES.ACTIVE) {
          const rowIndex = i + 1;
          
          sheet.getRange(rowIndex, 11).setValue(STATUSES.APPEALED);
          
          const appealData = {
            date: appealDate,
            reason: reason,
            proof: proof,
            timestamp: item.timestamp
          };
          
          sheet.getRange(rowIndex, 17).setValue(JSON.stringify(appealData));
          sheet.getRange(rowIndex, 18).setValue(proof);
          sheet.getRange(rowIndex, 20).setValue(new Date());
          
          updated++;
          break;
        }
      }
    } catch (error) {
      console.error('Ошибка импорта обжалования:', error, item);
    }
  });
  
  return updated;
}

/**
 * Импорт отчетности о снятии
 */
function importOtchetnost(data) {
  // Этот файл содержит подтверждения о снятии выговоров
  // Обычно это просто логи подтверждения, можем пропустить или обработать отдельно
  return 0;
}

