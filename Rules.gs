// ==================== Функции для работы с правилами ====================

/**
 * Получить или создать лист Правила
 */
function getOrCreateRulesSheet() {
  const ss = getOrCreateSpreadsheet();
  let rulesSheet = ss.getSheetByName(RULES_SHEET);
  
  if (!rulesSheet) {
    rulesSheet = ss.insertSheet(RULES_SHEET);
    
    // Заголовки
    const headers = ['Правило', 'Мера наказания'];
    rulesSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Форматирование заголовков
    rulesSheet.getRange(1, 1, 1, headers.length)
      .setFontWeight('bold')
      .setBackground('#667eea')
      .setFontColor('#ffffff')
      .setHorizontalAlignment('center');
    
    // Фиксируем первую строку
    rulesSheet.setFrozenRows(1);
    
    // Устанавливаем ширину столбцов
    rulesSheet.setColumnWidth(1, 150);  // Правило
    rulesSheet.setColumnWidth(2, 400);  // Мера наказания
  }
  
  return rulesSheet;
}

/**
 * Получить все правила
 */
function getRules() {
  try {
    const rulesSheet = getOrCreateRulesSheet();
    const dataRange = rulesSheet.getDataRange();
    const values = dataRange.getValues();
    
    if (values.length <= 1) {
      return { success: true, rules: [] };
    }
    
    const rules = [];
    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      if (row[0]) { // Если правило не пустое
        rules.push({
          id: i + 1, // Используем номер строки как ID (строки начинаются с 1, +1 т.к. заголовок)
          rule: row[0] || '',
          punishment: row[1] || ''
        });
      }
    }
    
    return { success: true, rules: rules };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Добавить новое правило
 */
function addRule(ruleData) {
  try {
    if (!ruleData || !ruleData.rule || !ruleData.punishment) {
      return { success: false, error: 'Не указаны обязательные поля' };
    }
    
    const rulesSheet = getOrCreateRulesSheet();
    
    // Проверяем, существует ли уже такое правило
    const dataRange = rulesSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      if (values[i][0] === ruleData.rule) {
        return { success: false, error: 'Правило с таким номером уже существует' };
      }
    }
    
    // Добавляем новое правило
    const newRow = [ruleData.rule, ruleData.punishment];
    rulesSheet.appendRow(newRow);
    
    logAction({
      action: 'ADD_RULE',
      userId: '',
      userName: 'Система',
      details: `Добавлено правило: ${ruleData.rule}`
    });
    
    return { success: true, message: 'Правило успешно добавлено' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Обновить правило
 */
function updateRule(ruleData) {
  try {
    if (!ruleData || !ruleData.id || !ruleData.rule || !ruleData.punishment) {
      return { success: false, error: 'Не указаны обязательные поля' };
    }
    
    const rulesSheet = getOrCreateRulesSheet();
    const rowIndex = parseInt(ruleData.id);
    
    if (rowIndex < 2) { // Не можем обновить заголовок (строка 1)
      return { success: false, error: 'Некорректный ID правила' };
    }
    
    // Проверяем, существует ли строка
    const lastRow = rulesSheet.getLastRow();
    if (rowIndex > lastRow) {
      return { success: false, error: 'Правило не найдено' };
    }
    
    // Проверяем, не существует ли уже другое правило с таким же номером
    const dataRange = rulesSheet.getDataRange();
    const values = dataRange.getValues();
    
    for (let i = 1; i < values.length; i++) {
      const currentRowIndex = i + 1;
      if (currentRowIndex !== rowIndex && values[i][0] === ruleData.rule) {
        return { success: false, error: 'Правило с таким номером уже существует' };
      }
    }
    
    // Обновляем правило
    rulesSheet.getRange(rowIndex, 1).setValue(ruleData.rule);
    rulesSheet.getRange(rowIndex, 2).setValue(ruleData.punishment);
    
    logAction({
      action: 'UPDATE_RULE',
      userId: '',
      userName: 'Система',
      details: `Обновлено правило: ${ruleData.rule}`
    });
    
    return { success: true, message: 'Правило успешно обновлено' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

/**
 * Удалить правило
 */
function deleteRule(ruleId) {
  try {
    if (!ruleId) {
      return { success: false, error: 'Не указан ID правила' };
    }
    
    const rulesSheet = getOrCreateRulesSheet();
    const rowIndex = parseInt(ruleId);
    
    if (rowIndex < 2) { // Не можем удалить заголовок (строка 1)
      return { success: false, error: 'Некорректный ID правила' };
    }
    
    // Проверяем, существует ли строка
    const lastRow = rulesSheet.getLastRow();
    if (rowIndex > lastRow) {
      return { success: false, error: 'Правило не найдено' };
    }
    
    // Получаем данные правила перед удалением
    const rule = rulesSheet.getRange(rowIndex, 1).getValue();
    const punishment = rulesSheet.getRange(rowIndex, 2).getValue();
    
    // Удаляем строку
    rulesSheet.deleteRow(rowIndex);
    
    logAction({
      action: 'DELETE_RULE',
      userId: '',
      userName: 'Система',
      details: `Удалено правило: ${rule}`
    });
    
    return { success: true, message: 'Правило успешно удалено' };
  } catch (error) {
    return { success: false, error: error.toString() };
  }
}

