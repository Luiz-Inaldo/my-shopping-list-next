import { TabType } from "@/app/statistics/_components/StatisticsTabs";

/**
 * Função para obter o início de um range atual, a depender da tab ativa
 * @param activeTab - Tab ativa (dia, semana, mês)
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de início do range atual
 */
export function getCurrentRangeStartDate(
  activeTab: TabType,
  month: number,
  year: number
) {
  const today = new Date();
  const dateUTC = new Date(Date.UTC(year, month, today.getDate(), 3, 0, 0, 0));

  switch (activeTab) {
    case "day":
      return dateUTC;
    case "week":
      // inicio da semana
      const dateNumber = dateUTC.getDate() - dateUTC.getDay();
      const weekStart = new Date(Date.UTC(year, month, dateNumber, 3, 0, 0, 0));

      return weekStart;
    case "month":
      if (!month || !year) return today;

      const monthStart = new Date(Date.UTC(year, month, 1, 3, 0, 0, 0));
      return monthStart;
    default:
      return dateUTC;
  }
}

/**
 * Função para obter o fim de um range atual, a depender da tab ativa
 * @param activeTab - Tab ativa (dia, semana, mês)
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de fim do range atual
 */
export function getCurrentRangeEndDate(
  activeTab: TabType,
  month: number,
  year: number
) {
  const today = new Date();
  const dateUTC = new Date(
    Date.UTC(year, month, today.getDate(), 23, 59, 59, 999)
  );

  switch (activeTab) {
    case "day":
      return dateUTC;
    case "week":
      // fim da semana
      const dateNumber = dateUTC.getDate() + (6 - dateUTC.getDay());
      const weekEnd = new Date(
        Date.UTC(year, month, dateNumber, 23, 59, 59, 999)
      );

      return weekEnd;
    case "month":
      if (!month || !year) return today;

      const monthEnd = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
      return monthEnd;
    default:
      return dateUTC;
  }
}

/**
 * Função para obter o início de um range anterior, a depender da tab ativa
 * @param activeTab - Tab ativa (dia, semana, mês)
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de início do range anterior
 */
export function getPreviousRangeStartDate(
  activeTab: TabType,
  month: number,
  year: number
) {
  let previousMonth = getPreviousMonth(activeTab, month);
  let previousYear = previousMonth < 0 ? year - 1 : year;

  const today = new Date();
  const dateUTC = new Date(Date.UTC(year, month, today.getDate(), 3, 0, 0, 0));

  switch (activeTab) {
    case "day":
      const yesterday = dateUTC.getDate() - 1;
      if (yesterday < 1) {
        previousMonth -= 1;
        previousYear = previousMonth < 0 ? year - 1 : year;
        return new Date(Date.UTC(previousYear, previousMonth, 0, 3, 0, 0, 0));
      }

      return new Date(
        Date.UTC(previousYear, previousMonth, yesterday, 3, 0, 0, 0)
      );
    case "week":
      const previousWeekStart = getPreviousWeekStart(
        dateUTC,
        previousMonth,
        previousYear
      );
      return previousWeekStart;
    case "month":
      return new Date(Date.UTC(previousYear, previousMonth, 1, 3, 0, 0, 0));

    default:
      return new Date(Date.UTC(previousYear, previousMonth, 1, 3, 0, 0, 0));
  }
}

/**
 * Função para obter o fim de um range anterior, a depender da tab ativa
 * @param activeTab - Tab ativa (dia, semana, mês)
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de fim do range anterior
 */
export function getPreviousRangeEndDate(
  activeTab: TabType,
  month: number,
  year: number
) {
  let previousMonth = activeTab === "month" ? month - 1 : month;
  let previousYear = previousMonth < 0 ? year - 1 : year;
  const today = new Date();
  const dateUTC = new Date(
    Date.UTC(year, month, today.getDate(), 23, 59, 59, 999)
  );

  switch (activeTab) {
    case "day":
      const yesterday = dateUTC.getDate() - 1;
      if (yesterday < 1) {
        previousMonth -= 1;
        previousYear = previousMonth < 0 ? year - 1 : year;
        return new Date(
          Date.UTC(previousYear, previousMonth + 1, 0, 23, 59, 59, 999)
        );
      }

      return new Date(
        Date.UTC(previousYear, previousMonth, yesterday, 23, 59, 59, 999)
      );
    case "week":
      const previousWeekEnd = getPreviousWeekEnd(
        dateUTC,
        previousMonth,
        previousYear
      );
      return previousWeekEnd;
    case "month":
      return new Date(
        Date.UTC(previousYear, previousMonth + 1, 0, 23, 59, 59, 999)
      );

    default:
      return new Date(
        Date.UTC(previousYear, previousMonth + 1, 0, 23, 59, 59, 999)
      );
  }
}

/**
 * Função para obter o início de uma semana anterior, a depender da data atual
 * @param dateUTC - Data atual
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de início da semana anterior
 */
function getPreviousWeekStart(dateUTC: Date, month: number, year: number) {
  // inicia com a contagem de 7 dias para trás
  let numberOfDaysBack = 7;
  const currentWeekStartDate = dateUTC.getDate() - dateUTC.getDay();
  let previousWeekStartDate = currentWeekStartDate;

  while (numberOfDaysBack > 0) {
    if (previousWeekStartDate > 1) {
      previousWeekStartDate -= 1;
    } else {
      month -= 1;
      if (month < 0) {
        month = 11; // dezembro
        year -= 1; // ano anterior
      }
      previousWeekStartDate = new Date(
        Date.UTC(year, month, 0, 3, 0, 0, 0)
      ).getDate();
    }
    numberOfDaysBack -= 1;
  }

  return new Date(Date.UTC(year, month, previousWeekStartDate, 3, 0, 0, 0));
}

/**
 * Função para obter o fim de uma semana anterior, a depender da data atual
 * @param dateUTC - Data atual
 * @param month - Mês atual
 * @param year - Ano atual
 * @returns Data de fim da semana anterior
 */
function getPreviousWeekEnd(dateUTC: Date, month: number, year: number) {
  let numberOfDaysBack = 1;
  const currentWeekStartDate = dateUTC.getDate() - dateUTC.getDay();
  let previousWeekEndDate = currentWeekStartDate;

  while (numberOfDaysBack > 0) {
    if (previousWeekEndDate > 1) {
      previousWeekEndDate -= 1;
    } else {
      month -= 1;
      if (month < 0) {
        month = 11;
        year -= 1;
      }
      previousWeekEndDate = new Date(
        Date.UTC(year, month, 0, 23, 59, 59, 999)
      ).getDate();
    }
    numberOfDaysBack -= 1;
  }

  return new Date(Date.UTC(year, month, previousWeekEndDate, 23, 59, 59, 999));
}

function getPreviousMonth(activeTab: TabType, month: number) {
  if (activeTab === "month") {
    return month === 0 ? 11 : month - 1;
  }

  return month;
}
