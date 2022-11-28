/* eslint-disable @typescript-eslint/ban-types */

export const keyExtractor = (item: {}, index: number) =>
  String(item) + index + '';
