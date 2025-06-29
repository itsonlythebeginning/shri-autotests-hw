export function dayOfYearToDate(dayNumber) {
  if (dayNumber < 1 || dayNumber > 365) {
    return 'Ошибка: введите число от 1 до 365';
  }

  const months = [
    ['января', 31],
    ['февраля', 28],
    ['марта', 31],
    ['апреля', 30],
    ['мая', 31],
    ['июня', 30],
    ['июля', 31],
    ['августа', 31],
    ['сентября', 30],
    ['октября', 31],
    ['ноября', 30],
    ['декабря', 31],
  ];

  for (let i = 0; i < months.length; i++) {
    const [month, daysInMonth] = months[i];
    if (dayNumber <= daysInMonth) {
      return `${dayNumber} ${month}`;
    }
    dayNumber = dayNumber - daysInMonth;
  }
}
