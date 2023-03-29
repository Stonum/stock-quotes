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

  const apiUrl = `https://iss.moex.com/iss/securities.json`;
  const params = [
    'iss.meta=off',
    'securities.columns=secid,name,group,primary_boardid,isin',
    'limit=10'
  ];

  if (search) {
    params.push(`q=${search}`);
  }

  const response = await fetch(`${apiUrl}?${params.join('&')}`);
  const data = await response.json();
  const columns = data.securities.columns;

  const getGroup = (group: string) => {
    let _g = group.replace('stock_', '');
    if (group === 'stock_dr') {
      _g = 'shares';
    }
    return _g;
  }

  const securities: Securitie[] = data.securities.data
    .filter((item: any) => item && item[4] !== null)
    .map((item: any) => ({
      secid: item[columns.indexOf("secid")],
      name: item[columns.indexOf("name")],
      group: getGroup(item[columns.indexOf("group")] ?? ''),
      boardid: item[columns.indexOf("primary_boardid")],
    }));

  return securities;
}

export { getHistoryStockQuotes, getSecurities };
