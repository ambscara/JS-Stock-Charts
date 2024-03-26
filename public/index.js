async function main() {
    const apiKey = 'bb179d89af174251ae7a0108a06e2e83'; 
    const symbols = ['GME', 'MSFT', 'DIS', 'BNTX'];
    const interval = '1day'; // You can adjust the interval as needed

    const timeChartCanvas = document.querySelector('#time-chart');
    const highestPriceChartCanvas = document.querySelector('#highest-price-chart');
    const averagePriceChartCanvas = document.querySelector('#average-price-chart');

    try {
        // Fetch stock data from Twelvedata
        const url = `https://api.twelvedata.com/time_series?symbol=${symbols.join(',')}&interval=${interval}&apikey=${apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch stock data');
        }
        const result = await response.json();

        // Instead of fetching, use the provided mock data for testing
        const mockData = {
            GME: result['GME'],
            MSFT: result['MSFT'],
            DIS: result['DIS'],
            BNTX: result['BNTX']
        };

        const { GME, MSFT, DIS, BNTX } = mockData;

        console.log(mockData); // Log the mock data

        // Process the fetched data
        const stocks = [GME, MSFT, DIS, BNTX];

        // Reverse the order of values for each stock
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

        // Function to find the highest price from an array of stock values
        function findHighestPrice(stock) {
            if (!Array.isArray(stock)) {
                throw new Error('Stock data is not in the expected format');
            }
            return Math.max(...stock);
        }

        // Prepare data for the Highest Stock Price chart
        const highestPrices = symbols.map(symbol => findHighestPrice(mockData[symbol]?.values));

        console.log(highestPrices); // Log the highest prices

        // Create the Highest Stock Price chart using Chart.js
        new Chart(highestPriceChartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: symbols, // Stock symbols as labels
                datasets: [{
                    label: 'Highest Stock Price',
                    data: highestPrices, // Highest prices as data
                    backgroundColor: 'rgba(54, 162, 235, 0.7)', // Blue color for bars
                    borderColor: 'rgba(54, 162, 235, 1)', // Border color for bars
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true // Start y-axis from zero
                    }
                }
            }
        });

    } catch (error) {
        console.error('Error fetching or processing stock data:', error);
    }
}

main();
