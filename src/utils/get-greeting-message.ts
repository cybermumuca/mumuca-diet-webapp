export function getGreetingMessage(date: Date, firstName: string) {
  const hours = date.getHours();

  if (hours >= 6 && hours < 12) {
    return `Bom dia, ${firstName}`;
  }

  if (hours >= 12 && hours < 18) {
    return `Boa tarde, ${firstName}`;
  }

  return `Boa noite, ${firstName}`;
}
