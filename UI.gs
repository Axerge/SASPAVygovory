/**
 * Файл с HTML интерфейсом для системы управления выговорами
 * HTML встроен в функцию для Google Apps Script
 */

/**
 * Получить HTML контент для веб-интерфейса
 */
function getHTMLContent() {
  return `
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Система управления выговорами SASPA</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      overflow-x: hidden;
    }
    
    .container {
      display: flex;
      min-height: 100vh;
    }
    
    /* Боковое меню */
    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
      color: white;
      padding: 0;
      box-shadow: 4px 0 20px rgba(0,0,0,0.15);
      position: fixed;
      height: 100vh;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 1000;
    }
    
    .sidebar::-webkit-scrollbar {
      width: 6px;
    }
    
    .sidebar::-webkit-scrollbar-track {
      background: rgba(255,255,255,0.1);
    }
    
    .sidebar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.3);
      border-radius: 3px;
    }
    
    .sidebar::-webkit-scrollbar-thumb:hover {
      background: rgba(255,255,255,0.5);
    }
    
    .sidebar-header {
      padding: 30px 20px;
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%);
      border-bottom: 2px solid rgba(255,255,255,0.2);
      text-align: center;
      backdrop-filter: blur(10px);
      position: relative;
      overflow: hidden;
    }
    
    .sidebar-header::before {
      content: '';
      position: absolute;
      top: -50%;
      left: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
      animation: pulse 4s ease-in-out infinite;
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.5; }
      50% { transform: scale(1.1); opacity: 0.8; }
    }
    
    .sidebar-header h1 {
      font-size: 24px;
      margin-bottom: 8px;
      font-weight: 700;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
      position: relative;
      z-index: 1;
      letter-spacing: 0.5px;
    }
    
    .sidebar-header p {
      font-size: 13px;
      opacity: 0.9;
      font-weight: 300;
      position: relative;
      z-index: 1;
      letter-spacing: 0.3px;
    }
    
    .menu-item {
      padding: 16px 24px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 4px solid transparent;
      display: flex;
      align-items: center;
      gap: 15px;
      margin: 4px 12px;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }
    
    .menu-item::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      transition: left 0.5s;
    }
    
    .menu-item:hover::before {
      left: 100%;
    }
    
    .menu-item:hover {
      background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.15) 100%);
      border-left-color: #ffd700;
      transform: translateX(5px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .menu-item.active {
      background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.2) 100%);
      border-left-color: #ffd700;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2), inset 0 0 20px rgba(255,255,255,0.1);
      transform: translateX(5px);
    }
    
    .menu-item.active::after {
      content: '';
      position: absolute;
      right: 15px;
      width: 8px;
      height: 8px;
      background: #ffd700;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(255,215,0,0.6);
      animation: pulse-dot 2s ease-in-out infinite;
    }
    
    @keyframes pulse-dot {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.3); opacity: 0.7; }
    }
    
    @keyframes pulse-badge {
      0%, 100% { transform: scale(1); box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4); }
      50% { transform: scale(1.1); box-shadow: 0 4px 12px rgba(255, 152, 0, 0.6); }
    }
    
    .menu-item-icon {
      width: 24px;
      text-align: center;
      font-size: 20px;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
      transition: transform 0.3s;
    }
    
    .menu-item:hover .menu-item-icon {
      transform: scale(1.15) rotate(5deg);
    }
    
    .menu-item.active .menu-item-icon {
      transform: scale(1.2);
      filter: drop-shadow(0 0 8px rgba(255,215,0,0.8));
    }
    
    /* Основной контент */
    .main-content {
      margin-left: 280px;
      flex: 1;
      padding: 30px;
      background: #f5f7fa;
    }
    
    .content-section {
      display: none;
      animation: fadeIn 0.3s;
    }
    
    .content-section.active {
      display: block;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .page-header {
      background: white;
      padding: 25px;
      border-radius: 10px;
      margin-bottom: 25px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .page-header h2 {
      color: #1e3c72;
      margin-bottom: 5px;
    }
    
    .page-header p {
      color: #666;
      font-size: 14px;
    }
    
    /* Карточки */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 25px;
      margin-bottom: 30px;
    }
    
    .stat-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-left: 5px solid;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .stat-card::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -50%;
      width: 200%;
      height: 200%;
      background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .stat-card:hover {
      transform: translateY(-8px) scale(1.02);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    
    .stat-card:hover::before {
      opacity: 1;
    }
    
    .stat-card.blue { 
      border-left-color: #4285f4;
      background: linear-gradient(135deg, #ffffff 0%, #e3f2fd 100%);
    }
    .stat-card.blue .stat-value { color: #1976d2; }
    
    .stat-card.green { 
      border-left-color: #34a853;
      background: linear-gradient(135deg, #ffffff 0%, #e8f5e9 100%);
    }
    .stat-card.green .stat-value { color: #2e7d32; }
    
    .stat-card.orange { 
      border-left-color: #fbbc05;
      background: linear-gradient(135deg, #ffffff 0%, #fff9e6 100%);
    }
    .stat-card.orange .stat-value { color: #f57c00; }
    
    .stat-card.red { 
      border-left-color: #ea4335;
      background: linear-gradient(135deg, #ffffff 0%, #ffebee 100%);
    }
    .stat-card.red .stat-value { color: #c62828; }
    
    .stat-card.purple {
      border-left-color: #9c27b0;
      background: linear-gradient(135deg, #ffffff 0%, #f3e5f5 100%);
    }
    .stat-card.purple .stat-value { color: #7b1fa2; }
    
    .stat-card.cyan {
      border-left-color: #00bcd4;
      background: linear-gradient(135deg, #ffffff 0%, #e0f7fa 100%);
    }
    .stat-card.cyan .stat-value { color: #00838f; }
    
    .stat-card.teal {
      border-left-color: #26a69a;
      background: linear-gradient(135deg, #ffffff 0%, #e0f2f1 100%);
    }
    .stat-card.teal .stat-value { color: #00695c; }
    
    .stat-value {
      font-size: 42px;
      font-weight: 700;
      margin: 15px 0;
      background: linear-gradient(135deg, currentColor 0%, currentColor 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      z-index: 1;
    }
    
    .stat-label {
      color: #666;
      font-size: 15px;
      font-weight: 500;
      letter-spacing: 0.3px;
      position: relative;
      z-index: 1;
    }
    
    .stat-card-icon {
      position: absolute;
      top: 20px;
      right: 20px;
      font-size: 48px;
      opacity: 0.1;
      z-index: 0;
    }
    
    /* Формы */
    .form-container {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 8px;
      color: #333;
      font-weight: 500;
    }
    
    .form-group input,
    .form-group select,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 5px;
      font-size: 14px;
      transition: border-color 0.3s;
    }
    
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #4285f4;
    }
    
    .form-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }
    
    .btn {
      padding: 12px 24px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
      display: inline-block;
    }
    
    .btn-primary {
      background: linear-gradient(135deg, #4285f4 0%, #1976d2 100%);
      color: white;
    }
    
    .btn-primary:hover {
      background: linear-gradient(135deg, #1976d2 0%, #1565c0 100%);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(66, 133, 244, 0.4);
    }
    
    .btn-success {
      background: linear-gradient(135deg, #34a853 0%, #2e7d32 100%);
      color: white;
    }
    
    .btn-danger {
      background: linear-gradient(135deg, #ea4335 0%, #c62828 100%);
      color: white;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: white;
    }
    
    /* Таблица */
    .table-container {
      background: white;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      overflow-x: auto;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      font-weight: 600;
      color: #1e3c72;
      position: sticky;
      top: 0;
    }
    
    tr:hover {
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }
    
    /* Карточки выговоров */
    .vygovor-card {
      background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
      border-radius: 16px;
      padding: 25px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      border-left: 5px solid;
      position: relative;
      overflow: hidden;
    }
    
    .vygovor-card::before {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      width: 100px;
      height: 100px;
      background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
      border-radius: 50%;
      transform: translate(30%, -30%);
    }
    
    .vygovor-card:hover {
      transform: translateY(-5px) scale(1.02);
      box-shadow: 0 8px 30px rgba(0,0,0,0.15);
    }
    
    .vygovor-card.VR { border-left-color: #4285f4; }
    .vygovor-card.WR { border-left-color: #9c27b0; }
    .vygovor-card.SR { border-left-color: #ea4335; }
    .vygovor-card.Fine { border-left-color: #fbbc05; }
    
    .vygovor-card-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 15px;
      padding-bottom: 15px;
      border-bottom: 2px solid #f0f0f0;
    }
    
    .vygovor-card-id {
      font-size: 11px;
      color: #999;
      font-family: monospace;
      background: #f5f5f5;
      padding: 4px 8px;
      border-radius: 5px;
    }
    
    .vygovor-card-date {
      font-size: 13px;
      color: #666;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .vygovor-card-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 15px;
    }
    
    .vygovor-card-field {
      display: flex;
      flex-direction: column;
    }
    
    .vygovor-card-field-label {
      font-size: 11px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
      font-weight: 600;
    }
    
    .vygovor-card-field-value {
      font-size: 15px;
      color: #333;
      font-weight: 500;
    }
    
    .vygovor-card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
      padding-top: 15px;
      border-top: 2px solid #f0f0f0;
    }
    
    .vygovor-status-badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-size: 13px;
      font-weight: 600;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    .vygovor-status-badge.active {
      background: linear-gradient(135deg, #fff3cd 0%, #ffe082 100%);
      color: #856404;
    }
    
    .vygovor-status-badge.paid {
      background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%);
      color: #0c5460;
    }
    
    .vygovor-status-badge.worked {
      background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);
      color: #155724;
    }
    
    .vygovor-status-badge.appealed {
      background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);
      color: #721c24;
    }
    
    .vygovor-status-badge.removed {
      background: linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%);
      color: #383d41;
    }
    
    .vygovor-type-badge {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      box-shadow: 0 2px 6px rgba(102, 126, 234, 0.3);
    }
    
    .vygovor-amount {
      font-size: 20px;
      font-weight: 700;
      color: #ea4335;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    
    .status-badge {
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;
    }
    
    .status-active { background: #fff3cd; color: #856404; }
    .status-paid { background: #d1edff; color: #004085; }
    .status-worked { background: #d4edda; color: #155724; }
    .status-appealed { background: #f8d7da; color: #721c24; }
    .status-removed { background: #d1ecf1; color: #0c5460; }
    
    /* Загрузка */
    .loading {
      display: none;
      text-align: center;
      padding: 20px;
    }
    
    .loading.active {
      display: block;
    }
    
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4285f4;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Уведомления */
    .notification {
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 15px 20px;
      background: white;
      border-radius: 5px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 10002;
      display: none;
      animation: slideIn 0.3s;
    }
    
    .notification.active {
      display: block;
    }
    
    .notification.success {
      border-left: 4px solid #34a853;
    }
    
    .notification.error {
      border-left: 4px solid #ea4335;
    }
    
    @keyframes slideIn {
      from {
        transform: translateX(400px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Боковое меню -->
    <div class="sidebar">
      <div class="sidebar-header">
        <h1>⚖️ Выговоры</h1>
        <p style="margin-bottom: 8px;">Система управления SASPA</p>
        <div style="display: flex; align-items: center; justify-content: center; gap: 6px; margin-top: 6px; padding: 6px 12px; background: rgba(255, 255, 255, 0.1); border-radius: 20px; font-size: 11px; backdrop-filter: blur(5px);">
          <span style="opacity: 0.7;">Разработчик:</span>
          <span style="font-weight: 600; color: rgba(255, 255, 255, 0.95);">Geralt Rivskii</span>
        </div>
        
        <!-- Кнопка выхода -->
        <div class="menu-item" id="logoutMenuItem" onclick="logoutUser();" style="display: none; margin-top: 8px; padding: 6px 12px; background: rgba(255, 255, 255, 0.15); border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 6px; transition: all 0.3s; font-size: 11px; cursor: pointer;" onmouseover="this.style.background='rgba(255, 255, 255, 0.25)'; this.style.transform='translateY(-1px)';" onmouseout="this.style.background='rgba(255, 255, 255, 0.15)'; this.style.transform='';">
          <span class="menu-item-icon" style="font-size: 13px;">🚪</span>
          <span>Выйти</span>
        </div>
      </div>
      
      <!-- Общедоступные разделы -->
      <div class="menu-section-header" style="margin-top: 10px;">
        <div style="padding: 12px 20px; display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(33, 150, 243, 0.2) 0%, rgba(25, 118, 210, 0.1) 100%); border-left: 3px solid #2196f3; border-radius: 8px; margin: 8px 12px;">
          <span style="font-size: 14px;">🌐</span>
          <span style="color: rgba(255,255,255,0.95); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Общедоступные разделы</span>
        </div>
      </div>
      
      <div class="menu-item active" onclick="showSection('dashboard')">
        <span class="menu-item-icon">📊</span>
        <span>Дашборд</span>
      </div>

      <div class="menu-item" onclick="showSection('stats')">
        <span class="menu-item-icon">📈</span>
        <span>Статистика</span>
      </div>
      
      <div class="menu-item" onclick="showSection('list')">
        <span class="menu-item-icon">📋</span>
        <span>Список выговоров</span>
      </div>
      
      <div class="menu-item" onclick="showSection('remove')">
        <span class="menu-item-icon">✅</span>
        <span>Снятие выговора</span>
      </div>
      
      <div class="menu-item" onclick="showSection('appeal')">
        <span class="menu-item-icon">⚖️</span>
        <span>Обжалование</span>
      </div>
      
      <div class="menu-item" onclick="showSection('howToGetDiscordId')">
        <span class="menu-item-icon">🆔</span>
        <span>Как узнать свой Discord ID</span>
      </div>
      
      <div class="menu-item" onclick="showSection('howToGetOtherDiscordId')">
        <span class="menu-item-icon">👤</span>
        <span>Как узнать чужой Discord ID</span>
      </div>
      
      <div class="menu-item" onclick="showSection('about')">
        <span class="menu-item-icon">ℹ️</span>
        <span>Инфо и связь с Разработчиком</span>
      </div>
      
      <div class="menu-item" onclick="showSection('requestAccess')">
        <span class="menu-item-icon">🔑</span>
        <span>Запросить доступ</span>
      </div>
      
      <!-- Разделы для старшего состава -->
      <div class="menu-section-header protected-header" style="margin-top: 20px; display: none;" id="adminSectionHeader">
        <div style="padding: 12px 20px; display: flex; align-items: center; gap: 8px; background: linear-gradient(135deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%); border-left: 3px solid #ffd700; border-radius: 8px; margin: 8px 12px;">
          <span style="font-size: 14px;">⭐</span>
          <span style="color: rgba(255,255,255,0.95); font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Для старшего состава</span>
        </div>
      </div>
      
      <div class="menu-item protected" onclick="showSection('create')" style="display: none;">
        <span class="menu-item-icon">➕</span>
        <span>Добавить выговор</span>
      </div>
      
      <div class="menu-item protected" onclick="showSection('reviewAppeals')" style="display: none;" id="reviewAppealsMenuItem">
        <span class="menu-item-icon">📋</span>
        <span>Рассмотрение обжалований</span>
        <span id="appealsCounterBadge" style="display: inline-block; margin-left: auto; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; min-width: 24px; text-align: center; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4); opacity: 0.7;">
          <span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>
        </span>
      </div>
      
      <div class="menu-item protected" onclick="showSection('reviewRemovals')" style="display: none;" id="reviewRemovalsMenuItem">
        <span class="menu-item-icon">📋</span>
        <span>Рассмотрение снятия</span>
        <span id="removalsCounterBadge" style="display: inline-block; margin-left: auto; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; min-width: 24px; text-align: center; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4); opacity: 0.7;">
          <span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>
        </span>
      </div>
      
      <div class="menu-item protected" onclick="showSection('users')" style="display: none;">
        <span class="menu-item-icon">👥</span>
        <span>Сотрудники</span>
      </div>
      
      <div class="menu-item protected" onclick="showSection('manageRules')" style="display: none;">
        <span class="menu-item-icon">⚙️</span>
        <span>Управление правилами</span>
      </div>
      
      <div class="menu-item admin-only" onclick="showSection('requests')" style="display: none;" id="requestsMenuItem">
        <span class="menu-item-icon">🔐</span>
        <span>Управление доступом</span>
        <span id="requestsCounterBadge" style="display: inline-block; margin-left: auto; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 700; min-width: 24px; text-align: center; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.4); opacity: 0.7;">
          <span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>
        </span>
      </div>
      
      <div class="menu-item protected" onclick="showSection('logs')" style="display: none;" id="logsMenuItem">
        <span class="menu-item-icon">📋</span>
        <span>Логи</span>
      </div>
      
      <div class="menu-item" id="loginMenuItem" onclick="showLoginForm();" style="display: flex;">
        <span class="menu-item-icon">🔐</span>
        <span>Войти</span>
      </div>
    </div>
    
    <!-- Основной контент -->
    <div class="main-content">
      <!-- Дашборд -->
      <div id="dashboard" class="content-section active">
        <div class="page-header">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h2>📊 Дашборд</h2>
              <p>Общая информация о системе</p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <div style="display: flex; gap: 10px; align-items: center;">
                <select id="periodFilter" style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; cursor: pointer; transition: all 0.3s;" onchange="handlePeriodChange()">
                  <option value="all">Все время</option>
                  <option value="today">Сегодня</option>
                  <option value="week">Последняя неделя</option>
                  <option value="month">Последний месяц</option>
                  <option value="quarter">Последний квартал</option>
                  <option value="year">Последний год</option>
                  <option value="custom">Произвольный период</option>
                </select>
                <div id="customDateRange" style="display: none; gap: 10px; align-items: center;">
                  <input type="date" id="dateFrom" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                  <span style="color: #666;">—</span>
                  <input type="date" id="dateTo" style="padding: 10px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px;">
                  <button onclick="applyCustomDateRange()" class="btn btn-primary" style="padding: 10px 20px;">Применить</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div id="dashboardUnpaidTable" style="margin-bottom: 30px;">
          <!-- Таблица неоплаченных будет добавлена здесь -->
        </div>
        
        <div class="stats-grid" id="dashboardStats">
          <div class="loading active">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
        
        <div id="dashboardCharts" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 20px; margin-top: 30px;">
          <!-- Графики будут добавлены здесь -->
        </div>
      </div>
      
      <!-- Создание выговора -->
      <div id="create" class="content-section">
        <div class="page-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3); margin-bottom: 30px;">
          <div style="display: flex; align-items: center; gap: 20px;">
            <div style="font-size: 56px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">➕</div>
            <div>
              <h2 style="margin: 0 0 10px 0; color: white; font-size: 32px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Добавить выговор</h2>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 16px;">Выдача нового дисциплинарного взыскания</p>
            </div>
          </div>
        </div>
        
          <form id="createForm" onsubmit="createVygovorHandler(event); return false;">
          <!-- Секция 1: Информация о выдающем -->
          <div class="form-container" style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.2);">
              <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <span style="font-size: 28px;">👤</span>
                <span>Информация о выдающем</span>
              </h3>
              <p style="margin: 8px 0 0 40px; color: rgba(255,255,255,0.9); font-size: 14px;">Автоматически заполняется из вашего профиля</p>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">📝 Имя и Фамилия</label>
                <input type="text" id="issuerName" readonly style="background: #f5f5f5; cursor: not-allowed; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; color: #666;">
              </div>
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">🆔 Discord ID</label>
                <input type="text" id="issuerId" readonly style="background: #f5f5f5; cursor: not-allowed; font-family: monospace; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; color: #666;">
              </div>
              </div>
          </div>
          
          <!-- Секция 2: Информация о наказываемом -->
          <div class="form-container" style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.2);">
              <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <span style="font-size: 28px;">🎯</span>
                <span>Информация о наказываемом</span>
              </h3>
              <p style="margin: 8px 0 0 40px; color: rgba(255,255,255,0.9); font-size: 14px;">Выберите сотрудника из списка или добавьте нового</p>
            </div>
            
            <div class="form-row">
              <div class="form-group" style="flex: 1;">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">👨‍💼 Сотрудник</label>
                <div style="display: flex; gap: 10px;">
                  <select id="recipientSelect" required style="flex: 1; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; box-sizing: border-box;" onfocus="this.style.borderColor='#ff9800'; this.style.boxShadow='0 0 0 3px rgba(255, 152, 0, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                    <option value="">Выберите сотрудника...</option>
                  </select>
                  <button type="button" id="addRecipientBtn" style="padding: 14px 24px; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; white-space: nowrap; transition: all 0.3s; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(33, 150, 243, 0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(33, 150, 243, 0.2)';">
                    ➕ Добавить сотрудника
                  </button>
                </div>
              </div>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">🆔 Discord ID</label>
                <input type="text" id="recipientId" readonly style="background: #f5f5f5; cursor: not-allowed; font-family: monospace; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; color: #666;">
              </div>
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">🎖️ Ранг сотрудника <span style="color: #f44336;">*</span></label>
                <select id="rank" required style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; box-sizing: border-box;" onfocus="this.style.borderColor='#ff9800'; this.style.boxShadow='0 0 0 3px rgba(255, 152, 0, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                  <option value="">Выберите ранг...</option>
                  <option value="1">🥉 Ранг 1</option>
                  <option value="2">🥉 Ранг 2</option>
                  <option value="3">🥈 Ранг 3</option>
                  <option value="4">🥈 Ранг 4</option>
                  <option value="5">🥈 Ранг 5</option>
                  <option value="6">🥇 Ранг 6</option>
                  <option value="7">🥇 Ранг 7</option>
                  <option value="8">🥇 Ранг 8</option>
                  <option value="9">🥇 Ранг 9</option>
                  <option value="10">💎 Ранг 10</option>
                  <option value="11">💎 Ранг 11</option>
                </select>
              </div>
            </div>
            
            <!-- История выговоров сотрудника -->
            <div id="recipientVygovoryHistory" style="margin-top: 20px; display: none;">
              <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 12px; padding: 20px; border: 2px solid #ff9800;">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                  <div style="font-size: 28px;">📊</div>
                  <div>
                    <strong style="color: #e65100; display: block; font-size: 16px;">История взысканий сотрудника</strong>
                    <span style="color: #666; font-size: 13px;">Активные и просроченные выговоры</span>
                  </div>
                </div>
                <div id="recipientVygovoryContainer" style="max-height: 300px; overflow-y: auto;">
                  <!-- Здесь будут отображаться выговоры -->
                </div>
              </div>
            </div>
          </div>
          
          <!-- Секция 3: Нарушение и наказание -->
          <div class="form-container" style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);">
              <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <span style="font-size: 28px;">⚠️</span>
                <span>Нарушение и наказание</span>
              </h3>
              <p style="margin: 8px 0 0 40px; color: rgba(255,255,255,0.9); font-size: 14px;">Выберите правило и тип выговора</p>
            </div>
            
            <div class="form-group">
              <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">📋 Правило <span style="color: #f44336;">*</span></label>
              <button type="button" onclick="openRuleModal()" style="width: 100%; padding: 14px; border: none; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; font-size: 15px; box-sizing: border-box; margin-bottom: 12px; cursor: pointer; font-weight: 600; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.2)';">
                📋 Выбрать правило из списка
              </button>
              <input type="text" id="rule" placeholder="или введите номер правила вручную (например, 25.10)" style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              <input type="hidden" id="selectedRulePunishment" value="">
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">📌 Тип выговора <span style="color: #f44336;">*</span></label>
                <select id="type" required style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; box-sizing: border-box;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                  <option value="VR">VR (Устный выговор)</option>
                  <option value="WR">WR (Письменный выговор)</option>
                  <option value="SR">SR (Строгий выговор 1/2)</option>
                  <option value="SR2">SR (Строгий выговор 2/2)</option>
                  <option value="Suspension">Отстранение от работы</option>
                  <option value="Retest">Переаттестация</option>
                  <option value="Dismissal">Увольнение</option>
                </select>
              </div>
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">💰 Сумма штрафа ($) <span style="color: #f44336;">*</span></label>
                <input type="number" id="amount" min="0" required placeholder="0" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              </div>
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">⏰ Часы отработки</label>
                <input type="number" id="hours" min="0" value="0" placeholder="0" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 16px; margin-top: 20px; border: 2px solid #2196f3;">
              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="font-size: 24px;">💡</div>
                <div style="flex: 1;">
                  <strong style="color: #1976d2; display: block; margin-bottom: 6px; font-size: 15px;">Автоматический расчет</strong>
                  <p style="margin: 0; color: #424242; font-size: 14px; line-height: 1.5;">
                    Сумма штрафа и часы отработки рассчитываются автоматически на основе выбранного ранга и типа выговора. Вы можете изменить эти значения вручную при необходимости.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Секция 4: Дополнительная информация -->
          <div class="form-container" style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(156, 39, 176, 0.2);">
              <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <span style="font-size: 28px;">📅</span>
                <span>Дополнительная информация</span>
              </h3>
              <p style="margin: 8px 0 0 40px; color: rgba(255,255,255,0.9); font-size: 14px;">Укажите дату выдачи и срок оплаты</p>
            </div>
            
            <div class="form-row">
            <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">📆 Дата выдачи <span style="color: #f44336;">*</span></label>
                <input type="date" id="date" required style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#9c27b0'; this.style.boxShadow='0 0 0 3px rgba(156, 39, 176, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              </div>
              <div class="form-group">
                <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">⏰ Срок оплаты/отработки <span style="color: #f44336;">*</span></label>
                <input type="datetime-local" id="paymentDeadline" required style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#9c27b0'; this.style.boxShadow='0 0 0 3px rgba(156, 39, 176, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              </div>
            </div>
            
            <div style="background: linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%); border-radius: 12px; padding: 16px; margin-top: 20px; border: 2px solid #ff9800;">
              <div style="display: flex; align-items: start; gap: 12px;">
                <div style="font-size: 24px;">⏳</div>
                <div style="flex: 1;">
                  <strong style="color: #e65100; display: block; margin-bottom: 6px; font-size: 15px;">Сроки оплаты/отработки</strong>
                  <p style="margin: 0; color: #424242; font-size: 14px; line-height: 1.8;">
                    • <strong>VR (Устный)</strong> - 2 дня<br>
                    • <strong>WR (Письменный)</strong> - 3 дня<br>
                    • <strong>SR (Строгий 1/2)</strong> - 4 дня<br>
                    • <strong>SR2 (Строгий 2/2)</strong> - 1 день (24 часа) или увольнение
                  </p>
                </div>
              </div>
        </div>
          </div>
          
          <!-- Секция 5: Доказательства -->
          <div class="form-container" style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 25px;">
            <div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(244, 67, 54, 0.2);">
              <h3 style="margin: 0; color: white; font-size: 20px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
                <span style="font-size: 28px;">📸</span>
                <span>Доказательства нарушения</span>
              </h3>
              <p style="margin: 8px 0 0 40px; color: rgba(255,255,255,0.9); font-size: 14px;">Добавьте ссылки на скриншоты и другие материалы</p>
            </div>
            
            <div class="form-group">
              <label style="font-weight: 600; color: #555; margin-bottom: 8px; display: block;">🔗 Ссылки на доказательства <span style="color: #f44336;">*</span></label>
              <textarea id="evidenceLinks" required placeholder="Вставьте ссылки на скриншоты, видео или другие доказательства (каждая ссылка с новой строки)&#10;&#10;Пример:&#10;https://imgur.com/abc123&#10;https://postimg.cc/xyz789" style="width: 100%; min-height: 120px; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; box-sizing: border-box; transition: all 0.3s; font-family: 'Segoe UI', Arial, sans-serif; resize: vertical;" onfocus="this.style.borderColor='#f44336'; this.style.boxShadow='0 0 0 3px rgba(244, 67, 54, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
            </div>
            
            <!-- Быстрые ссылки на сервисы загрузки -->
            <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px; padding: 18px; margin-top: 15px; border: 2px solid #2196f3;">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                <span style="font-size: 24px;">☁️</span>
                <strong style="color: #1565c0; font-size: 15px;">Загрузите скриншоты на один из сервисов:</strong>
              </div>
              <div style="display: flex; flex-wrap: wrap; gap: 10px;">
                <a href="https://imgur.com" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #1bb76e; border-radius: 8px; text-decoration: none; color: #1bb76e; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#1bb76e'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(27, 183, 110, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#1bb76e'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>🖼️</span> Imgur
                </a>
                <a href="https://yapx.ru" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #ff6f00; border-radius: 8px; text-decoration: none; color: #ff6f00; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#ff6f00'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(255, 111, 0, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#ff6f00'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>📷</span> Yapx
                </a>
                <a href="https://drive.google.com" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #4285f4; border-radius: 8px; text-decoration: none; color: #4285f4; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#4285f4'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(66, 133, 244, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#4285f4'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>💾</span> Google Drive
                </a>
                <a href="https://disk.yandex.ru" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #fc3f1d; border-radius: 8px; text-decoration: none; color: #fc3f1d; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#fc3f1d'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(252, 63, 29, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#fc3f1d'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>☁️</span> Яндекс Диск
                </a>
                <a href="https://radikal.cloud" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #7c4dff; border-radius: 8px; text-decoration: none; color: #7c4dff; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#7c4dff'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(124, 77, 255, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#7c4dff'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>🌐</span> Radikal Cloud
                </a>
                <a href="https://postimg.cc" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #00acc1; border-radius: 8px; text-decoration: none; color: #00acc1; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#00acc1'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(0, 172, 193, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#00acc1'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>📤</span> PostImg
                </a>
                <a href="https://ibb.co" target="_blank" style="flex: 1; min-width: 140px; padding: 10px 16px; background: white; border: 2px solid #e91e63; border-radius: 8px; text-decoration: none; color: #e91e63; font-weight: 600; font-size: 13px; text-align: center; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; gap: 6px;" onmouseover="this.style.background='#e91e63'; this.style.color='white'; this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(233, 30, 99, 0.3)';" onmouseout="this.style.background='white'; this.style.color='#e91e63'; this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.1)';">
                  <span>🖼️</span> ImgBB
                </a>
              </div>
              <div style="margin-top: 12px; padding: 10px; background: rgba(255, 255, 255, 0.7); border-radius: 8px;">
                <p style="margin: 0; color: #424242; font-size: 12px; line-height: 1.6;">
                  💡 <strong>Совет:</strong> После загрузки скриншота скопируйте ссылку и вставьте её в поле выше. Можно добавить несколько ссылок (каждую с новой строки).
                </p>
              </div>
            </div>
          </div>
          
          <!-- Кнопка отправки -->
          <div style="text-align: center; padding: 20px 0;">
            <button type="submit" class="btn btn-primary" style="padding: 18px 48px; font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-3px)'; this.style.boxShadow='0 12px 30px rgba(102, 126, 234, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 8px 20px rgba(102, 126, 234, 0.3)';">
              ✅ Создать выговор
            </button>
          </div>
        </form>
      </div>
      
      <!-- Список выговоров -->
      <div id="list" class="content-section">
        <div class="page-header">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h2>📋 Список выговоров</h2>
              <p>Все дисциплинарные взыскания</p>
            </div>
            <div id="listSummary" style="display: flex; gap: 15px; flex-wrap: wrap;">
              <!-- Сводка будет добавлена здесь -->
            </div>
          </div>
        </div>
        
        <div class="form-container" style="background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%); border: 2px solid #e0e7ff;">
          <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
            <span style="font-size: 24px;">🔍</span>
            <h3 style="margin: 0; color: #333;">Фильтры</h3>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label style="font-weight: 600; color: #555;">📊 Статус</label>
              <select id="statusFilter" onchange="loadVygovoryList()" style="padding: 12px; border: 2px solid #e0e7ff; border-radius: 10px; font-size: 14px; background: white; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e7ff'; this.style.boxShadow='none';">
                <option value="">Все статусы</option>
                <option value="Активен">⚡ Активен</option>
                <option value="Оплачен">💰 Оплачен</option>
                <option value="Отработан">⏰ Отработан</option>
                <option value="Обжалован">⚖️ Обжалован</option>
                <option value="На обжаловании">⏳ На обжаловании</option>
                <option value="Снят">✅ Снят</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-weight: 600; color: #555;">🏷️ Тип</label>
              <select id="typeFilter" onchange="loadVygovoryList()" style="padding: 12px; border: 2px solid #e0e7ff; border-radius: 10px; font-size: 14px; background: white; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e7ff'; this.style.boxShadow='none';">
                <option value="">Все типы</option>
                <option value="VR">VR (Устный)</option>
                <option value="WR">WR (Письменный)</option>
                <option value="SR">SR (Строгий)</option>
                <option value="Fine">Fine (Штраф)</option>
              </select>
            </div>
            <div class="form-group">
              <label style="font-weight: 600; color: #555;">👤 Discord ID</label>
              <input type="text" id="userIdFilter" placeholder="Введите Discord ID для поиска..." onkeyup="loadVygovoryList()" style="padding: 12px; border: 2px solid #e0e7ff; border-radius: 10px; font-size: 14px; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e7ff'; this.style.boxShadow='none';">
            </div>
            <div class="form-group">
              <label style="font-weight: 600; color: #555;">🆔 ID выговора</label>
              <input type="text" id="idFilter" placeholder="Введите ID выговора..." onkeyup="loadVygovoryList()" style="padding: 12px; border: 2px solid #e0e7ff; border-radius: 10px; font-size: 14px; transition: all 0.3s; font-family: monospace;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e7ff'; this.style.boxShadow='none';">
            </div>
          </div>
        </div>
        
        <div id="vygovoryCardsContainer" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 20px; margin-top: 25px;">
          <div class="loading active" id="listLoading" style="grid-column: 1 / -1;">
            <div class="spinner"></div>
            <p>Загрузка данных...</p>
          </div>
        </div>
        
        <!-- Старая таблица (скрыта, используется как fallback) -->
        <div class="table-container" style="display: none;">
          <table id="vygovoryTable" style="display: none;">
            <thead>
              <tr>
                <th>ID</th>
                <th>Дата</th>
                <th>Получатель</th>
                <th>Выдающий</th>
                <th>Тип</th>
                <th>Сумма</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody id="vygovoryTableBody">
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Статистика -->
      <div id="stats" class="content-section">
        <div class="page-header">
          <h2>📈 Статистика</h2>
          <p>Поиск выговоров по фильтрам</p>
        </div>
        
        <div style="margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3);">
            <form onsubmit="loadStatisticsWithFilters(event); return false;">
              <div style="display: flex; gap: 15px; align-items: flex-end; flex-wrap: wrap;">
                <div style="flex: 0 0 200px;">
                  <label style="color: white; font-weight: 600; margin-bottom: 8px; display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">🔍 Поиск по:</label>
                  <select id="statsFilterType" style="width: 100%; padding: 12px 15px; border: none; border-radius: 10px; font-size: 15px; background: white; color: #333; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.1); outline: none; transition: all 0.3s;" onfocus="this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)'" onblur="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                    <option value="recipientName">👤 Получатель (Имя Фамилия)</option>
                    <option value="recipientId">🆔 Discord ID получателя</option>
                    <option value="issuerName">👔 Выдавший (Имя Фамилия)</option>
                    <option value="issuerId">🆔 Discord ID выдающего</option>
                    <option value="all">🌐 По всем полям</option>
                  </select>
                </div>
                
                <div style="flex: 1; min-width: 250px;">
                  <label style="color: white; font-weight: 600; margin-bottom: 8px; display: block; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Значение для поиска:</label>
                  <input type="text" id="statsSearchValue" placeholder="Введите значение для поиска..." style="width: 100%; padding: 12px 15px; border: none; border-radius: 10px; font-size: 15px; background: white; color: #333; box-shadow: 0 4px 15px rgba(0,0,0,0.1); outline: none; transition: all 0.3s;" onfocus="this.style.boxShadow='0 6px 20px rgba(0,0,0,0.15)'" onblur="this.style.boxShadow='0 4px 15px rgba(0,0,0,0.1)'">
                </div>
                
                <div style="display: flex; gap: 10px; flex-shrink: 0;">
                  <button type="submit" class="btn btn-primary" style="background: white; color: #667eea; font-weight: 600; padding: 12px 30px; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.25)'" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)'">
                    🔍 Найти
                  </button>
                  <button type="button" class="btn btn-secondary" onclick="clearStatisticsFilters()" style="background: rgba(255,255,255,0.2); color: white; font-weight: 600; padding: 12px 25px; border: 2px solid rgba(255,255,255,0.3); border-radius: 10px; cursor: pointer; transition: all 0.3s; white-space: nowrap;" onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.borderColor='rgba(255,255,255,0.5)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.borderColor='rgba(255,255,255,0.3)'">
                    ✖ Очистить
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
        
        <div id="statisticsSummary" style="margin-bottom: 20px;"></div>
        
        <div id="statisticsContainer">
          <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
            <h3 style="color: #666; margin-bottom: 10px;">Используйте фильтры для поиска</h3>
            <p style="color: #999;">Заполните один или несколько полей и нажмите "Найти"</p>
          </div>
        </div>
      </div>
      
      <!-- Пользователи -->
      <div id="users" class="content-section">
        <div class="page-header" style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(33, 150, 243, 0.3); margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h2 style="margin: 0 0 10px 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">👥 Сотрудники</h2>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Список всех сотрудников SASPA</p>
            </div>
            <button id="addUserHeaderBtn" style="padding: 14px 28px; background: white; color: #2196f3; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s; font-size: 15px; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)';">
              ➕ Добавить сотрудника
            </button>
          </div>
        </div>
        <div id="usersContainer">Загрузка...</div>
      </div>
      
      <!-- Управление правилами -->
      <div id="manageRules" class="content-section">
        <div class="page-header" style="background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); color: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(255, 152, 0, 0.3); margin-bottom: 30px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h2 style="margin: 0 0 10px 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">⚙️ Управление правилами</h2>
              <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Добавление, редактирование и удаление правил</p>
            </div>
            <button onclick="showAddRuleForm()" style="padding: 14px 28px; background: white; color: #ff9800; font-weight: 600; border: none; border-radius: 12px; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.2); transition: all 0.3s; font-size: 15px; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(0,0,0,0.3)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.2)';">
              ➕ Добавить правило
            </button>
          </div>
        </div>
        
        <!-- Форма добавления/редактирования правила -->
        <div id="ruleFormContainer" style="display: none; background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 30px;">
          <form id="ruleForm" onsubmit="handleRuleFormSubmit(event); return false;">
            <input type="hidden" id="editRuleId" value="">
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
              <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 28px;">📝</span>
                <span id="ruleFormTitle">Добавить новое правило</span>
              </h3>
            </div>
            
            <div class="form-group">
              <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block;">Правило (например, 25.1)</label>
              <input type="text" id="ruleNumber" required placeholder="Введите номер правила" style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
            </div>
            
            <div class="form-group">
              <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block;">Мера наказания</label>
              <select id="rulePunishment" required style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: all 0.3s; background: white;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                <option value="">Выберите меру наказания...</option>
                <option value="VR (Устный выговор)">Устный — VR (Verbal Reprimand)</option>
                <option value="WR (Письменный выговор)">Письменный — WR (Written Reprimand)</option>
                <option value="SR (Строгий выговор)">Строгий — SR (Severe Reprimand)</option>
                <option value="Отстранение от работы">Отстранение от работы</option>
                <option value="Переаттестация">Переаттестация</option>
                <option value="Увольнение">Увольнение</option>
              </select>
            </div>
            
            <div style="display: flex; gap: 15px; flex-wrap: wrap;">
              <button type="submit" id="ruleFormSubmitBtn" style="padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; transition: all 0.3s; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.3)';">
                💾 Сохранить
              </button>
              <button type="button" id="ruleFormCancelBtn" onclick="hideRuleForm()" style="padding: 14px 28px; background: #e0e0e0; color: #333; font-weight: 600; border: none; border-radius: 10px; cursor: pointer; font-size: 15px; transition: all 0.3s;" onmouseover="this.style.background='#d0d0d0';" onmouseout="this.style.background='#e0e0e0';">
                ❌ Отмена
              </button>
            </div>
          </form>
        </div>
        
        <!-- Список правил -->
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px;">
            <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 28px;">📋</span>
              <span>Список правил</span>
            </h3>
          </div>
          
          <!-- Поиск -->
          <div style="margin-bottom: 25px;">
            <input type="text" id="rulesTableSearch" onkeyup="filterRulesTable()" placeholder="🔍 Поиск по правилам..." style="width: 100%; padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
          </div>
          
          <div id="rulesTableContainer">
            <div style="text-align: center; padding: 40px 20px; color: #999;">
              <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto 20px auto;"></div>
              <p>Загрузка правил...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Управление запросами доступа (только для супер-админа) -->
      <div id="requests" class="content-section">
        <div class="page-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(102, 126, 234, 0.3); margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">🔐 Управление доступом</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">Одобрение и отклонение запросов на доступ</p>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);">
            <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <span style="font-size: 28px;">📋</span>
              <span>Заявки на доступ</span>
            </h3>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Одобрение и отклонение запросов на доступ к системе</p>
          </div>
          <div id="requestsContainer">
            <div class="loading active">
              <div class="spinner"></div>
              <p>Загрузка запросов...</p>
            </div>
          </div>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2);">
            <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <span style="font-size: 28px;">👥</span>
              <span>Авторизованные пользователи</span>
            </h3>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Управление пользователями и их правами доступа</p>
          </div>
          <div id="authorizedUsersContainer">
            <div class="loading active">
              <div class="spinner"></div>
              <p>Загрузка пользователей...</p>
            </div>
          </div>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-top: 30px;">
          <div style="background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%); border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(156, 39, 176, 0.2);">
            <h3 style="margin: 0; color: white; font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 12px; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              <span style="font-size: 28px;">🌐</span>
              <span>Все пользователи</span>
            </h3>
            <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Полный список всех пользователей системы</p>
          </div>
          <div id="allUsersContainer">
            <div class="loading active">
              <div class="spinner"></div>
              <p>Загрузка пользователей...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Логи системы (только для старшего состава) -->
      <div id="logs" class="content-section">
        <div class="page-header" style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); color: white; border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(0, 188, 212, 0.3); margin-bottom: 30px;">
          <h2 style="margin: 0 0 10px 0; color: white; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">📋 Логи системы</h2>
          <p style="margin: 0; color: rgba(255,255,255,0.9); font-size: 15px;">История всех действий в системе</p>
        </div>
        
        <div style="background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; gap: 15px; flex-wrap: wrap;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 24px;">📊</span>
              <div>
                <h3 style="margin: 0; color: #333; font-size: 20px; font-weight: 700;">Журнал событий</h3>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;" id="logsCountText">Загрузка...</p>
              </div>
            </div>
            
            <div style="display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
              <input 
                type="text" 
                id="logsSearchInput" 
                placeholder="🔍 Поиск по логам..." 
                style="padding: 10px 15px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; min-width: 250px; transition: all 0.3s;"
                oninput="filterLogs()"
                onfocus="this.style.borderColor='#00bcd4'; this.style.boxShadow='0 0 0 3px rgba(0, 188, 212, 0.1)';"
                onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              
              <button 
                onclick="loadLogs()" 
                style="padding: 10px 20px; background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-weight: 600; font-size: 14px; transition: all 0.3s; box-shadow: 0 4px 12px rgba(0, 188, 212, 0.3);"
                onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0, 188, 212, 0.4)';"
                onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 12px rgba(0, 188, 212, 0.3)';">
                🔄 Обновить
              </button>
            </div>
          </div>
          
          <!-- Фильтры по типам действий -->
          <div style="margin-bottom: 20px; padding: 20px; background: linear-gradient(135deg, #f5f5f5 0%, #e8eaf6 100%); border-radius: 12px; border: 2px solid #e0e0e0;">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
              <span style="font-size: 18px;">🏷️</span>
              <h4 style="margin: 0; color: #333; font-size: 16px; font-weight: 600;">Фильтр по типу действия</h4>
            </div>
            
            <div id="logsFilterButtons" style="display: flex; flex-wrap: wrap; gap: 8px;">
              <button onclick="filterLogsByAction('')" data-action="" class="log-filter-btn active" style="padding: 8px 16px; background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%); color: white; border: none; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s; box-shadow: 0 2px 8px rgba(0, 188, 212, 0.3);">
                ✨ Все
              </button>
              <button onclick="filterLogsByAction('CREATE_VYGOVOR')" data-action="CREATE_VYGOVOR" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                📝 Создан выговор
              </button>
              <button onclick="filterLogsByAction('APPEAL_VYGOVOR')" data-action="APPEAL_VYGOVOR" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                ⚖️ Обжалование
              </button>
              <button onclick="filterLogsByAction('REVIEW_APPEAL')" data-action="REVIEW_APPEAL" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                👨‍⚖️ Рассмотрение обжалования
              </button>
              <button onclick="filterLogsByAction('REQUEST_REMOVAL')" data-action="REQUEST_REMOVAL" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                🗑️ Запрос на снятие
              </button>
              <button onclick="filterLogsByAction('REVIEW_REMOVAL')" data-action="REVIEW_REMOVAL" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                ✅ Рассмотрение снятия
              </button>
              <button onclick="filterLogsByAction('LOGIN')" data-action="LOGIN" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                🔓 Вход в систему
              </button>
              <button onclick="filterLogsByAction('LOGOUT')" data-action="LOGOUT" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                🔒 Выход из системы
              </button>
              <button onclick="filterLogsByAction('CREATE_USER')" data-action="CREATE_USER" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                👤 Создан пользователь
              </button>
              <button onclick="filterLogsByAction('ACCESS_REQUEST')" data-action="ACCESS_REQUEST" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                🔑 Запрос доступа
              </button>
              <button onclick="filterLogsByAction('APPROVE_ACCESS')" data-action="APPROVE_ACCESS" class="log-filter-btn" style="padding: 8px 16px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 20px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;">
                ✅ Доступ одобрен
              </button>
            </div>
          </div>
          
          <div id="logsContainer">
            <div class="loading active">
              <div class="spinner"></div>
              <p>Загрузка логов...</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Запрос доступа -->
      <div id="requestAccess" class="content-section">
        <div class="page-header">
          <h2>🔑 Запрос доступа</h2>
          <p>Запросите доступ к защищенным функциям системы</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 16px; padding: 25px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.2); border: 2px solid #2196f3;">
          <div style="display: flex; align-items: start; gap: 15px;">
            <div style="font-size: 32px;">ℹ️</div>
            <div>
              <h3 style="margin: 0 0 10px 0; color: #1976d2; font-size: 18px;">Как получить доступ?</h3>
              <p style="margin: 0; color: #424242; line-height: 1.6;">
                1. Заполните форму ниже и отправьте запрос на доступ<br>
                2. Старший состав рассмотрит ваш запрос<br>
                3. Используйте полученные данные для входа в систему через кнопку "Войти" в меню
              </p>
            </div>
          </div>
        </div>
        
        <div style="background: linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%); border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(0,0,0,0.1); border: 2px solid #e0e0e0;">
          <form id="requestAccessForm" onsubmit="requestAccessHandler(event); return false;">
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">👤 Ваше имя (Имя Фамилия) <span style="color: #dc3545;">*</span></label>
                <input type="text" id="requestName" required placeholder="Например: Иван Иванов" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#2196f3'; this.style.boxShadow='0 0 0 3px rgba(33, 150, 243, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 Ваш Discord ID <span style="color: #dc3545;">*</span></label>
                <input type="text" id="requestDiscordId" required placeholder="Ваш Discord ID" pattern="[0-9]+" inputmode="numeric" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#2196f3'; this.style.boxShadow='0 0 0 3px rgba(33, 150, 243, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';" oninput="this.value = this.value.replace(/[^0-9]/g, '');">
                <small style="color: #666; font-size: 12px; margin-top: 8px; display: block; padding: 10px; background: #f5f5f5; border-radius: 8px;">
                  💡 <strong>Как найти Discord ID:</strong><br>
                  Откройте Discord → Настройки → Дополнительно → Разработчик → Включите "Режим разработчика"<br>
                  Затем правой кнопкой мыши по вашему профилю → "Копировать ID пользователя"
                </small>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🔑 Логин <span style="color: #dc3545;">*</span></label>
                <input type="text" id="requestLogin" required placeholder="Придумайте логин для входа" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#2196f3'; this.style.boxShadow='0 0 0 3px rgba(33, 150, 243, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                <small style="color: #666; font-size: 12px; margin-top: 8px; display: block;">Логин будет использоваться для входа в систему</small>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🔒 Пароль <span style="color: #dc3545;">*</span></label>
                <div style="position: relative;">
                  <input type="password" id="requestPassword" required placeholder="Придумайте пароль (минимум 8 символов)" style="padding: 14px 50px 14px 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: white; transition: all 0.3s; width: 100%; box-sizing: border-box;" onfocus="this.style.borderColor='#2196f3'; this.style.boxShadow='0 0 0 3px rgba(33, 150, 243, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                  <button type="button" id="toggleRequestPassword" onclick="togglePasswordVisibility('requestPassword', 'toggleRequestPassword')" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 20px; color: #666; padding: 5px; transition: color 0.3s;" onmouseover="this.style.color='#2196f3';" onmouseout="this.style.color='#666';" title="Показать/скрыть пароль">👁️</button>
                </div>
                <small style="color: #666; font-size: 12px; margin-top: 8px; display: block;">Минимум 8 символов</small>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">📝 Причина запроса доступа</label>
                <textarea id="requestReason" rows="5" required placeholder="Опишите подробно, зачем вам нужен доступ к системе. Чем подробнее вы опишете причину, тем быстрее будет рассмотрен ваш запрос." style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; resize: vertical; min-height: 120px;" onfocus="this.style.borderColor='#2196f3'; this.style.boxShadow='0 0 0 3px rgba(33, 150, 243, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
              </div>
            </div>
            
            <div style="text-align: center;">
              <button type="submit" id="requestAccessSubmitBtn" class="btn btn-primary" style="padding: 15px 40px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); border: none; border-radius: 12px; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); transition: all 0.3s;" onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(33, 150, 243, 0.4)'; }" onmouseout="if(!this.disabled) { this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(33, 150, 243, 0.3)'; }">
                ✉️ Отправить запрос
              </button>
            </div>
          </form>
          
          <div id="requestStatus" style="margin-top: 25px;"></div>
        </div>
      </div>
      
      <!-- Обжалования -->
      <div id="appeal" class="content-section">
        <div class="page-header">
          <h2>⚖️ Обжалование выговора</h2>
          <p>Подача обжалования на дисциплинарное взыскание</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #fff5e6 0%, #ffe8cc 100%); border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(255, 193, 7, 0.2); border: 2px solid #ffc107;">
          <form id="appealForm" onsubmit="appealVygovorHandler(event); return false;">
            <div class="form-group" style="margin-bottom: 25px;">
              <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 ID выговора</label>
              <input type="text" id="appealVygovorId" required placeholder="Введите ID выговора для автозаполнения данных" style="padding: 14px; border: 2px solid #ffc107; border-radius: 10px; font-size: 15px; font-family: monospace; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#ff9800'; this.style.boxShadow='0 0 0 3px rgba(255, 152, 0, 0.1)';" onblur="this.style.borderColor='#ffc107'; this.style.boxShadow='none'; loadVygovorDataForAppeal();">
              <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">После ввода ID поля ниже заполнятся автоматически</small>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-row">
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">👤 Имя Фамилия</label>
                  <input type="text" id="appealUserName" required placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 Discord ID обжалующего</label>
                  <input type="text" id="appealUserId" required placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">📝 Причина обжалования</label>
                <textarea id="appealReason" rows="5" required placeholder="Опишите подробно причину обжалования выговора..." style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; resize: vertical;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
              </div>
              
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">📎 Доказательства невиновности (ссылки)</label>
                <textarea id="appealProof" rows="4" placeholder="Укажите ссылки на скриншоты, видео или другие доказательства..." style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; resize: vertical;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
                <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">Можно оставить пустым, но желательно приложить доказательства</small>
              </div>
            </div>
            
            <div style="text-align: center;">
              <button type="submit" id="appealSubmitBtn" class="btn btn-primary" style="padding: 15px 40px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #ff9800 0%, #f57c00 100%); border: none; border-radius: 12px; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3); transition: all 0.3s;" onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(255, 152, 0, 0.4)'; }" onmouseout="if(!this.disabled) { this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(255, 152, 0, 0.3)'; }">
                ⚖️ Подать обжалование
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Рассмотрение обжалований (только для админов) -->
      <div id="reviewAppeals" class="content-section">
        <div class="page-header">
          <h2>📋 Рассмотрение обжалований</h2>
          <p>Одобрение или отклонение поданных обжалований</p>
        </div>
        
        <div id="reviewAppealsContainer" style="margin-top: 20px;">
          <div style="text-align: center; padding: 40px; color: #666;">
            <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto;"></div>
            <p style="margin-top: 20px;">Загрузка обжалований...</p>
          </div>
        </div>
      </div>
      
      <!-- Как узнать Discord ID -->
      <div id="howToGetDiscordId" class="content-section">
        <div class="page-header">
          <h2>🆔 Как узнать Discord ID</h2>
          <p>Инструкция по получению вашего Discord ID</p>
        </div>
        
        <div class="form-container" style="max-width: 900px; margin: 0 auto;">
          <div style="padding: 30px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 28px;">🔍</span>
                <span>Пошаговая инструкция</span>
              </h3>
              <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.7; font-size: 15px;">
                Discord ID — это уникальный идентификатор вашей учетной записи Discord. Следуйте простым шагам ниже, чтобы его узнать.
              </p>
            </div>
            
            <!-- Шаг 1 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #5865F2;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(88, 101, 242, 0.3);">
                  1
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Включите режим разработчика</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    Откройте <strong>Discord</strong> → нажмите на <strong>⚙️ Настройки пользователя</strong> (шестеренка внизу слева) → перейдите в раздел <strong>"Расширенные"</strong> или <strong>"Advanced"</strong> → включите <strong>"Режим разработчика"</strong> (<strong>"Developer Mode"</strong>).
                  </p>
                  <div style="background: #f0f4ff; padding: 12px 15px; border-radius: 8px; border-left: 3px solid #5865F2;">
                    <small style="color: #5865F2; font-weight: 600;">💡 Подсказка:</small>
                    <small style="color: #5a6c7d; display: block; margin-top: 5px;">Режим разработчика позволяет копировать ID любых объектов в Discord (пользователей, серверов, сообщений).</small>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Шаг 2 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #57F287;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #57F287 0%, #3BA55D 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(87, 242, 135, 0.3);">
                  2
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Скопируйте ваш ID</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    Нажмите правой кнопкой мыши на <strong>ваш профиль</strong> (аватар или имя) в любом месте Discord → выберите <strong>"Копировать ID пользователя"</strong> (<strong>"Copy User ID"</strong>).
                  </p>
                  <div style="background: #eef; padding: 15px; border-radius: 10px; border: 2px dashed #667eea; margin-top: 12px;">
                    <div style="font-weight: 600; color: #667eea; margin-bottom: 8px; font-size: 13px;">📋 Пример Discord ID:</div>
                    <code style="background: white; padding: 10px 15px; border-radius: 8px; display: inline-block; font-size: 16px; color: #2c3e50; font-family: 'Courier New', monospace; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                      310459688380792832
                    </code>
                    <div style="font-size: 12px; color: #999; margin-top: 8px;">Это ваш уникальный идентификатор, состоящий из 17-19 цифр</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Шаг 3 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #FEE75C;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #FEE75C 0%, #ED4245 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(254, 231, 92, 0.4);">
                  3
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Используйте ID</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin: 0;">
                    Вставьте скопированный ID в соответствующее поле при регистрации, запросе доступа или создании выговора. Ваш ID никогда не изменится и является постоянным идентификатором вашего аккаунта.
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Альтернативный способ -->
            <div style="background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%); padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(253, 203, 110, 0.3);">
              <h4 style="margin: 0 0 15px 0; color: #2d3436; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🌐</span>
                <span>Альтернативный способ</span>
              </h4>
              <p style="color: #2d3436; line-height: 1.7; margin: 0 0 12px 0;">
                Если у вас есть ссылка на ваш профиль Discord (формат: <code style="background: rgba(255,255,255,0.6); padding: 2px 8px; border-radius: 4px; font-size: 13px;">https://discordapp.com/users/ВАШИ_ЦИФРЫ</code>), то число в конце ссылки и есть ваш Discord ID.
              </p>
              <div style="background: rgba(255,255,255,0.7); padding: 12px 15px; border-radius: 8px; margin-top: 12px;">
                <small style="color: #2d3436; font-weight: 600;">Пример:</small>
                <div style="margin-top: 8px; word-break: break-all; font-family: monospace; font-size: 13px; color: #636e72;">
                  https://discordapp.com/users/<span style="background: #ff6b6b; color: white; padding: 2px 6px; border-radius: 4px; font-weight: bold;">310459688380792832</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Как узнать чужой Discord ID -->
      <div id="howToGetOtherDiscordId" class="content-section">
        <div class="page-header">
          <h2>👤 Как узнать чужой Discord ID</h2>
          <p>Инструкция по получению Discord ID другого пользователя</p>
        </div>
        
        <div class="form-container" style="max-width: 900px; margin: 0 auto;">
          <div style="padding: 30px;">
            <div style="background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%); padding: 25px; border-radius: 15px; margin-bottom: 30px; box-shadow: 0 8px 20px rgba(88, 101, 242, 0.3);">
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 20px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 28px;">🔍</span>
                <span>Пошаговая инструкция</span>
              </h3>
              <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.7; font-size: 15px;">
                Чтобы создать выговор или добавить пользователя, вам нужен Discord ID другого человека. Следуйте простым шагам ниже.
              </p>
            </div>
            
            <!-- Шаг 1 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #5865F2;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #5865F2 0%, #4752C4 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(88, 101, 242, 0.3);">
                  1
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Включите режим разработчика</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    Откройте <strong>Discord</strong> → нажмите на <strong>⚙️ Настройки пользователя</strong> (шестеренка внизу слева) → перейдите в раздел <strong>"Расширенные"</strong> или <strong>"Advanced"</strong> → включите <strong>"Режим разработчика"</strong> (<strong>"Developer Mode"</strong>).
                  </p>
                  <div style="background: #f0f4ff; padding: 12px 15px; border-radius: 8px; border-left: 3px solid #5865F2;">
                    <small style="color: #5865F2; font-weight: 600;">💡 Подсказка:</small>
                    <small style="color: #5a6c7d; display: block; margin-top: 5px;">Режим разработчика нужно включить только один раз. После этого вы сможете копировать ID любых пользователей, серверов и сообщений.</small>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Шаг 2 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #57F287;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #57F287 0%, #3BA55D 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(87, 242, 135, 0.3);">
                  2
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Найдите нужного пользователя</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    Найдите сообщение нужного пользователя в любом канале Discord, либо откройте список участников сервера (иконка с людьми справа).
                  </p>
                  <div style="background: #f0fff4; padding: 12px 15px; border-radius: 8px; border-left: 3px solid #57F287;">
                    <small style="color: #57F287; font-weight: 600;">✅ Важно:</small>
                    <small style="color: #5a6c7d; display: block; margin-top: 5px;">Вы можете скопировать ID только тех пользователей, которые находятся с вами на одном сервере или которым вы когда-либо писали в личные сообщения.</small>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Шаг 3 -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #FEE75C;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #FEE75C 0%, #ED4245 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(254, 231, 92, 0.4);">
                  3
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Скопируйте Discord ID</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    Нажмите <strong>правой кнопкой мыши</strong> на:
                  </p>
                  <ul style="color: #5a6c7d; line-height: 1.9; margin: 0 0 15px 20px;">
                    <li><strong>Аватар пользователя</strong> в списке участников</li>
                    <li><strong>Имя пользователя</strong> над его сообщением</li>
                    <li><strong>Аватар пользователя</strong> в чате</li>
                  </ul>
                  <p style="color: #5a6c7d; line-height: 1.7; margin-bottom: 15px;">
                    В появившемся меню выберите <strong>"Копировать ID пользователя"</strong> (<strong>"Copy User ID"</strong>).
                  </p>
                  <div style="background: #eef; padding: 15px; border-radius: 10px; border: 2px dashed #667eea; margin-top: 12px;">
                    <div style="font-weight: 600; color: #667eea; margin-bottom: 8px; font-size: 13px;">📋 Пример скопированного ID:</div>
                    <code style="background: white; padding: 10px 15px; border-radius: 8px; display: inline-block; font-size: 16px; color: #2c3e50; font-family: 'Courier New', monospace; letter-spacing: 0.5px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">
                      1043563180061892638
                    </code>
                    <div style="font-size: 12px; color: #999; margin-top: 8px;">Это уникальный идентификатор пользователя из 17-19 цифр</div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Визуальная подсказка -->
            <div style="background: white; border-radius: 15px; padding: 25px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-left: 5px solid #EB459E;">
              <div style="display: flex; align-items: flex-start; gap: 20px;">
                <div style="flex-shrink: 0; width: 45px; height: 45px; background: linear-gradient(135deg, #EB459E 0%, #8B44AC 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 20px; box-shadow: 0 4px 10px rgba(235, 69, 158, 0.3);">
                  📸
                </div>
                <div style="flex: 1;">
                  <h4 style="margin: 0 0 12px 0; color: #2c3e50; font-size: 18px; font-weight: 600;">Визуальная подсказка</h4>
                  <p style="color: #5a6c7d; line-height: 1.7; margin: 0 0 15px 0;">
                    В контекстном меню (при нажатии правой кнопкой) вы увидите пункт <strong>"Копировать ID пользователя"</strong>. Он находится обычно в середине или внизу меню.
                  </p>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; font-family: monospace; font-size: 13px; color: #495057; border: 1px solid #dee2e6;">
                    📱 Профиль<br>
                    🔔 Упомянуть<br>
                    💬 Написать в ЛС<br>
                    ➕ Добавить заметку<br>
                    <span style="background: #fff3cd; padding: 2px 6px; border-radius: 3px; color: #856404; font-weight: bold;">🆔 Копировать ID пользователя</span> ← Этот пункт<br>
                    👮 Модерация<br>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Альтернативные способы -->
            <div style="background: linear-gradient(135deg, #a8e6cf 0%, #3d9970 100%); padding: 25px; border-radius: 15px; box-shadow: 0 4px 15px rgba(61, 153, 112, 0.3);">
              <h4 style="margin: 0 0 15px 0; color: white; font-size: 18px; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🌟</span>
                <span>Альтернативные способы</span>
              </h4>
              
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 12px;">
                <div style="color: white; font-weight: 600; margin-bottom: 8px;">1️⃣ Через профиль пользователя</div>
                <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.6; font-size: 14px;">
                  Нажмите на аватар пользователя → откроется его профиль → нажмите на <strong>три точки</strong> (⋯) → <strong>"Копировать ID пользователя"</strong>.
                </p>
              </div>
              
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px; margin-bottom: 12px;">
                <div style="color: white; font-weight: 600; margin-bottom: 8px;">2️⃣ Через список участников</div>
                <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.6; font-size: 14px;">
                  Откройте список участников сервера (иконка 👥 справа) → найдите нужного пользователя → нажмите правой кнопкой → <strong>"Копировать ID пользователя"</strong>.
                </p>
              </div>
              
              <div style="background: rgba(255,255,255,0.2); padding: 15px; border-radius: 10px;">
                <div style="color: white; font-weight: 600; margin-bottom: 8px;">3️⃣ Через поиск</div>
                <p style="color: rgba(255,255,255,0.95); margin: 0; line-height: 1.6; font-size: 14px;">
                  Используйте поиск Discord (Ctrl+K) → введите имя пользователя → нажмите на результат → нажмите правой кнопкой → <strong>"Копировать ID пользователя"</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- О системе -->
      <div id="about" class="content-section">
        <div class="page-header">
          <h2>ℹ️ О системе</h2>
          <p>Информация о системе учета выговоров SASPA</p>
        </div>
        
        <div class="form-container" style="max-width: 900px; margin: 0 auto;">
          <div style="padding: 30px;">
            <!-- Главный блок -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 35px; border-radius: 20px; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4); text-align: center;">
              <div style="font-size: 60px; margin-bottom: 15px;">📊</div>
              <h3 style="color: white; margin: 0 0 15px 0; font-size: 28px; font-weight: 700;">
                Система управления дисциплинарными взысканиями
              </h3>
              <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; line-height: 1.7;">
                Автоматизированная платформа для учета, контроля и обработки выговоров в структуре SASPA
              </p>
            </div>
            
            <!-- Возможности системы -->
            <div style="background: white; border-radius: 15px; padding: 30px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
              <h4 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="color: #667eea;">🚀</span>
                Возможности системы
              </h4>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px;">
                <div style="padding: 15px; background: #f8f9ff; border-radius: 12px; border-left: 4px solid #5865F2;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">📝 Создание выговоров</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Быстрое и структурированное оформление дисциплинарных взысканий</div>
                </div>
                <div style="padding: 15px; background: #fff5f5; border-radius: 12px; border-left: 4px solid #ED4245;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">⚖️ Обжалование</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Подача и рассмотрение обжалований выговоров</div>
                </div>
                <div style="padding: 15px; background: #f0fff4; border-radius: 12px; border-left: 4px solid #57F287;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">✅ Снятие</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Оформление оплаты или отработки выговоров</div>
                </div>
                <div style="padding: 15px; background: #fffbf0; border-radius: 12px; border-left: 4px solid #FEE75C;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">📊 Статистика</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Детальная аналитика и отчеты по выговорам</div>
                </div>
                <div style="padding: 15px; background: #f5f0ff; border-radius: 12px; border-left: 4px solid #764ba2;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">🔔 Уведомления</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Автоматическая отправка в Discord</div>
                </div>
                <div style="padding: 15px; background: #f0f8ff; border-radius: 12px; border-left: 4px solid #3498db;">
                  <div style="font-weight: 600; color: #2c3e50; margin-bottom: 6px;">👥 Управление</div>
                  <div style="font-size: 14px; color: #5a6c7d; line-height: 1.5;">Система ролей и прав доступа</div>
                </div>
              </div>
            </div>
            
            <!-- Разработчик -->
            <div style="background: white; border-radius: 15px; padding: 30px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
              <h4 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="color: #667eea;">👨‍💻</span>
                Разработчик
              </h4>
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px; border-radius: 12px;">
                <div style="display: flex; align-items: center; gap: 20px; flex-wrap: wrap;">
                  <div style="flex-shrink: 0;">
                    <div style="width: 80px; height: 80px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.2);">
                      🎮
                    </div>
                  </div>
                  <div style="flex: 1; min-width: 250px;">
                    <div style="color: white; font-size: 22px; font-weight: 700; margin-bottom: 8px;">Geralt Rivskii</div>
                    <div style="color: rgba(255,255,255,0.9); font-size: 14px; margin-bottom: 12px;">Разработчик системы управления выговорами</div>
                    <a href="https://discordapp.com/users/310459688380792832" target="_blank" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: white; color: #667eea; text-decoration: none; border-radius: 8px; font-weight: 600; transition: all 0.3s; box-shadow: 0 2px 10px rgba(0,0,0,0.15);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 15px rgba(0,0,0,0.25)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 10px rgba(0,0,0,0.15)';">
                      <span style="font-size: 20px;">💬</span>
                      <span>Связаться в Discord</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Техническая информация -->
            <div style="background: white; border-radius: 15px; padding: 30px; box-shadow: 0 4px 15px rgba(0,0,0,0.08);">
              <h4 style="margin: 0 0 20px 0; color: #2c3e50; font-size: 20px; font-weight: 600; display: flex; align-items: center; gap: 10px;">
                <span style="color: #667eea;">⚙️</span>
                Технологии
              </h4>
              <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                <span style="padding: 8px 16px; background: #e8f5e9; color: #2e7d32; border-radius: 20px; font-size: 14px; font-weight: 600;">Google Apps Script</span>
                <span style="padding: 8px 16px; background: #e3f2fd; color: #1565c0; border-radius: 20px; font-size: 14px; font-weight: 600;">Google Sheets API</span>
                <span style="padding: 8px 16px; background: #f3e5f5; color: #7b1fa2; border-radius: 20px; font-size: 14px; font-weight: 600;">Discord Webhooks</span>
                <span style="padding: 8px 16px; background: #fff3e0; color: #e65100; border-radius: 20px; font-size: 14px; font-weight: 600;">HTML5 / CSS3 / JavaScript</span>
              </div>
              <div style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 10px; border-left: 4px solid #667eea;">
                <div style="font-size: 13px; color: #5a6c7d; line-height: 1.6;">
                  <strong style="color: #2c3e50;">Версия:</strong> 2.0<br>
                  <strong style="color: #2c3e50;">Последнее обновление:</strong> Ноябрь 2025<br>
                  <strong style="color: #2c3e50;">Лицензия:</strong> Проприетарная (для SASPA)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Снятие выговора -->
      <div id="remove" class="content-section">
        <div class="page-header">
          <h2>✅ Снятие выговора</h2>
          <p>Подача заявки на снятие дисциплинарного взыскания</p>
        </div>
        
        <div style="background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%); border-radius: 16px; padding: 30px; box-shadow: 0 8px 30px rgba(76, 175, 80, 0.2); border: 2px solid #4caf50;">
          <form id="removeForm" onsubmit="removeVygovorHandler(event); return false;">
            <div class="form-group" style="margin-bottom: 25px;">
              <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 ID выговора</label>
              <input type="text" id="removeVygovorId" required placeholder="Введите ID выговора для автозаполнения данных" style="padding: 14px; border: 2px solid #4caf50; border-radius: 10px; font-size: 15px; font-family: monospace; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#2e7d32'; this.style.boxShadow='0 0 0 3px rgba(46, 125, 50, 0.1)';" onblur="this.style.borderColor='#4caf50'; this.style.boxShadow='none'; loadVygovorDataForRemoval();">
              <small style="color: #666; font-size: 12px; margin-top: 5px; display: block;">После ввода ID поля ниже заполнятся автоматически</small>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-row">
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">👤 Имя снимающего</label>
                  <input type="text" id="removeUserName" required placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 Discord ID снимающего</label>
                  <input type="text" id="removeUserId" required placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-row">
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">👔 Выдавший</label>
                  <input type="text" id="removeIssuerName" placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
                <div class="form-group">
                  <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">🆔 Discord ID выдающего</label>
                  <input type="text" id="removeIssuerId" placeholder="Заполнится автоматически" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; font-family: monospace; background: #f5f5f5; transition: all 0.3s; width: 100%;" readonly onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                </div>
              </div>
            </div>
            
            <div style="background: white; border-radius: 12px; padding: 20px; margin-bottom: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
              <div class="form-group">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">💰 Тип снятия <span style="color: #dc3545;">*</span></label>
                <select id="removalType" required style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%;" onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
                  <option value="">Выберите тип снятия</option>
                  <option value="Оплата">💰 Оплата</option>
                  <option value="Отработка">⏰ Отработка</option>
                </select>
              </div>
              
              <div class="form-group" style="margin-top: 20px;">
                <label style="font-weight: 600; color: #333; margin-bottom: 10px; display: block; font-size: 14px;">📎 Доказательства <span style="color: #dc3545;">*</span></label>
                <textarea id="removeProof" rows="5" required placeholder="Опишите подробно доказательства снятия выговора (ссылки на скриншоты, видео и т.д.)..." style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; background: white; transition: all 0.3s; width: 100%; resize: vertical;" onfocus="this.style.borderColor='#4caf50'; this.style.boxShadow='0 0 0 3px rgba(76, 175, 80, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
              </div>
            </div>
            
            <div style="text-align: center;">
              <button type="submit" id="removeSubmitBtn" class="btn btn-success" style="padding: 15px 40px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); border: none; border-radius: 12px; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s;" onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.4)'; }" onmouseout="if(!this.disabled) { this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)'; }">
                ✅ Подать заявку на снятие
              </button>
            </div>
          </form>
          
          <div id="removeStatus" style="margin-top: 25px;"></div>
        </div>
      </div>
      
      <!-- Рассмотрение снятия (только для админов) -->
      <div id="reviewRemovals" class="content-section">
        <div class="page-header">
          <h2>📋 Рассмотрение снятия</h2>
          <p>Одобрение или отклонение поданных заявок на снятие выговоров</p>
        </div>
        
        <div id="reviewRemovalsContainer" style="margin-top: 20px;">
          <div style="text-align: center; padding: 40px; color: #666;">
            <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto;"></div>
            <p style="margin-top: 20px;">Загрузка заявок на снятие...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Уведомления -->
  <div id="notification" class="notification"></div>
  
  <script>
    // Переменные для управления запросами
    let isLoading = false;
    let isLoadingDashboard = false;
    let isLoadingVygovoryList = false;
    let loadDashboardTimeout = null;
    let loadVygovoryListTimeout = null;
    let userAccess = null; // Информация о доступе пользователя
    let sessionToken = null; // Токен сессии
    
    // Система управления запросами для предотвращения 429
    let requestQueue = [];
    let isProcessingQueue = false;
    let lastRequestTime = 0;
    const MIN_REQUEST_INTERVAL = 2000; // Минимальный интервал между запросами (2 секунды)
    const REQUEST_CACHE = {}; // Кэш результатов запросов
    const CACHE_TTL = 30000; // Время жизни кэша (30 секунд)
    
    // Добавить запрос в очередь (для google.script.run)
    function queueRequest(requestFn, cacheKey) {
      // Проверяем кэш
      if (cacheKey && REQUEST_CACHE[cacheKey]) {
        const cached = REQUEST_CACHE[cacheKey];
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          // Возвращаем кэшированный результат, но все равно выполняем обработчики
          const result = cached.data;
          // Вызываем функцию и применяем обработчики к кэшированным данным
          const requestObj = requestFn();
          if (requestObj && requestObj.withSuccessHandler) {
            requestObj.withSuccessHandler(function(data) {
              // Уже обработано из кэша
            }).withFailureHandler(function(error) {
              // Игнорируем ошибки для кэшированных данных
            });
            // Применяем обработчики к кэшированным данным
            setTimeout(function() {
              if (requestObj.withSuccessHandler) {
                requestObj.withSuccessHandler(result);
              }
            }, 0);
          }
          return;
        }
      }
      
      // Добавляем в очередь
      requestQueue.push({
        fn: requestFn,
        cacheKey: cacheKey
      });
      processQueue();
    }
    
    // Обработка очереди запросов
    function processQueue() {
      if (isProcessingQueue || requestQueue.length === 0) {
        return;
      }
      
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        // Ждем перед следующим запросом
        setTimeout(processQueue, MIN_REQUEST_INTERVAL - timeSinceLastRequest);
        return;
      }
      
      isProcessingQueue = true;
      const request = requestQueue.shift();
      
      lastRequestTime = Date.now();
      
      try {
        const requestObj = request.fn();
        
        // google.script.run возвращает объект с методами withSuccessHandler/withFailureHandler
        if (requestObj && requestObj.withSuccessHandler) {
          // Сохраняем оригинальные обработчики
          const originalSuccess = requestObj._originalSuccessHandler;
          const originalFailure = requestObj._originalFailureHandler;
          
          // Переопределяем обработчики для сохранения в кэш и обработки очереди
          requestObj
            .withSuccessHandler(function(data) {
              // Сохраняем в кэш
              if (request.cacheKey) {
                REQUEST_CACHE[request.cacheKey] = {
                  data: data,
                  timestamp: Date.now()
                };
              }
              
              // Вызываем оригинальный обработчик, если есть
              if (originalSuccess) {
                originalSuccess(data);
              }
              
              // Обрабатываем следующий запрос
              isProcessingQueue = false;
              setTimeout(processQueue, MIN_REQUEST_INTERVAL);
            })
            .withFailureHandler(function(error) {
              // Вызываем оригинальный обработчик, если есть
              if (originalFailure) {
                originalFailure(error);
              }
              
              // Обрабатываем следующий запрос даже при ошибке
              isProcessingQueue = false;
              setTimeout(processQueue, MIN_REQUEST_INTERVAL);
            });
        } else {
          // Если не google.script.run объект, сразу обрабатываем следующий
          isProcessingQueue = false;
          setTimeout(processQueue, MIN_REQUEST_INTERVAL);
        }
      } catch (error) {
        isProcessingQueue = false;
        setTimeout(processQueue, MIN_REQUEST_INTERVAL);
      }
    }
    
    // Очистка кэша
    function clearCache() {
      Object.keys(REQUEST_CACHE).forEach(key => {
        const cached = REQUEST_CACHE[key];
        if (Date.now() - cached.timestamp >= CACHE_TTL) {
          delete REQUEST_CACHE[key];
        }
      });
    }
    
    // Очистка кэша каждые 30 секунд
    setInterval(clearCache, 30000);
    
    // Инициализация переменных для совместимости
    if (typeof isLoadingDashboard === 'undefined') {
      isLoadingDashboard = false;
    }
    if (typeof isLoadingVygovoryList === 'undefined') {
      isLoadingVygovoryList = false;
    }
    
    // Получить токен сессии из localStorage
    function getSessionToken() {
      if (!sessionToken) {
        sessionToken = localStorage.getItem('vygovory_session_token');
      }
      return sessionToken;
    }
    
    // Сохранить токен сессии в localStorage
    function setSessionToken(token) {
      sessionToken = token;
      if (token) {
        localStorage.setItem('vygovory_session_token', token);
      } else {
        localStorage.removeItem('vygovory_session_token');
      }
    }
    
    // Автоматическое продление сессии
    let sessionRenewalInterval = null;
    
    function startSessionRenewal() {
      // Останавливаем предыдущий интервал, если есть
      if (sessionRenewalInterval) {
        clearInterval(sessionRenewalInterval);
      }
      
      // Продлеваем сессию каждые 15 минут
      sessionRenewalInterval = setInterval(function() {
        const token = getSessionToken();
        if (token) {
          google.script.run
            .withSuccessHandler(function(result) {
              if (result && result.success) {
                console.log('Сессия продлена до:', result.expirationDate);
              } else {
                console.warn('Не удалось продлить сессию:', result);
                // Если сессия не может быть продлена, останавливаем попытки
                stopSessionRenewal();
              }
            })
            .withFailureHandler(function(error) {
              console.error('Ошибка продления сессии:', error);
            })
            .renewSession(token);
        } else {
          // Нет токена - останавливаем продление
          stopSessionRenewal();
        }
      }, 15 * 60 * 1000); // 15 минут
    }
    
    function stopSessionRenewal() {
      if (sessionRenewalInterval) {
        clearInterval(sessionRenewalInterval);
        sessionRenewalInterval = null;
      }
    }
    
    // Функция показа/скрытия пароля
    function togglePasswordVisibility(inputId, buttonId) {
      const input = document.getElementById(inputId);
      const button = document.getElementById(buttonId);
      if (input && button) {
        if (input.type === 'password') {
          input.type = 'text';
          button.textContent = '🙈';
        } else {
          input.type = 'password';
          button.textContent = '👁️';
        }
      }
    }
    
    // Глобальная обработка ошибок для отладки
    window.addEventListener('error', function(event) {
      console.error('Глобальная ошибка:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      });
    });
    
    window.addEventListener('unhandledrejection', function(event) {
      console.error('Необработанное обещание:', event.reason);
    });
    
    // Инициализация
    document.addEventListener('DOMContentLoaded', function() {
      sessionToken = getSessionToken();
      
      // Установить сегодняшнюю дату по умолчанию
      const dateInput = document.getElementById('date');
      if (dateInput) {
        const today = new Date();
        dateInput.value = today.toISOString().split('T')[0];
      }
      
      // Проверить, есть ли пользователи в системе
      checkSystemInitialized();
      
      // Восстановить активную секцию из localStorage (но пока не показываем защищенные)
      const savedSection = getSavedActiveSection();
      const protectedSections = ['create', 'users', 'remove', 'requests', 'reviewAppeals', 'reviewRemovals'];
      const isProtectedSection = savedSection && protectedSections.includes(savedSection);
      
      // Проверить доступ пользователя (если есть токен)
      if (sessionToken) {
        // Показываем индикатор загрузки при проверке токена
        showAuthCheckIndicator();
        // Передаем сохраненную секцию для восстановления после проверки доступа
        checkAccessAndUpdateUI(savedSection);
      } else {
        // Нет токена - скрываем защищенные пункты, но разрешаем просмотр публичных
        hideProtectedMenuItems();
        
        // Если сохраненная секция не защищена - показываем её
        if (savedSection && !isProtectedSection) {
          const targetSection = document.getElementById(savedSection);
          if (targetSection) {
            showSection(savedSection);
          } else {
            showSection('dashboard');
          }
        } else {
          // Защищенная секция без токена - показываем дашборд
          showSection('dashboard');
        }
      }
    });
    
    // Проверка инициализации системы
    function checkSystemInitialized() {
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result || !result.initialized) {
            // Показываем форму создания первого супер-админа
            showSuperAdminSetup();
          }
        })
        .withFailureHandler(function(error) {
          console.error('Ошибка проверки инициализации:', error);
        })
        .checkSystemInitialized();
    }
    
    // Показать форму создания супер-админа
    function showSuperAdminSetup() {
      const mainContent = document.querySelector('.main-content');
      if (mainContent) {
        mainContent.innerHTML = \`
          <div class="form-container" style="max-width: 500px; margin: 50px auto;">
            <h2 style="text-align: center; margin-bottom: 30px;">🔐 Настройка системы</h2>
            <p style="text-align: center; margin-bottom: 30px; color: #666;">
              Создайте первого супер-администратора для управления системой
            </p>
            <form id="superAdminForm" onsubmit="createSuperAdminHandler(event); return false;">
              <div class="form-group">
                <label>Логин</label>
                <input type="text" id="superAdminLogin" required placeholder="Введите логин">
              </div>
              <div class="form-group">
                <label>Пароль</label>
                <input type="password" id="superAdminPassword" required placeholder="Введите сложный пароль" minlength="8">
                <small style="color: #666; font-size: 12px;">Минимум 8 символов, рекомендуем использовать буквы, цифры и символы</small>
              </div>
              <div class="form-group">
                <label>Имя</label>
                <input type="text" id="superAdminName" placeholder="Имя Фамилия (необязательно)">
              </div>
              <div class="form-group">
                <label>Discord ID</label>
                <input type="text" id="superAdminDiscordId" placeholder="Ваш Discord ID (необязательно)">
              </div>
              <button type="submit" class="btn btn-primary" style="width: 100%;">Создать супер-администратора</button>
            </form>
            <div id="superAdminStatus" style="margin-top: 20px;"></div>
          </div>
        \`;
      }
    }
    
    // Обработчик создания супер-админа
    function createSuperAdminHandler(event) {
      event.preventDefault();
      
      const login = document.getElementById('superAdminLogin').value;
      const password = document.getElementById('superAdminPassword').value;
      const name = document.getElementById('superAdminName').value;
      const discordId = document.getElementById('superAdminDiscordId').value;
      
      if (password.length < 8) {
        const statusDiv = document.getElementById('superAdminStatus');
        statusDiv.innerHTML = '<div style="padding: 15px; background: #f8d7da; color: #721c24; border-radius: 5px;">❌ Пароль должен содержать минимум 8 символов</div>';
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          const statusDiv = document.getElementById('superAdminStatus');
          if (result && result.success) {
            statusDiv.innerHTML = '<div style="padding: 15px; background: #d4edda; color: #155724; border-radius: 5px;">✅ Супер-администратор создан! Теперь вы можете войти в систему.</div>';
            setTimeout(function() {
              showLoginForm();
            }, 2000);
          } else {
            statusDiv.innerHTML = '<div style="padding: 15px; background: #f8d7da; color: #721c24; border-radius: 5px;">❌ Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка') + '</div>';
          }
        })
        .withFailureHandler(function(error) {
          const statusDiv = document.getElementById('superAdminStatus');
          statusDiv.innerHTML = '<div style="padding: 15px; background: #f8d7da; color: #721c24; border-radius: 5px;">❌ Ошибка: ' + error.message + '</div>';
        })
        .createSuperAdmin(login, password, name, discordId);
    }
    
    // Показать форму входа
    function showLoginForm() {
      const loginSection = document.getElementById('loginSection');
      if (!loginSection) {
        // Добавляем секцию входа в конец body, если её нет
        const body = document.body;
        const loginDiv = document.createElement('div');
        loginDiv.id = 'loginSection';
        loginDiv.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px;';
        loginDiv.innerHTML = \`
          <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 450px; width: 100%; position: relative; overflow: hidden;">
            <!-- Закрытие -->
            <button onclick="hideLoginForm();" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.2)'; this.style.color='#333'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(0,0,0,0.1)'; this.style.color='#666'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
            
            <!-- Градиентный заголовок -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; color: white;">
              <div style="font-size: 56px; margin-bottom: 15px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🔐</div>
              <h2 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Вход в систему</h2>
              <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Система управления выговорами</p>
            </div>
            
            <!-- Форма -->
            <div style="padding: 40px 30px;">
              <form id="loginForm" onsubmit="loginHandler(event); return false;">
                <div style="margin-bottom: 25px;">
                  <label style="display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">👤 Логин</label>
                  <input type="text" id="loginUsername" required placeholder="Введите ваш логин" style="width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: #f8f9fa; transition: all 0.3s; box-sizing: border-box; outline: none;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'; this.style.background='white';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'; this.style.background='#f8f9fa';">
                </div>
                
                <div style="margin-bottom: 30px;">
                  <label style="display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">🔒 Пароль</label>
                  <div style="position: relative;">
                    <input type="password" id="loginPassword" required placeholder="Введите ваш пароль" style="width: 100%; padding: 14px 50px 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: #f8f9fa; transition: all 0.3s; box-sizing: border-box; outline: none;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 4px rgba(102, 126, 234, 0.1)'; this.style.background='white';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'; this.style.background='#f8f9fa';">
                    <button type="button" onclick="togglePasswordVisibility('loginPassword', 'toggleLoginPassword')" id="toggleLoginPassword" style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 20px; color: #666; padding: 5px; transition: color 0.3s;" onmouseover="this.style.color='#667eea';" onmouseout="this.style.color='#666';" title="Показать/скрыть пароль">👁️</button>
                  </div>
                </div>
                
                <button type="submit" id="loginSubmitBtn" class="btn btn-primary" style="width: 100%; padding: 16px; font-size: 16px; font-weight: 600; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: none; border-radius: 12px; color: white; cursor: pointer; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s;" onmouseover="if(!this.disabled) { this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(102, 126, 234, 0.5)'; }" onmouseout="if(!this.disabled) { this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(102, 126, 234, 0.4)'; }">
                  🚀 Войти
                </button>
              </form>
              
              <div id="loginStatus" style="margin-top: 20px;"></div>
              
              <div style="margin-top: 30px; padding-top: 25px; border-top: 2px solid #f0f0f0; text-align: center;">
                <p style="font-size: 13px; color: #666; margin-bottom: 15px; line-height: 1.6;">
                  Нет доступа?<br>
                  <a href="#" onclick="showRequestAccessFromLogin(); return false;" style="color: #667eea; text-decoration: none; font-weight: 600; border-bottom: 2px solid transparent; transition: all 0.3s;" onmouseover="this.style.borderBottomColor='#667eea';" onmouseout="this.style.borderBottomColor='transparent';">Запросить доступ у Старшего состава</a>
                </p>
                <button onclick="hideLoginForm();" class="btn btn-secondary" style="width: 100%; padding: 12px; margin-top: 10px; background: transparent; border: 2px solid #e0e0e0; border-radius: 10px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#667eea'; this.style.color='#667eea'; this.style.background='#f8f9fa';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#666'; this.style.background='transparent';">Продолжить без входа</button>
              </div>
            </div>
          </div>
        \`;
        body.appendChild(loginDiv);
        
        // Закрытие по клику вне формы
        loginDiv.addEventListener('click', function(e) {
          if (e.target === loginDiv) {
            hideLoginForm();
          }
        });
      } else {
        loginSection.style.display = 'flex';
      }
    }
    
    // Скрыть форму входа
    function hideLoginForm() {
      const loginSection = document.getElementById('loginSection');
      if (loginSection) {
        loginSection.style.display = 'none';
      }
    }
    
    // Показать форму запроса доступа из формы входа
    function showRequestAccessFromLogin() {
      hideLoginForm();
      showSection('requestAccess');
    }
    
    // Обработчик входа
    function loginHandler(event) {
      event.preventDefault();
      
      const login = document.getElementById('loginUsername').value.trim();
      const password = document.getElementById('loginPassword').value;
      const submitButton = document.getElementById('loginSubmitBtn');
      const loginStatus = document.getElementById('loginStatus');
      
      if (!login || !password) {
        if (loginStatus) {
          loginStatus.innerHTML = \`
            <div style="padding: 12px; background: #fff3cd; color: #856404; border-radius: 10px; border: 2px solid #ffc107; text-align: center; font-size: 14px;">
              ⚠️ Заполните все поля
            </div>
          \`;
        }
        return;
      }
      
      // Сохраняем оригинальный текст кнопки
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      
      // Показываем индикатор загрузки
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
        submitButton.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Вход...</span>';
      }
      
      // Очищаем статус
      if (loginStatus) {
        loginStatus.innerHTML = '';
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          if (result && result.success) {
            setSessionToken(result.sessionToken);
            sessionToken = result.sessionToken;
            hideLoginForm();
            checkAccessAndUpdateUI();
            showNotification('Вход выполнен успешно!', 'success');
            
            // Запускаем автоматическое продление сессии
            startSessionRenewal();
            // Если был открыт защищенный раздел, остаемся на нем, иначе возвращаемся на дашборд
            const currentSection = document.querySelector('.content-section.active');
            if (!currentSection || currentSection.id === 'requestAccess') {
              showSection('dashboard');
            }
          } else {
            if (loginStatus) {
              loginStatus.innerHTML = \`
                <div style="padding: 15px; background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); color: #721c24; border-radius: 12px; border: 2px solid #dc3545; font-size: 14px; text-align: center;">
                  <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 5px;">
                    <span style="font-size: 20px;">❌</span>
                    <strong>Ошибка входа</strong>
                  </div>
                  <p style="margin: 0; font-size: 13px;">\${(result && result.error) || 'Неверный логин или пароль'}</p>
                </div>
              \`;
            }
          }
        })
        .withFailureHandler(function(error) {
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          if (loginStatus) {
            loginStatus.innerHTML = \`
              <div style="padding: 15px; background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); color: #721c24; border-radius: 12px; border: 2px solid #dc3545; font-size: 14px; text-align: center;">
                <div style="display: flex; align-items: center; justify-content: center; gap: 8px; margin-bottom: 5px;">
                  <span style="font-size: 20px;">❌</span>
                  <strong>Ошибка подключения</strong>
                </div>
                <p style="margin: 0; font-size: 13px;">\${error.message || 'Не удалось подключиться к серверу. Проверьте интернет и попробуйте снова.'}</p>
              </div>
            \`;
          }
        })
        .loginUser(login, password);
    }
    
    // Выход из системы
    function logoutUser() {
      const token = getSessionToken();
      if (token) {
        // Останавливаем автоматическое продление сессии
        stopSessionRenewal();
        
        google.script.run
          .withSuccessHandler(function(result) {
            setSessionToken(null);
            sessionToken = null;
            userAccess = null;
            
            // Удаляем бейдж пользователя
            const userBadge = document.getElementById('userRoleBadge');
            if (userBadge) {
              userBadge.remove();
            }
            
            // Скрываем кнопку выхода
            const logoutMenuItem = document.getElementById('logoutMenuItem');
            if (logoutMenuItem) {
              logoutMenuItem.style.display = 'none';
            }
            
            // Показываем кнопку входа
            const loginMenuItem = document.getElementById('loginMenuItem');
            if (loginMenuItem) {
              loginMenuItem.style.display = 'flex';
            }
            
            // Обновляем UI
            document.querySelectorAll('.menu-item.protected').forEach(item => {
              item.style.display = 'none';
            });
            document.querySelectorAll('.menu-item.admin-only').forEach(item => {
              item.style.display = 'none';
            });
            hideProtectedMenuItems();
            
            // Если был открыт защищенный раздел, переключаемся на дашборд
            const currentSection = document.querySelector('.content-section.active');
            if (currentSection && (currentSection.id === 'create' || currentSection.id === 'users' || currentSection.id === 'remove' || currentSection.id === 'requests' || currentSection.id === 'logs')) {
              showSection('dashboard');
            }
            
            showNotification('Выход выполнен', 'success');
          })
          .logoutUser(token);
      }
    }
    
    // Скрыть защищенные пункты меню
    function hideProtectedMenuItems() {
      document.querySelectorAll('.menu-item.protected').forEach(item => {
        item.style.display = 'none';
      });
      document.querySelectorAll('.menu-item.admin-only').forEach(item => {
        item.style.display = 'none';
      });
      // Скрываем заголовок раздела для старшего состава
      const adminHeader = document.getElementById('adminSectionHeader');
      if (adminHeader) {
        adminHeader.style.display = 'none';
      }
      // Показываем пункт "Запросить доступ" если не авторизованы
      document.querySelectorAll('.menu-item').forEach(item => {
        if (item.textContent.includes('Запросить доступ')) {
          item.style.display = 'flex';
        }
      });
      // Показываем кнопку входа, скрываем выход
      const loginItem = document.getElementById('loginMenuItem');
      const logoutItem = document.getElementById('logoutMenuItem');
      if (loginItem) loginItem.style.display = 'flex';
      if (logoutItem) logoutItem.style.display = 'none';
    }
    
    // Проверка доступа и обновление UI
    // Показать индикатор проверки авторизации
    function showAuthCheckIndicator() {
      // Проверяем, не существует ли уже индикатор
      let indicator = document.getElementById('authCheckIndicator');
      if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'authCheckIndicator';
        indicator.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(102, 126, 234, 0.95); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
        indicator.innerHTML = \`
          <div style="background: white; padding: 40px 50px; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); text-align: center; max-width: 400px; width: 90%;">
            <div class="spinner" style="width: 50px; height: 50px; border-width: 4px; border-color: #667eea; border-top-color: transparent; margin: 0 auto 20px;"></div>
            <h3 style="margin: 0 0 10px 0; color: #333; font-size: 20px; font-weight: 600;">Проверка авторизации...</h3>
            <p style="margin: 0; color: #666; font-size: 14px;">Пожалуйста, подождите</p>
          </div>
        \`;
        document.body.appendChild(indicator);
      } else {
        indicator.style.display = 'flex';
      }
    }
    
    // Скрыть индикатор проверки авторизации
    function hideAuthCheckIndicator() {
      const indicator = document.getElementById('authCheckIndicator');
      if (indicator) {
        indicator.style.display = 'none';
      }
    }
    
    function checkAccessAndUpdateUI(savedSectionToRestore) {
      const token = getSessionToken();
      if (!token) {
        hideProtectedMenuItems();
        hideAuthCheckIndicator();
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          userAccess = result;
          
          // Скрываем индикатор проверки после получения результата
          hideAuthCheckIndicator();
          
          if (result && result.hasAccess) {
            hideLoginForm();
            
            // Запускаем автоматическое продление сессии
            startSessionRenewal();
            
            // Показываем защищенные пункты меню
            document.querySelectorAll('.menu-item.protected').forEach(item => {
              const onclickAttr = item.getAttribute('onclick');
              
              // Для пунктов "Пользователи" и "Логи" проверяем роль админа
              if (onclickAttr && (onclickAttr.includes("showSection('users')") || onclickAttr.includes("showSection('logs')"))) {
                // Показываем только для админов и супер-админов
                if (result.role === 'Админ' || result.role === 'Супер-админ') {
                  item.style.display = 'flex';
                } else {
                  item.style.display = 'none';
                }
              } else {
                item.style.display = 'flex';
              }
            });
            
            // Показываем заголовок раздела для старшего состава
            const adminHeader = document.getElementById('adminSectionHeader');
            if (adminHeader) {
              adminHeader.style.display = 'block';
            }
            
            // Обновляем счетчик обжалований при показе меню
            setTimeout(function() {
              updateAppealsCounter();
            }, 500);
            
            // Если супер-админ, показываем управление доступом
            if (result.role === 'Супер-админ') {
              document.querySelectorAll('.menu-item.admin-only').forEach(item => {
                item.style.display = 'flex';
              });
            }
            
            // Скрываем пункт "Запросить доступ"
            document.querySelectorAll('.menu-item').forEach(item => {
              if (item.textContent.includes('Запросить доступ')) {
                item.style.display = 'none';
              }
            });
            
            // Скрываем кнопку входа, показываем выход
            const loginItem = document.getElementById('loginMenuItem');
            const logoutItem = document.getElementById('logoutMenuItem');
            if (loginItem) loginItem.style.display = 'none';
            if (logoutItem) logoutItem.style.display = 'flex';
            
            // Добавляем информацию о пользователе
            updateUserInfo(result.userInfo);
            
            // Обновляем счетчики с задержкой, чтобы избежать одновременных запросов
            setTimeout(function() {
              updateAppealsCounter();
            }, 500);
            setTimeout(function() {
              updateRemovalsCounter();
            }, 2500);
            setTimeout(function() {
              updateRequestsCounter();
            }, 4500);
            
            // Восстанавливаем активную секцию после успешной проверки доступа
            const sectionToShow = savedSectionToRestore || getSavedActiveSection();
            if (sectionToShow) {
              const protectedSections = ['create', 'users', 'remove', 'requests', 'reviewAppeals', 'reviewRemovals'];
              const targetSection = document.getElementById(sectionToShow);
              
              if (targetSection) {
                // Проверяем доступ для защищенных секций
                if (protectedSections.includes(sectionToShow)) {
                  // Проверяем права доступа
                  if (sectionToShow === 'requests') {
                    // Для управления доступом нужна роль Супер-админ
                    if (result.role === 'Супер-админ') {
                      showSection(sectionToShow);
                    } else {
                      showSection('dashboard');
                    }
                  } else {
                    // Для остальных защищенных секций достаточно иметь доступ
                    if (result.hasAccess) {
                      showSection(sectionToShow);
                    } else {
                      showSection('dashboard');
                    }
                  }
                } else {
                  // Публичная секция - показываем сразу
                  showSection(sectionToShow);
                }
              } else {
                // Секция не найдена - показываем дашборд
                showSection('dashboard');
              }
            } else {
              // Нет сохраненной секции - показываем дашборд
              showSection('dashboard');
            }
          } else {
            // Не авторизован - скрываем защищенные пункты
            hideProtectedMenuItems();
            // Если была попытка открыть защищенную секцию - показываем дашборд
            if (savedSectionToRestore) {
              const protectedSections = ['create', 'users', 'remove', 'requests', 'reviewAppeals', 'reviewRemovals'];
              if (protectedSections.includes(savedSectionToRestore)) {
                showSection('dashboard');
              } else {
                showSection(savedSectionToRestore);
              }
            } else {
              showSection('dashboard');
            }
          }
        })
        .withFailureHandler(function(error) {
          console.error('Ошибка проверки доступа:', error);
          // Скрываем индикатор при ошибке
          hideAuthCheckIndicator();
          // При ошибке просто скрываем защищенные пункты
          hideProtectedMenuItems();
          // Показываем дашборд при ошибке
          showSection('dashboard');
        })
        .checkUserAccess(token);
    }
    
    // Обновление информации о пользователе в интерфейсе
    function updateUserInfo(userInfo) {
      if (userInfo) {
        // Можно добавить отображение текущего пользователя в шапке
        const sidebarHeader = document.querySelector('.sidebar-header');
        if (sidebarHeader && userInfo.name) {
          // Проверяем, не добавлен ли уже бейдж пользователя
          let existingBadge = document.getElementById('userRoleBadge');
          if (existingBadge) {
            // Обновляем существующий бейдж
            existingBadge.textContent = '👤 ' + userInfo.name;
          } else {
            // Создаем новый бейдж
          const userBadge = document.createElement('div');
            userBadge.id = 'userRoleBadge';
          userBadge.style.cssText = 'margin-top: 10px; padding: 5px; background: rgba(255,255,255,0.1); border-radius: 5px; font-size: 11px;';
          userBadge.textContent = '👤 ' + userInfo.name;
          sidebarHeader.appendChild(userBadge);
          }
        }
      }
    }
    
    // Debounce для счетчика обжалований
    let appealsCounterUpdateTimeout = null;
    let appealsCounterUpdateInProgress = false;
    let appealsCounterLastUpdate = 0;
    const COUNTER_UPDATE_INTERVAL = 10000; // Минимум 10 секунд между обновлениями счетчиков
    
    // Обновление счетчика обжалований в меню
    function updateAppealsCounter() {
      // Очищаем предыдущий таймер
      if (appealsCounterUpdateTimeout) {
        clearTimeout(appealsCounterUpdateTimeout);
      }
      
      // Откладываем выполнение на 2000ms (увеличено для предотвращения 429)
      appealsCounterUpdateTimeout = setTimeout(function() {
        updateAppealsCounterNow();
      }, 2000);
    }
    
    function updateAppealsCounterNow() {
      // Проверяем, не выполняется ли уже обновление
      if (appealsCounterUpdateInProgress) {
        return;
      }
      
      // Проверяем интервал с последнего обновления
      const now = Date.now();
      if (now - appealsCounterLastUpdate < COUNTER_UPDATE_INTERVAL) {
        return;
      }
      
      const badge = document.getElementById('appealsCounterBadge');
      const menuItem = document.getElementById('reviewAppealsMenuItem');
      
      if (!badge || !menuItem) return;
      
      // Показываем badge только если меню видимо
      if (menuItem.style.display === 'none') {
        badge.style.display = 'none';
        return;
      }
      
      const token = getSessionToken();
      if (!token) {
        badge.style.display = 'none';
        return;
      }
      
      appealsCounterUpdateInProgress = true;
      appealsCounterLastUpdate = now;
      
      // Показываем индикатор загрузки
      badge.style.display = 'inline-block';
      badge.style.opacity = '0.7';
      badge.innerHTML = '<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>';
      
      const cacheKey = 'appealsCounter_' + token;
      
      // Проверяем кэш перед добавлением в очередь
      if (REQUEST_CACHE[cacheKey]) {
        const cached = REQUEST_CACHE[cacheKey];
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          const result = cached.data;
          appealsCounterUpdateInProgress = false;
          
          if (result && result.success && typeof result.count !== 'undefined') {
            const count = result.count;
            
            if (count > 0) {
              badge.textContent = count;
              badge.style.display = 'inline-block';
              badge.style.opacity = '1';
              badge.style.animation = 'pulse-badge 2s ease-in-out infinite';
            } else {
              badge.textContent = '0';
              badge.style.display = 'inline-block';
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
          return;
        }
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          appealsCounterUpdateInProgress = false;
          
          // Сохраняем в кэш
          REQUEST_CACHE[cacheKey] = {
            data: result,
            timestamp: Date.now()
          };
          
          if (result && result.success && typeof result.count !== 'undefined') {
            const count = result.count;
            
            if (count > 0) {
              badge.textContent = count;
              badge.style.display = 'inline-block';
              badge.style.opacity = '1';
              badge.style.animation = 'pulse-badge 2s ease-in-out infinite';
            } else {
              badge.textContent = '0';
              badge.style.display = 'inline-block';
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
        })
        .withFailureHandler(function(error) {
          appealsCounterUpdateInProgress = false;
          
          // Тихая обработка ошибок 429 (Too Many Requests)
          if (error && error.message && error.message.includes('429')) {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
            return;
          }
          
          badge.style.display = 'inline-block';
          badge.style.opacity = '0.5';
          badge.textContent = '?';
          badge.style.animation = 'none';
        })
        .getPendingAppealsCount(token);
    }
    
    // Debounce для счетчика заявок на снятие
    let removalsCounterUpdateTimeout = null;
    let removalsCounterUpdateInProgress = false;
    let removalsCounterLastUpdate = 0;
    
    // Обновление счетчика заявок на снятие в меню
    function updateRemovalsCounter() {
      // Очищаем предыдущий таймер
      if (removalsCounterUpdateTimeout) {
        clearTimeout(removalsCounterUpdateTimeout);
      }
      
      // Откладываем выполнение на 2000ms (увеличено для предотвращения 429)
      removalsCounterUpdateTimeout = setTimeout(function() {
        updateRemovalsCounterNow();
      }, 2000);
    }
    
    function updateRemovalsCounterNow() {
      // Проверяем, не выполняется ли уже обновление
      if (removalsCounterUpdateInProgress) {
        return;
      }
      
      // Проверяем интервал с последнего обновления
      const now = Date.now();
      if (now - removalsCounterLastUpdate < COUNTER_UPDATE_INTERVAL) {
        return;
      }
      
      const badge = document.getElementById('removalsCounterBadge');
      const menuItem = document.getElementById('reviewRemovalsMenuItem');
      
      if (!badge || !menuItem) return;
      
      // Показываем badge только если меню видимо
      if (menuItem.style.display === 'none') {
        badge.style.display = 'none';
        return;
      }
      
      const token = getSessionToken();
      if (!token) {
        badge.style.display = 'none';
        return;
      }
      
      removalsCounterUpdateInProgress = true;
      removalsCounterLastUpdate = now;
      
      // Показываем индикатор загрузки
      badge.style.display = 'inline-block';
      badge.style.opacity = '0.7';
      badge.innerHTML = '<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>';
      
      const cacheKey = 'removalsCounter_' + token;
      
      // Проверяем кэш перед добавлением в очередь
      if (REQUEST_CACHE[cacheKey]) {
        const cached = REQUEST_CACHE[cacheKey];
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          const result = cached.data;
          removalsCounterUpdateInProgress = false;
          
          if (result && result.success) {
            const count = result.count || 0;
            badge.textContent = count.toString();
            badge.style.display = 'inline-block';
            if (count > 0) {
              badge.style.opacity = '1';
              badge.style.animation = 'pulse 2s infinite';
            } else {
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
          return;
        }
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          removalsCounterUpdateInProgress = false;
          
          // Сохраняем в кэш
          REQUEST_CACHE[cacheKey] = {
            data: result,
            timestamp: Date.now()
          };
          
          if (result && result.success) {
            const count = result.count || 0;
            badge.textContent = count.toString();
            badge.style.display = 'inline-block';
            if (count > 0) {
              badge.style.opacity = '1';
              badge.style.animation = 'pulse 2s infinite';
            } else {
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
        })
        .withFailureHandler(function(error) {
          removalsCounterUpdateInProgress = false;
          
          // Тихая обработка ошибок 429 (Too Many Requests)
          if (error && error.message && error.message.includes('429')) {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
            return;
          }
          
          badge.style.display = 'inline-block';
          badge.style.opacity = '0.5';
          badge.textContent = '?';
          badge.style.animation = 'none';
        })
        .getPendingRemovalsCount(token);
    }
    
    // Debounce для счетчика запросов на доступ
    let requestsCounterUpdateTimeout = null;
    let requestsCounterUpdateInProgress = false;
    let requestsCounterLastUpdate = 0;
    
    // Обновление счетчика запросов на доступ в меню
    function updateRequestsCounter() {
      // Очищаем предыдущий таймер
      if (requestsCounterUpdateTimeout) {
        clearTimeout(requestsCounterUpdateTimeout);
      }
      
      // Откладываем выполнение на 2000ms (увеличено для предотвращения 429)
      requestsCounterUpdateTimeout = setTimeout(function() {
        updateRequestsCounterNow();
      }, 2000);
    }
    
    function updateRequestsCounterNow() {
      // Проверяем, не выполняется ли уже обновление
      if (requestsCounterUpdateInProgress) {
        return;
      }
      
      // Проверяем интервал с последнего обновления
      const now = Date.now();
      if (now - requestsCounterLastUpdate < COUNTER_UPDATE_INTERVAL) {
        return;
      }
      
      const badge = document.getElementById('requestsCounterBadge');
      const menuItem = document.getElementById('requestsMenuItem');
      
      if (!badge || !menuItem) return;
      
      // Показываем badge только если меню видимо
      if (menuItem.style.display === 'none') {
        badge.style.display = 'none';
        return;
      }
      
      const token = getSessionToken();
      if (!token) {
        badge.style.display = 'none';
        return;
      }
      
      requestsCounterUpdateInProgress = true;
      requestsCounterLastUpdate = now;
      
      // Показываем индикатор загрузки
      badge.style.display = 'inline-block';
      badge.style.opacity = '0.7';
      badge.innerHTML = '<span class="spinner" style="width: 12px; height: 12px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle;"></span>';
      
      const cacheKey = 'requestsCounter_' + token;
      
      // Проверяем кэш перед добавлением в очередь
      if (REQUEST_CACHE[cacheKey]) {
        const cached = REQUEST_CACHE[cacheKey];
        if (Date.now() - cached.timestamp < CACHE_TTL) {
          const result = cached.data;
          requestsCounterUpdateInProgress = false;
          
          if (result && result.success) {
            const count = result.count || 0;
            badge.textContent = count.toString();
            badge.style.display = 'inline-block';
            if (count > 0) {
              badge.style.opacity = '1';
              badge.style.animation = 'pulse 2s infinite';
            } else {
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
          return;
        }
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          requestsCounterUpdateInProgress = false;
          
          // Сохраняем в кэш
          REQUEST_CACHE[cacheKey] = {
            data: result,
            timestamp: Date.now()
          };
          
          if (result && result.success) {
            const count = result.count || 0;
            badge.textContent = count.toString();
            badge.style.display = 'inline-block';
            if (count > 0) {
              badge.style.opacity = '1';
              badge.style.animation = 'pulse 2s infinite';
            } else {
              badge.style.opacity = '0.5';
              badge.style.animation = 'none';
            }
          } else {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
          }
        })
        .withFailureHandler(function(error) {
          requestsCounterUpdateInProgress = false;
          
          // Тихая обработка ошибок 429 (Too Many Requests)
          if (error && error.message && error.message.includes('429')) {
            badge.style.display = 'inline-block';
            badge.style.opacity = '0.5';
            badge.textContent = '?';
            badge.style.animation = 'none';
            return;
          }
          
          badge.style.display = 'inline-block';
          badge.style.opacity = '0.5';
          badge.textContent = '?';
          badge.style.animation = 'none';
        })
        .getPendingAccessRequestsCount(token);
    }
    
    // Сохранить активную секцию в localStorage
    function saveActiveSection(sectionId) {
      try {
        localStorage.setItem('vygovory_active_section', sectionId);
      } catch (e) {
        console.warn('Не удалось сохранить активную секцию:', e);
      }
    }
    
    // Получить сохраненную активную секцию из localStorage
    function getSavedActiveSection() {
      try {
        return localStorage.getItem('vygovory_active_section');
      } catch (e) {
        console.warn('Не удалось загрузить активную секцию:', e);
        return null;
      }
    }
    
      // Переключение секций
    // Загрузка обжалований для рассмотрения
    function loadReviewAppeals() {
      const container = document.getElementById('reviewAppealsContainer');
      if (!container) return;
      
      const token = getSessionToken();
      if (!token) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #dc3545;">Необходима авторизация</div>';
        return;
      }
      
      container.innerHTML = \`
        <div style="text-align: center; padding: 40px; color: #666;">
          <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto;"></div>
          <p style="margin-top: 20px;">Загрузка обжалований...</p>
        </div>
      \`;
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result || !result.success) {
            container.innerHTML = \`
              <div style="padding: 20px; text-align: center; background: #f8d7da; color: #721c24; border-radius: 12px; border: 2px solid #dc3545;">
                <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
                <p>\${(result && result.error) || 'Ошибка загрузки обжалований'}</p>
              </div>
            \`;
            return;
          }
          
          const appeals = result.data || [];
          
          if (appeals.length === 0) {
            container.innerHTML = \`
              <div style="text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div style="font-size: 64px; margin-bottom: 20px;">✅</div>
                <h3 style="color: #666; margin-bottom: 10px;">Нет обжалований для рассмотрения</h3>
                <p style="color: #999;">Все обжалования обработаны</p>
              </div>
            \`;
            return;
          }
          
          const pendingCount = appeals.filter(a => a.appealStatus === 'Ожидает рассмотрения').length;
          const processedCount = appeals.length - pendingCount;
          
          let html = \`
            <div style="margin-bottom: 25px; display: flex; gap: 15px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);">
                <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">\${pendingCount}</div>
                <div style="font-size: 14px; opacity: 0.9;">Ожидают рассмотрения</div>
              </div>
              <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">\${processedCount}</div>
                <div style="font-size: 14px; opacity: 0.9;">Обработано</div>
              </div>
            </div>
            <div style="display: grid; gap: 20px;">
          \`;
          
          appeals.forEach(function(appeal) {
            const isPending = appeal.appealStatus === 'Ожидает рассмотрения';
            const statusColor = isPending ? '#ff9800' : (appeal.appealStatus === 'Одобрено' ? '#4caf50' : '#dc3545');
            const statusBg = isPending ? '#fff3cd' : (appeal.appealStatus === 'Одобрено' ? '#d4edda' : '#f8d7da');
            const statusIcon = isPending ? '⏳' : (appeal.appealStatus === 'Одобрено' ? '✅' : '❌');
            
            html += \`
              <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid \${isPending ? '#ff9800' : '#e0e0e0'}; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 6px 30px rgba(0,0,0,0.12)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'; this.style.transform='';">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                  <div style="flex: 1; min-width: 250px;">
                    <div style="font-family: monospace; font-size: 12px; color: #999; margin-bottom: 10px; word-break: break-all;">
                      <strong>ID:</strong> \${escapeHtml(appeal.vygovorId)}
                    </div>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                      <div style="flex: 1; min-width: 200px;">
                        <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">👤 Получатель</div>
                        <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 3px;">\${escapeHtml(appeal.recipient)}</div>
                        <div style="font-size: 12px; color: #999; font-family: monospace;">Discord: \${escapeHtml(appeal.recipientId)}</div>
                      </div>
                      <div style="flex: 1; min-width: 200px;">
                        <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">👔 Выдавший</div>
                        <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 3px;">\${escapeHtml(appeal.issuer)}</div>
                        <div style="font-size: 12px; color: #999; font-family: monospace;">Discord: \${escapeHtml(appeal.issuerId)}</div>
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="display: inline-block; padding: 8px 16px; background: \${statusBg}; color: \${statusColor}; border-radius: 20px; font-size: 13px; font-weight: 600; border: 2px solid \${statusColor};">
                      \${statusIcon} \${escapeHtml(appeal.appealStatus)}
                    </div>
                  </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="margin-bottom: 15px;">
                    <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">📜 Правило</div>
                    <div style="font-size: 15px; color: #333; font-weight: 600;">\${escapeHtml(appeal.rule || 'Не указано')}</div>
                  </div>
                  
                  \${appeal.proof && appeal.proof !== 'Нет' ? \`
                    <div style="margin-bottom: 15px; padding: 15px; background: #d1ecf1; border-radius: 12px; border: 2px solid #0277bd;">
                      <div style="font-size: 11px; color: #0277bd; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">📎 Доказательства выговора</div>
                      <div style="font-size: 14px; color: #333; white-space: pre-wrap; line-height: 1.6; word-break: break-word;">\${escapeHtml(appeal.proof)}</div>
                    </div>
                  \` : ''}
                  
                  <div style="margin-bottom: 15px;">
                    <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">📝 Суть обжалования</div>
                    <div style="font-size: 15px; color: #333; white-space: pre-wrap; line-height: 1.6;">\${escapeHtml(appeal.appealReason)}</div>
                  </div>
                  
                  \${appeal.appealProof && appeal.appealProof !== 'Нет' ? \`
                    <div style="padding: 15px; background: #ffe0b2; border-radius: 12px; border: 2px solid #ff9800;">
                      <div style="font-size: 11px; color: #e65100; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; font-weight: 600;">⚖️ Доказательства обжалования (невиновности)</div>
                      <div style="font-size: 14px; color: #333; white-space: pre-wrap; line-height: 1.6; word-break: break-word;">\${escapeHtml(appeal.appealProof)}</div>
                    </div>
                  \` : ''}
                </div>
                
                \${isPending ? \`
                  <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-review-appeal" data-vygovor-id="\${escapeHtml(appeal.vygovorId)}" data-decision="approved" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)';">
                      ✅ Одобрить
                    </button>
                    <button class="btn-review-appeal" data-vygovor-id="\${escapeHtml(appeal.vygovorId)}" data-decision="rejected" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(220, 53, 69, 0.3)';">
                      ❌ Отклонить
                    </button>
                  </div>
                \` : \`
                  <div style="padding: 15px; background: \${statusBg}; border-radius: 12px; border: 2px solid \${statusColor};">
                    <div style="font-size: 14px; color: #333; margin-bottom: 5px;">
                      <strong>Рассмотрел:</strong> \${escapeHtml(appeal.reviewedBy || 'Не указано')}
                    </div>
                    \${appeal.reviewComment ? \`
                      <div style="font-size: 14px; color: #333; margin-top: 10px;">
                        <strong>Комментарий:</strong> \${escapeHtml(appeal.reviewComment)}
                      </div>
                    \` : ''}
                    \${appeal.reviewDate ? \`
                      <div style="font-size: 12px; color: #666; margin-top: 8px;">
                        Дата: \${new Date(appeal.reviewDate).toLocaleString('ru-RU')}
                      </div>
                    \` : ''}
                  </div>
                \`}
              </div>
            \`;
          });
          
          html += '</div>';
          container.innerHTML = html;
          
          // Добавляем обработчики событий для кнопок обжалований через делегирование
          container.addEventListener('click', function(e) {
            const target = e.target.closest('.btn-review-appeal');
            if (target) {
              const vygovorId = target.getAttribute('data-vygovor-id');
              const decision = target.getAttribute('data-decision');
              if (vygovorId && decision) {
                reviewAppealHandler(vygovorId, decision);
              }
            }
          });
        })
        .withFailureHandler(function(error) {
          container.innerHTML = \`
            <div style="padding: 20px; text-align: center; background: #f8d7da; color: #721c24; border-radius: 12px; border: 2px solid #dc3545;">
              <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
              <p>Ошибка загрузки: \${escapeHtml(error.message || 'Неизвестная ошибка')}</p>
            </div>
          \`;
        })
        .getAppeals(token);
    }
    
    // Загрузка заявок на снятие для рассмотрения
    function loadReviewRemovals() {
      const container = document.getElementById('reviewRemovalsContainer');
      if (!container) return;
      
      const token = getSessionToken();
      if (!token) {
        container.innerHTML = '<div style="padding: 20px; text-align: center; color: #dc3545;">Необходима авторизация</div>';
        return;
      }
      
      container.innerHTML = \`
        <div style="text-align: center; padding: 40px; color: #666;">
          <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto;"></div>
          <p style="margin-top: 20px;">Загрузка заявок на снятие...</p>
        </div>
      \`;
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result || !result.success) {
            container.innerHTML = \`
              <div style="padding: 20px; text-align: center; background: #f8d7da; color: #721c24; border-radius: 12px; border: 2px solid #dc3545;">
                <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
                <p>\${(result && result.error) || 'Ошибка загрузки заявок на снятие'}</p>
              </div>
            \`;
            return;
          }
          
          const removals = result.data || [];
          
          if (removals.length === 0) {
            container.innerHTML = \`
              <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 16px; border: 2px dashed #dee2e6;">
                <div style="font-size: 48px; margin-bottom: 15px;">📭</div>
                <h3 style="color: #666; margin-bottom: 10px;">Нет заявок на снятие</h3>
                <p style="color: #999;">Все заявки обработаны</p>
              </div>
            \`;
            return;
          }
          
          const pendingCount = removals.filter(r => r.removalStatus === 'Ожидает рассмотрения').length;
          const processedCount = removals.length - pendingCount;
          
          let html = \`
            <div style="margin-bottom: 25px; display: flex; gap: 15px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3);">
                <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">\${pendingCount}</div>
                <div style="font-size: 14px; opacity: 0.9;">Ожидают рассмотрения</div>
              </div>
              <div style="flex: 1; min-width: 200px; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); color: white; padding: 20px; border-radius: 16px; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3);">
                <div style="font-size: 32px; font-weight: 700; margin-bottom: 5px;">\${processedCount}</div>
                <div style="font-size: 14px; opacity: 0.9;">Обработано</div>
              </div>
            </div>
            <div style="display: grid; gap: 20px;">
          \`;
          
          removals.forEach(function(removal) {
            const isPending = removal.removalStatus === 'Ожидает рассмотрения';
            const statusColor = isPending ? '#4caf50' : (removal.removalStatus === 'Одобрено' ? '#4caf50' : '#dc3545');
            const statusBg = isPending ? '#d4edda' : (removal.removalStatus === 'Одобрено' ? '#d4edda' : '#f8d7da');
            const statusIcon = isPending ? '⏳' : (removal.removalStatus === 'Одобрено' ? '✅' : '❌');
            
            html += \`
              <div style="background: white; border-radius: 16px; padding: 25px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border: 2px solid \${isPending ? '#4caf50' : '#e0e0e0'}; transition: all 0.3s;" onmouseover="this.style.boxShadow='0 6px 30px rgba(0,0,0,0.12)'; this.style.transform='translateY(-2px)';" onmouseout="this.style.boxShadow='0 4px 20px rgba(0,0,0,0.08)'; this.style.transform='';">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap; gap: 15px;">
                  <div style="flex: 1; min-width: 250px;">
                    <div style="font-family: monospace; font-size: 12px; color: #999; margin-bottom: 10px; word-break: break-all;">
                      <strong>ID:</strong> \${escapeHtml(removal.vygovorId)}
                    </div>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                      <div style="flex: 1; min-width: 200px;">
                        <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">👤 Снимающий</div>
                        <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 3px;">\${escapeHtml(removal.removedByName)}</div>
                        <div style="font-size: 12px; color: #999; font-family: monospace;">Discord: \${escapeHtml(removal.removedById)}</div>
                      </div>
                      <div style="flex: 1; min-width: 200px;">
                        <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">👔 Выдавший</div>
                        <div style="font-size: 16px; font-weight: 600; color: #333; margin-bottom: 3px;">\${escapeHtml(removal.issuer)}</div>
                        <div style="font-size: 12px; color: #999; font-family: monospace;">Discord: \${escapeHtml(removal.issuerId)}</div>
                      </div>
                    </div>
                  </div>
                  <div style="text-align: right;">
                    <div style="display: inline-block; padding: 8px 16px; background: \${statusBg}; color: \${statusColor}; border-radius: 20px; font-size: 13px; font-weight: 600; border: 2px solid \${statusColor};">
                      \${statusIcon} \${escapeHtml(removal.removalStatus)}
                    </div>
                  </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                  <div style="margin-bottom: 15px;">
                    <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">💰 Тип снятия</div>
                    <div style="font-size: 15px; color: #333; font-weight: 600;">\${escapeHtml(removal.removalType)}</div>
                  </div>
                  <div>
                    <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px;">📎 Доказательства</div>
                    <div style="font-size: 14px; color: #333; white-space: pre-wrap; line-height: 1.6; word-break: break-word;">\${escapeHtml(removal.proof)}</div>
                  </div>
                </div>
                
                \${isPending ? \`
                  <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button class="btn-review-removal" data-vygovor-id="\${escapeHtml(removal.vygovorId)}" data-decision="approved" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(76, 175, 80, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(76, 175, 80, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(76, 175, 80, 0.3)';">
                      ✅ Одобрить
                    </button>
                    <button class="btn-review-removal" data-vygovor-id="\${escapeHtml(removal.vygovorId)}" data-decision="rejected" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(220, 53, 69, 0.3)';">
                      ❌ Отклонить
                    </button>
                  </div>
                \` : \`
                  <div style="padding: 15px; background: \${statusBg}; border-radius: 12px; border: 2px solid \${statusColor};">
                    <div style="font-size: 14px; color: #333; margin-bottom: 5px;">
                      <strong>Рассмотрел:</strong> \${escapeHtml(removal.reviewedBy || 'Не указано')}
                    </div>
                    \${removal.reviewComment ? \`
                      <div style="font-size: 14px; color: #333; margin-top: 10px;">
                        <strong>Комментарий:</strong> \${escapeHtml(removal.reviewComment)}
                      </div>
                    \` : ''}
                    \${removal.reviewDate ? \`
                      <div style="font-size: 12px; color: #666; margin-top: 8px;">
                        Дата: \${new Date(removal.reviewDate).toLocaleString('ru-RU')}
                      </div>
                    \` : ''}
                  </div>
                \`}
              </div>
            \`;
          });
          
          html += '</div>';
          container.innerHTML = html;
          
          // Добавляем обработчики событий для кнопок снятия через делегирование
          container.addEventListener('click', function(e) {
            const target = e.target.closest('.btn-review-removal');
            if (target) {
              const vygovorId = target.getAttribute('data-vygovor-id');
              const decision = target.getAttribute('data-decision');
              if (vygovorId && decision) {
                reviewRemovalHandler(vygovorId, decision);
              }
            }
          });
        })
        .withFailureHandler(function(error) {
          container.innerHTML = \`
            <div style="padding: 20px; text-align: center; background: #f8d7da; color: #721c24; border-radius: 12px; border: 2px solid #dc3545;">
              <div style="font-size: 24px; margin-bottom: 10px;">❌</div>
              <p>Ошибка загрузки: \${escapeHtml(error.message || 'Неизвестная ошибка')}</p>
            </div>
          \`;
        })
        .getRemovals(token);
    }
    
    // Показать кастомное окно для ввода причины отклонения (для снятия)
    function showRemovalRejectionReasonModal(vygovorId, callback) {
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.id = 'removalRejectionReasonModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = \`
        <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">
          <!-- Закрытие -->
          <button onclick="document.getElementById('removalRejectionReasonModal').remove();" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.2)'; this.style.color='#333'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(0,0,0,0.1)'; this.style.color='#666'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
          
          <!-- Градиентный заголовок -->
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">❌</div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Причина отклонения</h2>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Укажите причину отклонения заявки на снятие</p>
          </div>
          
          <!-- Форма -->
          <div style="padding: 30px;">
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">📝 Причина отклонения <span style="color: #dc3545;">*</span></label>
              <textarea id="removalRejectionReasonText" rows="5" placeholder="Опишите причину отклонения заявки на снятие..." style="width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: #f8f9fa; transition: all 0.3s; box-sizing: border-box; outline: none; resize: vertical; font-family: inherit;" onfocus="this.style.borderColor='#dc3545'; this.style.boxShadow='0 0 0 4px rgba(220, 53, 69, 0.1)'; this.style.background='white';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'; this.style.background='#f8f9fa';"></textarea>
            </div>
            
            <div id="removalRejectionReasonError" style="display: none; padding: 12px; background: #f8d7da; color: #721c24; border-radius: 10px; border: 2px solid #dc3545; text-align: center; font-size: 14px; margin-bottom: 20px;">
              ⚠️ Необходимо указать причину отклонения
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button onclick="document.getElementById('removalRejectionReasonModal').remove();" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#999'; this.style.color='#333'; this.style.background='#f8f9fa';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#666'; this.style.background='transparent';">Отмена</button>
              <button type="button" id="submitRemovalRejectionReasonBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(220, 53, 69, 0.3)';">
                Отклонить заявку
              </button>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Фокус на текстовое поле
      setTimeout(function() {
        const textarea = document.getElementById('removalRejectionReasonText');
        if (textarea) {
          textarea.focus();
        }
      }, 100);
      
      // Обработка отправки
      function submitRejection() {
        const textarea = document.getElementById('removalRejectionReasonText');
        const errorDiv = document.getElementById('removalRejectionReasonError');
        const reason = textarea ? textarea.value.trim() : '';
        
        if (!reason) {
          if (errorDiv) {
            errorDiv.style.display = 'block';
          }
          if (textarea) {
            textarea.style.borderColor = '#dc3545';
            textarea.focus();
          }
          return;
        }
        
        // Закрываем модальное окно
        modal.remove();
        
        // Вызываем callback с причиной
        if (callback) {
          callback(reason);
        }
      }
      
      // Устанавливаем обработчик после добавления в DOM
      setTimeout(function() {
        const submitBtn = document.getElementById('submitRemovalRejectionReasonBtn');
        if (submitBtn) {
          submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            submitRejection();
          });
        }
      }, 100);
      
      // Отправка по Enter (Ctrl+Enter)
      const textarea = document.getElementById('removalRejectionReasonText');
      if (textarea) {
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submitRejection();
          }
        });
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Обработчик рассмотрения заявки на снятие
    function reviewRemovalHandler(vygovorId, decision) {
      const token = getSessionToken();
      if (!token) {
        showNotification('Необходима авторизация', 'error');
        return;
      }
      
      // При отклонении показываем кастомное окно для ввода причины
      if (decision === 'rejected') {
        showRemovalRejectionReasonModal(vygovorId, function(reviewComment) {
          // Обрабатываем отклонение с указанной причиной
          processRemovalReview(vygovorId, decision, reviewComment, token);
        });
      } else {
        // При одобрении сразу обрабатываем без комментария
        processRemovalReview(vygovorId, decision, '', token);
      }
    }
    
    // Обработка рассмотрения заявки на снятие
    function processRemovalReview(vygovorId, decision, reviewComment, token) {
      const container = document.getElementById('reviewRemovalsContainer');
      if (container) {
        container.style.opacity = '0.5';
        container.style.pointerEvents = 'none';
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
          }
          
          if (result && result.success) {
            showNotification('Заявка на снятие ' + (decision === 'approved' ? 'одобрена' : 'отклонена') + ' успешно!', 'success');
            // Обновляем список
            loadReviewRemovals();
            // Обновляем счетчик с задержкой
            setTimeout(function() {
              updateRemovalsCounter();
            }, 1000);
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
          }
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .reviewRemoval(token, vygovorId, decision, reviewComment);
    }
    
    // Показать кастомное окно для ввода причины отклонения
    function showRejectionReasonModal(vygovorId, callback) {
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.id = 'rejectionReasonModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = \`
        <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">
          <!-- Закрытие -->
          <button onclick="document.getElementById('rejectionReasonModal').remove();" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.2)'; this.style.color='#333'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(0,0,0,0.1)'; this.style.color='#666'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
          
          <!-- Градиентный заголовок -->
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">❌</div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Причина отклонения</h2>
            <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.9;">Укажите причину отклонения обжалования</p>
          </div>
          
          <!-- Форма -->
          <div style="padding: 30px;">
            <div style="margin-bottom: 25px;">
              <label style="display: block; font-weight: 600; color: #333; margin-bottom: 10px; font-size: 14px;">📝 Причина отклонения <span style="color: #dc3545;">*</span></label>
              <textarea id="rejectionReasonText" rows="5" placeholder="Опишите причину отклонения обжалования..." style="width: 100%; padding: 14px 16px; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; background: #f8f9fa; transition: all 0.3s; box-sizing: border-box; outline: none; resize: vertical; font-family: inherit;" onfocus="this.style.borderColor='#dc3545'; this.style.boxShadow='0 0 0 4px rgba(220, 53, 69, 0.1)'; this.style.background='white';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none'; this.style.background='#f8f9fa';"></textarea>
            </div>
            
            <div id="rejectionReasonError" style="display: none; padding: 12px; background: #f8d7da; color: #721c24; border-radius: 10px; border: 2px solid #dc3545; text-align: center; font-size: 14px; margin-bottom: 20px;">
              ⚠️ Необходимо указать причину отклонения
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button onclick="document.getElementById('rejectionReasonModal').remove();" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#999'; this.style.color='#333'; this.style.background='#f8f9fa';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#666'; this.style.background='transparent';">Отмена</button>
              <button type="button" id="submitRejectionReasonBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s; position: relative;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)';" onmouseout="if (!this.disabled) { this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(220, 53, 69, 0.3)'; }">
                <span id="submitRejectionReasonBtnText">Отклонить обжалование</span>
                <span id="submitRejectionReasonBtnSpinner" style="display: none; margin-left: 8px;">
                  <span class="spinner" style="width: 14px; height: 14px; border-width: 2px; border-color: white; border-top-color: transparent; display: inline-block; vertical-align: middle; border-radius: 50%;"></span>
                </span>
              </button>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Фокус на текстовое поле
      setTimeout(function() {
        const textarea = document.getElementById('rejectionReasonText');
        if (textarea) {
          textarea.focus();
        }
      }, 100);
      
      // Обработка отправки
      const errorDiv = document.getElementById('rejectionReasonError');
      
      function submitRejection() {
        const textarea = document.getElementById('rejectionReasonText');
        const submitBtn = document.getElementById('submitRejectionReasonBtn');
        const submitBtnText = document.getElementById('submitRejectionReasonBtnText');
        const submitBtnSpinner = document.getElementById('submitRejectionReasonBtnSpinner');
        const reason = textarea ? textarea.value.trim() : '';
        
        if (!reason) {
          if (errorDiv) {
            errorDiv.style.display = 'block';
          }
          if (textarea) {
            textarea.style.borderColor = '#dc3545';
            textarea.focus();
          }
          return;
        }
        
        // Блокируем кнопку и показываем индикатор загрузки
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.style.opacity = '0.7';
          submitBtn.style.cursor = 'not-allowed';
          submitBtn.style.transform = 'none';
          if (submitBtnText) submitBtnText.textContent = 'Обработка...';
          if (submitBtnSpinner) submitBtnSpinner.style.display = 'inline-block';
        }
        
        // Закрываем модальное окно
        modal.remove();
        
        // Вызываем callback с причиной
        if (callback) {
          callback(reason);
        }
      }
      
      // Устанавливаем обработчик после добавления в DOM
      setTimeout(function() {
        const submitBtn = document.getElementById('submitRejectionReasonBtn');
        if (submitBtn) {
          submitBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            submitRejection();
          });
        }
      }, 100);
      
      // Отправка по Enter (Ctrl+Enter)
      const textarea = document.getElementById('rejectionReasonText');
      if (textarea) {
        textarea.addEventListener('keydown', function(e) {
          if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            submitRejection();
          }
        });
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Флаг для предотвращения двойного вызова
    let appealReviewInProgress = false;
    
    // Обработчик рассмотрения обжалования
    function reviewAppealHandler(vygovorId, decision) {
      // Защита от двойного вызова
      if (appealReviewInProgress) {
        return;
      }
      
      const token = getSessionToken();
      if (!token) {
        showNotification('Необходима авторизация', 'error');
        return;
      }
      
      // При отклонении показываем кастомное окно для ввода причины
      if (decision === 'rejected') {
        showRejectionReasonModal(vygovorId, function(reviewComment) {
          // Обрабатываем отклонение с указанной причиной
          processAppealReview(vygovorId, decision, reviewComment, token);
        });
      } else {
        // При одобрении сразу обрабатываем без комментария
        processAppealReview(vygovorId, decision, '', token);
      }
    }
    
    // Обработка рассмотрения обжалования
    function processAppealReview(vygovorId, decision, reviewComment, token) {
      // Защита от двойного вызова
      if (appealReviewInProgress) {
        return;
      }
      
      appealReviewInProgress = true;
      
      const container = document.getElementById('reviewAppealsContainer');
      if (container) {
        container.style.opacity = '0.5';
        container.style.pointerEvents = 'none';
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          appealReviewInProgress = false;
          
          if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
          }
          
          if (result && result.success) {
            showNotification(\`Обжалование \${decision === 'approved' ? 'одобрено' : 'отклонено'} успешно\`, 'success');
            loadReviewAppeals();
            // Обновляем счетчик после обработки обжалования с задержкой
            setTimeout(function() {
              updateAppealsCounter();
            }, 1000);
          } else {
            showNotification((result && result.error) || 'Ошибка при обработке обжалования', 'error');
          }
        })
        .withFailureHandler(function(error) {
          appealReviewInProgress = false;
          
          if (container) {
            container.style.opacity = '1';
            container.style.pointerEvents = 'auto';
          }
          showNotification('Ошибка: ' + (error.message || 'Неизвестная ошибка'), 'error');
        })
        .reviewAppeal(token, vygovorId, decision, reviewComment);
    }
    
    function showSection(sectionId) {
      // Сохраняем активную секцию
      saveActiveSection(sectionId);
      
      // Скрыть все секции
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Показать выбранную
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.classList.add('active');
      }
      
      // Обновить меню
      document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
      });
      
      // Найти соответствующий пункт меню и активировать его
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        const onclickAttr = item.getAttribute('onclick');
        if (onclickAttr && onclickAttr.includes("showSection('" + sectionId + "')")) {
          item.classList.add('active');
        }
      });
      
      // Если был клик по меню, активируем соответствующий пункт
      if (event && event.target && typeof event.target.closest === 'function') {
        const clickedItem = event.target.closest('.menu-item');
        if (clickedItem) {
          clickedItem.classList.add('active');
        }
      }
      
      // Загрузка данных для специфичных секций
      if (sectionId === 'reviewAppeals') {
        loadReviewAppeals();
      }
      if (sectionId === 'reviewRemovals') {
        loadReviewRemovals();
      }
      if (sectionId === 'requests') {
        loadAccessRequests();
        loadAuthorizedUsers();
        loadAllUsers();
        // Обновляем счетчик с задержкой
        setTimeout(function() {
          updateRequestsCounter();
        }, 1000);
      }
      
      // Проверка доступа для защищенных разделов
      if (sectionId === 'create' || sectionId === 'reviewAppeals' || sectionId === 'reviewRemovals') {
        const token = getSessionToken();
        if (!token || !userAccess || !userAccess.hasAccess) {
          // Показываем форму входа вместо редиректа на запрос доступа
          showLoginForm();
          showNotification('Для доступа к этому разделу необходимо войти в систему', 'error');
          return;
        }
      }
      
      // Проверка доступа для раздела пользователей (только для админов)
      if (sectionId === 'users') {
        const token = getSessionToken();
        if (!token || !userAccess || !userAccess.hasAccess || (userAccess.role !== 'Админ' && userAccess.role !== 'Супер-админ')) {
          showLoginForm();
          showNotification('Для доступа к этому разделу необходима роль Админ', 'error');
          return;
        }
      }
      
      // Проверка доступа для админ-раздела
      if (sectionId === 'requests') {
        const token = getSessionToken();
        if (!token || !userAccess || userAccess.role !== 'Супер-админ') {
          showLoginForm();
          showNotification('У вас нет доступа к этому разделу', 'error');
          return;
        }
        loadAccessRequests();
        loadAuthorizedUsers();
        loadAllUsers();
      }
      
      // Проверка доступа для раздела логов (только для админов и супер-админов)
      if (sectionId === 'logs') {
        const token = getSessionToken();
        if (!token || !userAccess || !userAccess.hasAccess || (userAccess.role !== 'Админ' && userAccess.role !== 'Супер-админ')) {
          showLoginForm();
          showNotification('Для доступа к логам необходима роль Админ', 'error');
          return;
        }
        loadLogs();
      }
      
      // Загрузить данные для секции
      if (sectionId === 'dashboard') {
        loadDashboard();
      } else if (sectionId === 'list') {
        loadVygovoryList();
      } else if (sectionId === 'stats') {
        loadStatistics();
      } else if (sectionId === 'users') {
        loadUsers();
        // Добавляем обработчик для кнопки в header
        const addUserHeaderBtn = document.getElementById('addUserHeaderBtn');
        if (addUserHeaderBtn) {
          addUserHeaderBtn.onclick = function() {
            showAddUserModal();
          };
        }
      } else if (sectionId === 'manageRules') {
        initManageRulesPage();
      } else if (sectionId === 'create') {
        initCreateForm();
      }
    }
    
    // Инициализация формы создания выговора
    function initCreateForm() {
      // Автозаполнение выдающего из профиля
      if (userAccess && userAccess.userInfo) {
        const issuerNameInput = document.getElementById('issuerName');
        const issuerIdInput = document.getElementById('issuerId');
        if (issuerNameInput) {
          issuerNameInput.value = userAccess.userInfo.name || '';
        }
        if (issuerIdInput) {
          issuerIdInput.value = userAccess.userInfo.discordId || '';
        }
      }
      
      // Установка текущей даты
      const dateInput = document.getElementById('date');
      if (dateInput) {
        const today = new Date();
        dateInput.valueAsDate = today;
        // Рассчитываем срок оплаты при инициализации
        calculatePaymentDeadline();
        
        // Обработчик для изменения даты выдачи
        dateInput.addEventListener('change', function() {
          calculatePaymentDeadline();
        });
      }
      
      // Загрузка списка пользователей
      loadUsersForSelect();
      
      // Обработчики для выпадающих списков
      const recipientSelect = document.getElementById('recipientSelect');
      if (recipientSelect) {
        recipientSelect.addEventListener('change', function() {
          const selectedOption = this.options[this.selectedIndex];
          if (selectedOption && selectedOption.value) {
            const recipientIdInput = document.getElementById('recipientId');
            if (recipientIdInput) {
              recipientIdInput.value = selectedOption.value || '';
            }
            // Загружаем историю выговоров сотрудника
            loadRecipientVygovoryHistory(selectedOption.value);
          } else {
            const recipientIdInput = document.getElementById('recipientId');
            if (recipientIdInput) {
              recipientIdInput.value = '';
            }
            // Скрываем историю
            const historyDiv = document.getElementById('recipientVygovoryHistory');
            if (historyDiv) {
              historyDiv.style.display = 'none';
            }
          }
        });
      }
      
      // Обработчик для кнопки добавления сотрудника
      const addRecipientBtn = document.getElementById('addRecipientBtn');
      if (addRecipientBtn) {
        // Удаляем старые обработчики
        const newBtn = addRecipientBtn.cloneNode(true);
        addRecipientBtn.parentNode.replaceChild(newBtn, addRecipientBtn);
        newBtn.addEventListener('click', function() {
          showAddUserModalForRecipient();
        });
        // Добавляем визуальные эффекты при наведении
        newBtn.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.3)';
        });
        newBtn.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '';
        });
      }
      
      // Обработчик для выбора правила из списка
      const ruleSelect = document.getElementById('ruleSelect');
      const ruleInput = document.getElementById('rule');
      if (ruleSelect && ruleInput) {
        ruleSelect.addEventListener('change', function() {
          if (this.value) {
            // Записываем полный текст опции в поле ввода
            const selectedOption = this.options[this.selectedIndex];
            if (selectedOption && selectedOption.textContent) {
              ruleInput.value = selectedOption.textContent;
            } else {
              ruleInput.value = this.value;
            }
            // Автоматически определяем тип, сумму и часы на основе ранга и правила
            updateVygovorTypeFromRule();
          }
        });
      }
      
      // Обработчик для ручного ввода правила
      if (ruleInput) {
        ruleInput.addEventListener('input', function() {
          if (this.value) {
            // Сбрасываем выпадающий список, если вводим вручную
            if (ruleSelect) {
              ruleSelect.value = '';
            }
            updateVygovorTypeFromRule();
          }
        });
      }
      
      // Обработчик для изменения ранга
      const rankSelect = document.getElementById('rank');
      if (rankSelect) {
        rankSelect.addEventListener('change', function() {
          updateVygovorTypeFromRule();
          calculatePenaltyAndHours();
        });
      }
      
      // Обработчик для изменения типа выговора
      const typeSelect = document.getElementById('type');
      if (typeSelect) {
        typeSelect.addEventListener('change', function() {
          calculatePenaltyAndHours();
          calculatePaymentDeadline();
        });
      }
    }
    
    // Загрузка пользователей для выпадающего списка
    function loadUsersForSelect(callback) {
      const recipientSelect = document.getElementById('recipientSelect');
      if (!recipientSelect) {
        if (callback) callback();
        return;
      }
      
      // Очищаем список, оставляя только первый option
      while (recipientSelect.options.length > 1) {
        recipientSelect.remove(1);
      }
      
      // Добавляем индикатор загрузки
      const loadingOption = document.createElement('option');
      loadingOption.value = '';
      loadingOption.textContent = '⏳ Загрузка сотрудников...';
      loadingOption.disabled = true;
      recipientSelect.appendChild(loadingOption);
      
      // Блокируем поле на время загрузки
      recipientSelect.disabled = true;
      recipientSelect.style.opacity = '0.7';
      recipientSelect.style.cursor = 'wait';
      
      google.script.run
        .withSuccessHandler(function(result) {
          // Удаляем индикатор загрузки
          if (recipientSelect.options.length > 1) {
            recipientSelect.remove(1);
          }
          
          // Разблокируем поле
          recipientSelect.disabled = false;
          recipientSelect.style.opacity = '1';
          recipientSelect.style.cursor = 'pointer';
          
          if (result && result.success && result.data) {
            if (result.data.length === 0) {
              // Если нет сотрудников
              const noDataOption = document.createElement('option');
              noDataOption.value = '';
              noDataOption.textContent = 'Нет сотрудников в базе';
              noDataOption.disabled = true;
              recipientSelect.appendChild(noDataOption);
            } else {
              // Добавляем сотрудников
            result.data.forEach(function(user) {
              const option = document.createElement('option');
              option.value = user['Discord ID'] || '';
              option.textContent = (user.Имя || 'Не указано') + ' (' + (user['Discord ID'] || 'N/A') + ')';
              recipientSelect.appendChild(option);
            });
          }
          } else {
            // Ошибка загрузки
            const errorOption = document.createElement('option');
            errorOption.value = '';
            errorOption.textContent = '❌ Ошибка загрузки';
            errorOption.disabled = true;
            recipientSelect.appendChild(errorOption);
          }
          
          if (callback) callback();
        })
        .withFailureHandler(function(error) {
          console.error('Ошибка загрузки пользователей:', error);
          
          // Удаляем индикатор загрузки
          if (recipientSelect.options.length > 1) {
            recipientSelect.remove(1);
          }
          
          // Разблокируем поле
          recipientSelect.disabled = false;
          recipientSelect.style.opacity = '1';
          recipientSelect.style.cursor = 'pointer';
          
          // Добавляем сообщение об ошибке
          const errorOption = document.createElement('option');
          errorOption.value = '';
          errorOption.textContent = '❌ Ошибка загрузки: ' + (error.message || 'Неизвестная ошибка');
          errorOption.disabled = true;
          recipientSelect.appendChild(errorOption);
          
          if (callback) callback();
        })
        .getUsers(getSessionToken());
    }
    
    // Показать модальное окно для добавления сотрудника из формы создания выговора
    function showAddUserModalForRecipient() {
      // Создаем модальное окно с callback для обновления списка
      const modal = document.createElement('div');
      modal.id = 'addUserModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<button id="closeAddUserModalBtn" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" title="Закрыть">×</button>' +
        '<div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); padding: 30px; text-align: center; color: white;">' +
          '<div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">➕</div>' +
          '<h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Добавить сотрудника</h2>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<form id="addUserForm" style="display: flex; flex-direction: column; gap: 20px;">' +
            '<div>' +
              '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Имя фамилия *</label>' +
              '<input type="text" id="addUserName" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box;" placeholder="Введите имя и фамилию" autofocus>' +
            '</div>' +
            '<div>' +
              '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Discord ID *</label>' +
              '<input type="text" id="addUserDiscordId" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box; font-family: monospace;" placeholder="Введите Discord ID">' +
            '</div>' +
            '<div style="display: flex; gap: 10px; margin-top: 10px;">' +
              '<button type="button" id="cancelAddUserBtn" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;">Отмена</button>' +
              '<button type="submit" id="submitAddUserBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); transition: all 0.3s;">Добавить</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Обработчики событий
      const closeBtn = modal.querySelector('#closeAddUserModalBtn');
      const cancelBtn = modal.querySelector('#cancelAddUserBtn');
      const form = modal.querySelector('#addUserForm');
      
      function closeModal() {
        modal.remove();
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('mouseover', function() {
          this.style.background = 'rgba(0,0,0,0.2)';
          this.style.color = '#333';
          this.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', function() {
          this.style.background = 'rgba(0,0,0,0.1)';
          this.style.color = '#666';
          this.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = closeModal;
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseover', function() {
          this.style.borderColor = '#999';
          this.style.color = '#333';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseout', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'transparent';
        });
        cancelBtn.onclick = closeModal;
      }
      
      // Закрытие по Escape
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.getElementById('addUserModal')) {
          closeModal();
        }
      });
      
      // Закрытие при клике вне модального окна
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
      
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = document.getElementById('addUserName').value.trim();
          const discordId = document.getElementById('addUserDiscordId').value.trim();
          
          if (!name || !discordId) {
            showNotification('Пожалуйста, заполните все обязательные поля (Имя фамилия и Discord ID)', 'error');
            return;
          }
          
          // Показываем индикатор загрузки
          const submitBtn = document.getElementById('submitAddUserBtn');
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Добавление...';
          submitBtn.style.opacity = '0.7';
          
          google.script.run
            .withSuccessHandler(function(result) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              submitBtn.style.opacity = '1';
              
              if (result && result.success) {
                showNotification('Пользователь успешно добавлен!', 'success');
                closeModal();
                
                // Обновляем список пользователей и автоматически выбираем добавленного
                loadUsersForSelect(function() {
                  const recipientSelect = document.getElementById('recipientSelect');
                  if (recipientSelect) {
                    recipientSelect.value = discordId;
                    // Триггерим событие change для обновления поля Discord ID
                    const event = new Event('change', { bubbles: true });
                    recipientSelect.dispatchEvent(event);
                  }
                });
              } else {
                showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
              }
            })
            .withFailureHandler(function(error) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              submitBtn.style.opacity = '1';
              showNotification('Ошибка: ' + (error.message || 'Неизвестная ошибка'), 'error');
            })
            .addUserToSheet(getSessionToken(), name, discordId);
        });
      }
    }
    
    // Функция для определения типа выговора, суммы и часов на основе правила
    function getVygovorTypeFromRule(ruleNumber) {
      // Маппинг правил на типы выговоров
      const ruleMap = {
        '25.1': 'VR',
        '25.2': 'VR',
        '25.3': 'SR',
        '25.4': 'VR',
        '25.5': 'VR',
        '25.6': 'VR',
        '25.7': 'VR', // или Dismissal
        '25.8': 'VR',
        '25.9': 'WR',
        '25.10': 'VR',
        '25.11': 'SR',
        '25.12': 'VR',
        '25.13': 'WR',
        '25.14': 'WR', // или SR
        '25.15': 'VR',
        '25.16': 'VR',
        '25.17': 'VR',
        '25.18': 'WR',
        '25.19': 'WR',
        '25.20': 'VR',
        '25.21': 'VR',
        '25.22': 'VR',
        '25.23': 'WR', // или SR
        '25.24': 'VR',
        '25.25': 'WR',
        '25.26': 'Dismissal',
        '25.27': 'WR', // или SR
        '25.28': 'WR', // или Suspension
        '25.29': 'WR', // или SR
        '25.30': 'VR', // или WR
        '25.31': 'WR', // или SR
        '25.32': 'VR', // или WR или SR
        '25.33': 'SR', // или Dismissal
        '25.34': 'WR',
        '25.35': 'WR'
      };
      
      return ruleMap[ruleNumber] || null;
    }
    
    // Функция для определения суммы и часов на основе ранга и типа выговора
    function getVygovorAmountAndHours(rank, type) {
      const rankNum = parseInt(rank);
      if (!rankNum || rankNum < 1 || rankNum > 11) {
        return { amount: 0, hours: 0 };
      }
      
      let amount = 0;
      let hours = 0;
      
      // Определяем диапазон ранга
      if (rankNum >= 1 && rankNum <= 2) {
        // Ранги 1-2
        if (type === 'VR') {
          amount = 1000;
          hours = 1; // Холл
        } else if (type === 'WR') {
          amount = 2500;
          hours = 2; // Холл
        } else if (type === 'SR') {
          amount = 7000;
          hours = 0;
        } else if (type === 'SR2') {
          amount = 7000;
          hours = 0; // или увольнение
        }
      } else if (rankNum >= 3 && rankNum <= 5) {
        // Ранги 3-5
        if (type === 'VR') {
          amount = 2500;
          hours = 2; // КПП
        } else if (type === 'WR') {
          amount = 5500;
          hours = 3; // КПП
        } else if (type === 'SR') {
          amount = 8500;
          hours = 0;
        } else if (type === 'SR2') {
          amount = 10000;
          hours = 0; // или увольнение
        }
      } else if (rankNum >= 6 && rankNum <= 9) {
        // Ранги 6-9
        if (type === 'VR') {
          amount = 5000;
          hours = 3; // КПП
        } else if (type === 'WR') {
          amount = 8000;
          hours = 4; // КПП
        } else if (type === 'SR') {
          amount = 10000;
          hours = 0;
        } else if (type === 'SR2') {
          amount = 12000;
          hours = 0; // или увольнение
        }
      }
      
      return { amount: amount, hours: hours };
    }
    
    // Обновить тип, сумму и часы на основе ранга и правила
    function updateVygovorTypeFromRule() {
      const rankSelect = document.getElementById('rank');
      const ruleInput = document.getElementById('rule');
      const typeSelect = document.getElementById('type');
      const amountInput = document.getElementById('amount');
      const hoursInput = document.getElementById('hours');
      
      if (!rankSelect || !ruleInput || !typeSelect || !amountInput || !hoursInput) {
        return;
      }
      
      const rank = rankSelect.value;
      const rule = ruleInput.value.trim();
      
      // Если нет ранга или правила, не обновляем
      if (!rank || !rule) {
        return;
      }
      
      // Извлекаем номер правила (например, "25.10" из "25.10 - Игнорировать или выключать рацию")
      const ruleMatch = rule.match(/^(\d+\.\d+)/);
      if (!ruleMatch) {
        return; // Если не удалось извлечь номер правила, не обновляем
      }
      
      const ruleNumber = ruleMatch[1];
      
      // Определяем тип выговора из правила
      const type = getVygovorTypeFromRule(ruleNumber);
      if (type) {
        typeSelect.value = type;
      }
      
      // Определяем сумму и часы на основе ранга и типа
      const { amount, hours } = getVygovorAmountAndHours(rank, type);
      
      if (amount > 0) {
        amountInput.value = amount;
      }
      
      if (hours > 0) {
        hoursInput.value = hours;
      } else {
        hoursInput.value = 0;
      }
    }
    
    // Функция для экранирования HTML
    function escapeHtml(text) {
      if (text == null) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Переменные для фильтров дашборда
    let currentDateFrom = null;
    let currentDateTo = null;
    
    // Обработка изменения периода
    function handlePeriodChange() {
      const periodSelect = document.getElementById('periodFilter');
      const customRange = document.getElementById('customDateRange');
      const period = periodSelect ? periodSelect.value : 'all';
      
      if (period === 'custom') {
        if (customRange) {
          customRange.style.display = 'flex';
        }
      } else {
        if (customRange) {
          customRange.style.display = 'none';
        }
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        switch(period) {
          case 'today':
            currentDateFrom = today.toISOString().split('T')[0];
            currentDateTo = today.toISOString().split('T')[0];
            break;
          case 'week':
            const weekAgo = new Date(today);
            weekAgo.setDate(weekAgo.getDate() - 7);
            currentDateFrom = weekAgo.toISOString().split('T')[0];
            currentDateTo = today.toISOString().split('T')[0];
            break;
          case 'month':
            const monthAgo = new Date(today);
            monthAgo.setMonth(monthAgo.getMonth() - 1);
            currentDateFrom = monthAgo.toISOString().split('T')[0];
            currentDateTo = today.toISOString().split('T')[0];
            break;
          case 'quarter':
            const quarterAgo = new Date(today);
            quarterAgo.setMonth(quarterAgo.getMonth() - 3);
            currentDateFrom = quarterAgo.toISOString().split('T')[0];
            currentDateTo = today.toISOString().split('T')[0];
            break;
          case 'year':
            const yearAgo = new Date(today);
            yearAgo.setFullYear(yearAgo.getFullYear() - 1);
            currentDateFrom = yearAgo.toISOString().split('T')[0];
            currentDateTo = today.toISOString().split('T')[0];
            break;
          default:
            currentDateFrom = null;
            currentDateTo = null;
        }
        
        loadDashboard();
      }
    }
    
    // Применить произвольный диапазон дат
    function applyCustomDateRange() {
      const dateFrom = document.getElementById('dateFrom') ? document.getElementById('dateFrom').value : null;
      const dateTo = document.getElementById('dateTo') ? document.getElementById('dateTo').value : null;
      
      if (!dateFrom || !dateTo) {
        showNotification('Выберите обе даты', 'error');
        return;
      }
      
      if (new Date(dateFrom) > new Date(dateTo)) {
        showNotification('Дата начала не может быть позже даты окончания', 'error');
        return;
      }
      
      currentDateFrom = dateFrom;
      currentDateTo = dateTo;
      loadDashboard();
    }
    
    // Загрузка дашборда с защитой от множественных запросов
    function loadDashboard() {
      // Отменяем предыдущий запрос если он еще не выполнен
      if (loadDashboardTimeout) {
        clearTimeout(loadDashboardTimeout);
      }
      
      // Debounce - ждем 1000ms перед выполнением (увеличено для предотвращения 429)
      loadDashboardTimeout = setTimeout(function() {
        // Проверяем, не выполняется ли уже загрузка дашборда
        if (isLoadingDashboard) {
          console.log('Загрузка дашборда уже выполняется, пропускаем запрос');
          return;
        }
        
        // Проверяем общий флаг загрузки
        if (isLoading) {
          console.log('Другая операция выполняется, откладываем загрузку дашборда');
          setTimeout(function() {
            loadDashboard();
          }, 1000);
          return;
        }
        
        isLoadingDashboard = true;
        isLoading = true;
        const container = document.getElementById('dashboardStats');
        const chartsContainer = document.getElementById('dashboardCharts');
        if (container) {
          container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Загрузка данных...</p></div>';
        }
        if (chartsContainer) {
          chartsContainer.innerHTML = '';
        }
        
        google.script.run
          .withSuccessHandler(function(result) {
            isLoadingDashboard = false;
            isLoading = false;
            if (result && result.success) {
              const stats = result.stats;
              const html = \`
                <div class="stat-card blue">
                  <div class="stat-card-icon">📊</div>
                  <div class="stat-label">Всего выговоров</div>
                  <div class="stat-value">\${stats.total || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">За выбранный период</div>
                </div>
                <div class="stat-card orange">
                  <div class="stat-card-icon">⚡</div>
                  <div class="stat-label">Активных</div>
                  <div class="stat-value">\${stats.active || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Требуют действий</div>
                </div>
                <div class="stat-card cyan">
                  <div class="stat-card-icon">✅</div>
                  <div class="stat-label">Закрытых</div>
                  <div class="stat-value">\${stats.closed || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Оплачено/Отработано/Снято</div>
                </div>
                <div class="stat-card red">
                  <div class="stat-card-icon">💸</div>
                  <div class="stat-label">Проигнорированных</div>
                  <div class="stat-value">\${stats.unpaidCount || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Сумма: \${(stats.unpaidAmount || 0).toLocaleString('ru-RU')}$</div>
                </div>
                <div class="stat-card green">
                  <div class="stat-card-icon">💰</div>
                  <div class="stat-label">Оплачено</div>
                  <div class="stat-value">\${stats.paid || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Выполнено оплат</div>
                </div>
                <div class="stat-card green">
                  <div class="stat-card-icon">⏰</div>
                  <div class="stat-label">Отработано</div>
                  <div class="stat-value">\${stats.worked || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Отработано часов</div>
                </div>
                <div class="stat-card red">
                  <div class="stat-card-icon">⚖️</div>
                  <div class="stat-label">Обжалований на рассмотрении</div>
                  <div class="stat-value">\${stats.appealed || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Ожидают решения</div>
                </div>
                <div class="stat-card purple">
                  <div class="stat-card-icon">📋</div>
                  <div class="stat-label">Обжалований рассмотрено</div>
                  <div class="stat-value">\${stats.processedAppeals || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Одобрено/Отклонено</div>
                </div>
                <div class="stat-card teal">
                  <div class="stat-card-icon">📝</div>
                  <div class="stat-label">Снятий рассмотрено</div>
                  <div class="stat-value">\${stats.processedRemovals || 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Одобрено/Отклонено</div>
                </div>
                <div class="stat-card purple">
                  <div class="stat-card-icon">💵</div>
                  <div class="stat-label">Общая сумма штрафов</div>
                  <div class="stat-value">\${(stats.totalAmount || 0).toLocaleString('ru-RU')}$</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">За период</div>
                </div>
                <div class="stat-card orange">
                  <div class="stat-card-icon">🕐</div>
                  <div class="stat-label">Общие часы отработки</div>
                  <div class="stat-value">\${(stats.totalHours || 0).toLocaleString('ru-RU')}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Часов</div>
                </div>
                <div class="stat-card blue">
                  <div class="stat-card-icon">💬</div>
                  <div class="stat-label">VR (Устный)</div>
                  <div class="stat-value">\${stats.byType && stats.byType.VR ? stats.byType.VR : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Устные выговоры</div>
                </div>
                <div class="stat-card purple">
                  <div class="stat-card-icon">📄</div>
                  <div class="stat-label">WR (Письменный)</div>
                  <div class="stat-value">\${stats.byType && stats.byType.WR ? stats.byType.WR : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Письменные выговоры</div>
                        </div>
                <div class="stat-card red">
                  <div class="stat-card-icon">⚠️</div>
                  <div class="stat-label">SR (Строгий 1/2)</div>
                  <div class="stat-value">\${stats.byType && stats.byType.SR ? stats.byType.SR : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Строгие выговоры 1/2</div>
                        </div>
                <div class="stat-card red">
                  <div class="stat-card-icon">🔴</div>
                  <div class="stat-label">SR2 (Строгий 2/2)</div>
                  <div class="stat-value">\${stats.byType && stats.byType.SR2 ? stats.byType.SR2 : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Строгие выговоры 2/2</div>
                        </div>
                <div class="stat-card orange">
                  <div class="stat-card-icon">⏸️</div>
                  <div class="stat-label">Отстранение</div>
                  <div class="stat-value">\${stats.byType && stats.byType.Suspension ? stats.byType.Suspension : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">От работы</div>
                        </div>
                <div class="stat-card cyan">
                  <div class="stat-card-icon">📝</div>
                  <div class="stat-label">Переаттестация</div>
                  <div class="stat-value">\${stats.byType && stats.byType.Retest ? stats.byType.Retest : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Повторное тестирование</div>
                      </div>
                <div class="stat-card red">
                  <div class="stat-card-icon">🚫</div>
                  <div class="stat-label">Увольнение</div>
                  <div class="stat-value">\${stats.byType && stats.byType.Dismissal ? stats.byType.Dismissal : 0}</div>
                  <div style="font-size: 12px; color: #999; margin-top: 10px;">Уволенные</div>
                    </div>
                  \`;
              if (container) {
                container.innerHTML = html;
                }
                
              // Добавляем таблицу неоплаченных выговоров
              const unpaidTableContainer = document.getElementById('dashboardUnpaidTable');
              if (unpaidTableContainer && stats.unpaid && stats.unpaid.length > 0) {
                  let unpaidHtml = '<div class="form-container" style="padding: 25px; border-left: 5px solid #ea4335;">';
                  unpaidHtml += '<h3 style="margin-bottom: 20px; color: #c62828;">⚠️ Не уплаченные выговоры</h3>';
                unpaidHtml += '<div class="table-container"><table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden;"><thead><tr><th style="background: #ea4335; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">ID</th><th style="background: #e73c33; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Дата выдачи</th><th style="background: #dd3531; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Получатель</th><th style="background: #d32e2f; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Discord ID</th><th style="background: #ca272d; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Сумма</th><th style="background: #c22929; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Срок оплаты</th><th style="background: #ba2626; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Дней просрочки</th><th style="background: #c62828; color: white; padding: 15px; text-align: left; font-weight: 600;">Статус уведомления</th></tr></thead><tbody>';
                  
                  stats.unpaid.forEach(function(item) {
                    const daysBadge = item.daysOverdue > 7 ? '🔴' : item.daysOverdue > 3 ? '🟠' : '🟡';
                    unpaidHtml += \`
                      <tr style="background: \${item.daysOverdue > 7 ? '#ffebee' : item.daysOverdue > 3 ? '#fff3e0' : '#fff9c4'};">
                      <td style="padding: 12px 15px; font-family: monospace; font-size: 11px;">\${item.id || 'N/A'}</td>
                      <td style="padding: 12px 15px;">\${item.dateStr || 'N/A'}</td>
                      <td style="padding: 12px 15px; font-weight: 600;">\${item.recipientName || 'Не указано'}</td>
                      <td style="padding: 12px 15px; font-family: monospace; font-size: 12px;">\${item.recipientId || 'Не указано'}</td>
                      <td style="padding: 12px 15px; font-weight: bold; color: #c62828;">\${item.amount}$</td>
                      <td style="padding: 12px 15px; font-weight: bold; color: #ea4335;">\${item.deadlineStr || 'Не указан'}</td>
                      <td style="padding: 12px 15px;">\${daysBadge} \${item.daysOverdue || 0} дн.</td>
                      <td style="padding: 12px 15px;">\${item.notificationSent ? '✅ Отправлено' : '⏳ Ожидает'}</td>
                      </tr>
                    \`;
                  });
                  
                  unpaidHtml += '</tbody></table></div></div>';
                unpaidTableContainer.innerHTML = unpaidHtml;
              } else if (unpaidTableContainer) {
                unpaidTableContainer.innerHTML = '';
              }
            } else {
              showNotification('Ошибка загрузки данных', 'error');
            }
          })
          .withFailureHandler(function(error) {
            isLoadingDashboard = false;
            isLoading = false;
            // Обработка ошибки 429 (Too Many Requests)
            if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests'))) {
              const waitTime = 5000; // 5 секунд
              showNotification('Слишком много запросов. Ожидание ' + (waitTime/1000) + ' секунд...', 'error');
              // Автоматически повторить через увеличенное время
              setTimeout(function() {
                if (!isLoadingDashboard) {
                  loadDashboard();
                }
              }, waitTime);
            } else {
              showNotification('Ошибка: ' + (error.message || 'Неизвестная ошибка'), 'error');
            }
          })
          .getGlobalStats(currentDateFrom, currentDateTo);
      }, 1000); // Увеличено до 1000ms для предотвращения 429
    }
    
    // Создание выговора с защитой от множественных отправок
    function createVygovorHandler(event) {
      event.preventDefault();
      
      // Проверка доступа
      if (!userAccess || !userAccess.hasAccess) {
        showNotification('У вас нет доступа к этой функции. Запросите доступ.', 'error');
        showSection('requestAccess');
        return;
      }
      
      // Предотвращаем множественные отправки
      const submitBtn = event.target.querySelector('button[type="submit"]');
      if (isLoading && submitBtn) {
        return;
      }
      
      isLoading = true;
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Создание...';
      }
      
      // Получаем выбранного сотрудника из выпадающего списка
      const recipientSelect = document.getElementById('recipientSelect');
      const recipientNameInput = document.getElementById('recipientName');
      const recipientIdInput = document.getElementById('recipientId');
      
      let recipientName = '';
      let recipientId = '';
      
      if (recipientSelect && recipientSelect.value) {
        const selectedOption = recipientSelect.options[recipientSelect.selectedIndex];
        recipientId = recipientSelect.value;
        // Извлекаем имя из текста опции (формат: "Имя (Discord ID)")
        const optionText = selectedOption.textContent || '';
        // Используем более безопасный способ извлечения имени
        const openParenIndex = optionText.indexOf('(');
        if (openParenIndex > 0) {
          recipientName = optionText.substring(0, openParenIndex).trim();
        } else {
          recipientName = optionText.trim();
        }
        // Если имя не найдено, используем значение из input (если есть)
        if (!recipientName && recipientNameInput) {
          recipientName = recipientNameInput.value || '';
        }
      } else {
        recipientName = recipientNameInput ? recipientNameInput.value : '';
        recipientId = recipientIdInput ? recipientIdInput.value : '';
      }
      
      // Получаем правило (из поля ввода, которое содержит полный текст при выборе из списка)
      const ruleInput = document.getElementById('rule');
      let rule = '';
      if (ruleInput && ruleInput.value) {
        rule = ruleInput.value.trim();
      }
      
      // Получаем значение даты как строку (формат YYYY-MM-DD)
      const dateValue = document.getElementById('date').value;
      // Преобразуем в ISO строку для передачи на сервер
      const dateString = dateValue ? new Date(dateValue + 'T00:00:00').toISOString() : new Date().toISOString();
      
      // Получаем срок оплаты/отработки
      const paymentDeadlineValue = document.getElementById('paymentDeadline').value;
      const paymentDeadlineString = paymentDeadlineValue ? new Date(paymentDeadlineValue).toISOString() : '';
      
      const data = {
        recipientName: recipientName,
        recipientId: recipientId,
        issuerName: document.getElementById('issuerName').value,
        issuerId: document.getElementById('issuerId').value,
        rule: rule,
        type: document.getElementById('type').value,
        amount: parseFloat(document.getElementById('amount').value) || 0,
        hours: parseInt(document.getElementById('hours').value) || 0,
        date: dateString, // Передаем как строку ISO
        paymentDeadline: paymentDeadlineString, // Срок оплаты/отработки
        messageLink: '', // Не используется
        comment: '', // Не используется
        evidenceLinks: document.getElementById('evidenceLinks') ? document.getElementById('evidenceLinks').value : '' // Ссылки на доказательства
      };
      
      google.script.run
        .withSuccessHandler(function(result) {
          isLoading = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Создать выговор';
          }
          
          if (result && result.success) {
            showNotification('Выговор успешно создан!', 'success');
            document.getElementById('createForm').reset();
            
            // Переинициализируем форму
            initCreateForm();
            
            // Обновляем дашборд с задержкой
            setTimeout(function() {
              loadDashboard();
            }, 1000);
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          isLoading = false;
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Создать выговор';
          }
          
          if (error.message && error.message.includes('429')) {
            showNotification('Слишком много запросов. Подождите несколько секунд и попробуйте снова.', 'error');
          } else {
            showNotification('Ошибка: ' + error.message, 'error');
          }
        })
        .createVygovor(getSessionToken(), data);
    }
    
    // Загрузка списка выговоров с debounce
    function loadVygovoryList() {
      // Отменяем предыдущий запрос
      if (loadVygovoryListTimeout) {
        clearTimeout(loadVygovoryListTimeout);
      }
      
      // Debounce - ждем 800ms перед выполнением (увеличено для предотвращения 429)
      loadVygovoryListTimeout = setTimeout(function() {
        console.log('Попытка загрузки списка выговоров...');
        // Проверяем, не выполняется ли уже другой запрос
        if (isLoadingVygovoryList) {
          console.log('Загрузка уже выполняется, пропускаем запрос');
          return;
        }
        
        // Проверяем общий флаг загрузки
        if (isLoading) {
          console.log('Другая операция выполняется, откладываем запрос');
          setTimeout(function() {
            loadVygovoryList();
          }, 1000);
          return;
        }
        
        isLoadingVygovoryList = true;
        isLoading = true;
        
        const loadingEl = document.getElementById('listLoading');
        const cardsContainer = document.getElementById('vygovoryCardsContainer');
        const summaryEl = document.getElementById('listSummary');
        
        if (loadingEl) {
          loadingEl.classList.add('active');
          loadingEl.style.gridColumn = '1 / -1';
        }
        
        const filters = {
          status: document.getElementById('statusFilter') ? document.getElementById('statusFilter').value : null,
          type: document.getElementById('typeFilter') ? document.getElementById('typeFilter').value : null,
          discordId: document.getElementById('userIdFilter') ? document.getElementById('userIdFilter').value : null,
          id: document.getElementById('idFilter') ? document.getElementById('idFilter').value.trim() : null
        };
        
        // Удалить пустые фильтры
        Object.keys(filters).forEach(key => {
          if (!filters[key] || filters[key] === '') {
            filters[key] = null;
          }
        });
        
        console.log('Отправка запроса getAllVygovory с фильтрами:', filters);
        google.script.run
          .withSuccessHandler(function(result) {
            isLoadingVygovoryList = false;
            isLoading = false;
            if (loadingEl) loadingEl.classList.remove('active');
            
            console.log('Результат getAllVygovory получен:', result);
            console.log('Тип результата:', typeof result);
            console.log('result === null:', result === null);
            console.log('result === undefined:', result === undefined);
            
            // Обработка случая, когда результат null или undefined
            if (result === null || result === undefined) {
              console.error('getAllVygovory вернул null или undefined');
              console.error('Фильтры запроса:', filters);
              showNotification('Ошибка: Сервер вернул пустой ответ. Проверьте консоль для деталей.', 'error');
              if (cardsContainer) {
                cardsContainer.innerHTML = \`
                  <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: #666; margin-bottom: 10px;">Ошибка загрузки</h3>
                    <p style="color: #999;">Сервер вернул пустой ответ. Откройте консоль (F12) для деталей.</p>
                    <p style="color: #999; font-size: 12px; margin-top: 10px;">Фильтры: \${JSON.stringify(filters)}</p>
                    <button onclick="loadVygovoryList()" class="btn btn-primary" style="margin-top: 20px;">Повторить попытку</button>
                  </div>
                \`;
              }
              return;
            }
            
            if (result && result.success) {
              const vygovory = result.data || [];
              // Данные уже перевернуты в getAllVygovory (снизу вверх)
              console.log('Загружено выговоров:', vygovory.length);
              
              // Обновляем сводку
              if (summaryEl) {
                summaryEl.innerHTML = \`
                  <div style="padding: 10px 15px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; font-weight: 600; color: #1976d2;">
                    Всего: \${vygovory.length}
                  </div>
                \`;
              }
              
              if (cardsContainer) {
                cardsContainer.innerHTML = '';
                
                if (vygovory.length === 0) {
                  cardsContainer.innerHTML = \`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                      <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                      <h3 style="color: #666; margin-bottom: 10px;">Нет данных</h3>
                      <p style="color: #999;">Попробуйте изменить фильтры</p>
                    </div>
                  \`;
                } else {
                  vygovory.forEach(vygovor => {
                    // Безопасное получение значений
                    const id = vygovor.ID || 'N/A';
                    
                    let date = null;
                    let dateStr = 'N/A';
                    if (vygovor.Дата) {
                      try {
                        date = new Date(vygovor.Дата);
                        if (!isNaN(date.getTime())) {
                          dateStr = date.toLocaleDateString('ru-RU');
                        }
                      } catch (e) {
                        console.warn('Ошибка парсинга даты:', e);
                      }
                    }
                    
                    const type = String(vygovor.Тип || 'N/A').trim();
                    const status = String(vygovor.Статус || 'Неизвестно').trim();
                    const statusClass = getStatusClass(status);
                    
                    // Безопасное получение суммы (может быть числом или строкой)
                    let amount = 0;
                    if (vygovor.Сумма !== undefined && vygovor.Сумма !== null && vygovor.Сумма !== '') {
                      amount = parseFloat(vygovor.Сумма) || 0;
                    }
                    
                    // Безопасное получение часов отработки (пробуем разные варианты названий)
                    let hours = 0;
                    const hoursFields = ['Часы отработки', 'Часы', 'Отработанные часы', 'Отработано часов'];
                    for (let field of hoursFields) {
                      if (vygovor[field] !== undefined && vygovor[field] !== null && vygovor[field] !== '') {
                        hours = parseFloat(vygovor[field]) || 0;
                        if (hours > 0) break;
                      }
                    }
                    
                    // Определяем иконку типа
                    let typeIcon = '📝';
                    if (type === 'VR') typeIcon = '💬';
                    else if (type === 'WR') typeIcon = '📄';
                    else if (type === 'SR') typeIcon = '⚠️';
                    else if (type === 'Fine') typeIcon = '💵';
                    
                    // Проверяем просроченность
                    let isOverdue = false;
                    let deadlineStr = '';
                    let daysOverdue = 0;
                    if (status === 'Активен' && amount > 0 && vygovor['Срок оплаты']) {
                      try {
                        const deadline = new Date(vygovor['Срок оплаты']);
                        const now = new Date();
                        if (!isNaN(deadline.getTime()) && deadline < now) {
                          isOverdue = true;
                          daysOverdue = Math.floor((now - deadline) / (1000 * 60 * 60 * 24));
                          deadlineStr = deadline.toLocaleDateString('ru-RU') + ' ' + deadline.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});
                        }
                      } catch (e) {
                        console.warn('Ошибка проверки срока оплаты:', e);
                      }
                    }
                    
                    const card = document.createElement('div');
                    card.className = 'vygovor-card ' + type;
                    if (isOverdue) {
                      card.style.border = '3px solid #ea4335';
                      card.style.boxShadow = '0 4px 20px rgba(234, 67, 53, 0.3)';
                    }
                    card.innerHTML = \`
                      <div class="vygovor-card-header">
                        <div>
                          <div class="vygovor-card-id">ID: \${id}</div>
                          <div class="vygovor-card-date" style="margin-top: 8px;">📅 \${dateStr}</div>
                        </div>
                        <div class="vygovor-type-badge" style="background: linear-gradient(135deg, \${type === 'VR' ? '#4285f4' : type === 'WR' ? '#9c27b0' : type === 'SR' ? '#ea4335' : '#fbbc05'} 0%, \${type === 'VR' ? '#1976d2' : type === 'WR' ? '#7b1fa2' : type === 'SR' ? '#c62828' : '#f57c00'} 100%);">
                          \${typeIcon} \${type}
                        </div>
                      </div>
                      
                      \${isOverdue ? '<div style="background: #ea4335; color: white; padding: 12px; text-align: center; font-weight: 700; font-size: 14px; border-bottom: 1px solid rgba(255,255,255,0.2);">🚨 ПРОСРОЧЕН ' + daysOverdue + ' дн. | Срок был: ' + deadlineStr + '</div>' : ''}
                      
                      <div class="vygovor-card-body">
                        <div class="vygovor-card-field">
                          <div class="vygovor-card-field-label">👤 Получатель</div>
                          <div class="vygovor-card-field-value">\${escapeHtml(vygovor.Получатель || 'Не указано')}</div>
                          <div style="font-size: 11px; color: #999; margin-top: 3px;">ID: \${escapeHtml(vygovor['Discord ID получателя'] || 'N/A')}</div>
                        </div>
                        
                        <div class="vygovor-card-field">
                          <div class="vygovor-card-field-label">👔 Выдавший</div>
                          <div class="vygovor-card-field-value">\${escapeHtml(vygovor.Выдавший || 'Не указано')}</div>
                          <div style="font-size: 11px; color: #999; margin-top: 3px;">ID: \${escapeHtml(vygovor['Discord ID выдающего'] || 'N/A')}</div>
                        </div>
                        
                        <div class="vygovor-card-field">
                          <div class="vygovor-card-field-label">📋 Правило</div>
                          <div class="vygovor-card-field-value">\${escapeHtml(vygovor.Правило || 'Не указано')}</div>
                        </div>
                        
                        <div class="vygovor-card-field">
                          <div class="vygovor-card-field-label">💰 Сумма / ⏰ Часы</div>
                          <div class="vygovor-card-field-value">
                            \${amount > 0 ? '<span style="color: #ea4335; font-weight: 700;">' + amount + '$</span>' : ''}
                            \${hours > 0 ? '<span style="color: #f57c00; margin-left: 10px;">' + hours + ' ч.</span>' : ''}
                            \${amount === 0 && hours === 0 ? '<span style="color: #999;">Нет</span>' : ''}
                          </div>
                        </div>
                      </div>
                      
                      <div class="vygovor-card-footer">
                        <span class="vygovor-status-badge \${statusClass}">
                          \${status === 'Активен' ? '⚡' : status === 'Оплачен' ? '💰' : status === 'Отработан' ? '⏰' : (status === 'Обжалован' || status === 'На обжаловании') ? '⚖️' : '✅'}
                          \${status}
                        </span>
                        <button class="btn btn-secondary btn-view-details" data-vygovor-id="\${escapeHtml(id)}" style="padding: 8px 16px; font-size: 13px;">Подробнее</button>
                      </div>
                    \`;
                    cardsContainer.appendChild(card);
                  });
                  
                  // Добавляем обработчик для кнопок "Подробнее" через делегирование (только если еще не добавлен)
                  if (!cardsContainer.hasAttribute('data-details-handler')) {
                    cardsContainer.setAttribute('data-details-handler', 'true');
                    cardsContainer.addEventListener('click', function(e) {
                      const target = e.target.closest('.btn-view-details');
                      if (target) {
                        e.stopPropagation();
                        const vygovorId = target.getAttribute('data-vygovor-id');
                        if (vygovorId) {
                          viewVygovorDetails(vygovorId);
                        }
                      }
                    });
                  }
                }
              }
            } else {
              // Показываем детали ошибки
              const errorMsg = result && result.error ? result.error : 'Неизвестная ошибка';
              showNotification('Ошибка загрузки данных: ' + errorMsg, 'error');
              console.error('Ошибка загрузки выговоров:', result);
              
              // Показываем пустой результат вместо ошибки
              if (cardsContainer) {
                cardsContainer.innerHTML = \`
                  <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: #666; margin-bottom: 10px;">Ошибка загрузки</h3>
                    <p style="color: #999;">\${errorMsg}</p>
                  </div>
                \`;
              }
            }
          })
          .withFailureHandler(function(error) {
            isLoadingVygovoryList = false;
            isLoading = false;
            if (loadingEl) loadingEl.classList.remove('active');
            
            console.error('Ошибка запроса:', error);
            
            // Обработка ошибки 429 - увеличиваем время ожидания
            if (error.message && (error.message.includes('429') || error.message.includes('Too Many Requests'))) {
              const waitTime = 5000; // 5 секунд
              showNotification('Слишком много запросов. Ожидание ' + (waitTime/1000) + ' секунд перед повторной попыткой...', 'error');
              
              // Показываем сообщение с обратным отсчетом
              if (cardsContainer) {
                let countdown = waitTime / 1000;
                cardsContainer.innerHTML = \`
                  <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="font-size: 64px; margin-bottom: 20px;">⏳</div>
                    <h3 style="color: #666; margin-bottom: 10px;">Слишком много запросов</h3>
                    <p style="color: #999; margin-bottom: 20px;">Повторная попытка через: <span id="retryCountdown" style="font-weight: bold; color: #1976d2;">\${countdown}</span> сек.</p>
                    <button onclick="loadVygovoryList()" class="btn btn-primary">Повторить сейчас</button>
                  </div>
                \`;
                
                const countdownEl = document.getElementById('retryCountdown');
                const countdownInterval = setInterval(function() {
                  countdown--;
                  if (countdownEl) {
                    countdownEl.textContent = countdown;
                  }
                  if (countdown <= 0) {
                    clearInterval(countdownInterval);
                  }
                }, 1000);
              }
              
              // Автоматический повтор через увеличенное время
              setTimeout(function() {
                if (!isLoadingVygovoryList) {
                  loadVygovoryList();
                }
              }, waitTime);
            } else {
              const errorMsg = error.message || error.toString() || 'Неизвестная ошибка';
              showNotification('Ошибка: ' + errorMsg, 'error');
              
              // Показываем сообщение об ошибке в контейнере
              if (cardsContainer) {
                cardsContainer.innerHTML = \`
                  <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                    <div style="font-size: 64px; margin-bottom: 20px;">⚠️</div>
                    <h3 style="color: #666; margin-bottom: 10px;">Ошибка подключения</h3>
                    <p style="color: #999;">\${errorMsg}</p>
                    <button onclick="loadVygovoryList()" class="btn btn-primary" style="margin-top: 20px;">Повторить попытку</button>
                  </div>
                \`;
              }
            }
          })
          .getAllVygovory(filters);
      }, 500);
    }
    
    // Получить класс для статуса
    function getStatusClass(status) {
      const statusMap = {
        'Активен': 'active',
        'Оплачен': 'paid',
        'Отработан': 'worked',
        'Обжалован': 'appealed',
        'На обжаловании': 'appealed',
        'Снят': 'removed'
      };
      return statusMap[status] || 'active';
    }
    
    // Переменные для статистики
    let isLoadingStatistics = false;
    
    // Очистка фильтров статистики
    function clearStatisticsFilters() {
      const filterType = document.getElementById('statsFilterType');
      const searchValue = document.getElementById('statsSearchValue');
      const statisticsContainer = document.getElementById('statisticsContainer');
      const statisticsSummary = document.getElementById('statisticsSummary');
      
      if (filterType) {
        filterType.value = 'all';
      }
      if (searchValue) {
        searchValue.value = '';
      }
      if (statisticsContainer) {
        statisticsContainer.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
            <h3 style="color: #666; margin-bottom: 10px;">Используйте фильтры для поиска</h3>
            <p style="color: #999;">Выберите тип поиска и введите значение</p>
          </div>
        \`;
      }
      if (statisticsSummary) {
        statisticsSummary.innerHTML = '';
      }
    }
    
    // Загрузка статистики с фильтрами (карточки)
    function loadStatisticsWithFilters(event) {
      if (event) {
        event.preventDefault();
      }
      
      if (isLoadingStatistics) {
        return;
      }
      
      const filterType = document.getElementById('statsFilterType') ? document.getElementById('statsFilterType').value : 'all';
      const searchValue = document.getElementById('statsSearchValue') ? document.getElementById('statsSearchValue').value.trim() : '';
      
      // Проверка, что значение для поиска заполнено
      if (!searchValue) {
        showNotification('Введите значение для поиска', 'warning');
        return;
      }
      
      const container = document.getElementById('statisticsContainer');
      const summaryEl = document.getElementById('statisticsSummary');
      if (!container) return;
      
      isLoadingStatistics = true;
      container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Поиск выговоров...</p></div>';
      if (summaryEl) summaryEl.innerHTML = '';
      
      // Формируем фильтры для getAllVygovory
      // Если выбран тип "recipientId" или "issuerId", можем фильтровать на сервере
      // Для имен или "по всем полям" - загружаем все и фильтруем на клиенте
      const filters = {};
      if (filterType === 'recipientId') {
        filters.discordId = searchValue;
      }
      // Для остальных типов фильтруем на клиенте после загрузки всех данных
      
      google.script.run
        .withSuccessHandler(function(result) {
          isLoadingStatistics = false;
          
          if (!result || result === null || result === undefined || !result.success) {
            const errorMsg = result && result.error ? result.error : 'Неизвестная ошибка';
            container.innerHTML = \`
              <div style="text-align: center; padding: 40px 20px; background: #ffebee; border-radius: 16px; border: 2px solid #ef5350;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <h3 style="color: #c62828; margin-bottom: 10px;">Ошибка загрузки</h3>
                <p style="color: #d32f2f;">\${errorMsg}</p>
                <button class="btn btn-primary" onclick="loadStatisticsWithFilters()" style="margin-top: 20px;">Повторить</button>
              </div>
            \`;
            return;
          }
          
          let vygovory = result.data || [];
          
          // Применяем фильтры на основе выбранного типа
          if (filterType === 'all') {
            // Поиск по всем полям - проверяем все возможные совпадения
            vygovory = vygovory.filter(v => {
              const recipient = String(v.Получатель || '').toLowerCase().trim();
              const issuer = String(v.Выдавший || '').toLowerCase().trim();
              const recipientDiscordId = String(v['Discord ID получателя'] || '').trim();
              const issuerDiscordId = String(v['Discord ID выдающего'] || '').trim();
              const searchLower = searchValue.toLowerCase();
              
              return recipient.includes(searchLower) ||
                     issuer.includes(searchLower) ||
                     recipientDiscordId === searchValue ||
                     issuerDiscordId === searchValue;
            });
          } else if (filterType === 'recipientName') {
            vygovory = vygovory.filter(v => {
              const recipient = String(v.Получатель || '').toLowerCase().trim();
              return recipient.includes(searchValue.toLowerCase());
            });
          } else if (filterType === 'issuerName') {
            vygovory = vygovory.filter(v => {
              const issuer = String(v.Выдавший || '').toLowerCase().trim();
              return issuer.includes(searchValue.toLowerCase());
            });
          } else if (filterType === 'recipientId') {
            vygovory = vygovory.filter(v => {
              const recipientDiscordId = String(v['Discord ID получателя'] || '').trim();
              return recipientDiscordId === searchValue;
            });
          } else if (filterType === 'issuerId') {
            vygovory = vygovory.filter(v => {
              const issuerDiscordId = String(v['Discord ID выдающего'] || '').trim();
              return issuerDiscordId === searchValue;
            });
          }
          
          // Обновляем сводку
          if (summaryEl) {
            summaryEl.innerHTML = \`
              <div style="padding: 10px 15px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 10px; font-weight: 600; color: #1976d2;">
                Найдено: \${vygovory.length}
              </div>
            \`;
          }
          
          if (vygovory.length === 0) {
            container.innerHTML = \`
              <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                <div style="font-size: 64px; margin-bottom: 20px;">📭</div>
                <h3 style="color: #666; margin-bottom: 10px;">Ничего не найдено</h3>
                <p style="color: #999;">Попробуйте изменить фильтры</p>
              </div>
            \`;
            return;
          }
          
          // Отображаем карточки
          const cardsContainer = document.createElement('div');
          cardsContainer.className = 'vygovory-cards-grid';
          cardsContainer.style.cssText = 'display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; margin-top: 20px;';
          
          vygovory.forEach((vygovor, index) => {
            const id = vygovor.ID || 'N/A';
            
            let date = null;
            let dateStr = 'N/A';
            if (vygovor.Дата || vygovor.Создано) {
              try {
                date = new Date(vygovor.Создано || vygovor.Дата);
                if (!isNaN(date.getTime())) {
                  dateStr = date.toLocaleDateString('ru-RU');
                }
              } catch (e) {
                console.warn('Ошибка парсинга даты:', e);
              }
            }
            
            // Получаем тип и статус
            const type = String(vygovor.Тип || 'N/A').trim();
            const status = String(vygovor.Статус || 'Неизвестно').trim();
            const statusClass = getStatusClass(status);
            
            // Определяем иконку типа
            let typeIcon = '📝';
            let typeColor = '#999';
            if (type === 'VR') {
              typeIcon = '💬';
              typeColor = '#4285f4';
            } else if (type === 'WR') {
              typeIcon = '📄';
              typeColor = '#9c27b0';
            } else if (type === 'SR') {
              typeIcon = '⚠️';
              typeColor = '#ea4335';
            } else if (type === 'Fine') {
              typeIcon = '💵';
              typeColor = '#fbbc05';
            }
            
            // Определяем иконку и цвет статуса
            let statusIcon = '⚡';
            let statusColor = '#999';
            if (status === 'Активен') {
              statusIcon = '⚡';
              statusColor = '#f57c00';
            } else if (status === 'Оплачен') {
              statusIcon = '💰';
              statusColor = '#4caf50';
            } else if (status === 'Отработан') {
              statusIcon = '⏰';
              statusColor = '#2196f3';
            } else if (status === 'Обжалован' || status === 'На обжаловании') {
              statusIcon = '⚖️';
              statusColor = '#9c27b0';
            } else if (status === 'Снят' || status === 'Амнистирован') {
              statusIcon = '✅';
              statusColor = '#4caf50';
            }
            
            const card = document.createElement('div');
            card.className = 'vygovor-card statistics-card';
            card.style.cssText = 'background: white; border-radius: 16px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); transition: all 0.3s ease; cursor: pointer;';
            
            // Добавляем обработчики hover
            card.addEventListener('mouseenter', function() {
              this.style.transform = 'translateY(-4px)';
              this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.12)';
            });
            card.addEventListener('mouseleave', function() {
              this.style.transform = '';
              this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
            });
            
            // Обработчик клика на карточку
            card.addEventListener('click', function(e) {
              // Если клик не на кнопке, открываем детали
              if (!e.target.closest('button')) {
                viewVygovorDetails(id);
              }
            });
            
            card.innerHTML = \`
              <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 2px solid #f0f0f0;">
                <div style="font-family: monospace; font-size: 12px; color: #666; word-break: break-all; margin-bottom: 8px;">
                  <strong>ID:</strong> \${escapeHtml(id)}
                </div>
                <div style="font-size: 14px; color: #999; display: flex; align-items: center; gap: 5px; margin-bottom: 10px;">
                  <span>📅</span>
                  <span>\${dateStr}</span>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                  <div style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: linear-gradient(135deg, \${typeColor} 0%, \${typeColor}dd 100%); border-radius: 8px; color: white; font-size: 12px; font-weight: 600;">
                    <span>\${typeIcon}</span>
                    <span>\${type}</span>
                  </div>
                  <div style="display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; background: linear-gradient(135deg, \${statusColor} 0%, \${statusColor}dd 100%); border-radius: 8px; color: white; font-size: 12px; font-weight: 600;">
                    <span>\${statusIcon}</span>
                    <span>\${status}</span>
                  </div>
                </div>
              </div>
              
              <div style="display: flex; flex-direction: column; gap: 12px;">
                <div>
                  <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">👤 Получатель</div>
                  <div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 2px;">\${escapeHtml(vygovor.Получатель || 'Не указано')}</div>
                  <div style="font-size: 12px; color: #999; font-family: monospace;">Discord ID: \${escapeHtml(vygovor['Discord ID получателя'] || 'N/A')}</div>
                </div>
                
                <div>
                  <div style="font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">👔 Выдавший</div>
                  <div style="font-size: 15px; font-weight: 600; color: #333; margin-bottom: 2px;">\${escapeHtml(vygovor.Выдавший || 'Не указано')}</div>
                  <div style="font-size: 12px; color: #999; font-family: monospace;">Discord ID: \${escapeHtml(vygovor['Discord ID выдающего'] || 'N/A')}</div>
                </div>
              </div>
              
              <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #f0f0f0; text-align: center;">
                <button class="btn btn-primary btn-details btn-view-details" style="width: 100%;" data-vygovor-id="\${escapeHtml(id)}">Подробнее</button>
              </div>
            \`;
            
            cardsContainer.appendChild(card);
          });
          
          container.innerHTML = '';
          container.appendChild(cardsContainer);
          
          // Добавляем обработчики для кнопок "Подробнее" через делегирование
          cardsContainer.addEventListener('click', function(e) {
            const target = e.target.closest('.btn-view-details, .btn-details');
            if (target) {
              e.stopPropagation();
              const vygovorId = target.getAttribute('data-vygovor-id');
              if (vygovorId) {
                viewVygovorDetails(vygovorId);
              }
            }
          });
        })
        .withFailureHandler(function(error) {
          isLoadingStatistics = false;
          const container = document.getElementById('statisticsContainer');
          if (container) {
            container.innerHTML = \`
              <div style="text-align: center; padding: 40px 20px; background: #ffebee; border-radius: 16px; border: 2px solid #ef5350;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <h3 style="color: #c62828; margin-bottom: 10px;">Ошибка</h3>
                <p style="color: #d32f2f;">\${error.message || 'Неизвестная ошибка'}</p>
                <button class="btn btn-primary" onclick="loadStatisticsWithFilters()" style="margin-top: 20px;">Повторить</button>
              </div>
            \`;
          }
        })
        .getAllVygovory(filters);
    }
    
    // Загрузка статистики (без параметров - для совместимости)
    function loadStatistics() {
      // При открытии страницы просто показываем пустое состояние
      // Проверяем, что элементы существуют, прежде чем очищать
      const statisticsContainer = document.getElementById('statisticsContainer');
      if (statisticsContainer) {
        statisticsContainer.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <div style="font-size: 64px; margin-bottom: 20px;">🔍</div>
            <h3 style="color: #666; margin-bottom: 10px;">Используйте фильтры для поиска</h3>
            <p style="color: #999;">Выберите тип поиска и введите значение</p>
          </div>
        \`;
      }
      const statisticsSummary = document.getElementById('statisticsSummary');
      if (statisticsSummary) {
        statisticsSummary.innerHTML = '';
      }
    }
    
    // Загрузка пользователей
    function loadUsers() {
      const container = document.getElementById('usersContainer');
      if (!container) return;
      
      // Используем DOM API вместо innerHTML
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      
      const loadingDiv = document.createElement('div');
      loadingDiv.className = 'loading active';
      const spinner = document.createElement('div');
      spinner.className = 'spinner';
      const loadingText = document.createElement('p');
      loadingText.textContent = 'Загрузка...';
      loadingDiv.appendChild(spinner);
      loadingDiv.appendChild(loadingText);
      container.appendChild(loadingDiv);
      
      if (!userAccess || (userAccess.role !== 'Админ' && userAccess.role !== 'Супер-админ')) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
        const errorP = document.createElement('p');
        errorP.textContent = 'Недостаточно прав для просмотра списка пользователей';
        container.appendChild(errorP);
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          
          if (result && result.success) {
            const users = result.data;
            
            if (users.length === 0) {
              const emptyContainer = document.createElement('div');
              emptyContainer.style.cssText = 'background: white; border-radius: 16px; padding: 60px 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); text-align: center;';
              
              const emptyIcon = document.createElement('div');
              emptyIcon.style.cssText = 'font-size: 64px; margin-bottom: 20px; opacity: 0.5;';
              emptyIcon.textContent = '👥';
              emptyContainer.appendChild(emptyIcon);
              
              const emptyTitle = document.createElement('h3');
              emptyTitle.style.cssText = 'margin: 0 0 10px 0; color: #333; font-size: 22px; font-weight: 600;';
              emptyTitle.textContent = 'Нет пользователей';
              emptyContainer.appendChild(emptyTitle);
              
              const emptyText = document.createElement('p');
              emptyText.style.cssText = 'margin: 0; color: #666; font-size: 15px;';
              emptyText.textContent = 'Начните добавлять сотрудников, используя кнопку "Добавить сотрудника"';
              emptyContainer.appendChild(emptyText);
              
              container.appendChild(emptyContainer);
              return;
            }
            
            const tableContainer = document.createElement('div');
            tableContainer.style.cssText = 'background: white; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.08); overflow-x: auto;';
            
            const table = document.createElement('table');
            table.style.cssText = 'width: 100%; border-collapse: collapse;';
            
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = ['Имя', 'Discord ID', 'Дата добавления', 'Действия'];
            const colors = ['#667eea', '#6c7de8', '#717be6', '#764ba2'];
            
            headers.forEach(function(headerText, index) {
              const th = document.createElement('th');
              const borderRight = index < headers.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none';
              th.style.cssText = 'background: ' + colors[index] + '; color: white; padding: 15px 20px; text-align: left; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; border-right: ' + borderRight + ';';
              th.textContent = headerText;
              headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            const tbody = document.createElement('tbody');
            
            users.forEach((user, index) => {
              const tr = document.createElement('tr');
              tr.style.cssText = 'border-bottom: 1px solid #e9ecef; transition: background-color 0.2s;';
              
              // Добавляем hover эффект
              tr.addEventListener('mouseover', function() {
                this.style.backgroundColor = '#f8f9fa';
              });
              tr.addEventListener('mouseout', function() {
                this.style.backgroundColor = 'transparent';
              });
              
              // Имя
              const nameTd = document.createElement('td');
              nameTd.style.cssText = 'padding: 18px 20px; color: #212529; font-size: 15px; font-weight: 500;';
              nameTd.textContent = user.Имя || 'Не указано';
              tr.appendChild(nameTd);
              
              // Discord ID
              const discordIdTd = document.createElement('td');
              discordIdTd.style.cssText = 'padding: 18px 20px; color: #495057; font-size: 14px; font-family: monospace; background: #f8f9fa; border-radius: 6px;';
              discordIdTd.textContent = user['Discord ID'] || 'N/A';
              tr.appendChild(discordIdTd);
              
              // Дата добавления
              const dateTd = document.createElement('td');
              dateTd.style.cssText = 'padding: 18px 20px; color: #6c757d; font-size: 14px;';
              if (user['Дата добавления']) {
                try {
                  const date = new Date(user['Дата добавления']);
                  if (!isNaN(date.getTime())) {
                    dateTd.textContent = date.toLocaleDateString('ru-RU', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                  } else {
                    dateTd.textContent = user['Дата добавления'] || 'Не указано';
                  }
                } catch (e) {
                  dateTd.textContent = user['Дата добавления'] || 'Не указано';
                }
              } else {
                dateTd.textContent = 'Не указано';
              }
              tr.appendChild(dateTd);
              
              // Действия
              const actionsTd = document.createElement('td');
              actionsTd.style.cssText = 'padding: 18px 20px;';
              
              const actionsContainer = document.createElement('div');
              actionsContainer.style.cssText = 'display: flex; gap: 8px; align-items: center;';
              
              const editBtn = document.createElement('button');
              editBtn.textContent = '✏️ Изменить';
              editBtn.style.cssText = 'padding: 10px 18px; background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(108, 117, 125, 0.2);';
              editBtn.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(108, 117, 125, 0.3)';
              });
              editBtn.addEventListener('mouseout', function() {
                this.style.transform = '';
                this.style.boxShadow = '0 2px 8px rgba(108, 117, 125, 0.2)';
              });
              editBtn.onclick = function() {
                editUserPrompt(user['Discord ID'], user.Имя || '');
              };
              
              const deleteBtn = document.createElement('button');
              deleteBtn.textContent = '🗑️ Удалить';
              deleteBtn.style.cssText = 'padding: 10px 18px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 13px; transition: all 0.3s; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.2);';
              deleteBtn.addEventListener('mouseover', function() {
                this.style.transform = 'translateY(-2px)';
                this.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.3)';
              });
              deleteBtn.addEventListener('mouseout', function() {
                this.style.transform = '';
                this.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.2)';
              });
              deleteBtn.onclick = function() {
                deleteUserPrompt(user['Discord ID'], user.Имя || '');
              };
              
              actionsContainer.appendChild(editBtn);
              actionsContainer.appendChild(deleteBtn);
              actionsTd.appendChild(actionsContainer);
              tr.appendChild(actionsTd);
              
              tbody.appendChild(tr);
            });
            
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
          } else {
            const errorP = document.createElement('p');
            errorP.textContent = 'Ошибка загрузки: ' + ((result && result.error) || 'Неизвестная ошибка');
            errorP.style.color = '#dc3545';
            errorP.style.padding = '20px';
            container.appendChild(errorP);
          }
        })
        .withFailureHandler(function(error) {
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          const errorP = document.createElement('p');
          errorP.textContent = 'Ошибка: ' + error.message;
          errorP.style.color = '#dc3545';
          errorP.style.padding = '20px';
          container.appendChild(errorP);
        })
        .getUsers(getSessionToken());
    }
    
    // Показать форму редактирования пользователя
    function editUserPrompt(discordId, currentName) {
      const modal = document.createElement('div');
      modal.id = 'editUserModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<button id="closeEditUserModalBtn" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" title="Закрыть">×</button>' +
        '<div style="background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); padding: 30px; text-align: center; color: white;">' +
          '<div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">✏️</div>' +
          '<h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Изменить пользователя</h2>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<form id="editUserForm" style="display: flex; flex-direction: column; gap: 20px;">' +
            '<div>' +
              '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Имя фамилия *</label>' +
              '<input type="text" id="editUserName" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box;" placeholder="Введите имя и фамилию" value="' + escapeHtml(currentName || '') + '">' +
            '</div>' +
            '<div style="display: flex; gap: 10px; margin-top: 10px;">' +
              '<button type="button" id="cancelEditUserBtn" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;">Отмена</button>' +
              '<button type="submit" id="submitEditUserBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3); transition: all 0.3s;">Сохранить</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Устанавливаем фокус на поле ввода
      setTimeout(function() {
        const nameInput = document.getElementById('editUserName');
        if (nameInput) {
          nameInput.focus();
          nameInput.select();
        }
      }, 100);
      
      // Обработчики событий
      const closeBtn = modal.querySelector('#closeEditUserModalBtn');
      const cancelBtn = modal.querySelector('#cancelEditUserBtn');
      const form = modal.querySelector('#editUserForm');
      
      function closeModal() {
        modal.remove();
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('mouseover', function() {
          this.style.background = 'rgba(0,0,0,0.2)';
          this.style.color = '#333';
          this.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', function() {
          this.style.background = 'rgba(0,0,0,0.1)';
          this.style.color = '#666';
          this.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = closeModal;
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseover', function() {
          this.style.borderColor = '#999';
          this.style.color = '#333';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseout', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'transparent';
        });
        cancelBtn.onclick = closeModal;
      }
      
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const newName = document.getElementById('editUserName').value.trim();
          
          if (!newName || newName === '') {
            showNotification('Имя не может быть пустым', 'error');
            return;
          }
          
          // Показываем индикатор загрузки
          const submitBtn = document.getElementById('submitEditUserBtn');
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Сохранение...';
          
          google.script.run
            .withSuccessHandler(function(result) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              
              if (result && result.success) {
                showNotification('Пользователь обновлен', 'success');
                modal.remove();
                loadUsers(); // Перезагружаем список пользователей
              } else {
                showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
              }
            })
            .withFailureHandler(function(error) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              showNotification('Ошибка: ' + error.message, 'error');
            })
            .updateUserFromSheet(getSessionToken(), discordId, newName);
        });
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Показать модальное окно для добавления пользователя
    function showAddUserModal() {
      const modal = document.createElement('div');
      modal.id = 'addUserModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<button id="closeAddUserModalBtn" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" title="Закрыть">×</button>' +
        '<div style="background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); padding: 30px; text-align: center; color: white;">' +
          '<div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">➕</div>' +
          '<h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Добавить пользователя</h2>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<form id="addUserForm" style="display: flex; flex-direction: column; gap: 20px;">' +
            '<div>' +
              '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Имя фамилия *</label>' +
              '<input type="text" id="addUserName" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box;" placeholder="Введите имя и фамилию">' +
            '</div>' +
            '<div>' +
              '<label style="display: block; margin-bottom: 8px; font-weight: 600; color: #333;">Discord ID *</label>' +
              '<input type="text" id="addUserDiscordId" required style="width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 14px; box-sizing: border-box;" placeholder="Введите Discord ID">' +
            '</div>' +
            '<div style="display: flex; gap: 10px; margin-top: 10px;">' +
              '<button type="button" id="cancelAddUserBtn" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;">Отмена</button>' +
              '<button type="submit" id="submitAddUserBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(33, 150, 243, 0.3); transition: all 0.3s;">Добавить</button>' +
            '</div>' +
          '</form>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Обработчики событий
      const closeBtn = modal.querySelector('#closeAddUserModalBtn');
      const cancelBtn = modal.querySelector('#cancelAddUserBtn');
      const form = modal.querySelector('#addUserForm');
      
      function closeModal() {
        modal.remove();
      }
      
      if (closeBtn) {
        closeBtn.addEventListener('mouseover', function() {
          this.style.background = 'rgba(0,0,0,0.2)';
          this.style.color = '#333';
          this.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', function() {
          this.style.background = 'rgba(0,0,0,0.1)';
          this.style.color = '#666';
          this.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = closeModal;
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseover', function() {
          this.style.borderColor = '#999';
          this.style.color = '#333';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseout', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'transparent';
        });
        cancelBtn.onclick = closeModal;
      }
      
      if (form) {
        form.addEventListener('submit', function(e) {
          e.preventDefault();
          
          const name = document.getElementById('addUserName').value.trim();
          const discordId = document.getElementById('addUserDiscordId').value.trim();
          
          if (!name || !discordId) {
            showNotification('Пожалуйста, заполните все обязательные поля (Имя фамилия и Discord ID)', 'error');
            return;
          }
          
          // Показываем индикатор загрузки
          const submitBtn = document.getElementById('submitAddUserBtn');
          const originalText = submitBtn.textContent;
          submitBtn.disabled = true;
          submitBtn.textContent = 'Добавление...';
          
          google.script.run
            .withSuccessHandler(function(result) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              
              if (result && result.success) {
                showNotification('Пользователь успешно добавлен', 'success');
                modal.remove();
                loadUsers(); // Перезагружаем список пользователей
              } else {
                showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
              }
            })
            .withFailureHandler(function(error) {
              submitBtn.disabled = false;
              submitBtn.textContent = originalText;
              showNotification('Ошибка: ' + error.message, 'error');
            })
            .addUserToSheet(getSessionToken(), name, discordId);
        });
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          closeModal();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Показать подтверждение удаления пользователя
    function deleteUserPrompt(discordId, userName) {
      // Создаем модальное окно вместо confirm для безопасности
      const modal = document.createElement('div');
      modal.id = 'deleteUserConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<button id="closeDeleteUserModalBtn" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" title="Закрыть">×</button>' +
        '<div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">' +
          '<div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🗑️</div>' +
          '<h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Подтверждение удаления</h2>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<p style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;">Вы уверены, что хотите удалить пользователя <strong id="deleteUserNameText"></strong>?</p>' +
          '<div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; margin-bottom: 25px;">' +
            '<p style="margin: 0; font-size: 14px; color: #856404; font-weight: 600;">⚠️ Это действие нельзя отменить.</p>' +
          '</div>' +
          '<div style="display: flex; gap: 10px;">' +
            '<button class="cancelDeleteUserBtn" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;">Отмена</button>' +
            '<button id="confirmDeleteUserBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;">Удалить</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Безопасно вставляем имя пользователя через textContent
      const nameText = modal.querySelector('#deleteUserNameText');
      if (nameText) {
        nameText.textContent = userName || 'Неизвестно';
      }
      
      // Обработчики событий
      const confirmBtn = modal.querySelector('#confirmDeleteUserBtn');
      const cancelBtn = modal.querySelector('.cancelDeleteUserBtn');
      const closeBtn = modal.querySelector('#closeDeleteUserModalBtn');
      
      // Добавляем обработчики hover для кнопки закрытия через DOM API
      if (closeBtn) {
        closeBtn.addEventListener('mouseover', function() {
          this.style.background = 'rgba(0,0,0,0.2)';
          this.style.color = '#333';
          this.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', function() {
          this.style.background = 'rgba(0,0,0,0.1)';
          this.style.color = '#666';
          this.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = function() {
          modal.remove();
        };
      }
      
      // Добавляем обработчики hover для кнопки "Отмена"
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseover', function() {
          this.style.borderColor = '#999';
          this.style.color = '#333';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseout', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'transparent';
        });
      }
      
      // Добавляем обработчики hover для кнопки "Удалить"
      if (confirmBtn) {
        confirmBtn.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
        });
        confirmBtn.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
        });
      }
      
      function confirmDelete() {
        modal.remove();
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.success) {
              showNotification('Пользователь удален', 'success');
              loadUsers();
            } else {
              showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
            }
          })
          .withFailureHandler(function(error) {
            showNotification('Ошибка: ' + error.message, 'error');
          })
          .deleteUserFromSheet(getSessionToken(), discordId);
      }
      
      function cancelDelete() {
        modal.remove();
      }
      
      if (confirmBtn) {
        confirmBtn.onclick = confirmDelete;
      }
      if (cancelBtn) {
        cancelBtn.onclick = cancelDelete;
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Запрос доступа
    function requestAccessHandler(event) {
      event.preventDefault();
      
      const submitButton = document.getElementById('requestAccessSubmitBtn');
      if (isLoading && submitButton) return;
      
      // Сохраняем оригинальный текст кнопки
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      
      isLoading = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
        submitButton.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Отправка...</span>';
      }
      
      const password = document.getElementById('requestPassword').value;
      if (password.length < 8) {
        const statusDiv = document.getElementById('requestStatus');
        if (statusDiv) {
          statusDiv.innerHTML = '<div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); color: #856404; border-radius: 12px; margin-top: 10px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><span style="font-size: 24px;">⚠️</span><h3 style="margin: 0; font-size: 18px;">Ошибка валидации</h3></div><p style="margin: 0;">Пароль должен содержать минимум 8 символов</p></div>';
        }
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      const discordIdInput = document.getElementById('requestDiscordId');
      if (!discordIdInput) {
        const statusDiv = document.getElementById('requestStatus');
        if (statusDiv) {
          statusDiv.innerHTML = '<div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); color: #856404; border-radius: 12px; margin-top: 10px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><span style="font-size: 24px;">⚠️</span><h3 style="margin: 0; font-size: 18px;">Ошибка</h3></div><p style="margin: 0;">Поле Discord ID не найдено</p></div>';
        }
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      // Получаем значение из поля
      let discordId = String(discordIdInput.value || '').trim();
      
      // Проверяем, что поле не пустое
      if (!discordId || discordId.length === 0) {
        const statusDiv = document.getElementById('requestStatus');
        if (statusDiv) {
          statusDiv.innerHTML = '<div style="padding: 20px; background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%); color: #856404; border-radius: 12px; margin-top: 10px; border: 2px solid #ffc107; box-shadow: 0 4px 15px rgba(255, 193, 7, 0.2);"><div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;"><span style="font-size: 24px;">⚠️</span><h3 style="margin: 0; font-size: 18px;">Ошибка валидации</h3></div><p style="margin: 0;">Поле Discord ID не может быть пустым</p></div>';
        }
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        discordIdInput.focus();
        discordIdInput.style.borderColor = '#dc3545';
        setTimeout(function() {
          discordIdInput.style.borderColor = '#e0e0e0';
        }, 2000);
        return;
      }
      
      const requestData = {
        name: document.getElementById('requestName').value,
        discordId: discordId,
        login: document.getElementById('requestLogin').value,
        password: password,
        reason: document.getElementById('requestReason').value
      };
      
      google.script.run
        .withSuccessHandler(function(result) {
          isLoading = false;
          
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          const statusDiv = document.getElementById('requestStatus');
          if (result && result.success) {
            statusDiv.innerHTML = \`
              <div style="padding: 20px; background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%); color: #155724; border-radius: 12px; margin-top: 10px; border: 2px solid #28a745; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.2);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-size: 24px;">✅</span>
                  <h3 style="margin: 0; font-size: 18px;">Запрос отправлен успешно!</h3>
                </div>
                <p style="margin: 0; line-height: 1.6;">
                  \${result.message || 'Ваш запрос на доступ был отправлен администратору на рассмотрение. После одобрения запроса вам будет выдан логин и пароль для входа в систему. Ожидайте уведомления.'}
                </p>
              </div>
            \`;
            document.getElementById('requestAccessForm').reset();
          } else {
            statusDiv.innerHTML = \`
              <div style="padding: 20px; background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); color: #721c24; border-radius: 12px; margin-top: 10px; border: 2px solid #dc3545; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-size: 24px;">❌</span>
                  <h3 style="margin: 0; font-size: 18px;">Ошибка отправки</h3>
                </div>
                <p style="margin: 0;">\${(result && result.error) || 'Неизвестная ошибка'}</p>
              </div>
            \`;
          }
        })
        .withFailureHandler(function(error) {
          isLoading = false;
          
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          const statusDiv = document.getElementById('requestStatus');
          statusDiv.innerHTML = \`
            <div style="padding: 20px; background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%); color: #721c24; border-radius: 12px; margin-top: 10px; border: 2px solid #dc3545; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.2);">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                <span style="font-size: 24px;">❌</span>
                <h3 style="margin: 0; font-size: 18px;">Ошибка подключения</h3>
              </div>
              <p style="margin: 0;">\${error.message || 'Не удалось отправить запрос. Проверьте подключение к интернету и попробуйте снова.'}</p>
            </div>
          \`;
        })
        .requestAccess(requestData);
    }
    
    // Загрузка запросов на доступ (для супер-админа)
    function loadAccessRequests() {
      const container = document.getElementById('requestsContainer');
      if (!container) return;
      
      container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Загрузка запросов...</p></div>';
      
      const token = getSessionToken();
      if (!token) {
        container.innerHTML = '<p style="padding: 20px; color: #dc3545;">Необходима авторизация. Войдите в систему.</p>';
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result) {
            container.innerHTML = '<p style="padding: 20px; color: #dc3545;">Ошибка: Сервер вернул пустой ответ</p>';
            return;
          }
          
          if (result.success && result.data) {
            const requests = result.data.filter(r => r.Статус === 'Ожидает' || !r.Статус);
            
            if (requests.length === 0) {
              container.innerHTML = \`
                <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;">
                  <div style="font-size: 48px; margin-bottom: 15px;">📭</div>
                  <h3 style="color: #666; margin-bottom: 10px; font-size: 18px;">Нет активных запросов</h3>
                  <p style="color: #999; font-size: 14px;">Все запросы обработаны</p>
                </div>
              \`;
              return;
            }
            
            let html = '<div class="table-container" style="overflow-x: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);"><table style="width: 100%; border-collapse: collapse; background: white;"><thead><tr><th style="background: #667eea; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Дата</th><th style="background: #6a77e7; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Имя</th><th style="background: #6e70e5; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Discord ID</th><th style="background: #7269e2; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Причина</th><th style="background: #764ba2; color: white; padding: 15px; text-align: left; font-weight: 600;">Действия</th></tr></thead><tbody>';
            requests.forEach((req, index) => {
              let date = 'Не указано';
              if (req['Дата запроса']) {
                try {
                  const dateValue = req['Дата запроса'];
                  if (typeof dateValue === 'string') {
                    date = new Date(dateValue).toLocaleDateString('ru-RU');
                  } else if (dateValue instanceof Date) {
                    date = dateValue.toLocaleDateString('ru-RU');
                  } else {
                    date = String(dateValue);
                  }
                } catch (e) {
                  date = String(req['Дата запроса']);
                }
              }
              const identifier = req.Логин || req.Имя || req['Discord ID'] || 'Не указано';
              // Экранируем только кавычки для data-атрибута (безопасность HTML-атрибута)
              // Полное HTML-экранирование не нужно, так как data-атрибут безопасен
              const safeIdentifier = String(identifier).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
              html += \`
                <tr style="border-bottom: 1px solid #f0f0f0; transition: background 0.3s;" onmouseover="this.style.background='#f8f9fa';" onmouseout="this.style.background='white';">
                  <td style="padding: 15px; color: #666; font-size: 14px;">\${escapeHtml(date)}</td>
                  <td style="padding: 15px; color: #333; font-size: 14px; font-weight: 500;">\${escapeHtml(req.Имя || 'Не указано')}</td>
                  <td style="padding: 15px; color: #666; font-family: monospace; font-size: 13px;">\${escapeHtml(req['Discord ID'] || 'Не указано')}</td>
                  <td style="padding: 15px; color: #666; font-size: 14px; max-width: 300px; word-break: break-word;">\${escapeHtml(req['Причина запроса'] || 'Не указано')}</td>
                  <td style="padding: 15px;">
                    <div style="display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
                      <button class="btn btn-success btn-approve-request" data-identifier="\${safeIdentifier}" style="padding: 8px 16px; background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3); transition: all 0.3s; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(76, 175, 80, 0.3)';">✅ Одобрить</button>
                      <button class="btn btn-danger btn-reject-request" data-identifier="\${safeIdentifier}" style="padding: 8px 16px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3); transition: all 0.3s; white-space: nowrap;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 53, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 8px rgba(220, 53, 69, 0.3)';">❌ Отклонить</button>
                    </div>
                  </td>
                </tr>
              \`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;
            
            // Добавляем обработчики событий через делегирование (безопаснее чем inline onclick)
            const tableContainer = container.querySelector('.table-container');
            if (tableContainer) {
              tableContainer.addEventListener('click', function(e) {
                const target = e.target;
                if (target.classList.contains('btn-approve-request')) {
                  const identifier = target.getAttribute('data-identifier');
                  if (identifier) {
                    approveRequest(identifier);
                  }
                } else if (target.classList.contains('btn-reject-request')) {
                  const identifier = target.getAttribute('data-identifier');
                  if (identifier) {
                    rejectRequest(identifier);
                  }
                }
              });
            }
          } else {
            const errorMsg = (result && result.error) ? result.error : 'Неизвестная ошибка';
            container.innerHTML = '<p style="padding: 20px; color: #dc3545;">Ошибка: ' + errorMsg + '</p>';
          }
        })
        .withFailureHandler(function(error) {
          container.innerHTML = '<p style="padding: 20px; color: #dc3545;">Ошибка: ' + (error.message || 'Не удалось подключиться к серверу') + '</p>';
        })
        .getAccessRequests(token);
    }
    
    // Вспомогательная функция для создания строки таблицы пользователя через DOM API
    function createUserTableRow(user, headerColor) {
      const tr = document.createElement('tr');
      tr.style.cssText = 'border-bottom: 1px solid #f0f0f0; transition: background 0.3s;';
      tr.addEventListener('mouseover', function() { this.style.background = '#f8f9fa'; });
      tr.addEventListener('mouseout', function() { this.style.background = 'white'; });
      
      // Логин
      const tdLogin = document.createElement('td');
      tdLogin.style.cssText = 'padding: 15px; color: #333; font-size: 14px; font-weight: 500;';
      tdLogin.textContent = user.Логин || 'Не указано';
      tr.appendChild(tdLogin);
      
      // Имя
      const tdName = document.createElement('td');
      tdName.style.cssText = 'padding: 15px; color: #333; font-size: 14px;';
      tdName.textContent = user.Имя || 'Не указано';
      tr.appendChild(tdName);
      
      // Discord ID
      const tdDiscord = document.createElement('td');
      tdDiscord.style.cssText = 'padding: 15px; color: #666; font-family: monospace; font-size: 13px;';
      tdDiscord.textContent = user['Discord ID'] || 'Не указано';
      tr.appendChild(tdDiscord);
      
      // Роль
      const tdRole = document.createElement('td');
      tdRole.style.cssText = 'padding: 15px; color: #333; font-size: 14px;';
      const roleSpan = document.createElement('span');
      roleSpan.style.cssText = 'padding: 4px 12px; background: ' + headerColor + '; color: white; border-radius: 12px; font-size: 12px; font-weight: 600;';
      const userRole = user.Роль || 'Пользователь';
      roleSpan.textContent = userRole;
      tdRole.appendChild(roleSpan);
      tr.appendChild(tdRole);
      
      // Дата
      const tdDate = document.createElement('td');
      tdDate.style.cssText = 'padding: 15px; color: #666; font-size: 14px;';
      let dateStr = 'Не указано';
      if (user['Дата добавления']) {
        try {
          const dateValue = user['Дата добавления'];
          if (typeof dateValue === 'string') {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
              dateStr = date.toLocaleDateString('ru-RU');
            } else {
              dateStr = dateValue;
            }
          } else {
            dateStr = String(dateValue);
          }
        } catch (e) {
          dateStr = String(user['Дата добавления']);
        }
      }
      tdDate.textContent = dateStr;
      tr.appendChild(tdDate);
      
      // Действия
      const tdActions = document.createElement('td');
      tdActions.style.cssText = 'padding: 15px;';
      const actionsDiv = document.createElement('div');
      actionsDiv.style.cssText = 'display: flex; flex-wrap: wrap; gap: 8px; align-items: center;';
      
      const isSuperAdmin = userRole === 'Супер-админ';
      if (!isSuperAdmin) {
        // Кнопка Изменить
        const btnEdit = document.createElement('button');
        btnEdit.className = 'btn btn-secondary';
        btnEdit.setAttribute('data-user-login', user.Логин || '');
        btnEdit.setAttribute('data-user-name', user.Имя || '');
        btnEdit.setAttribute('data-user-discord', user['Discord ID'] || '');
        btnEdit.setAttribute('data-user-role', userRole);
        btnEdit.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); transition: all 0.3s; white-space: nowrap;';
        btnEdit.textContent = '✏️ Изменить';
        btnEdit.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
        });
        btnEdit.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
        });
        btnEdit.addEventListener('click', function() { showEditUserModal(this); });
        actionsDiv.appendChild(btnEdit);
        
        // Кнопка Разлогинить
        const btnLogout = document.createElement('button');
        btnLogout.className = 'btn btn-warning';
        btnLogout.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3); transition: all 0.3s; white-space: nowrap;';
        btnLogout.textContent = '🚪 Разлогинить';
        btnLogout.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(255, 152, 0, 0.4)';
        });
        btnLogout.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 2px 8px rgba(255, 152, 0, 0.3)';
        });
        btnLogout.addEventListener('click', function() { logoutUserByLogin(user.Логин || ''); });
        actionsDiv.appendChild(btnLogout);
        
        // Кнопка Удалить
        const btnDelete = document.createElement('button');
        btnDelete.className = 'btn btn-danger';
        btnDelete.style.cssText = 'padding: 8px 16px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 8px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3); transition: all 0.3s; white-space: nowrap;';
        btnDelete.textContent = '🗑️ Удалить';
        btnDelete.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 4px 12px rgba(220, 53, 69, 0.4)';
        });
        btnDelete.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 2px 8px rgba(220, 53, 69, 0.3)';
        });
        btnDelete.addEventListener('click', function() { removeUserPrompt(user.Логин || ''); });
        actionsDiv.appendChild(btnDelete);
      } else {
        const span = document.createElement('span');
        span.style.cssText = 'color: #999; font-size: 13px; font-style: italic;';
        span.textContent = 'Защищенный аккаунт';
        actionsDiv.appendChild(span);
      }
      
      tdActions.appendChild(actionsDiv);
      tr.appendChild(tdActions);
      
      return tr;
    }
    
    // Загрузка авторизованных пользователей
    function loadAuthorizedUsers() {
      const container = document.getElementById('authorizedUsersContainer');
      if (!container) return;
      
      const token = getSessionToken();
      if (!token) {
        const p = document.createElement('p');
        p.style.cssText = 'padding: 20px; color: #dc3545;';
        p.textContent = 'Необходима авторизация. Войдите в систему.';
        container.innerHTML = '';
        container.appendChild(p);
        return;
      }
      
      container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Загрузка пользователей...</p></div>';
      
      google.script.run
        .withSuccessHandler(function(result) {
          container.innerHTML = '';
          
          if (!result) {
            const p = document.createElement('p');
            p.style.cssText = 'padding: 20px; color: #dc3545;';
            p.textContent = 'Ошибка: Сервер вернул пустой ответ';
            container.appendChild(p);
            return;
          }
          
          if (result.success && result.data) {
            const users = result.data;
            if (users.length === 0) {
              const p = document.createElement('p');
              p.textContent = 'Нет авторизованных пользователей';
              container.appendChild(p);
              return;
            }
            
            // Создаем контейнер таблицы
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.style.cssText = 'overflow-x: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);';
            
            const table = document.createElement('table');
            table.style.cssText = 'width: 100%; border-collapse: collapse; background: white;';
            
            // Заголовок
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = ['Логин', 'Имя', 'Discord ID', 'Роль', 'Дата авторизации', 'Действия'];
            const colors = ['#2196f3', '#1f8fea', '#1d88e1', '#1b81d8', '#197acf', '#1976d2'];
            
            headers.forEach(function(headerText, index) {
              const th = document.createElement('th');
              const borderRight = index < headers.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none';
              th.style.cssText = 'background: ' + colors[index] + '; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: ' + borderRight + ';';
              th.textContent = headerText;
              headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Тело таблицы
            const tbody = document.createElement('tbody');
            users.forEach(user => {
              const row = createUserTableRow(user, 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
              tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
          } else {
            const errorMsg = (result && result.error) ? result.error : 'Неизвестная ошибка';
            const p = document.createElement('p');
            p.style.cssText = 'padding: 20px; color: #dc3545;';
            p.textContent = 'Ошибка: ' + errorMsg;
            container.appendChild(p);
          }
        })
        .withFailureHandler(function(error) {
          container.innerHTML = '';
          const p = document.createElement('p');
          p.style.cssText = 'padding: 20px; color: #dc3545;';
          p.textContent = 'Ошибка: ' + (error.message || 'Не удалось подключиться к серверу');
          container.appendChild(p);
        })
        .getAuthorizedUsers(token);
    }
    
    // Загрузка всех пользователей
    function loadAllUsers() {
      const container = document.getElementById('allUsersContainer');
      if (!container) return;
      
      const token = getSessionToken();
      if (!token) {
        const p = document.createElement('p');
        p.style.cssText = 'padding: 20px; color: #dc3545;';
        p.textContent = 'Необходима авторизация. Войдите в систему.';
        container.innerHTML = '';
        container.appendChild(p);
        return;
      }
      
      container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Загрузка пользователей...</p></div>';
      
      google.script.run
        .withSuccessHandler(function(result) {
          container.innerHTML = '';
          
          if (!result) {
            const p = document.createElement('p');
            p.style.cssText = 'padding: 20px; color: #dc3545;';
            p.textContent = 'Ошибка: Сервер вернул пустой ответ';
            container.appendChild(p);
            return;
          }
          
          if (result.success && result.data) {
            const users = result.data;
            if (users.length === 0) {
              const p = document.createElement('p');
              p.textContent = 'Нет пользователей';
              container.appendChild(p);
              return;
            }
            
            // Создаем контейнер таблицы
            const tableContainer = document.createElement('div');
            tableContainer.className = 'table-container';
            tableContainer.style.cssText = 'overflow-x: auto; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);';
            
            const table = document.createElement('table');
            table.style.cssText = 'width: 100%; border-collapse: collapse; background: white;';
            
            // Заголовок
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            
            const headers = ['Логин', 'Имя', 'Discord ID', 'Роль', 'Дата авторизации', 'Действия'];
            const colors = ['#9c27b0', '#9324ad', '#8a21aa', '#811fa7', '#781fa4', '#7b1fa2'];
            
            headers.forEach(function(headerText, index) {
              const th = document.createElement('th');
              const borderRight = index < headers.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none';
              th.style.cssText = 'background: ' + colors[index] + '; color: white; padding: 15px; text-align: left; font-weight: 600; border-right: ' + borderRight + ';';
              th.textContent = headerText;
              headerRow.appendChild(th);
            });
            
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Тело таблицы
            const tbody = document.createElement('tbody');
            users.forEach(user => {
              const row = createUserTableRow(user, 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)');
              tbody.appendChild(row);
            });
            
            table.appendChild(tbody);
            tableContainer.appendChild(table);
            container.appendChild(tableContainer);
          } else {
            const errorMsg = (result && result.error) ? result.error : 'Неизвестная ошибка';
            const p = document.createElement('p');
            p.style.cssText = 'padding: 20px; color: #dc3545;';
            p.textContent = 'Ошибка: ' + errorMsg;
            container.appendChild(p);
          }
        })
        .withFailureHandler(function(error) {
          container.innerHTML = '';
          const p = document.createElement('p');
          p.style.cssText = 'padding: 20px; color: #dc3545;';
          p.textContent = 'Ошибка: ' + (error.message || 'Не удалось подключиться к серверу');
          container.appendChild(p);
        })
        .getAuthorizedUsers(token);
    }
    
    // Загрузка логов системы
    let allLogsData = []; // Глобальная переменная для хранения всех логов (для фильтрации)
    let currentActionFilter = ''; // Текущий выбранный фильтр по типу действия
    
    function loadLogs() {
      const container = document.getElementById('logsContainer');
      const countText = document.getElementById('logsCountText');
      
      if (!container) return;
      
      // Сбрасываем фильтр при загрузке
      currentActionFilter = '';
      const searchInput = document.getElementById('logsSearchInput');
      if (searchInput) searchInput.value = '';
      
      // Сбрасываем стили кнопок фильтра
      const buttons = document.querySelectorAll('.log-filter-btn');
      buttons.forEach(btn => {
        const btnAction = btn.getAttribute('data-action');
        if (btnAction === '') {
          btn.style.background = 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)';
          btn.style.color = 'white';
          btn.style.border = 'none';
          btn.style.boxShadow = '0 2px 8px rgba(0, 188, 212, 0.3)';
          btn.classList.add('active');
        } else {
          btn.style.background = 'white';
          btn.style.color = '#666';
          btn.style.border = '2px solid #e0e0e0';
          btn.style.boxShadow = 'none';
          btn.classList.remove('active');
        }
      });
      
      const token = getSessionToken();
      if (!token) {
        container.innerHTML = '<p style="padding: 20px; color: #dc3545; text-align: center;">❌ Необходима авторизация</p>';
        return;
      }
      
      container.innerHTML = '<div class="loading active"><div class="spinner"></div><p>Загрузка логов...</p></div>';
      if (countText) countText.textContent = 'Загрузка...';
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (!result || !result.success) {
            container.innerHTML = \`
              <div style="padding: 40px; text-align: center; background: #ffebee; border-radius: 12px; border: 2px solid #ffcdd2;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <h3 style="color: #c62828; margin-bottom: 10px;">Ошибка загрузки</h3>
                <p style="color: #d32f2f;">\${result?.error || 'Неизвестная ошибка'}</p>
              </div>
            \`;
            if (countText) countText.textContent = 'Ошибка';
            return;
          }
          
          allLogsData = result.logs || [];
          
          if (countText) {
            countText.textContent = \`Всего записей: \${result.total || 0} (показано: \${allLogsData.length})\`;
          }
          
          if (allLogsData.length === 0) {
            container.innerHTML = \`
              <div style="padding: 60px 20px; text-align: center; background: linear-gradient(135deg, #f5f5f5 0%, #e8eaf6 100%); border-radius: 16px; border: 2px dashed #9fa8da;">
                <div style="font-size: 64px; margin-bottom: 20px; opacity: 0.5;">📋</div>
                <h3 style="color: #5c6bc0; margin-bottom: 12px; font-size: 22px;">Логи отсутствуют</h3>
                <p style="color: #7986cb; font-size: 16px;">Действий в системе пока не было</p>
              </div>
            \`;
            return;
          }
          
          displayLogs(allLogsData);
        })
        .withFailureHandler(function(error) {
          container.innerHTML = \`
            <div style="padding: 40px; text-align: center; background: #ffebee; border-radius: 12px; border: 2px solid #ffcdd2;">
              <div style="font-size: 48px; margin-bottom: 15px;">⚠️</div>
              <h3 style="color: #c62828; margin-bottom: 10px;">Ошибка соединения</h3>
              <p style="color: #d32f2f;">\${error.message || 'Не удалось подключиться к серверу'}</p>
            </div>
          \`;
          if (countText) countText.textContent = 'Ошибка';
        })
        .getAllLogs(token, { limit: 200 });
    }
    
    // Отображение логов в виде красивых карточек
    function displayLogs(logs) {
      const container = document.getElementById('logsContainer');
      if (!container) return;
      
      container.innerHTML = '';
      
      if (logs.length === 0) {
        container.innerHTML = \`
          <div style="padding: 40px; text-align: center; background: #f8f9fa; border-radius: 12px; border: 2px dashed #dee2e6;">
            <div style="font-size: 48px; margin-bottom: 15px;">🔍</div>
            <h3 style="color: #666; margin-bottom: 10px;">Ничего не найдено</h3>
            <p style="color: #999;">Попробуйте изменить поисковый запрос</p>
          </div>
        \`;
        return;
      }
      
      // Создаем карточки для каждого лога
      logs.forEach((log, index) => {
        const card = document.createElement('div');
        card.className = 'log-card';
        card.style.cssText = \`
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.3s;
          border-left: 4px solid \${getActionColor(log.action)};
          cursor: pointer;
        \`;
        
        // Получаем иконку для действия
        const actionIcon = getActionIcon(log.action);
        const actionText = getActionText(log.action);
        
        card.innerHTML = \`
          <div style="display: flex; justify-content: space-between; align-items: start; gap: 20px; flex-wrap: wrap;">
            <div style="flex: 1; min-width: 250px;">
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
                <span style="font-size: 24px;">\${actionIcon}</span>
                <span style="font-weight: 700; font-size: 16px; color: \${getActionColor(log.action)};">\${actionText}</span>
              </div>
              
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-bottom: 10px;">
                <div>
                  <div style="color: #999; font-size: 12px; margin-bottom: 4px;">👤 Пользователь</div>
                  <div style="color: #333; font-weight: 600; font-size: 14px;">\${log.userName || 'Не указан'}</div>
                  \${log.userId ? \`<div style="color: #999; font-size: 11px; font-family: monospace; margin-top: 2px;">\${log.userId}</div>\` : ''}
                </div>
                
                <div>
                  <div style="color: #999; font-size: 12px; margin-bottom: 4px;">🕒 Дата и время</div>
                  <div style="color: #333; font-weight: 600; font-size: 14px;">\${log.date}</div>
                </div>
              </div>
              
              \${log.details ? \`
                <div style="background: #f8f9fa; padding: 12px; border-radius: 8px; margin-top: 10px;">
                  <div style="color: #666; font-size: 12px; margin-bottom: 4px;">📝 Детали</div>
                  <div style="color: #333; font-size: 14px; line-height: 1.5;">\${log.details}</div>
                </div>
              \` : ''}
              
              \${log.vygovorId ? \`
                <div style="margin-top: 12px;">
                  <span style="color: #999; font-size: 11px;">🆔 ID выговора:</span>
                  <span style="color: #666; font-size: 11px; font-family: monospace; margin-left: 5px;">\${log.vygovorId}</span>
                </div>
              \` : ''}
            </div>
          </div>
        \`;
        
        // Hover эффект
        card.addEventListener('mouseenter', function() {
          this.style.boxShadow = '0 8px 24px rgba(0,0,0,0.15)';
          this.style.transform = 'translateY(-2px)';
        });
        
        card.addEventListener('mouseleave', function() {
          this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          this.style.transform = '';
        });
        
        container.appendChild(card);
      });
    }
    
    // Получить цвет для типа действия
    function getActionColor(action) {
      const colors = {
        'CREATE_VYGOVOR': '#f44336',
        'UPDATE_VYGOVOR': '#ff9800',
        'APPEAL_VYGOVOR': '#2196f3',
        'REVIEW_APPEAL': '#9c27b0',
        'REQUEST_REMOVAL': '#00bcd4',
        'REVIEW_REMOVAL': '#4caf50',
        'LOGIN': '#4caf50',
        'LOGOUT': '#757575',
        'CREATE_USER': '#3f51b5',
        'UPDATE_USER': '#673ab7',
        'DELETE_USER': '#e91e63',
        'ADD_RULE': '#009688',
        'UPDATE_RULE': '#ffc107',
        'DELETE_RULE': '#ff5722',
        'ACCESS_REQUEST': '#00bcd4',
        'APPROVE_ACCESS': '#4caf50',
        'REJECT_ACCESS': '#f44336'
      };
      return colors[action] || '#607d8b';
    }
    
    // Получить иконку для типа действия
    function getActionIcon(action) {
      const icons = {
        'CREATE_VYGOVOR': '📝',
        'UPDATE_VYGOVOR': '✏️',
        'APPEAL_VYGOVOR': '⚖️',
        'REVIEW_APPEAL': '👨‍⚖️',
        'REQUEST_REMOVAL': '🗑️',
        'REVIEW_REMOVAL': '✅',
        'LOGIN': '🔓',
        'LOGOUT': '🔒',
        'CREATE_USER': '👤',
        'UPDATE_USER': '✏️',
        'DELETE_USER': '❌',
        'ADD_RULE': '➕',
        'UPDATE_RULE': '✏️',
        'DELETE_RULE': '🗑️',
        'ACCESS_REQUEST': '🔑',
        'APPROVE_ACCESS': '✅',
        'REJECT_ACCESS': '❌',
        'UNPAID_NOTIFICATION': '✏️'
      };
      return icons[action] || '📋';
    }
    
    // Получить текст для типа действия
    function getActionText(action) {
      const texts = {
        'CREATE_VYGOVOR': 'Создан выговор',
        'UPDATE_VYGOVOR': 'Обновлен выговор',
        'APPEAL_VYGOVOR': 'Обжалование выговора',
        'REVIEW_APPEAL': 'Рассмотрение обжалования',
        'REQUEST_REMOVAL': 'Запрос на снятие',
        'REVIEW_REMOVAL': 'Рассмотрение снятия',
        'LOGIN': 'Вход в систему',
        'LOGOUT': 'Выход из системы',
        'CREATE_USER': 'Создан пользователь',
        'UPDATE_USER': 'Обновлен пользователь',
        'DELETE_USER': 'Удален пользователь',
        'ADD_RULE': 'Добавлено правило',
        'UPDATE_RULE': 'Обновлено правило',
        'DELETE_RULE': 'Удалено правило',
        'ACCESS_REQUEST': 'Запрос доступа',
        'APPROVE_ACCESS': 'Доступ одобрен',
        'REJECT_ACCESS': 'Доступ отклонен',
        'UNPAID_NOTIFICATION': 'Уведомление о просрочке'
      };
      return texts[action] || action;
    }
    
    // Фильтрация логов по поисковому запросу
    function filterLogs() {
      applyAllFilters();
    }
    
    // Фильтрация логов по типу действия
    function filterLogsByAction(actionType) {
      currentActionFilter = actionType;
      
      // Обновляем стили кнопок
      const buttons = document.querySelectorAll('.log-filter-btn');
      buttons.forEach(btn => {
        const btnAction = btn.getAttribute('data-action');
        if (btnAction === actionType) {
          // Активная кнопка
          btn.style.background = 'linear-gradient(135deg, #00bcd4 0%, #0097a7 100%)';
          btn.style.color = 'white';
          btn.style.border = 'none';
          btn.style.boxShadow = '0 2px 8px rgba(0, 188, 212, 0.3)';
          btn.classList.add('active');
        } else {
          // Неактивная кнопка
          btn.style.background = 'white';
          btn.style.color = '#666';
          btn.style.border = '2px solid #e0e0e0';
          btn.style.boxShadow = 'none';
          btn.classList.remove('active');
        }
      });
      
      // Применяем фильтр
      applyAllFilters();
    }
    
    // Применение всех фильтров (поиск + тип действия)
    function applyAllFilters() {
      const searchInput = document.getElementById('logsSearchInput');
      const searchQuery = searchInput ? searchInput.value.toLowerCase().trim() : '';
      
      let filtered = allLogsData;
      
      // Фильтр по типу действия
      if (currentActionFilter) {
        filtered = filtered.filter(log => log.action === currentActionFilter);
      }
      
      // Фильтр по поисковому запросу
      if (searchQuery) {
        filtered = filtered.filter(log => {
          return (
            (log.action && typeof log.action === 'string' && log.action.toLowerCase().includes(searchQuery)) ||
            (log.userName && typeof log.userName === 'string' && log.userName.toLowerCase().includes(searchQuery)) ||
            (log.userId && typeof log.userId === 'string' && log.userId.toLowerCase().includes(searchQuery)) ||
            (log.details && typeof log.details === 'string' && log.details.toLowerCase().includes(searchQuery)) ||
            (log.vygovorId && typeof log.vygovorId === 'string' && log.vygovorId.toLowerCase().includes(searchQuery)) ||
            (log.date && typeof log.date === 'string' && log.date.toLowerCase().includes(searchQuery)) ||
            (getActionText(log.action) && getActionText(log.action).toLowerCase().includes(searchQuery))
          );
        });
      }
      
      displayLogs(filtered);
    }
    
    // Показать кастомное окно подтверждения одобрения запроса
    function showApprovalConfirmModal(identifier, callback) {
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.id = 'approvalConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = \`
        <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">
          <!-- Закрытие -->
          <button onclick="document.getElementById('approvalConfirmModal').remove();" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.2)'; this.style.color='#333'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(0,0,0,0.1)'; this.style.color='#666'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
          
          <!-- Градиентный заголовок -->
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">✅</div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Подтверждение одобрения</h2>
          </div>
          
          <!-- Содержимое -->
          <div style="padding: 30px;">
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #333; line-height: 1.6;">
              Одобрить запрос на доступ для <strong>\${identifier}</strong>?
            </p>
            <div style="padding: 15px; background: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 14px; color: #1976D2; font-weight: 600;">
                ⓘ Роль будет автоматически установлена: <strong>Админ</strong>
              </p>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button onclick="document.getElementById('approvalConfirmModal').remove();" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#999'; this.style.color='#333'; this.style.background='#f8f9fa';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#666'; this.style.background='transparent';">Отмена</button>
              <button id="confirmApprovalBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #28a745 0%, #20c997 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(40, 167, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(40, 167, 69, 0.3)';">
                Одобрить
              </button>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Обработка подтверждения
      const confirmBtn = document.getElementById('confirmApprovalBtn');
      
      function confirmApproval() {
        // Закрываем модальное окно
        modal.remove();
        
        // Вызываем callback
        if (callback) {
          callback();
        }
      }
      
      if (confirmBtn) {
        confirmBtn.onclick = confirmApproval;
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Одобрить запрос
    function approveRequest(identifier) {
      showApprovalConfirmModal(identifier, function() {
        google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success) {
            showNotification('Запрос одобрен!', 'success');
            loadAccessRequests();
            loadAuthorizedUsers();
            loadAllUsers();
            updateRequestsCounter();
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .approveAccessRequest(getSessionToken(), identifier);
      });
    }
    
    // Показать кастомное окно подтверждения отклонения запроса
    function showRejectionConfirmModal(identifier, callback) {
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.id = 'rejectionConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = \`
        <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">
          <!-- Закрытие -->
          <button onclick="document.getElementById('rejectionConfirmModal').remove();" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" onmouseover="this.style.background='rgba(0,0,0,0.2)'; this.style.color='#333'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(0,0,0,0.1)'; this.style.color='#666'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
          
          <!-- Градиентный заголовок -->
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">
            <div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">❌</div>
            <h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Подтверждение отклонения</h2>
          </div>
          
          <!-- Содержимое -->
          <div style="padding: 30px;">
            <p style="margin: 0 0 25px 0; font-size: 16px; color: #333; line-height: 1.6;">
              Отклонить запрос на доступ для <strong>\${identifier}</strong>?
            </p>
            <div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; margin-bottom: 25px;">
              <p style="margin: 0; font-size: 14px; color: #856404; font-weight: 600;">
                ⚠️ Это действие нельзя отменить
              </p>
            </div>
            
            <div style="margin-bottom: 25px;">
              <label style="font-weight: 600; color: #333; margin-bottom: 8px; display: block; font-size: 14px;">Причина отклонения <span style="color: #dc3545;">*</span></label>
              <textarea id="rejectionReason" required placeholder="Укажите причину отклонения запроса" style="padding: 14px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 15px; width: 100%; box-sizing: border-box; min-height: 100px; resize: vertical; font-family: inherit; transition: all 0.3s;" onfocus="this.style.borderColor='#dc3545'; this.style.boxShadow='0 0 0 3px rgba(220, 53, 69, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';"></textarea>
            </div>
            
            <div style="display: flex; gap: 10px;">
              <button onclick="document.getElementById('rejectionConfirmModal').remove();" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.borderColor='#999'; this.style.color='#333'; this.style.background='#f8f9fa';" onmouseout="this.style.borderColor='#e0e0e0'; this.style.color='#666'; this.style.background='transparent';">Отмена</button>
              <button id="confirmRejectionBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 20px rgba(220, 53, 69, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 4px 15px rgba(220, 53, 69, 0.3)';">
                Отклонить
              </button>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Обработка подтверждения
      const confirmBtn = document.getElementById('confirmRejectionBtn');
      
      function confirmRejection() {
        const reasonInput = document.getElementById('rejectionReason');
        const reason = reasonInput ? reasonInput.value.trim() : '';
        
        if (!reason) {
          if (reasonInput) {
            reasonInput.style.borderColor = '#dc3545';
            reasonInput.focus();
            setTimeout(function() {
              reasonInput.style.borderColor = '#e0e0e0';
            }, 2000);
          }
          return;
        }
        
        // Закрываем модальное окно
        modal.remove();
        
        // Вызываем callback с причиной
        if (callback) {
          callback(reason);
        }
      }
      
      if (confirmBtn) {
        confirmBtn.onclick = confirmRejection;
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Отклонить запрос
    function rejectRequest(identifier) {
      showRejectionConfirmModal(identifier, function(reason) {
        // Находим контейнер для показа индикатора загрузки
        const container = document.getElementById('requestsContainer');
        let loadingDiv = null;
        if (container) {
          const originalContent = container.innerHTML;
          loadingDiv = document.createElement('div');
          loadingDiv.className = 'loading active';
          loadingDiv.innerHTML = '<div class="spinner"></div><p>Отклонение запроса...</p>';
          loadingDiv.style.cssText = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255,255,255,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; z-index: 1000;';
          
          // Делаем контейнер относительно позиционированным, если еще не так
          if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
          }
          
          container.appendChild(loadingDiv);
        }
        
        google.script.run
        .withSuccessHandler(function(result) {
          if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.remove();
          }
          
          if (result && result.success) {
            showNotification('Запрос отклонен', 'success');
            loadAccessRequests();
            // Обновляем счетчик с задержкой
            setTimeout(function() {
              updateRequestsCounter();
            }, 1000);
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          if (loadingDiv && loadingDiv.parentNode) {
            loadingDiv.remove();
          }
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .rejectAccessRequest(getSessionToken(), identifier, reason || '');
      });
    }
    
    // Модальное окно для редактирования пользователя
    function showEditUserModal(button) {
      const login = button.getAttribute('data-user-login');
      const currentName = button.getAttribute('data-user-name') || '';
      const currentDiscordId = button.getAttribute('data-user-discord') || '';
      const currentRole = button.getAttribute('data-user-role') || 'Пользователь';
      
      // Удаляем предыдущее модальное окно, если оно есть
      const existingModal = document.getElementById('editUserModal_' + login);
      if (existingModal) {
        existingModal.remove();
      }
      
      const modal = document.createElement('div');
      modal.id = 'editUserModal_' + login;
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center;';
      
      // Создаем контейнер модального окна
      const modalContent = document.createElement('div');
      modalContent.style.cssText = 'background: white; border-radius: 16px; padding: 30px; max-width: 500px; width: 90%; box-shadow: 0 8px 30px rgba(0,0,0,0.3);';
      
      // Заголовок
      const title = document.createElement('h3');
      title.textContent = 'Редактировать пользователя';
      title.style.cssText = 'margin: 0 0 20px 0; color: #333; font-size: 20px; font-weight: 600;';
      
      // Логин
      const loginP = document.createElement('p');
      loginP.style.cssText = 'margin: 0 0 15px 0; color: #666; font-size: 14px;';
      loginP.appendChild(document.createTextNode('Логин: '));
      const loginStrong = document.createElement('strong');
      loginStrong.textContent = login;
      loginP.appendChild(loginStrong);
      
      // Группа для имени
      const nameGroup = document.createElement('div');
      nameGroup.style.cssText = 'margin-bottom: 20px;';
      
      const nameLabel = document.createElement('label');
      nameLabel.textContent = 'Имя (Имя Фамилия):';
      nameLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 14px;';
      
      const nameInput = document.createElement('input');
      nameInput.type = 'text';
      nameInput.id = 'editUserName_' + login;
      nameInput.value = currentName;
      nameInput.placeholder = 'Имя Фамилия';
      nameInput.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; transition: all 0.3s; box-sizing: border-box;';
      nameInput.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
        this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      });
      nameInput.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
      });
      
      nameGroup.appendChild(nameLabel);
      nameGroup.appendChild(nameInput);
      
      // Группа для Discord ID
      const discordGroup = document.createElement('div');
      discordGroup.style.cssText = 'margin-bottom: 20px;';
      
      const discordLabel = document.createElement('label');
      discordLabel.textContent = 'Discord ID:';
      discordLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 14px;';
      
      const discordInput = document.createElement('input');
      discordInput.type = 'text';
      discordInput.id = 'editUserDiscordId_' + login;
      discordInput.value = currentDiscordId;
      discordInput.placeholder = 'Discord ID';
      discordInput.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; font-family: monospace; transition: all 0.3s; box-sizing: border-box;';
      discordInput.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
        this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      });
      discordInput.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
      });
      
      discordGroup.appendChild(discordLabel);
      discordGroup.appendChild(discordInput);
      
      // Группа для роли
      const roleGroup = document.createElement('div');
      roleGroup.style.cssText = 'margin-bottom: 20px;';
      
      const roleLabel = document.createElement('label');
      roleLabel.textContent = 'Роль:';
      roleLabel.style.cssText = 'display: block; margin-bottom: 8px; color: #333; font-weight: 600; font-size: 14px;';
      
      const roleSelect = document.createElement('select');
      roleSelect.id = 'editUserRole_' + login;
      roleSelect.style.cssText = 'width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 15px; background: white; cursor: pointer; transition: all 0.3s; box-sizing: border-box;';
      
      const roleOptions = ['Пользователь', 'Админ', 'Супер-админ'];
      roleOptions.forEach(function(role) {
        const option = document.createElement('option');
        option.value = role;
        option.textContent = role;
        if (role === currentRole) {
          option.selected = true;
        }
        roleSelect.appendChild(option);
      });
      
      roleSelect.addEventListener('focus', function() {
        this.style.borderColor = '#667eea';
        this.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
      });
      roleSelect.addEventListener('blur', function() {
        this.style.borderColor = '#e0e0e0';
        this.style.boxShadow = 'none';
      });
      
      roleGroup.appendChild(roleLabel);
      roleGroup.appendChild(roleSelect);
      
      // Кнопки
      const buttonsGroup = document.createElement('div');
      buttonsGroup.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';
      
      const cancelBtn = document.createElement('button');
      cancelBtn.id = 'cancelEditBtn_' + login;
      cancelBtn.textContent = 'Отмена';
      cancelBtn.style.cssText = 'padding: 10px 20px; background: #f5f5f5; color: #333; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.3s;';
      cancelBtn.addEventListener('mouseover', function() {
        this.style.background = '#e0e0e0';
      });
      cancelBtn.addEventListener('mouseout', function() {
        this.style.background = '#f5f5f5';
      });
      cancelBtn.addEventListener('click', function() {
        modal.remove();
      });
      
      const saveBtn = document.createElement('button');
      saveBtn.id = 'saveEditBtn_' + login;
      saveBtn.textContent = 'Сохранить';
      saveBtn.style.cssText = 'padding: 10px 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 14px; font-weight: 600; cursor: pointer; box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3); transition: all 0.3s;';
      saveBtn.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
      });
      saveBtn.addEventListener('mouseout', function() {
        this.style.transform = '';
        this.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
      });
      saveBtn.addEventListener('click', function() {
        updateUser(login);
        modal.remove();
      });
      
      buttonsGroup.appendChild(cancelBtn);
      buttonsGroup.appendChild(saveBtn);
      
      // Собираем модальное окно
      modalContent.appendChild(title);
      modalContent.appendChild(loginP);
      modalContent.appendChild(nameGroup);
      modalContent.appendChild(discordGroup);
      modalContent.appendChild(roleGroup);
      modalContent.appendChild(buttonsGroup);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Закрытие по клику вне модального окна
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Обновить данные пользователя
    function updateUser(login) {
      const nameInput = document.getElementById('editUserName_' + login);
      const discordIdInput = document.getElementById('editUserDiscordId_' + login);
      const roleSelect = document.getElementById('editUserRole_' + login);
      
      const newName = nameInput ? nameInput.value.trim() : '';
      const newDiscordId = discordIdInput ? discordIdInput.value.trim() : '';
      const newRole = roleSelect ? roleSelect.value : 'Пользователь';
      
      if (!newRole || !['Пользователь', 'Админ', 'Супер-админ'].includes(newRole)) {
        showNotification('Неверная роль', 'error');
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success) {
            showNotification('Данные пользователя обновлены!', 'success');
            loadAuthorizedUsers();
            loadAllUsers();
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .updateUser(getSessionToken(), login, newName, newDiscordId, newRole);
    }
    
    // Разлогинить пользователя (удалить все его сессии)
    function logoutUserByLogin(login) {
      // Экранируем кавычки и специальные символы в логине
      const safeLogin = escapeJsString(login);
      if (!confirm('Вы уверены, что хотите разлогинить пользователя ' + safeLogin + '?\\n\\nВсе его активные сессии будут удалены, и пользователю потребуется войти заново.')) {
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success) {
            showNotification('Пользователь разлогинен', 'success');
            loadAuthorizedUsers();
            loadAllUsers();
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .logoutUserByLogin(getSessionToken(), login);
    }
    
    // Подтверждение удаления пользователя
    function removeUserPrompt(login) {
      // Создаем модальное окно вместо confirm для безопасности
      const modal = document.createElement('div');
      modal.id = 'removeUserConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<button id="closeRemoveUserModalBtn" style="position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.1); border: none; font-size: 24px; cursor: pointer; color: #666; padding: 8px; line-height: 1; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s; z-index: 10;" title="Закрыть">×</button>' +
        '<div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center; color: white;">' +
          '<div style="font-size: 48px; margin-bottom: 10px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🗑️</div>' +
          '<h2 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Подтверждение удаления</h2>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<p style="margin: 0 0 20px 0; font-size: 16px; color: #333; line-height: 1.6;">Вы уверены, что хотите удалить пользователя <strong id="removeUserLoginText"></strong>?</p>' +
          '<div style="padding: 15px; background: #fff3cd; border-left: 4px solid #ffc107; border-radius: 8px; margin-bottom: 25px;">' +
            '<p style="margin: 0; font-size: 14px; color: #856404; font-weight: 600;">⚠️ Это действие нельзя отменить.</p>' +
          '</div>' +
          '<div style="display: flex; gap: 10px;">' +
            '<button class="cancelRemoveUserBtn" style="flex: 1; padding: 14px; background: transparent; border: 2px solid #e0e0e0; border-radius: 12px; color: #666; cursor: pointer; font-weight: 600; transition: all 0.3s;">Отмена</button>' +
            '<button id="confirmRemoveUserBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); border: none; border-radius: 12px; color: white; cursor: pointer; font-weight: 600; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;">Удалить</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Безопасно вставляем логин через textContent
      const loginText = modal.querySelector('#removeUserLoginText');
      if (loginText) {
        loginText.textContent = login || 'Неизвестно';
      }
      
      // Обработчики событий
      const confirmBtn = modal.querySelector('#confirmRemoveUserBtn');
      const cancelBtn = modal.querySelector('.cancelRemoveUserBtn');
      const closeBtn = modal.querySelector('#closeRemoveUserModalBtn');
      
      // Добавляем обработчики hover для кнопки закрытия через DOM API
      if (closeBtn) {
        closeBtn.addEventListener('mouseover', function() {
          this.style.background = 'rgba(0,0,0,0.2)';
          this.style.color = '#333';
          this.style.transform = 'rotate(90deg)';
        });
        closeBtn.addEventListener('mouseout', function() {
          this.style.background = 'rgba(0,0,0,0.1)';
          this.style.color = '#666';
          this.style.transform = 'rotate(0deg)';
        });
        closeBtn.onclick = function() {
          modal.remove();
        };
      }
      
      // Добавляем обработчики hover для кнопки "Отмена"
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseover', function() {
          this.style.borderColor = '#999';
          this.style.color = '#333';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseout', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'transparent';
        });
      }
      
      // Добавляем обработчики hover для кнопки "Удалить"
      if (confirmBtn) {
        confirmBtn.addEventListener('mouseover', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
        });
        confirmBtn.addEventListener('mouseout', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
        });
      }
      
      function confirmRemove() {
        modal.remove();
        google.script.run
          .withSuccessHandler(function(result) {
            if (result && result.success) {
              showNotification('Пользователь удален', 'success');
              loadAuthorizedUsers();
              loadAllUsers();
              if (document.getElementById('usersContainer')) {
                loadUsers();
              }
            } else {
              showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
            }
          })
          .withFailureHandler(function(error) {
            showNotification('Ошибка: ' + error.message, 'error');
          })
          .removeUser(getSessionToken(), login);
      }
      
      function cancelRemove() {
        modal.remove();
      }
      
      if (confirmBtn) {
        confirmBtn.onclick = confirmRemove;
      }
      if (cancelBtn) {
        cancelBtn.onclick = cancelRemove;
      }
      
      // Закрытие по клику вне формы
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          modal.remove();
        }
      });
      
      // Закрытие по Escape
      const escapeHandler = function(e) {
        if (e.key === 'Escape') {
          modal.remove();
          document.removeEventListener('keydown', escapeHandler);
        }
      };
      document.addEventListener('keydown', escapeHandler);
    }
    
    // Изменить роль (для формы в разделе пользователей)
    function changeUserRolePrompt(login, currentRole) {
      const newRole = prompt('Введите новую роль (Пользователь/Админ/Супер-админ):', currentRole);
      if (!newRole) return;
      
      if (!['Пользователь', 'Админ', 'Супер-админ'].includes(newRole)) {
        showNotification('Неверная роль', 'error');
        return;
      }
      
      changeUserRole(login);
    }
    
    // Загрузка данных выговора для автозаполнения формы обжалования
    function loadVygovorDataForAppeal() {
      const vygovorIdInput = document.getElementById('appealVygovorId');
      const userNameInput = document.getElementById('appealUserName');
      const userIdInput = document.getElementById('appealUserId');
      
      if (!vygovorIdInput || !userNameInput || !userIdInput) return;
      
      const vygovorId = vygovorIdInput.value.trim();
      
      if (!vygovorId) {
        // Очищаем поля если ID пустой
        userNameInput.value = '';
        userIdInput.value = '';
        userNameInput.style.background = '#f5f5f5';
        userIdInput.style.background = '#f5f5f5';
        return;
      }
      
      // Показываем индикатор загрузки
      userNameInput.value = 'Загрузка...';
      userIdInput.value = 'Загрузка...';
      userNameInput.style.background = '#fff3cd';
      userIdInput.style.background = '#fff3cd';
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success && result.data) {
            const vygovor = result.data;
            // Заполняем поля данными получателя
            userNameInput.value = vygovor.Получатель || '';
            userIdInput.value = vygovor['Discord ID получателя'] || '';
            userNameInput.style.background = '#f5f5f5';
            userIdInput.style.background = '#f5f5f5';
            
            if (vygovor.Получатель && vygovor['Discord ID получателя']) {
              showNotification('Данные загружены автоматически', 'success');
            } else {
              showNotification('Данные о получателе не найдены', 'warning');
            }
          } else {
            userNameInput.value = '';
            userIdInput.value = '';
            userNameInput.style.background = '#ffebee';
            userIdInput.style.background = '#ffebee';
            showNotification('Выговор не найден. Проверьте ID', 'error');
          }
        })
        .withFailureHandler(function(error) {
          userNameInput.value = '';
          userIdInput.value = '';
          userNameInput.style.background = '#ffebee';
          userIdInput.style.background = '#ffebee';
          showNotification('Ошибка загрузки данных: ' + (error.message || 'Неизвестная ошибка'), 'error');
        })
        .getVygovorById(vygovorId);
    }
    
    // Обжалование выговора
    function appealVygovorHandler(event) {
      event.preventDefault();
      
      const vygovorId = document.getElementById('appealVygovorId') ? document.getElementById('appealVygovorId').value.trim() : '';
      const appealData = {
        userId: document.getElementById('appealUserId') ? document.getElementById('appealUserId').value.trim() : '',
        userName: document.getElementById('appealUserName') ? document.getElementById('appealUserName').value.trim() : '',
        reason: document.getElementById('appealReason') ? document.getElementById('appealReason').value.trim() : '',
        proof: document.getElementById('appealProof') ? document.getElementById('appealProof').value.trim() : ''
      };
      
      if (!vygovorId) {
        showNotification('Введите ID выговора', 'error');
        return;
      }
      
      if (!appealData.userName || !appealData.userId) {
        showNotification('Данные обжалующего не заполнены. Убедитесь, что ID выговора корректен', 'error');
        return;
      }
      
      if (!appealData.reason) {
        showNotification('Укажите причину обжалования', 'error');
        return;
      }
      
      // 🔍 ОТЛАДКА: Логирование данных обжалования
      console.log('🔔 ОБЖАЛОВАНИЕ ВЫГОВОРА - Начало');
      console.log('ID выговора:', vygovorId);
      console.log('Данные обжалования:', appealData);
      console.log('Discord ID обжалующего:', appealData.userId);
      console.log('Имя обжалующего:', appealData.userName);
      console.log('Причина:', appealData.reason);
      console.log('Доказательства:', appealData.proof);
      
      // Получаем кнопку и форму
      const submitButton = document.getElementById('appealSubmitBtn') || event.target.querySelector('button[type="submit"]');
      const form = document.getElementById('appealForm');
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      
      // Показываем индикатор загрузки
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
        submitButton.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Отправка...</span>';
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          console.log('✅ ОТВЕТ ОТ СЕРВЕРА - appealVygovor:', result);
          
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          if (result && result.success) {
            console.log('✅ Обжалование подано успешно!');
            console.log('💡 Проверьте Apps Script → Журнал выполнения для серверных логов');
            showNotification('Обжалование подано успешно!', 'success');
            if (form) {
              form.reset();
              // Сбрасываем стили полей
              const userNameInput = document.getElementById('appealUserName');
              const userIdInput = document.getElementById('appealUserId');
              if (userNameInput) userNameInput.style.background = '#f5f5f5';
              if (userIdInput) userIdInput.style.background = '#f5f5f5';
            }
            // Обновляем счетчик обжалований
            updateAppealsCounter();
          } else {
            console.error('❌ ОШИБКА СЕРВЕРА:', result);
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          console.error('❌ КРИТИЧЕСКАЯ ОШИБКА - appealVygovor:', error);
          console.error('Сообщение:', error.message);
          
          // Восстанавливаем кнопку
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .appealVygovor(vygovorId, appealData);
      
      console.log('📤 Вызов google.script.run.appealVygovor() отправлен');
    }
    
    // Загрузка данных выговора для автозаполнения формы снятия
    function loadVygovorDataForRemoval() {
      const vygovorIdInput = document.getElementById('removeVygovorId');
      const removedByNameInput = document.getElementById('removeUserName');
      const removedByIdInput = document.getElementById('removeUserId');
      const issuerNameInput = document.getElementById('removeIssuerName');
      const issuerIdInput = document.getElementById('removeIssuerId');
      
      if (!vygovorIdInput || !removedByNameInput || !removedByIdInput || !issuerNameInput || !issuerIdInput) return;
      
      const vygovorId = vygovorIdInput.value.trim();
      
      if (!vygovorId) {
        // Очищаем поля если ID пустой
        removedByNameInput.value = '';
        removedByIdInput.value = '';
        issuerNameInput.value = '';
        issuerIdInput.value = '';
        removedByNameInput.style.background = '#f5f5f5';
        removedByIdInput.style.background = '#f5f5f5';
        issuerNameInput.style.background = '#f5f5f5';
        issuerIdInput.style.background = '#f5f5f5';
        return;
      }
      
      // Показываем индикатор загрузки
      removedByNameInput.value = 'Загрузка...';
      removedByIdInput.value = 'Загрузка...';
      issuerNameInput.value = 'Загрузка...';
      issuerIdInput.value = 'Загрузка...';
      removedByNameInput.style.background = '#fff3cd';
      removedByIdInput.style.background = '#fff3cd';
      issuerNameInput.style.background = '#fff3cd';
      issuerIdInput.style.background = '#fff3cd';
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success && result.data) {
            const vygovor = result.data;
            // Заполняем поля данными получателя (снимающего) и выдающего
            removedByNameInput.value = vygovor.Получатель || '';
            removedByIdInput.value = vygovor['Discord ID получателя'] || '';
            issuerNameInput.value = vygovor.Выдавший || '';
            issuerIdInput.value = vygovor['Discord ID выдающего'] || '';
            removedByNameInput.style.background = '#f5f5f5';
            removedByIdInput.style.background = '#f5f5f5';
            issuerNameInput.style.background = '#f5f5f5';
            issuerIdInput.style.background = '#f5f5f5';
            
            if (vygovor.Получатель && vygovor['Discord ID получателя']) {
              showNotification('Данные загружены автоматически', 'success');
            } else {
              showNotification('Данные о получателе не найдены', 'warning');
            }
          } else {
            removedByNameInput.value = '';
            removedByIdInput.value = '';
            issuerNameInput.value = '';
            issuerIdInput.value = '';
            removedByNameInput.style.background = '#ffebee';
            removedByIdInput.style.background = '#ffebee';
            issuerNameInput.style.background = '#ffebee';
            issuerIdInput.style.background = '#ffebee';
            showNotification('Выговор не найден. Проверьте ID', 'error');
          }
        })
        .withFailureHandler(function(error) {
          removedByNameInput.value = '';
          removedByIdInput.value = '';
          issuerNameInput.value = '';
          issuerIdInput.value = '';
          removedByNameInput.style.background = '#ffebee';
          removedByIdInput.style.background = '#ffebee';
          issuerNameInput.style.background = '#ffebee';
          issuerIdInput.style.background = '#ffebee';
          showNotification('Ошибка загрузки данных: ' + (error.message || 'Неизвестная ошибка'), 'error');
        })
        .getVygovorById(vygovorId);
    }
    
    // Снятие выговора (подача заявки)
    function removeVygovorHandler(event) {
      event.preventDefault();
      
      const submitButton = document.getElementById('removeSubmitBtn');
      if (isLoading && submitButton) return;
      
      const originalButtonText = submitButton ? submitButton.innerHTML : '';
      isLoading = true;
      if (submitButton) {
        submitButton.disabled = true;
        submitButton.style.opacity = '0.7';
        submitButton.style.cursor = 'not-allowed';
        submitButton.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Отправка...</span>';
      }
      
      const vygovorId = document.getElementById('removeVygovorId') ? document.getElementById('removeVygovorId').value.trim() : '';
      const removalData = {
        removalType: document.getElementById('removalType') ? document.getElementById('removalType').value : '',
        proof: document.getElementById('removeProof') ? document.getElementById('removeProof').value.trim() : '',
        removedByName: document.getElementById('removeUserName') ? document.getElementById('removeUserName').value.trim() : '',
        removedById: document.getElementById('removeUserId') ? document.getElementById('removeUserId').value.trim() : '',
        issuerName: document.getElementById('removeIssuerName') ? document.getElementById('removeIssuerName').value.trim() : '',
        issuerId: document.getElementById('removeIssuerId') ? document.getElementById('removeIssuerId').value.trim() : ''
      };
      
      if (!vygovorId) {
        showNotification('Введите ID выговора', 'error');
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      if (!removalData.removedByName || !removalData.removedById) {
        showNotification('Данные снимающего не заполнены. Убедитесь, что ID выговора корректен', 'error');
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      if (!removalData.removalType) {
        showNotification('Выберите тип снятия', 'error');
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      if (!removalData.proof) {
        showNotification('Опишите доказательства снятия выговора', 'error');
        isLoading = false;
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.style.opacity = '1';
          submitButton.style.cursor = 'pointer';
          submitButton.innerHTML = originalButtonText;
        }
        return;
      }
      
      google.script.run
        .withSuccessHandler(function(result) {
          isLoading = false;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          
          if (result && result.success) {
            showNotification('Заявка на снятие успешно подана! Ожидайте рассмотрения.', 'success');
            const form = document.getElementById('removeForm');
            if (form) {
              form.reset();
              // Сбрасываем стили полей
              const removedByNameInput = document.getElementById('removeUserName');
              const removedByIdInput = document.getElementById('removeUserId');
              const issuerNameInput = document.getElementById('removeIssuerName');
              const issuerIdInput = document.getElementById('removeIssuerId');
              if (removedByNameInput) removedByNameInput.style.background = '#f5f5f5';
              if (removedByIdInput) removedByIdInput.style.background = '#f5f5f5';
              if (issuerNameInput) issuerNameInput.style.background = '#f5f5f5';
              if (issuerIdInput) issuerIdInput.style.background = '#f5f5f5';
            }
            // Обновляем счетчик заявок на снятие с задержкой
            setTimeout(function() {
              updateRemovalsCounter();
            }, 1000);
          } else {
            showNotification('Ошибка: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          isLoading = false;
          if (submitButton) {
            submitButton.disabled = false;
            submitButton.style.opacity = '1';
            submitButton.style.cursor = 'pointer';
            submitButton.innerHTML = originalButtonText;
          }
          showNotification('Ошибка: ' + error.message, 'error');
        })
        .requestVygovorRemoval(vygovorId, removalData);
    }
    
    // Просмотр деталей выговора
    function viewVygovorDetails(vygovorId) {
      if (!vygovorId) {
        showNotification('ID выговора не указан', 'error');
        return;
      }
      
      // Создаем модальное окно с индикатором загрузки
      const modal = document.createElement('div');
      modal.className = 'vygovor-detail-modal-overlay';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); z-index: 10000; display: flex; align-items: center; justify-content: center; padding: 20px;';
      
      // Функция для закрытия модального окна
      const closeModal = function() {
        if (modal && modal.parentNode) {
          modal.remove();
        }
      };
      
      modal.innerHTML = \`
        <div class="vygovor-detail-modal" style="background: white; border-radius: 16px; max-width: 800px; width: 100%; max-height: 90vh; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.3); position: relative; display: flex; flex-direction: column;">
          <div style="flex-shrink: 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px 25px; border-radius: 16px 16px 0 0; display: flex; justify-content: space-between; align-items: center; z-index: 10;">
            <h2 style="margin: 0; font-size: 24px;">📋 Детали выговора</h2>
            <button class="close-detail-modal-btn" style="background: rgba(255,255,255,0.2); border: none; color: white; font-size: 24px; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">×</button>
          </div>
          <div id="vygovorDetailLoading" style="flex: 1; display: flex; align-items: center; justify-content: center; padding: 60px 30px;">
            <div style="text-align: center;">
              <div class="loading active" style="margin-bottom: 20px;">
                <div class="spinner" style="width: 50px; height: 50px; border-width: 4px;"></div>
              </div>
              <p style="color: #666; font-size: 16px; margin: 0;">Загрузка деталей выговора...</p>
            </div>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
      
      // Добавляем обработчики для закрытия модального окна
      modal.addEventListener('click', function(e) {
        // Закрытие при клике вне модального окна (на overlay)
        if (e.target === modal || e.target.classList.contains('vygovor-detail-modal-overlay')) {
          closeModal();
        }
      });
      
      // Обработчики для кнопок закрытия (добавляются после загрузки контента)
      // Также добавляем обработчик для кнопки в заголовке, которая уже есть
      setTimeout(function() {
        const initialCloseBtn = modal.querySelector('.close-detail-modal-btn');
        if (initialCloseBtn) {
          initialCloseBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            closeModal();
          });
        }
      }, 100);
      
      google.script.run
        .withSuccessHandler(function(result) {
          const loadingEl = document.getElementById('vygovorDetailLoading');
          if (loadingEl) {
            loadingEl.style.display = 'none';
          }
          if (result && result.success && result.data) {
            const vygovor = result.data;
            
            // Форматируем даты для отображения
            const formatDate = function(dateValue) {
              if (!dateValue) return 'Не указано';
              try {
                const date = new Date(dateValue);
                if (!isNaN(date.getTime())) {
                  return date.toLocaleDateString('ru-RU') + ' ' + date.toLocaleTimeString('ru-RU');
                }
                return String(dateValue);
              } catch (e) {
                return String(dateValue || 'Не указано');
              }
            };
            
            // Находим контейнер модального окна
            const modalContainer = modal.querySelector('.vygovor-detail-modal');
            if (!modalContainer) return;
            
            // Удаляем индикатор загрузки и добавляем контент
            const loadingEl = document.getElementById('vygovorDetailLoading');
            if (loadingEl) {
              loadingEl.remove();
            }
            
            // Создаем контент с деталями
            const contentDiv = document.createElement('div');
            contentDiv.className = 'vygovor-detail-content';
            contentDiv.style.cssText = 'flex: 1; overflow-y: auto; overflow-x: hidden; padding: 30px;';
            contentDiv.innerHTML = \`
                  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
                    <div class="detail-field" style="grid-column: 1 / -1;">
                      <div class="detail-label">🆔 ID</div>
                      <div class="detail-value" style="font-family: monospace; font-size: 13px; word-break: break-all; background: #f5f5f5; padding: 10px; border-radius: 8px;">\${escapeHtml(vygovor.ID || 'Не указано')}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">📅 Дата выдачи</div>
                      <div class="detail-value">\${formatDate(vygovor.Создано || vygovor.Дата)}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">👤 Получатель</div>
                      <div class="detail-value">\${escapeHtml(vygovor.Получатель || 'Не указано')}</div>
                      <div style="font-size: 12px; color: #999; margin-top: 5px;">Discord ID: \${escapeHtml(vygovor['Discord ID получателя'] || 'N/A')}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">👔 Выдавший</div>
                      <div class="detail-value">\${escapeHtml(vygovor.Выдавший || 'Не указано')}</div>
                      <div style="font-size: 12px; color: #999; margin-top: 5px;">Discord ID: \${escapeHtml(vygovor['Discord ID выдающего'] || 'N/A')}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">📋 Правило</div>
                      <div class="detail-value">\${escapeHtml(vygovor.Правило || 'Не указано')}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">🏷️ Тип</div>
                      <div class="detail-value">
                        <span class="vygovor-type-badge" style="background: linear-gradient(135deg, \${vygovor.Тип === 'VR' ? '#4285f4' : vygovor.Тип === 'WR' ? '#9c27b0' : vygovor.Тип === 'SR' ? '#ea4335' : '#fbbc05'} 0%, \${vygovor.Тип === 'VR' ? '#1976d2' : vygovor.Тип === 'WR' ? '#7b1fa2' : vygovor.Тип === 'SR' ? '#c62828' : '#f57c00'} 100%);">
                          \${vygovor.Тип === 'VR' ? '💬' : vygovor.Тип === 'WR' ? '📄' : vygovor.Тип === 'SR' ? '⚠️' : '💵'} \${escapeHtml(vygovor.Тип || 'N/A')}
                        </span>
                      </div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">💰 Сумма штрафа</div>
                      <div class="detail-value" style="font-weight: bold; color: \${parseFloat(vygovor.Сумма || 0) > 0 ? '#ea4335' : '#999'};">\${parseFloat(vygovor.Сумма || 0) > 0 ? parseFloat(vygovor.Сумма) + '$' : 'Нет'}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">⏰ Часы отработки</div>
                      <div class="detail-value" style="font-weight: bold; color: \${parseFloat(vygovor['Часы отработки'] || 0) > 0 ? '#f57c00' : '#999'};">\${parseFloat(vygovor['Часы отработки'] || 0) > 0 ? parseFloat(vygovor['Часы отработки']) + ' ч.' : 'Нет'}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">⏳ Срок оплаты</div>
                      <div class="detail-value" style="font-weight: bold; color: \${vygovor['Срок оплаты'] ? (new Date(vygovor['Срок оплаты']) < new Date() ? '#ea4335' : '#4caf50') : '#999'};">
                        \${vygovor['Срок оплаты'] ? formatDate(vygovor['Срок оплаты']) : 'Не указан'}
                        \${vygovor['Срок оплаты'] && new Date(vygovor['Срок оплаты']) < new Date() && vygovor.Статус === 'Активен' ? '<br><span style="font-size: 11px; color: #ea4335; font-weight: normal;">⚠️ ПРОСРОЧЕН</span>' : ''}
                        \${vygovor['Срок оплаты'] && new Date(vygovor['Срок оплаты']) >= new Date() && vygovor.Статус === 'Активен' ? '<br><span style="font-size: 11px; color: #4caf50; font-weight: normal;">✓ Еще актуален</span>' : ''}
                      </div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">📊 Статус</div>
                      <div class="detail-value">
                        <span class="vygovor-status-badge \${getStatusClass(vygovor.Статус)}">
                          \${vygovor.Статус === 'Активен' ? '⚡' : vygovor.Статус === 'Оплачен' ? '💰' : vygovor.Статус === 'Отработан' ? '⏰' : vygovor.Статус === 'Обжалован' ? '⚖️' : '✅'}
                          \${escapeHtml(vygovor.Статус || 'Неизвестно')}
                        </span>
                      </div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">💰 Дата оплаты</div>
                      <div class="detail-value">\${formatDate(vygovor['Дата оплаты'])}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">⏰ Дата отработки</div>
                      <div class="detail-value">\${formatDate(vygovor['Дата отработки'])}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">✅ Дата снятия</div>
                      <div class="detail-value">\${formatDate(vygovor['Дата снятия'])}</div>
                    </div>
                    
                    <div class="detail-field" style="grid-column: 1 / -1;">
                      <div class="detail-label">🗑️ Снятие выговора</div>
                      <div class="detail-value" style="background: #e8f5e9; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                        \${(function() {
                          const removalData = vygovor.Комментарий || '';
                          if (!removalData || removalData === 'Нет' || removalData === 'Нет комментария') {
                            return '<span style="color: #999;">Заявка на снятие не подавалась</span>';
                          }
                          
                          try {
                            // Пытаемся распарсить JSON
                            const removal = typeof removalData === 'string' ? JSON.parse(removalData) : removalData;
                            
                            let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
                            
                            // Статус заявки
                            const status = removal.status || 'Не указано';
                            let statusColor = '#666';
                            let statusIcon = '⏳';
                            if (status === 'Ожидает рассмотрения') {
                              statusColor = '#4caf50';
                              statusIcon = '⏳';
                            } else if (status === 'Одобрено') {
                              statusColor = '#4caf50';
                              statusIcon = '✅';
                            } else if (status === 'Отклонено') {
                              statusColor = '#dc3545';
                              statusIcon = '❌';
                            }
                            
                            html += '<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid ' + statusColor + ';">';
                            html += '<strong style="color: ' + statusColor + ';">' + statusIcon + ' Статус:</strong> ' + escapeHtml(status);
                            html += '</div>';
                            
                            // Тип снятия
                            if (removal.removalType) {
                              html += '<div><strong>💰 Тип снятия:</strong> ' + escapeHtml(removal.removalType) + '</div>';
                            }
                            
                            // Кто снимает
                            if (removal.removedByName) {
                              html += '<div><strong>👤 Кто снимает:</strong> ' + escapeHtml(removal.removedByName);
                              if (removal.removedById) {
                                html += ' <span style="font-family: monospace; color: #666; font-size: 12px;">(' + escapeHtml(removal.removedById) + ')</span>';
                              }
                              html += '</div>';
                            }
                            
                            // Кто выдавал
                            if (removal.issuerName) {
                              html += '<div><strong>👔 Выдавший выговор:</strong> ' + escapeHtml(removal.issuerName);
                              if (removal.issuerId) {
                                html += ' <span style="font-family: monospace; color: #666; font-size: 12px;">(' + escapeHtml(removal.issuerId) + ')</span>';
                              }
                              html += '</div>';
                            }
                            
                            // Доказательства снятия
                            if (removal.proof && removal.proof !== 'Нет') {
                              html += '<div style="background: white; padding: 12px; border-radius: 8px;">';
                              html += '<strong>📎 Доказательства:</strong><br>';
                              const proofLines = removal.proof.split('\\n').filter(line => line.trim());
                              if (proofLines.length > 0) {
                                html += '<div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">';
                                proofLines.forEach(function(line, idx) {
                                  line = line.trim();
                                  if (line.match(/^https?:\\/\\//i)) {
                                    html += '<div><span style="color: #4caf50; font-weight: 600;">' + (idx + 1) + '.</span> <a href="' + line + '" target="_blank" style="color: #4caf50; text-decoration: none; word-break: break-all;" onmouseover="this.style.textDecoration=\\'underline\\'" onmouseout="this.style.textDecoration=\\'none\\'">' + line + '</a></div>';
                                  } else {
                                    html += '<div><span style="color: #4caf50; font-weight: 600;">' + (idx + 1) + '.</span> ' + escapeHtml(line) + '</div>';
                                  }
                                });
                                html += '</div>';
                              }
                              html += '</div>';
                            }
                            
                            // Дата подачи заявки
                            if (removal.requestDate) {
                              const requestDate = new Date(removal.requestDate);
                              if (!isNaN(requestDate.getTime())) {
                                html += '<div style="color: #666; font-size: 12px;"><strong>📅 Дата подачи заявки:</strong> ' + requestDate.toLocaleString('ru-RU') + '</div>';
                              }
                            }
                            
                            // Информация о рассмотрении (если есть)
                            if (removal.reviewedBy) {
                              html += '<div style="background: white; padding: 12px; border-radius: 8px; margin-top: 8px; border: 2px solid ' + statusColor + ';">';
                              html += '<strong style="color: ' + statusColor + ';">👨‍⚖️ Рассмотрел:</strong> ' + escapeHtml(removal.reviewedBy);
                              if (removal.reviewDate) {
                                const reviewDate = new Date(removal.reviewDate);
                                if (!isNaN(reviewDate.getTime())) {
                                  html += '<br><strong>📅 Дата рассмотрения:</strong> ' + reviewDate.toLocaleString('ru-RU');
                                }
                              }
                              if (removal.reviewComment) {
                                html += '<br><strong>💬 Комментарий:</strong> ' + escapeHtml(removal.reviewComment);
                              }
                              html += '</div>';
                            }
                            
                            html += '</div>';
                            return html;
                          } catch (e) {
                            // Если не удалось распарсить, возможно это обычный текстовый комментарий
                            return '<div style="white-space: pre-wrap; line-height: 1.6;">' + escapeHtml(removalData) + '</div>';
                          }
                        })()}
                      </div>
                    </div>
                    
                    <div class="detail-field" style="grid-column: 1 / -1;">
                      <div class="detail-label">⚖️ Обжалование</div>
                      <div class="detail-value" style="background: #fff3cd; padding: 15px; border-radius: 8px; max-height: 300px; overflow-y: auto;">
                        \${(function() {
                          const appealData = vygovor.Обжалование || '';
                          if (!appealData || appealData === 'Нет') {
                            return '<span style="color: #999;">Выговор не обжаловался</span>';
                          }
                          
                          try {
                            // Пытаемся распарсить JSON
                            const appeal = typeof appealData === 'string' ? JSON.parse(appealData) : appealData;
                            
                            let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
                            
                            // Статус обжалования
                            const status = appeal.status || 'Не указано';
                            let statusColor = '#666';
                            let statusIcon = '⏳';
                            if (status === 'Ожидает рассмотрения') {
                              statusColor = '#ff9800';
                              statusIcon = '⏳';
                            } else if (status === 'Одобрено') {
                              statusColor = '#4caf50';
                              statusIcon = '✅';
                            } else if (status === 'Отклонено') {
                              statusColor = '#dc3545';
                              statusIcon = '❌';
                            }
                            
                            html += '<div style="background: white; padding: 12px; border-radius: 8px; border-left: 4px solid ' + statusColor + ';">';
                            html += '<strong style="color: ' + statusColor + ';">' + statusIcon + ' Статус:</strong> ' + escapeHtml(status);
                            html += '</div>';
                            
                            // Кто обжалует
                            if (appeal.userName) {
                              html += '<div><strong>👤 Обжаловал:</strong> ' + escapeHtml(appeal.userName);
                              if (appeal.userId) {
                                html += ' <span style="font-family: monospace; color: #666; font-size: 12px;">(' + escapeHtml(appeal.userId) + ')</span>';
                              }
                              html += '</div>';
                            }
                            
                            // Причина обжалования
                            if (appeal.reason) {
                              html += '<div style="background: white; padding: 12px; border-radius: 8px;">';
                              html += '<strong>📝 Причина обжалования:</strong><br>';
                              html += '<div style="margin-top: 8px; white-space: pre-wrap; line-height: 1.6;">' + escapeHtml(appeal.reason) + '</div>';
                              html += '</div>';
                            }
                            
                            // Доказательства обжалования
                            if (appeal.proof && appeal.proof !== 'Нет') {
                              html += '<div style="background: white; padding: 12px; border-radius: 8px;">';
                              html += '<strong>📎 Доказательства:</strong><br>';
                              const proofLines = appeal.proof.split('\\n').filter(line => line.trim());
                              if (proofLines.length > 0) {
                                html += '<div style="margin-top: 8px; display: flex; flex-direction: column; gap: 6px;">';
                                proofLines.forEach(function(line, idx) {
                                  line = line.trim();
                                  if (line.match(/^https?:\\/\\//i)) {
                                    html += '<div><span style="color: #ff9800; font-weight: 600;">' + (idx + 1) + '.</span> <a href="' + line + '" target="_blank" style="color: #ff9800; text-decoration: none; word-break: break-all;" onmouseover="this.style.textDecoration=\\'underline\\'" onmouseout="this.style.textDecoration=\\'none\\'">' + line + '</a></div>';
                                  } else {
                                    html += '<div><span style="color: #ff9800; font-weight: 600;">' + (idx + 1) + '.</span> ' + escapeHtml(line) + '</div>';
                                  }
                                });
                                html += '</div>';
                              }
                              html += '</div>';
                            }
                            
                            // Дата обжалования
                            if (appeal.appealDate) {
                              const appealDate = new Date(appeal.appealDate);
                              if (!isNaN(appealDate.getTime())) {
                                html += '<div style="color: #666; font-size: 12px;"><strong>📅 Дата обжалования:</strong> ' + appealDate.toLocaleString('ru-RU') + '</div>';
                              }
                            }
                            
                            // Информация о рассмотрении (если есть)
                            if (appeal.reviewedBy) {
                              html += '<div style="background: white; padding: 12px; border-radius: 8px; margin-top: 8px; border: 2px solid ' + statusColor + ';">';
                              html += '<strong style="color: ' + statusColor + ';">👨‍⚖️ Рассмотрел:</strong> ' + escapeHtml(appeal.reviewedBy);
                              if (appeal.reviewDate) {
                                const reviewDate = new Date(appeal.reviewDate);
                                if (!isNaN(reviewDate.getTime())) {
                                  html += '<br><strong>📅 Дата рассмотрения:</strong> ' + reviewDate.toLocaleString('ru-RU');
                                }
                              }
                              if (appeal.reviewComment) {
                                html += '<br><strong>💬 Комментарий:</strong> ' + escapeHtml(appeal.reviewComment);
                              }
                              html += '</div>';
                            }
                            
                            html += '</div>';
                            return html;
                          } catch (e) {
                            // Если не удалось распарсить, показываем как есть
                            return '<div style="color: #999; font-size: 12px;">Ошибка парсинга данных обжалования</div><pre style="font-size: 11px; overflow-x: auto;">' + escapeHtml(appealData) + '</pre>';
                          }
                        })()}
                      </div>
                    </div>
                    
                    <div class="detail-field" style="grid-column: 1 / -1;">
                      <div class="detail-label">📎 Доказательства</div>
                      <div class="detail-value" style="background: #d1ecf1; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto;">
                        \${(function() {
                          const evidence = vygovor.Доказательства || '';
                          if (!evidence || evidence === 'Нет') {
                            return '<span style="color: #999;">Нет доказательств</span>';
                          }
                          // Разбиваем по строкам и создаем ссылки
                          const lines = evidence.split('\\n').filter(line => line.trim());
                          if (lines.length === 0) {
                            return '<span style="color: #999;">Нет доказательств</span>';
                          }
                          return '<div style="display: flex; flex-direction: column; gap: 8px;">' + 
                            lines.map(function(line, index) {
                              line = line.trim();
                              // Проверяем, является ли строка URL
                              if (line.match(/^https?:\\/\\//i)) {
                                return '<div style="display: flex; align-items: center; gap: 8px;"><span style="color: #0277bd; font-weight: 600;">' + (index + 1) + '.</span><a href="' + line + '" target="_blank" style="color: #0277bd; text-decoration: none; word-break: break-all; flex: 1;" onmouseover="this.style.textDecoration=\\'underline\\'" onmouseout="this.style.textDecoration=\\'none\\'">' + line + '</a></div>';
                              } else {
                                return '<div style="display: flex; align-items: center; gap: 8px;"><span style="color: #0277bd; font-weight: 600;">' + (index + 1) + '.</span><span style="word-break: break-all; flex: 1;">' + escapeHtml(line) + '</span></div>';
                              }
                            }).join('') + 
                          '</div>';
                        })()}
                      </div>
                    </div>
                    
                    \${(function() {
                      const appealEvidence = vygovor['Доказательства обжалования'] || '';
                      if (!appealEvidence || appealEvidence === 'Нет' || appealEvidence.trim() === '') {
                        return '';
                      }
                      const lines = appealEvidence.split('\\n').filter(line => line.trim());
                      if (lines.length === 0) {
                        return '';
                      }
                      const evidenceLinksHtml = lines.map(function(line, index) {
                        line = line.trim();
                        if (line.match(/^https?:\\/\\//i)) {
                          return '<div style="display: flex; align-items: center; gap: 8px;"><span style="color: #e65100; font-weight: 600;">' + (index + 1) + '.</span><a href="' + line + '" target="_blank" style="color: #e65100; text-decoration: none; word-break: break-all; flex: 1;" onmouseover="this.style.textDecoration=\\'underline\\'" onmouseout="this.style.textDecoration=\\'none\\'">' + line + '</a></div>';
                        } else {
                          return '<div style="display: flex; align-items: center; gap: 8px;"><span style="color: #e65100; font-weight: 600;">' + (index + 1) + '.</span><span style="word-break: break-all; flex: 1;">' + escapeHtml(line) + '</span></div>';
                        }
                      }).join('');
                      
                      return '<div style="grid-column: 1 / -1;"><div style="font-weight: 600; color: #555; margin-bottom: 8px; font-size: 14px;">⚖️ Доказательства обжалования</div><div style="background: #ffe0b2; padding: 15px; border-radius: 8px; max-height: 200px; overflow-y: auto; border: 2px solid #ff9800;"><div style="display: flex; flex-direction: column; gap: 8px;">' + evidenceLinksHtml + '</div></div></div>';
                    })()}
                    
                    <div class="detail-field">
                      <div class="detail-label">🕐 Создано</div>
                      <div class="detail-value" style="font-size: 12px; color: #999;">\${formatDate(vygovor.Создано)}</div>
                    </div>
                    
                    <div class="detail-field">
                      <div class="detail-label">🔄 Обновлено</div>
                      <div class="detail-value" style="font-size: 12px; color: #999;">\${formatDate(vygovor.Обновлено)}</div>
                    </div>
                  </div>
                  
                  <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 30px; padding-top: 20px; border-top: 2px solid #eee;">
                    <button class="btn btn-secondary close-detail-modal-btn">Закрыть</button>
                  </div>
                </div>
              </div>
            \`;
            
            // Добавляем контент в модальное окно
            modalContainer.appendChild(contentDiv);
            
            // Добавляем обработчики для кнопок закрытия после создания контента
            const closeButtons = modal.querySelectorAll('.close-detail-modal-btn');
            closeButtons.forEach(btn => {
              btn.addEventListener('click', function(e) {
                e.stopPropagation();
                closeModal();
              });
            });
            
            // Добавляем стили для деталей
            if (!document.getElementById('detailModalStyles')) {
              const style = document.createElement('style');
              style.id = 'detailModalStyles';
              style.textContent = \`
                .detail-field {
                  display: flex;
                  flex-direction: column;
                  gap: 8px;
                }
                .detail-label {
                  font-size: 12px;
                  color: #999;
                  text-transform: uppercase;
                  letter-spacing: 0.5px;
                  font-weight: 600;
                }
                .detail-value {
                  font-size: 15px;
                  color: #333;
                  font-weight: 500;
                }
                
                /* Кастомный скроллбар для контента модального окна */
                .vygovor-detail-content {
                  scrollbar-width: thin;
                  scrollbar-color: rgba(102, 126, 234, 0.5) rgba(0, 0, 0, 0.05);
                  /* Скролл находится внутри, не ломая закругленные углы */
                }
                
                .vygovor-detail-content::-webkit-scrollbar {
                  width: 10px;
                }
                
                .vygovor-detail-content::-webkit-scrollbar-track {
                  background: rgba(0, 0, 0, 0.02);
                  border-radius: 10px;
                  margin: 10px 0;
                }
                
                .vygovor-detail-content::-webkit-scrollbar-thumb {
                  background: linear-gradient(180deg, rgba(102, 126, 234, 0.5) 0%, rgba(118, 75, 162, 0.5) 100%);
                  border-radius: 10px;
                  border: 2px solid rgba(255, 255, 255, 0.8);
                  min-height: 50px;
                  transition: all 0.3s ease;
                }
                
                .vygovor-detail-content::-webkit-scrollbar-thumb:hover {
                  background: linear-gradient(180deg, rgba(102, 126, 234, 0.7) 0%, rgba(118, 75, 162, 0.7) 100%);
                  border: 2px solid rgba(255, 255, 255, 1);
                }
                
                .vygovor-detail-content::-webkit-scrollbar-thumb:active {
                  background: linear-gradient(180deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
                }
                
                /* Для Firefox */
                @-moz-document url-prefix() {
                  .vygovor-detail-content {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(102, 126, 234, 0.5) rgba(0, 0, 0, 0.05);
                  }
                }
                
                /* Скроллбар для блоков с текстом внутри */
                .detail-value[style*="overflow-y: auto"]::-webkit-scrollbar {
                  width: 8px;
                }
                
                .detail-value[style*="overflow-y: auto"]::-webkit-scrollbar-track {
                  background: rgba(0, 0, 0, 0.05);
                  border-radius: 8px;
                }
                
                .detail-value[style*="overflow-y: auto"]::-webkit-scrollbar-thumb {
                  background: rgba(102, 126, 234, 0.4);
                  border-radius: 8px;
                  transition: all 0.3s ease;
                }
                
                .detail-value[style*="overflow-y: auto"]::-webkit-scrollbar-thumb:hover {
                  background: rgba(102, 126, 234, 0.6);
                }
              \`;
              document.head.appendChild(style);
            }
            
          } else {
            // Удаляем модальное окно при ошибке
            if (modal && modal.parentNode) {
              modal.remove();
            }
            showNotification('Не удалось загрузить детали выговора: ' + ((result && result.error) || 'Неизвестная ошибка'), 'error');
          }
        })
        .withFailureHandler(function(error) {
          // Удаляем модальное окно при ошибке
          if (modal && modal.parentNode) {
            modal.remove();
          }
          showNotification('Ошибка загрузки деталей: ' + (error.message || 'Неизвестная ошибка'), 'error');
        })
        .getVygovorById(vygovorId);
    }
    
    // Показать уведомление
    function showNotification(message, type) {
      const notification = document.getElementById('notification');
      if (notification) {
        notification.textContent = message;
        notification.className = 'notification ' + type + ' active';
        
        setTimeout(() => {
          notification.classList.remove('active');
        }, 3000);
      }
    }
    
    // Переменная для хранения правил
    let rulesData = [];
    
    // Открыть модальное окно выбора правил
    function openRuleModal() {
      // Создаем модальное окно
      const modal = document.createElement('div');
      modal.id = 'ruleSelectionModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = \`
        <div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 900px; width: 90%; max-height: 85vh; position: relative; overflow: hidden; display: flex; flex-direction: column;">
          <!-- Заголовок -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 25px 30px; color: white; display: flex; align-items: center; justify-content: space-between;">
            <div>
              <h2 style="margin: 0; font-size: 24px; font-weight: 700;">📋 Выбор правила</h2>
              <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Выберите правило из списка</p>
            </div>
            <button onclick="closeRuleModal()" style="background: rgba(255,255,255,0.2); border: none; font-size: 28px; cursor: pointer; color: white; padding: 8px; line-height: 1; width: 40px; height: 40px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s;" onmouseover="this.style.background='rgba(255,255,255,0.3)'; this.style.transform='rotate(90deg)';" onmouseout="this.style.background='rgba(255,255,255,0.2)'; this.style.transform='rotate(0deg)';" title="Закрыть">×</button>
          </div>
          
          <!-- Поиск -->
          <div style="padding: 20px 30px; border-bottom: 1px solid #e0e0e0;">
            <input type="text" id="ruleSearchInput" placeholder="🔍 Поиск по правилам..." onkeyup="filterRules()" style="width: 100%; padding: 12px 16px; border: 2px solid #e0e0e0; border-radius: 10px; font-size: 14px; box-sizing: border-box; transition: all 0.3s;" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)';" onblur="this.style.borderColor='#e0e0e0'; this.style.boxShadow='none';">
          </div>
          
          <!-- Контейнер с правилами -->
          <div id="rulesContainer" style="padding: 20px 30px; overflow-y: auto; flex: 1;">
            <div style="text-align: center; padding: 40px 20px; color: #999;">
              <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto 20px auto;"></div>
              <p>Загрузка правил...</p>
            </div>
          </div>
        </div>
      \`;
      
      document.body.appendChild(modal);
      
      // Загружаем правила
      loadRules();
    }
    
    // Закрыть модальное окно выбора правил
    function closeRuleModal() {
      const modal = document.getElementById('ruleSelectionModal');
      if (modal) {
        modal.remove();
      }
    }
    
    // Загрузить правила с листа
    function loadRules() {
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success && result.rules) {
            rulesData = result.rules;
            displayRules(rulesData);
          } else {
            const container = document.getElementById('rulesContainer');
            if (container) {
              container.innerHTML = \`
                <div style="text-align: center; padding: 40px 20px; color: #999;">
                  <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                  <p>Не удалось загрузить правила</p>
                  <p style="font-size: 14px;">\${result && result.error ? result.error : 'Неизвестная ошибка'}</p>
                </div>
              \`;
            }
          }
        })
        .withFailureHandler(function(error) {
          const container = document.getElementById('rulesContainer');
          if (container) {
            container.innerHTML = \`
              <div style="text-align: center; padding: 40px 20px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <p>Ошибка загрузки правил</p>
                <p style="font-size: 14px;">\${error.message || 'Неизвестная ошибка'}</p>
              </div>
            \`;
          }
        })
        .getRules();
    }
    
    // Отобразить правила
    function displayRules(rules) {
      const container = document.getElementById('rulesContainer');
      if (!container) return;
      
      if (!rules || rules.length === 0) {
        container.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
            <p>Правила не найдены</p>
            <p style="font-size: 14px;">Добавьте правила на лист "Правила"</p>
          </div>
        \`;
        return;
      }
      
      let html = '<div id="rulesGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px;">';
      
      rules.forEach(rule => {
        // Экранируем только кавычки для data-атрибутов
        const safeRule = String(rule.rule || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        const safePunishment = String(rule.punishment || '').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        
        html += \`
          <div class="rule-card" data-rule="\${safeRule}" data-punishment="\${safePunishment}" style="
            background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
            padding: 20px;
            border-radius: 12px;
            border: 2px solid #e0e0e0;
            cursor: pointer;
            transition: all 0.3s;
            position: relative;
            overflow: hidden;
          " onmouseover="this.style.transform='translateY(-5px)'; this.style.boxShadow='0 8px 20px rgba(0,0,0,0.15)'; this.style.borderColor='#667eea';" onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='#e0e0e0';">
            <div style="font-size: 18px; font-weight: 700; color: #667eea; margin-bottom: 10px;">\${escapeHtml(rule.rule)}</div>
            <div style="font-size: 14px; color: #666; line-height: 1.6;">\${escapeHtml(rule.punishment)}</div>
          </div>
        \`;
      });
      
      html += '</div>';
      container.innerHTML = html;
      
      // Добавляем делегирование событий для кликабельности
      const rulesGrid = container.querySelector('#rulesGrid');
      if (rulesGrid) {
        rulesGrid.addEventListener('click', function(e) {
          const ruleCard = e.target.closest('.rule-card');
          if (ruleCard) {
            const rule = ruleCard.getAttribute('data-rule');
            const punishment = ruleCard.getAttribute('data-punishment');
            if (rule && punishment) {
              selectRule(rule, punishment);
            }
          }
        });
      }
    }
    
    // Фильтровать правила по поиску
    function filterRules() {
      const searchInput = document.getElementById('ruleSearchInput');
      if (!searchInput) return;
      
      const searchTerm = searchInput.value.toLowerCase();
      
      if (!searchTerm) {
        displayRules(rulesData);
        return;
      }
      
      const filteredRules = rulesData.filter(rule => {
        return rule.rule.toLowerCase().includes(searchTerm) || 
               rule.punishment.toLowerCase().includes(searchTerm);
      });
      
      displayRules(filteredRules);
    }
    
    // Выбрать правило
    function selectRule(rule, punishment) {
      // Устанавливаем значения в форму
      const ruleInput = document.getElementById('rule');
      const selectedRulePunishment = document.getElementById('selectedRulePunishment');
      const typeSelect = document.getElementById('type');
      
      if (ruleInput) {
        ruleInput.value = rule;
      }
      
      if (selectedRulePunishment) {
        selectedRulePunishment.value = punishment;
      }
      
      // Автоматически определяем тип выговора из меры наказания
      if (typeSelect) {
        const vygovorType = detectVygovorType(punishment);
        if (vygovorType) {
          typeSelect.value = vygovorType;
          // Триггерим пересчет штрафа и часов
          calculatePenaltyAndHours();
          // Триггерим пересчет срока оплаты
          calculatePaymentDeadline();
        }
      }
      
      // Закрываем модальное окно
      closeRuleModal();
      
      // Показываем уведомление
      showNotification('Правило выбрано: ' + rule, 'success');
    }
    
    // Определить тип выговора из текста меры наказания
    function detectVygovorType(punishment) {
      if (!punishment) return null;
      
      const punishmentLower = punishment.toLowerCase();
      
      // VR - Устный выговор
      if (punishmentLower.includes('vr') || 
          punishmentLower.includes('устный') ||
          punishmentLower.includes('verbal')) {
        return 'VR';
      }
      
      // WR - Письменный выговор
      if (punishmentLower.includes('wr') || 
          punishmentLower.includes('письменный') ||
          punishmentLower.includes('written')) {
        return 'WR';
      }
      
      // SR2 - Строгий выговор 2/2 (проверяем первым, т.к. содержит sr)
      if (punishmentLower.includes('sr') && 
          (punishmentLower.includes('2/2') || punishmentLower.includes('второй'))) {
        return 'SR2';
      }
      
      // SR - Строгий выговор 1/2
      if (punishmentLower.includes('sr') || 
          punishmentLower.includes('строгий') ||
          punishmentLower.includes('severe') ||
          (punishmentLower.includes('выговор') && punishmentLower.includes('1/2'))) {
        return 'SR';
      }
      
      // Отстранение от работы
      if (punishmentLower.includes('отстранение') || 
          punishmentLower.includes('suspension')) {
        return 'Suspension';
      }
      
      // Переаттестация
      if (punishmentLower.includes('переаттестация') || 
          punishmentLower.includes('retest')) {
        return 'Retest';
      }
      
      // Увольнение
      if (punishmentLower.includes('увольнение') || 
          punishmentLower.includes('dismissal')) {
        return 'Dismissal';
      }
      
      return null;
    }
    
    // Рассчитать штраф и часы отработки на основе ранга и типа выговора
    function calculatePenaltyAndHours() {
      const rankSelect = document.getElementById('rank');
      const typeSelect = document.getElementById('type');
      const amountInput = document.getElementById('amount');
      const hoursInput = document.getElementById('hours');
      
      if (!rankSelect || !typeSelect || !amountInput || !hoursInput) return;
      
      const rank = parseInt(rankSelect.value);
      const vygovorType = typeSelect.value;
      
      if (!rank || !vygovorType) return;
      
      let amount = 0;
      let hours = 0;
      
      // Определяем диапазон ранга
      let rankRange = '';
      if (rank >= 1 && rank <= 2) {
        rankRange = '1-2';
      } else if (rank >= 3 && rank <= 5) {
        rankRange = '3-5';
      } else if (rank >= 6 && rank <= 9) {
        rankRange = '6-9';
      } else if (rank >= 10 && rank <= 11) {
        // Для рангов 10-11 используем ту же логику что и для 6-9
        rankRange = '6-9';
      }
      
      // Расчет по типу выговора и рангу
      if (vygovorType === 'VR') { // Устный выговор
        if (rankRange === '1-2') {
          amount = 1000;
          hours = 1;
        } else if (rankRange === '3-5') {
          amount = 2500;
          hours = 2;
        } else if (rankRange === '6-9') {
          amount = 5000;
          hours = 3;
        }
      } else if (vygovorType === 'WR') { // Письменный выговор
        if (rankRange === '1-2') {
          amount = 2500;
          hours = 2;
        } else if (rankRange === '3-5') {
          amount = 5500;
          hours = 3;
        } else if (rankRange === '6-9') {
          amount = 8000;
          hours = 4;
        }
      } else if (vygovorType === 'SR') { // Строгий выговор 1/2
        // Строгий выговор не отрабатывается, только штраф
        if (rankRange === '1-2') {
          amount = 7000;
          hours = 0;
        } else if (rankRange === '3-5') {
          amount = 8500;
          hours = 0;
        } else if (rankRange === '6-9') {
          amount = 10000;
          hours = 0;
        }
      } else if (vygovorType === 'SR2') { // Строгий выговор 2/2
        // Строгий выговор не отрабатывается, только штраф
        if (rankRange === '1-2') {
          amount = 7000;
          hours = 0;
        } else if (rankRange === '3-5') {
          amount = 10000;
          hours = 0;
        } else if (rankRange === '6-9') {
          amount = 12000;
          hours = 0;
        }
      }
      // Для других типов (Suspension, Retest, Dismissal) оставляем 0
      
      // Устанавливаем значения
      amountInput.value = amount;
      hoursInput.value = hours;
    }
    
    // Рассчитать срок оплаты/отработки на основе даты выдачи и типа выговора
    function calculatePaymentDeadline() {
      const dateInput = document.getElementById('date');
      const typeSelect = document.getElementById('type');
      const paymentDeadlineInput = document.getElementById('paymentDeadline');
      
      if (!dateInput || !typeSelect || !paymentDeadlineInput) return;
      
      const issueDate = dateInput.value;
      const vygovorType = typeSelect.value;
      
      if (!issueDate || !vygovorType) return;
      
      // Получаем текущее время
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      
      // Создаем дату выдачи с текущим временем
      const date = new Date(issueDate + 'T00:00:00');
      date.setHours(currentHours, currentMinutes, 0, 0);
      
      // Определяем количество дней для оплаты
      let daysToAdd = 0;
      
      switch(vygovorType) {
        case 'VR': // Устный выговор
          daysToAdd = 2;
          break;
        case 'WR': // Письменный выговор
          daysToAdd = 3;
          break;
        case 'SR': // Строгий выговор 1/2
          daysToAdd = 4;
          break;
        case 'SR2': // Строгий выговор 2/2
          daysToAdd = 1;
          break;
        default:
          // Для других типов (Suspension, Retest, Dismissal) не устанавливаем срок
          paymentDeadlineInput.value = '';
          return;
      }
      
      // Добавляем дни
      date.setDate(date.getDate() + daysToAdd);
      
      // Форматируем в datetime-local формат (YYYY-MM-DDTHH:MM)
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      
      const formattedDate = \`\${year}-\${month}-\${day}T\${hours}:\${minutes}\`;
      
      // Устанавливаем значение
      paymentDeadlineInput.value = formattedDate;
    }
    
    // Вспомогательная функция для экранирования HTML
    function escapeHtml(text) {
      if (!text) return '';
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
    
    // Перевод просроченного выговора в следующий тип и заполнение формы
    function escalateOverdueVygovor(vygovorId) {
      if (!vygovorId) {
        showNotification('ID выговора не указан', 'error');
        return;
      }
      
      // Проверяем токен сессии перед открытием модалки
      let sessionToken = getSessionToken();
      if (!sessionToken) {
        showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
        showSection('login');
        return;
      }
      
      // Сохраняем токен в переменную для использования в обработчиках
      const savedSessionToken = sessionToken;
      
      // Создаем модальное окно подтверждения
      const modal = document.createElement('div');
      modal.id = 'escalateVygovorConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<div style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); padding: 25px 30px; color: white;">' +
          '<div style="display: flex; align-items: center; gap: 15px;">' +
            '<div style="font-size: 48px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">⬆️</div>' +
            '<div>' +
              '<h3 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Перевод в следующий тип</h3>' +
              '<p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Подтвердите действие</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<div style="background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%); border: 2px solid #ffc107; border-radius: 12px; padding: 20px; margin-bottom: 25px;">' +
            '<div style="display: flex; align-items: start; gap: 12px;">' +
              '<div style="font-size: 28px; line-height: 1;">⚠️</div>' +
              '<div style="flex: 1;">' +
                '<strong style="color: #856404; display: block; margin-bottom: 8px; font-size: 15px;">Внимание!</strong>' +
                '<p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">Статус текущего выговора будет изменен на "Игнорирован", и форма будет заполнена данными для нового выговора.</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 2px solid #e0e0e0;">' +
            '<div style="font-size: 13px; color: #666; margin-bottom: 8px; font-weight: 600;">ID выговора:</div>' +
            '<div style="font-size: 14px; color: #333; font-weight: 700; font-family: monospace; word-break: break-word;">' + escapeHtml(vygovorId) + '</div>' +
          '</div>' +
          '<div style="display: flex; gap: 12px;">' +
            '<button id="confirmEscalateVygovorBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(244, 67, 54, 0.3); transition: all 0.3s;">⬆️ Да, перевести</button>' +
            '<button id="cancelEscalateVygovorBtn" style="flex: 1; padding: 14px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s;">❌ Отмена</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Обработчик для кнопки подтверждения
      const confirmBtn = document.getElementById('confirmEscalateVygovorBtn');
      const cancelBtn = document.getElementById('cancelEscalateVygovorBtn');
      
      // Добавляем hover эффекты через JavaScript
      if (confirmBtn) {
        confirmBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 6px 20px rgba(244, 67, 54, 0.4)';
        });
        confirmBtn.addEventListener('mouseleave', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 4px 15px rgba(244, 67, 54, 0.3)';
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseenter', function() {
          this.style.borderColor = '#667eea';
          this.style.color = '#667eea';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseleave', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'white';
        });
      }
      
      const closeModal = function() {
        if (modal && modal.parentNode) {
          modal.remove();
        }
      };
      
      if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
          // Показываем индикатор загрузки
          confirmBtn.disabled = true;
          cancelBtn.disabled = true;
          confirmBtn.style.opacity = '0.7';
          confirmBtn.textContent = '⏳ Обработка...';
          
          // Проверяем токен еще раз перед отправкой
          const currentToken = getSessionToken();
          if (!currentToken || currentToken !== savedSessionToken) {
            closeModal();
            showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
            showSection('login');
            return;
          }
          
          google.script.run
            .withSuccessHandler(function(result) {
              closeModal();
              
              if (result && result.success && result.data) {
                const data = result.data;
                
                // Заполняем форму новыми данными
                fillVygovorForm(data);
                
                // Переключаемся на форму создания выговора
                showSection('create');
                
                // Показываем уведомление
                showNotification('Выговор переведен в статус "Игнорирован". Форма заполнена данными для нового выговора.', 'success');
                
                // Обновляем историю выговоров
                const recipientIdInput = document.getElementById('recipientId');
                if (recipientIdInput && recipientIdInput.value) {
                  loadRecipientVygovoryHistory(recipientIdInput.value);
                }
              } else {
                showNotification(result && result.error ? result.error : 'Ошибка при переводе выговора', 'error');
              }
            })
            .withFailureHandler(function(error) {
              closeModal();
              const errorMsg = error.message || error.toString();
              if (errorMsg.includes('доступ') || errorMsg.includes('сесси') || errorMsg.includes('session')) {
                showNotification('Сессия истекла. Пожалуйста, войдите снова.', 'error');
                showSection('login');
              } else {
                showNotification('Ошибка: ' + errorMsg, 'error');
              }
            })
            .escalateOverdueVygovor(vygovorId, savedSessionToken);
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
      }
      
      // Закрытие по клику на фон
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
    
    // Заполнение формы данными выговора
    function fillVygovorForm(data) {
      // Получатель
      const recipientSelect = document.getElementById('recipientSelect');
      const recipientIdInput = document.getElementById('recipientId');
      if (recipientSelect && data.recipientId) {
        // Ищем опцию с нужным Discord ID
        for (let i = 0; i < recipientSelect.options.length; i++) {
          if (recipientSelect.options[i].value === data.recipientId) {
            recipientSelect.selectedIndex = i;
            recipientSelect.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
      if (recipientIdInput && data.recipientId) {
        recipientIdInput.value = data.recipientId;
      }
      
      // Правило/причина
      const ruleInput = document.getElementById('rule');
      if (ruleInput && data.rule) {
        ruleInput.value = data.rule;
      }
      
      // Тип
      const typeSelect = document.getElementById('type');
      if (typeSelect && data.type) {
        typeSelect.value = data.type;
      }
      
      // Сумма (не заполняем автоматически)
      // const amountInput = document.getElementById('amount');
      // if (amountInput && data.amount !== undefined && data.amount > 0) {
      //   amountInput.value = data.amount;
      // }
      
      // Часы
      const hoursInput = document.getElementById('hours');
      if (hoursInput && data.hours !== undefined) {
        hoursInput.value = data.hours;
      }
      
      // Срок оплаты (не заполняем автоматически)
      // const paymentDeadlineInput = document.getElementById('paymentDeadline');
      // if (paymentDeadlineInput && data.paymentDeadline) {
      //   const deadlineDate = new Date(data.paymentDeadline);
      //   const year = deadlineDate.getFullYear();
      //   const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
      //   const day = String(deadlineDate.getDate()).padStart(2, '0');
      //   const hours = String(deadlineDate.getHours()).padStart(2, '0');
      //   const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
      //   paymentDeadlineInput.value = \`\${year}-\${month}-\${day}T\${hours}:\${minutes}\`;
      // }
      
      // Ссылки на доказательства
      const evidenceLinksInput = document.getElementById('evidenceLinks');
      if (evidenceLinksInput && data.evidenceLinks) {
        evidenceLinksInput.value = data.evidenceLinks;
      }
      
      // Дата (текущая дата)
      const dateInput = document.getElementById('date');
      if (dateInput) {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        dateInput.value = \`\${year}-\${month}-\${day}\`;
      }
    }
    
    // Загрузить историю выговоров для выбранного сотрудника
    function loadRecipientVygovoryHistory(discordId) {
      const historyDiv = document.getElementById('recipientVygovoryHistory');
      const container = document.getElementById('recipientVygovoryContainer');
      
      if (!historyDiv || !container || !discordId) return;
      
      // Показываем контейнер и индикатор загрузки
      historyDiv.style.display = 'block';
      container.innerHTML = \`
        <div style="text-align: center; padding: 20px; color: #999;">
          <div class="spinner" style="width: 24px; height: 24px; border-width: 3px; margin: 0 auto 10px auto;"></div>
          <p style="margin: 0; font-size: 14px;">Загрузка истории...</p>
        </div>
      \`;
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success && result.data) {
            const vygovory = result.data;
            
            // Фильтруем только активные и просроченные (исключаем "Игнорированные")
            const relevantVygovory = vygovory.filter(v => {
              const status = v['Статус'] || '';
              
              // Исключаем игнорированные выговоры
              if (status === 'Игнорирован') {
                return false;
              }
              
              // Проверяем просроченность для активных выговоров
              if (status === 'Активен') {
                const amount = parseFloat(v['Сумма']) || 0;
                if (amount > 0 && v['Срок оплаты']) {
                  try {
                    const deadline = new Date(v['Срок оплаты']);
                    const now = new Date();
                    if (!isNaN(deadline.getTime()) && deadline < now) {
                      v._isOverdue = true; // Помечаем как просроченный
                    }
                  } catch (e) {
                    // Игнорируем ошибки парсинга даты
                  }
                }
                return true;
              }
              return status === 'Просрочен';
            });
            
            if (relevantVygovory.length === 0) {
              container.innerHTML = \`
                <div style="text-align: center; padding: 20px; color: #666;">
                  <div style="font-size: 32px; margin-bottom: 10px;">✅</div>
                  <p style="margin: 0; font-size: 14px;">У сотрудника нет активных или просроченных выговоров</p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                    Всего выговоров: \${vygovory.length}
                  </p>
                </div>
              \`;
              return;
            }
            
            // Отображаем выговоры
            let html = '<div style="display: flex; flex-direction: column; gap: 12px;">';
            
            relevantVygovory.forEach(vygovor => {
              const status = vygovor['Статус'] || '';
              const type = vygovor['Тип'] || '';
              const rule = vygovor['Правило'] || 'Не указано';
              const amount = vygovor['Сумма'] || 0;
              const createdDate = vygovor['Создано'] || 'Не указана';
              const id = vygovor['ID'] || '';
              
              // Форматируем дату из ISO формата в "03.11.2025 15:57"
              let formattedDate = createdDate;
              if (createdDate && createdDate !== 'Не указана') {
                try {
                  const dateObj = new Date(createdDate);
                  if (!isNaN(dateObj.getTime())) {
                    const day = String(dateObj.getDate()).padStart(2, '0');
                    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                    const year = dateObj.getFullYear();
                    const hours = String(dateObj.getHours()).padStart(2, '0');
                    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
                    formattedDate = \`\${day}.\${month}.\${year} \${hours}:\${minutes}\`;
                  }
                } catch (e) {
                  // Если не удалось распарсить, оставляем как есть
                  formattedDate = createdDate;
                }
              }
              
              // Определяем цвет статуса
              let statusColor = '#4caf50';
              let statusIcon = '⚡';
              let displayStatus = status;
              if (status === 'Просрочен' || vygovor._isOverdue) {
                statusColor = '#f44336';
                statusIcon = '⏰';
                displayStatus = 'Просрочен';
              }
              
              // Определяем иконку типа
              let typeIcon = '📝';
              if (type === 'VR') typeIcon = '💬';
              else if (type === 'WR') typeIcon = '📝';
              else if (type === 'SR' || type === 'SR2') typeIcon = '⚠️';
              
              html += \`
                <div style="background: white; border-left: 4px solid \${statusColor}; border-radius: 8px; padding: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <span style="font-size: 20px;">\${typeIcon}</span>
                      <div>
                        <strong style="color: #333; font-size: 14px;">\${escapeHtml(type)}</strong>
                        <div style="font-size: 12px; color: #666; font-family: monospace;">ID: \${escapeHtml(id)}</div>
                      </div>
                    </div>
                    <span style="background: \${statusColor}; color: white; padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; white-space: nowrap;">
                      \${statusIcon} \${escapeHtml(displayStatus)}
                    </span>
                  </div>
                  <div style="font-size: 13px; color: #555; line-height: 1.6;">
                    <div><strong>Суть наказания:</strong> \${escapeHtml(rule)}</div>
                    <div><strong>Штраф:</strong> \${amount}$</div>
                    <div><strong>Дата создания:</strong> \${escapeHtml(formattedDate)}</div>
                  </div>
                  <div style="margin-top: 12px; display: flex; justify-content: flex-end; gap: 8px;">
                    <button type="button" data-vygovor-id="\${escapeHtml(id)}" class="view-details-btn" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 4px rgba(102, 126, 234, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(102, 126, 234, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 4px rgba(102, 126, 234, 0.3)';">
                      📋 Подробнее
                    </button>
                    \${(status === 'Просрочен' || vygovor._isOverdue) ? \`
                    <button type="button" data-vygovor-id="\${escapeHtml(id)}" class="escalate-overdue-btn" style="background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%); color: white; border: none; padding: 6px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; transition: all 0.3s; box-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 8px rgba(244, 67, 54, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='0 2px 4px rgba(244, 67, 54, 0.3)';">
                      ⬆️ Перевести в следующий тип
                    </button>
                    \` : ''}
                  </div>
                </div>
              \`;
            });
            
            html += '</div>';
            
            // Добавляем статистику
            const activeCount = relevantVygovory.filter(v => {
              return (v['Статус'] === 'Активен' && !v._isOverdue);
            }).length;
            const overdueCount = relevantVygovory.filter(v => {
              return (v['Статус'] === 'Просрочен' || v._isOverdue);
            }).length;
            
            html += \`
              <div style="margin-top: 15px; padding: 12px; background: rgba(255, 152, 0, 0.1); border-radius: 8px; display: flex; justify-content: space-around; gap: 10px;">
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #4caf50;">\${activeCount}</div>
                  <div style="font-size: 12px; color: #666;">Активных</div>
                </div>
                <div style="width: 1px; background: rgba(0,0,0,0.1);"></div>
                <div style="text-align: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #f44336;">\${overdueCount}</div>
                  <div style="font-size: 12px; color: #666;">Просроченных</div>
                </div>
              </div>
            \`;
            
            container.innerHTML = html;
            
            // Добавляем обработчики для кнопок "Подробнее"
            const viewDetailsButtons = container.querySelectorAll('.view-details-btn');
            viewDetailsButtons.forEach(function(btn) {
              btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                const vygovorId = this.getAttribute('data-vygovor-id');
                if (vygovorId) {
                  viewVygovorDetails(vygovorId);
                }
              });
            });
            
            // Добавляем обработчики для кнопок "Перевести в следующий тип"
            const escalateButtons = container.querySelectorAll('.escalate-overdue-btn');
            escalateButtons.forEach(function(btn) {
              btn.addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                const vygovorId = this.getAttribute('data-vygovor-id');
                if (vygovorId) {
                  escalateOverdueVygovor(vygovorId);
                }
              });
            });
          } else {
            container.innerHTML = \`
              <div style="text-align: center; padding: 20px; color: #999;">
                <div style="font-size: 32px; margin-bottom: 10px;">❌</div>
                <p style="margin: 0; font-size: 14px;">Не удалось загрузить историю</p>
              </div>
            \`;
          }
        })
        .withFailureHandler(function(error) {
          container.innerHTML = \`
            <div style="text-align: center; padding: 20px; color: #999;">
              <div style="font-size: 32px; margin-bottom: 10px;">❌</div>
              <p style="margin: 0; font-size: 14px;">Ошибка загрузки: \${escapeHtml(error.message || 'Неизвестная ошибка')}</p>
            </div>
          \`;
        })
        .getVygovoryByRecipient(discordId);
    }
    
    // ==================== Управление правилами ====================
    
    // Загрузить таблицу правил
    function loadRulesTable() {
      const container = document.getElementById('rulesTableContainer');
      if (!container) return;
      
      container.innerHTML = \`
        <div style="text-align: center; padding: 40px 20px; color: #999;">
          <div class="spinner" style="width: 40px; height: 40px; border-width: 4px; margin: 0 auto 20px auto;"></div>
          <p>Загрузка правил...</p>
        </div>
      \`;
      
      google.script.run
        .withSuccessHandler(function(result) {
          if (result && result.success && result.rules) {
            displayRulesTable(result.rules);
          } else {
            container.innerHTML = \`
              <div style="text-align: center; padding: 40px 20px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
                <p>Не удалось загрузить правила</p>
                <p style="font-size: 14px;">\${result && result.error ? escapeHtml(result.error) : 'Неизвестная ошибка'}</p>
              </div>
            \`;
          }
        })
        .withFailureHandler(function(error) {
          container.innerHTML = \`
            <div style="text-align: center; padding: 40px 20px; color: #999;">
              <div style="font-size: 48px; margin-bottom: 15px;">❌</div>
              <p>Ошибка загрузки правил</p>
              <p style="font-size: 14px;">\${escapeHtml(error.message || 'Неизвестная ошибка')}</p>
            </div>
          \`;
        })
        .getRules();
    }
    
    // Отобразить таблицу правил
    function displayRulesTable(rules) {
      const container = document.getElementById('rulesTableContainer');
      if (!container) return;
      
      if (!rules || rules.length === 0) {
        container.innerHTML = \`
          <div style="text-align: center; padding: 40px 20px; color: #999;">
            <div style="font-size: 48px; margin-bottom: 15px;">📋</div>
            <p>Правила не найдены</p>
            <p style="font-size: 14px;">Нажмите "Добавить правило" чтобы создать первое правило</p>
          </div>
        \`;
        return;
      }
      
      let html = \`
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden;">
            <thead>
              <tr>
                <th style="background: #667eea; color: white; padding: 16px; text-align: left; font-weight: 600; white-space: nowrap; border-right: 1px solid rgba(255,255,255,0.1);">№</th>
                <th style="background: #6c78e7; color: white; padding: 16px; text-align: left; font-weight: 600; white-space: nowrap; border-right: 1px solid rgba(255,255,255,0.1);">Правило</th>
                <th style="background: #7162e4; color: white; padding: 16px; text-align: left; font-weight: 600; border-right: 1px solid rgba(255,255,255,0.1);">Мера наказания</th>
                <th style="background: #764ba2; color: white; padding: 16px; text-align: center; font-weight: 600; white-space: nowrap;">Действия</th>
              </tr>
            </thead>
            <tbody id="rulesTableBody">
      \`;
      
      rules.forEach((rule, index) => {
        html += \`
          <tr data-rule-id="\${rule.id || index}" style="border-bottom: 1px solid #e0e0e0; transition: background 0.3s;" onmouseover="this.style.background='#f8f9fa';" onmouseout="this.style.background='white';">
            <td style="padding: 16px; font-weight: 600; color: #667eea;">\${index + 1}</td>
            <td style="padding: 16px; font-weight: 600;">\${escapeHtml(rule.rule)}</td>
            <td style="padding: 16px; color: #666;">\${escapeHtml(rule.punishment)}</td>
            <td style="padding: 16px; text-align: center; white-space: nowrap;">
              <button onclick="editRule(\${rule.id || index}, '\${escapeHtml(rule.rule).replace(/'/g, "&apos;")}', '\${escapeHtml(rule.punishment).replace(/'/g, "&apos;")}')" style="padding: 8px 16px; background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; margin-right: 8px; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(76, 175, 80, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='none';" title="Редактировать">
                ✏️ Изменить
              </button>
              <button onclick="deleteRule(\${rule.id || index}, '\${escapeHtml(rule.rule).replace(/'/g, "&apos;")}')" style="padding: 8px 16px; background: linear-gradient(135deg, #f44336 0%, #c62828 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; transition: all 0.3s;" onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(244, 67, 54, 0.4)';" onmouseout="this.style.transform=''; this.style.boxShadow='none';" title="Удалить">
                🗑️ Удалить
              </button>
            </td>
          </tr>
        \`;
      });
      
      html += \`
            </tbody>
          </table>
        </div>
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 10px; text-align: center; color: #666;">
          <strong>Всего правил:</strong> \${rules.length}
        </div>
      \`;
      
      container.innerHTML = html;
    }
    
    // Фильтровать таблицу правил
    function filterRulesTable() {
      const searchInput = document.getElementById('rulesTableSearch');
      const tbody = document.getElementById('rulesTableBody');
      
      if (!searchInput || !tbody) return;
      
      const searchTerm = searchInput.value.toLowerCase();
      const rows = tbody.getElementsByTagName('tr');
      
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.getElementsByTagName('td');
        let found = false;
        
        for (let j = 0; j < cells.length - 1; j++) { // Пропускаем последнюю колонку с кнопками
          if (cells[j].textContent.toLowerCase().includes(searchTerm)) {
            found = true;
            break;
          }
        }
        
        row.style.display = found ? '' : 'none';
      }
    }
    
    // Показать форму добавления правила
    function showAddRuleForm() {
      const form = document.getElementById('ruleForm');
      const container = document.getElementById('ruleFormContainer');
      const title = document.getElementById('ruleFormTitle');
      const editRuleId = document.getElementById('editRuleId');
      
      if (form) form.reset();
      if (editRuleId) editRuleId.value = '';
      if (title) title.textContent = 'Добавить новое правило';
      if (container) container.style.display = 'block';
      
      // Скроллим к форме
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Скрыть форму правила
    function hideRuleForm() {
      const container = document.getElementById('ruleFormContainer');
      if (container) {
        container.style.display = 'none';
      }
    }
    
    // Редактировать правило
    function editRule(id, rule, punishment) {
      const form = document.getElementById('ruleForm');
      const container = document.getElementById('ruleFormContainer');
      const title = document.getElementById('ruleFormTitle');
      const editRuleId = document.getElementById('editRuleId');
      const ruleNumber = document.getElementById('ruleNumber');
      const rulePunishment = document.getElementById('rulePunishment');
      
      if (editRuleId) editRuleId.value = id;
      if (ruleNumber) ruleNumber.value = rule;
      if (rulePunishment) rulePunishment.value = punishment;
      if (title) title.textContent = 'Редактировать правило';
      if (container) {
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    
    // Удалить правило
    function deleteRule(id, rule) {
      // Создаем модальное окно подтверждения
      const modal = document.createElement('div');
      modal.id = 'deleteRuleConfirmModal';
      modal.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 10001; backdrop-filter: blur(4px);';
      
      modal.innerHTML = '<div style="background: white; padding: 0; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); max-width: 500px; width: 90%; position: relative; overflow: hidden;">' +
        '<div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 25px 30px; color: white;">' +
          '<div style="display: flex; align-items: center; gap: 15px;">' +
            '<div style="font-size: 48px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));">🗑️</div>' +
            '<div>' +
              '<h3 style="margin: 0; font-size: 24px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.2);">Удаление правила</h3>' +
              '<p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Подтвердите действие</p>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div style="padding: 30px;">' +
          '<div style="background: linear-gradient(135deg, #fff3cd 0%, #ffe69c 100%); border: 2px solid #ffc107; border-radius: 12px; padding: 20px; margin-bottom: 25px;">' +
            '<div style="display: flex; align-items: start; gap: 12px;">' +
              '<div style="font-size: 28px; line-height: 1;">⚠️</div>' +
              '<div style="flex: 1;">' +
                '<strong style="color: #856404; display: block; margin-bottom: 8px; font-size: 15px;">Внимание!</strong>' +
                '<p style="margin: 0; color: #856404; font-size: 14px; line-height: 1.6;">Вы действительно хотите удалить правило?</p>' +
              '</div>' +
            '</div>' +
          '</div>' +
          '<div style="background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 25px; border: 2px solid #e0e0e0;">' +
            '<div style="font-size: 13px; color: #666; margin-bottom: 8px; font-weight: 600;">Правило для удаления:</div>' +
            '<div style="font-size: 16px; color: #333; font-weight: 700; font-family: monospace; word-break: break-word;">' + escapeHtml(rule) + '</div>' +
          '</div>' +
          '<div style="display: flex; gap: 12px;">' +
            '<button id="confirmDeleteRuleBtn" style="flex: 1; padding: 14px; background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); color: white; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3); transition: all 0.3s;">🗑️ Да, удалить</button>' +
            '<button id="cancelDeleteRuleBtn" style="flex: 1; padding: 14px; background: white; color: #666; border: 2px solid #e0e0e0; border-radius: 12px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.3s;">❌ Отмена</button>' +
          '</div>' +
        '</div>' +
      '</div>';
      
      document.body.appendChild(modal);
      
      // Обработчик для кнопки подтверждения
      const confirmBtn = document.getElementById('confirmDeleteRuleBtn');
      const cancelBtn = document.getElementById('cancelDeleteRuleBtn');
      
      // Добавляем hover эффекты через JavaScript
      if (confirmBtn) {
        confirmBtn.addEventListener('mouseenter', function() {
          this.style.transform = 'translateY(-2px)';
          this.style.boxShadow = '0 6px 20px rgba(220, 53, 69, 0.4)';
        });
        confirmBtn.addEventListener('mouseleave', function() {
          this.style.transform = '';
          this.style.boxShadow = '0 4px 15px rgba(220, 53, 69, 0.3)';
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('mouseenter', function() {
          this.style.borderColor = '#667eea';
          this.style.color = '#667eea';
          this.style.background = '#f8f9fa';
        });
        cancelBtn.addEventListener('mouseleave', function() {
          this.style.borderColor = '#e0e0e0';
          this.style.color = '#666';
          this.style.background = 'white';
        });
      }
      
      const closeModal = function() {
        if (modal && modal.parentNode) {
          modal.remove();
        }
      };
      
      if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
          // Показываем индикатор загрузки
          confirmBtn.disabled = true;
          cancelBtn.disabled = true;
          confirmBtn.style.opacity = '0.7';
          confirmBtn.style.cursor = 'not-allowed';
          confirmBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Удаление...</span>';
          
          google.script.run
            .withSuccessHandler(function(result) {
              closeModal();
              if (result && result.success) {
                showNotification('Правило успешно удалено', 'success');
                loadRulesTable();
              } else {
                showNotification('Ошибка удаления правила: ' + (result && result.error ? result.error : 'Неизвестная ошибка'), 'error');
              }
            })
            .withFailureHandler(function(error) {
              closeModal();
              showNotification('Ошибка удаления правила: ' + (error.message || 'Неизвестная ошибка'), 'error');
            })
            .deleteRule(id);
        });
      }
      
      if (cancelBtn) {
        cancelBtn.addEventListener('click', closeModal);
      }
      
      // Закрытие при клике вне модального окна
      modal.addEventListener('click', function(e) {
        if (e.target === modal) {
          closeModal();
        }
      });
    }
    
    // Обработчик отправки формы правила
    function handleRuleFormSubmit(event) {
      event.preventDefault();
      
      const editRuleId = document.getElementById('editRuleId');
      const ruleNumber = document.getElementById('ruleNumber');
      const rulePunishment = document.getElementById('rulePunishment');
      const submitBtn = document.getElementById('ruleFormSubmitBtn');
      const cancelBtn = document.getElementById('ruleFormCancelBtn');
      
      if (!ruleNumber || !rulePunishment) return;
      
      // Сохраняем оригинальный текст кнопки
      const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
      
      // Блокируем кнопки и показываем загрузку
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.innerHTML = '<span style="display: inline-flex; align-items: center; gap: 8px;"><div class="spinner" style="width: 16px; height: 16px; border-width: 2px;"></div>Сохранение...</span>';
      }
      if (cancelBtn) {
        cancelBtn.disabled = true;
        cancelBtn.style.opacity = '0.5';
        cancelBtn.style.cursor = 'not-allowed';
      }
      
      const ruleData = {
        rule: ruleNumber.value.trim(),
        punishment: rulePunishment.value.trim()
      };
      
      const isEdit = editRuleId && editRuleId.value;
      
      // Функция для разблокировки кнопок
      const enableButtons = function() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.innerHTML = originalBtnText;
        }
        if (cancelBtn) {
          cancelBtn.disabled = false;
          cancelBtn.style.opacity = '1';
          cancelBtn.style.cursor = 'pointer';
        }
      };
      
      if (isEdit) {
        ruleData.id = editRuleId.value;
        
        google.script.run
          .withSuccessHandler(function(result) {
            enableButtons();
            if (result && result.success) {
              showNotification('Правило успешно обновлено', 'success');
              hideRuleForm();
              loadRulesTable();
            } else {
              showNotification('Ошибка обновления правила: ' + (result && result.error ? result.error : 'Неизвестная ошибка'), 'error');
            }
          })
          .withFailureHandler(function(error) {
            enableButtons();
            showNotification('Ошибка обновления правила: ' + (error.message || 'Неизвестная ошибка'), 'error');
          })
          .updateRule(ruleData);
      } else {
        google.script.run
          .withSuccessHandler(function(result) {
            enableButtons();
            if (result && result.success) {
              showNotification('Правило успешно добавлено', 'success');
              hideRuleForm();
              loadRulesTable();
            } else {
              showNotification('Ошибка добавления правила: ' + (result && result.error ? result.error : 'Неизвестная ошибка'), 'error');
            }
          })
          .withFailureHandler(function(error) {
            enableButtons();
            showNotification('Ошибка добавления правила: ' + (error.message || 'Неизвестная ошибка'), 'error');
          })
          .addRule(ruleData);
      }
    }
    
    // Инициализация страницы управления правилами
    function initManageRulesPage() {
      loadRulesTable();
    }
  </script>
</body>
</html>
  `;
}

