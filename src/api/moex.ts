interface IParamsStockQuotes {
  fromDate?: string;
  toDate?: string;
  start?: number;
}

async function getHistoryStockQuotes(
  symbol: string,
  boardId: string,
  params: any
) {
  const apiUrl = `https://iss.moex.com/iss/history/engines/stock/markets/shares/boards/${boardId}/securities/${symbol}.json`;
  let queryParams = `interval=24`;
  if (params.fromDate) queryParams += `&from=${params.fromDate}`;
  if (params.toDate) queryParams += `&till=${params.toDate}`;
  if (params.start) queryParams += `&start=${params.start}`;

  const response = await fetch(`${apiUrl}?${queryParams}`);
  const data = await response.json();
  const columns = data.history.columns;
  const prices = data.history.data.map((item: any) => ({
    date: item[columns.indexOf("TRADEDATE")],
    open: item[columns.indexOf("OPEN")],
    high: item[columns.indexOf("HIGH")],
    low: item[columns.indexOf("LOW")],
    close: item[columns.indexOf("CLOSE")],
    volume: item[columns.indexOf("LEGALCLOSEPRICE")],
  }));
  if (prices.length !== 0) {
    prices.push(
      ...(await getHistoryStockQuotes(symbol, boardId, {
        ...params,
        start: (params.start || 0) + prices.length,
      }))
    );
  }

  return prices;
}

export { getHistoryStockQuotes };
