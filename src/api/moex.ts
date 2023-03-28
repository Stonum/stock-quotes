async function getHistoryStockQuotes(
  symbol: string,
  group: string,
  boardId: string,
  params: any
): Promise<SecuritiePrice[]> {
  const apiUrl = `https://iss.moex.com/iss/history/engines/stock/markets/${group}/boards/${boardId}/securities/${symbol}.json`;
  let queryParams = `iss.meta=off&interval=24&history.columns=TRADEDATE,LEGALCLOSEPRICE,CLOSE`;
  if (params.fromDate) queryParams += `&from=${params.fromDate}`;
  if (params.toDate) queryParams += `&till=${params.toDate}`;
  if (params.start) queryParams += `&start=${params.start}`;

  const response = await fetch(`${apiUrl}?${queryParams}`);
  const data = await response.json();
  const columns = data.history.columns;
  const prices: SecuritiePrice[] = data.history.data.map((item: any) => ({
    date: item[columns.indexOf("TRADEDATE")],
    volume: item[columns.indexOf("LEGALCLOSEPRICE")] || item[columns.indexOf("CLOSE")],
  }));
  if (prices.length !== 0) {
    prices.push(
      ...(await getHistoryStockQuotes(symbol, group, boardId, {
        ...params,
        start: (params.start || 0) + prices.length,
      }))
    );
  }

  return prices;
}

async function getSecurities(search: string): Promise<Securitie[]> {

  const apiUrl = `https://iss.moex.com/iss/securities.json?iss.meta=off&is_trading=true&securities.columns=secid,name,group,primary_boardid&limit=10`;
  const q = search ? `&q=${search}` : '';

  const response = await fetch(`${apiUrl}${q}`);
  const data = await response.json();
  const columns = data.securities.columns;

  const securities: Securitie[] = data.securities.data.map((item: any) => ({
    secid: item[columns.indexOf("secid")],
    name: item[columns.indexOf("name")],
    group: (item[columns.indexOf("group")] ?? '').replace('stock_', ''),
    boardid: item[columns.indexOf("primary_boardid")],
  }));

  return securities;
}

export { getHistoryStockQuotes, getSecurities };
