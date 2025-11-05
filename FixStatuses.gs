/**
 * Исправление статусов для выговоров, которые были обработаны старым кодом
 * Эта функция исправит статус "Снят" на "Оплачен" или "Отработан" в зависимости от типа снятия
 */
function fixApprovedRemovalStatuses() {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let fixedCount = 0;
    const report = [];
    
    Logger.log('=== НАЧАЛО ИСПРАВЛЕНИЯ СТАТУСОВ ===');
    
    for (let i = 1; i < values.length; i++) {
      const rowIndex = i + 1;
      const status = values[i][10]; // Столбец K - Статус
      const commentStr = values[i][15]; // Столбец P - Комментарий (JSON с данными снятия)
      
      // Ищем выговоры со статусом "Снят" и JSON данными о снятии
      if ((status === 'Снят' || status === STATUSES.REMOVED) && commentStr && commentStr.trim() !== '') {
        try {
          const removalInfo = JSON.parse(commentStr);
          
          // Проверяем, что это одобренная заявка на снятие с указанным типом
          if (removalInfo.removalType && removalInfo.status === 'Одобрено') {
            const removalType = removalInfo.removalType;
            const correctStatus = removalType === 'Оплата' ? STATUSES.PAID : STATUSES.WORKED;
            
            // Исправляем статус
            sheet.getRange(rowIndex, 11).setValue(correctStatus);
            
            // Проставляем соответствующую дату, если её нет
            if (removalType === 'Оплата') {
              const paymentDate = values[i][11]; // Столбец L - Дата оплаты
              if (!paymentDate) {
                const removalDate = values[i][13]; // Столбец N - Дата снятия
                sheet.getRange(rowIndex, 12).setValue(removalDate || new Date());
              }
            } else {
              const workedDate = values[i][12]; // Столбец M - Дата отработки
              if (!workedDate) {
                const removalDate = values[i][13]; // Столбец N - Дата снятия
                sheet.getRange(rowIndex, 13).setValue(removalDate || new Date());
              }
            }
            
            fixedCount++;
            const vygovorId = values[i][0];
            const recipient = values[i][2];
            
            report.push({
              id: vygovorId,
              recipient: recipient,
              oldStatus: 'Снят',
              newStatus: correctStatus,
              removalType: removalType
            });
            
            Logger.log('✅ Исправлен ID: ' + vygovorId + ' | ' + recipient + ' | ' + removalType + ' → ' + correctStatus);
          }
        } catch (e) {
          // Это не JSON или не заявка на снятие, пропускаем
        }
      }
    }
    
    Logger.log('=== ЗАВЕРШЕНО ===');
    Logger.log('Исправлено записей: ' + fixedCount);
    
    if (fixedCount > 0) {
      Logger.log('\nОТЧЁТ:');
      report.forEach(function(item) {
        Logger.log('- ' + item.id + ' | ' + item.recipient + ' | ' + item.removalType + ' | ' + item.oldStatus + ' → ' + item.newStatus);
      });
    }
    
    return {
      success: true,
      fixedCount: fixedCount,
      report: report,
      message: 'Исправлено записей: ' + fixedCount
    };
  } catch (error) {
    Logger.log('❌ ОШИБКА: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      fixedCount: 0
    };
  }
}

/**
 * Исправление статусов для одобренных обжалований
 * Эта функция исправит статус "Снят" на правильный для обжалований, которые были одобрены
 * ВНИМАНИЕ: Для одобренных обжалований статус должен оставаться "Снят"
 */
function fixApprovedAppealStatuses() {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let checkedCount = 0;
    const report = [];
    
    Logger.log('=== ПРОВЕРКА СТАТУСОВ ОБЖАЛОВАНИЙ ===');
    
    for (let i = 1; i < values.length; i++) {
      const status = values[i][10]; // Столбец K - Статус
      const appealDataStr = values[i][16]; // Столбец Q - Обжалование
      
      // Проверяем одобренные обжалования
      if (appealDataStr && appealDataStr.trim() !== '') {
        try {
          const appealData = JSON.parse(appealDataStr);
          
          if (appealData.status === 'Одобрено') {
            checkedCount++;
            const vygovorId = values[i][0];
            const recipient = values[i][2];
            const currentStatus = status || 'Не указан';
            
            report.push({
              id: vygovorId,
              recipient: recipient,
              currentStatus: currentStatus,
              correctStatus: STATUSES.REMOVED,
              isCorrect: currentStatus === STATUSES.REMOVED || currentStatus === 'Снят'
            });
            
            Logger.log((currentStatus === STATUSES.REMOVED || currentStatus === 'Снят' ? '✅' : '⚠️') + 
                      ' ID: ' + vygovorId + ' | ' + recipient + ' | Статус: ' + currentStatus);
          }
        } catch (e) {
          // Не JSON, пропускаем
        }
      }
    }
    
    Logger.log('=== ЗАВЕРШЕНО ===');
    Logger.log('Проверено одобренных обжалований: ' + checkedCount);
    
    return {
      success: true,
      checkedCount: checkedCount,
      report: report,
      message: 'Проверено одобренных обжалований: ' + checkedCount
    };
  } catch (error) {
    Logger.log('❌ ОШИБКА: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      checkedCount: 0
    };
  }
}

/**
 * Исправление столбца "Уведомление о неоплате отправлено"
 * Эта функция исправит записи, где в столбце 22 записана дата вместо булева значения
 */
function fixNotificationColumnDates() {
  try {
    const ss = getOrCreateSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const dataRange = sheet.getDataRange();
    const values = dataRange.getValues();
    
    let fixedCount = 0;
    const report = [];
    
    Logger.log('=== НАЧАЛО ИСПРАВЛЕНИЯ СТОЛБЦА УВЕДОМЛЕНИЙ ===');
    
    for (let i = 1; i < values.length; i++) {
      const rowIndex = i + 1;
      const notificationValue = values[i][21]; // Столбец V (индекс 21) - Уведомление о неоплате отправлено
      const vygovorId = values[i][0];
      const recipientName = values[i][2] || 'Не указано';
      
      // Проверяем, является ли значение объектом Date
      if (notificationValue instanceof Date) {
        // Это ошибка - в столбце уведомлений записана дата
        // Заменяем на false (уведомление не отправлено)
        sheet.getRange(rowIndex, 22).setValue(false);
        fixedCount++;
        
        report.push({
          id: vygovorId,
          recipient: recipientName,
          oldValue: 'Дата: ' + notificationValue.toString(),
          newValue: 'false'
        });
        
        Logger.log('✅ Исправлен ID: ' + vygovorId + ' | ' + recipientName + ' | Дата → false');
      }
    }
    
    Logger.log('=== ЗАВЕРШЕНО ===');
    Logger.log('Исправлено записей: ' + fixedCount);
    
    if (fixedCount > 0) {
      Logger.log('\nОТЧЁТ:');
      report.forEach(function(item) {
        Logger.log('- ' + item.id + ' | ' + item.recipient + ' | ' + item.oldValue + ' → ' + item.newValue);
      });
    }
    
    return {
      success: true,
      fixedCount: fixedCount,
      report: report,
      message: 'Исправлено записей: ' + fixedCount
    };
  } catch (error) {
    Logger.log('❌ ОШИБКА: ' + error.toString());
    return {
      success: false,
      error: error.toString(),
      fixedCount: 0
    };
  }
}

