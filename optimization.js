// ============================================
// PYROSYNC - TEMPERATURE OPTIMIZATION MODULE
// ============================================

let optChart = null;

/**
 * Initialize temperature optimization chart on page load
 */
window.addEventListener('DOMContentLoaded', function() {
    generateOptimizationChart();
});

/**
 * Generate temperature vs yield optimization chart
 */
function generateOptimizationChart() {
    let tempRange = [];
    let oilYieldData = [];
    let gasYieldData = [];
    let efficiencyData = [];

    // Temperature range from 300°C to 500°C
    for (let t = 300; t <= 500; t += 10) {
        tempRange.push(t + "°C");

        // Advanced optimization model
        let tempFactor = (t - 350) / 150;
        let oilYield = 55 + (15 * tempFactor) + 5;
        let gasYield = 25 + (5 * tempFactor) - 2;
        let efficiency = Math.min((oilYield + gasYield) / 100 * 100, 100);

        oilYieldData.push(Math.min(oilYield, 90));
        gasYieldData.push(Math.min(gasYield, 50));
        efficiencyData.push(efficiency.toFixed(1));
    }

    // Destroy previous chart if exists
    if (optChart) {
        optChart.destroy();
    }

    // Create optimization chart
    const ctx = document.getElementById("optChart").getContext("2d");
    optChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: tempRange,
            datasets: [
                {
                    label: 'Oil Yield (%)',
                    data: oilYieldData,
                    backgroundColor: '#06ffa5',
                    borderColor: '#06ffa5',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                },
                {
                    label: 'Gas Yield (%)',
                    data: gasYieldData,
                    backgroundColor: '#ffa500',
                    borderColor: '#ffa500',
                    borderWidth: 2,
                    borderRadius: 8,
                    borderSkipped: false
                }
            ]
        },
        options: {
            indexAxis: 'x',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0aec0',
                        font: { size: 12, weight: '600' },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 14, 39, 0.9)',
                    titleColor: '#00d4ff',
                    bodyColor: '#a0aec0',
                    borderColor: '#00d4ff',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#718096',
                        font: { size: 11 },
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#718096',
                        font: { size: 10 }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                }
            }
        }
    });
}

/**
 * Export optimization data as CSV
 */
function exportOptimizationData() {
    let data = "Temperature (°C),Oil Yield (%),Gas Yield (%)\n";
    
    for (let t = 300; t <= 500; t += 10) {
        let tempFactor = (t - 350) / 150;
        let oilYield = Math.min(55 + (15 * tempFactor) + 5, 90);
        let gasYield = Math.min(25 + (5 * tempFactor) - 2, 50);
        
        data += `${t},${oilYield.toFixed(2)},${gasYield.toFixed(2)}\n`;
    }

    // Create download link
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pyrosync_optimization_data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}
