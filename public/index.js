async function main() {
    const apiKey = 'bb179d89af174251ae7a0108a06e2e83'; 
    const symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];
    const interval = '1day'; 
    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    try {
       
        const url = `https://api.twelvedata.com/time_series?symbol=${symbols.join(',')}&interval=${interval}&apikey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch stock data');
        }
        const result = await response.json();

        
        const mockData = {
            GME: result['GME'],
            MSFT: result['MSFT'],
            DIS: result['DIS'],
            BNTX: result['BNTX']
        };

        const { GME, MSFT, DIS, BNTX } = mockData;

        console.log(mockData); 

        
        const stocks = [GME, MSFT, DIS, BNTX];

        
        stocks.forEach(stock => {
            stock.values.reverse();
        });

        // Create Time Series chart
        new Chart(timeChartCanvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: stocks[0].values.map(value => value.datetime),
                datasets: stocks.map(stock => ({
                    label: stock.meta.symbol,
                    data: stock.values.map(value => parseFloat(value.high)),
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }))
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

       
        function findHighestPrice(stock) {
            if (!Array.isArray(stock)) {
                throw new Error('Stock data is not in the expected format');
            }
            return Math.max(...stock);
        }

       
        const highestPrices = symbols.map(symbol => findHighestPrice(mockData[symbol]?.values));

        
        new Chart(highestPriceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: symbols,
                datasets: [{
                    label: 'Highest Stock Price',
                    data: highestPrices, 
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', 
                    borderColor: 'rgba(54, 162, 235, 1)', 
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true 
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching or processing stock data:', error);
    }
}

main();
