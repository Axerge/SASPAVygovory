/**
 * Получить выговоры конкретного сотрудника по Discord ID
 */
function getVygovoryByRecipient(discordId) {
  try {
    Logger.log('=== RecipientVygovory.gs: getVygovoryByRecipient START ===');
    Logger.log('Ищем выговоры для Discord ID: ' + discordId);
    
    if (!discordId) {
      return { success: false, error: 'Discord ID не указан', data: [] };
    }
    
    // Получаем ВСЕ выговоры без фильтра, чтобы контролировать фильтрацию самостоятельно
    const result = getAllVygovory({});
    
    Logger.log('Результат getAllVygovory: success=' + (result && result.success) + ', data.length=' + (result && result.data ? result.data.length : 'null'));
    
    if (result && result.success && result.data) {
      const searchId = String(discordId).trim();
      
      Logger.log('Поиск ID: "' + searchId + '"');
      Logger.log('Всего выговоров получено от getAllVygovory: ' + result.data.length);
      
      // Логируем все Discord ID
      result.data.forEach((v, idx) => {
        const recipientId = String(v['Discord ID получателя'] || '').trim();
        Logger.log('  [' + idx + '] ID выговора: ' + (v['ID'] || 'unknown').substring(0, 13) + '..., Получатель: ' + (v['Получатель'] || 'unknown') + ', Discord ID: [' + recipientId + ']');
      });
      
      // Фильтруем только те выговоры, где данный Discord ID является получателем
      const recipientVygovory = result.data.filter(v => {
        // Пробуем все возможные варианты названий колонки получателя
        const recipientId = String(
          v['Discord ID получателя'] || 
          v['Discord ID наказываемого'] || 
          v['Наказываемый Discord ID'] ||
          v['Recipient Discord ID'] ||
          ''
        ).trim();
        
        // Также проверяем колонку выдающего
        const issuerId = String(
          v['Discord ID выдающего'] || 
          v['Выдающий Discord ID'] ||
          v['Issuer Discord ID'] ||
          ''
        ).trim();
        
        const vygovorId = (v['ID'] || 'unknown').substring(0, 13) + '...';
        
        // Проверяем условия
        const isRecipientMatch = recipientId === searchId;
        const isRecipientNotEmpty = recipientId !== '';
        const isDifferentFromIssuer = recipientId !== issuerId;
        
        // Возвращаем true только если это получатель
        // УБИРАЕМ проверку recipientId !== issuerId - это не должно исключать выговор
        const isMatch = isRecipientMatch && isRecipientNotEmpty;
        
        // Логируем все проверки
        if (v['Получатель'] && v['Получатель'].includes('Geralt')) {
          Logger.log('  Проверка выговора ' + vygovorId + ':');
          Logger.log('    recipientId: "' + recipientId + '"');
          Logger.log('    issuerId: "' + issuerId + '"');
          Logger.log('    searchId: "' + searchId + '"');
          Logger.log('    isRecipientMatch: ' + isRecipientMatch);
          Logger.log('    isRecipientNotEmpty: ' + isRecipientNotEmpty);
          Logger.log('    isDifferentFromIssuer: ' + isDifferentFromIssuer);
          Logger.log('    isMatch: ' + isMatch);
        }
        
        if (isMatch) {
          Logger.log('    ✅ СОВПАДЕНИЕ для выговора: ' + vygovorId);
        } else if (isRecipientMatch && !isRecipientNotEmpty) {
          Logger.log('    ❌ ПРОПУСК: recipientId пустой');
        } else if (isRecipientMatch && !isDifferentFromIssuer) {
          Logger.log('    ⚠️ ПРОПУСК: получатель = выдающий (но это нормально, не исключаем)');
        }
        
        return isMatch;
      });
      
      Logger.log('=== ИТОГО найдено выговоров для ' + searchId + ': ' + recipientVygovory.length + ' ===');
      
      return { 
        success: true, 
        data: recipientVygovory,
        debug: {
          totalFromGetAll: result.data.length,
          filteredCount: recipientVygovory.length,
          searchId: searchId
        }
      };
    }
    
    return { success: false, error: 'Не удалось загрузить выговоры', data: [] };
  } catch (error) {
    Logger.log('Ошибка в getVygovoryByRecipient: ' + error.toString());
    return { success: false, error: error.toString(), data: [] };
  }
}

