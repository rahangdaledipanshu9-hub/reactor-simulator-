// ============================================
// PYROSYNC - ENHANCED SIMULATION LOGIC
// ============================================

let timeChart = null;

/**
 * Advanced yield calculation with refined pyrolysis model
 */
function calculateYield() {
    // Get input values
    let feed = Number(document.getElementById("feedstock").value);
    let catalyst = Number(document.getElementById("catalyst").value);
    let temp = Number(document.getElementById("temperature").value);
    let time = Number(document.getElementById("time").value);

    // Validation
    if (!feed || !catalyst || !temp || !time) {
        showNotification("Please enter all input values", "error");
        return;
    }

    if (feed < 10 || feed > 500) {
        showNotification("Feedstock must be between 10-500 kg", "error");
        return;
    }

    if (catalyst < 0 || catalyst > 20) {
        showNotification("Catalyst must be between 0-20%", "error");
        return;
    }

    if (temp < 300 || temp > 500) {
        showNotification("Temperature must be between 300-500°C", "error");
        return;
    }

    if (time < 5 || time > 120) {
        showNotification("Reaction time must be between 5-120 minutes", "error");
        return;
    }

    // Advanced yield model with optimized coefficients
    let tempFactor = (temp - 350) / 150;
    let catalystEffect = catalyst / 20;
    let timeFactor = Math.min(time / 60, 1);

    // Base yields with optimization curves
    let oilPercent = 55 + (8 * catalystEffect) + (15 * tempFactor) + (12 * timeFactor);
    let gasPercent = 25 - (3 * catalystEffect) + (5 * timeFactor);
    let charPercent = Math.max(5, 100 - oilPercent - gasPercent);

    // Cap values
    oilPercent = Math.min(oilPercent, 90);
    gasPercent = Math.min(gasPercent, 50);

    // Mass calculations
    let oil = feed * oilPercent / 100;
    let gas = feed * gasPercent / 100;
    let char = feed * charPercent / 100;

    // Display results with animation
    animateValue("oil", oil.toFixed(2) + " kg", 500);
    animateValue("gas", gas.toFixed(2) + " kg", 500);
    animateValue("char", char.toFixed(2) + " kg", 500);

    // Conversion efficiency
    let conversion = ((feed - char) / feed) * 100;
    animateValue("conversion", conversion.toFixed(2) + " %", 500);

    // Carbon footprint reduction
    let carbon = feed * 0.6;
    animateValue("carbon", carbon.toFixed(2) + " kg CO₂", 500);

    // Economic calculation (refined pricing)
    let oilPrice = 35; // ₹/kg
    let gasPrice = 12; // ₹/kg
    let charPrice = 8; // ₹/kg
    let revenue = (oil * oilPrice) + (gas * gasPrice) + (char * charPrice);
    let operatingCost = feed * 10; // ₹/kg feedstock
    let profit = revenue - operatingCost;

    animateValue("profit", "₹ " + profit.toFixed(2), 500);

    // Generate yield vs time graph
    generateTimeChart(feed, catalyst, temp, time, oilPercent, gasPercent, charPercent);

    // Show success notification
    showNotification("Simulation completed successfully!", "success");
}

/**
 * Animate number changes for visual feedback
 */
function animateValue(elementId, finalValue, duration = 500) {
    const element = document.getElementById(elementId);
    const startTime = Date.now();

    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Add fade and scale animation
        element.style.opacity = '0.7';
        element.style.transform = 'scale(0.95)';

        if (progress === 1) {
            element.innerText = finalValue;
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }
    }

    // Initial animation
    element.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        element.innerText = finalValue;
        element.style.opacity = '1';
        element.style.transform = 'scale(1)';
    }, 100);
}

/**
 * Generate yield vs reaction time chart
 */
function generateTimeChart(feed, catalyst, temp, time, oilBase, gasBase, charBase) {
    let timeSteps = [];
    let oilData = [];
    let gasData = [];
    let charData = [];

    // Calculate yields at different time intervals
    for (let t = 0; t <= time; t += Math.max(5, Math.floor(time / 10))) {
        let timeFraction = t / time;
        let o = oilBase * timeFraction;
        let g = gasBase * timeFraction * 0.8; // Gas slightly lags
        let c = charBase * (1 - timeFraction * 0.5);

        timeSteps.push(t);
        oilData.push((feed * o / 100).toFixed(2));
        gasData.push((feed * g / 100).toFixed(2));
        charData.push((feed * c / 100).toFixed(2));
    }

    // Destroy previous chart if exists
    if (timeChart) {
        timeChart.destroy();
    }

    // Create new chart
    const ctx = document.getElementById("timeChart").getContext("2d");
    timeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: timeSteps,
            datasets: [
                {
                    label: 'Oil Yield',
                    data: oilData,
                    borderColor: '#06ffa5',
                    backgroundColor: 'rgba(6, 255, 165, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#06ffa5',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Gas Yield',
                    data: gasData,
                    borderColor: '#ffa500',
                    backgroundColor: 'rgba(255, 165, 0, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#ffa500',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Biochar',
                    data: charData,
                    borderColor: '#a0aec0',
                    backgroundColor: 'rgba(160, 174, 192, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#a0aec0',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: {
                        color: '#a0aec0',
                        font: { size: 12, weight: '600' },
                        padding: 15
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#718096',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        color: '#718096',
                        font: { size: 11 }
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    }
                }
            }
        }
    });
}

/**
 * Show toast notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;

    if (type === 'success') {
        notification.style.background = 'rgba(6, 255, 165, 0.2)';
        notification.style.color = '#06ffa5';
        notification.style.borderColor = 'rgba(6, 255, 165, 0.5)';
    } else if (type === 'error') {
        notification.style.background = 'rgba(255, 71, 87, 0.2)';
        notification.style.color = '#ff4757';
        notification.style.borderColor = 'rgba(255, 71, 87, 0.5)';
    } else {
        notification.style.background = 'rgba(0, 212, 255, 0.2)';
        notification.style.color = '#00d4ff';
        notification.style.borderColor = 'rgba(0, 212, 255, 0.5)';
    }

    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }
`;
document.head.appendChild(style);

// Initialize on page load
window.addEventListener('load', function() {
    console.log('PyroSync Simulator loaded successfully');
    // Optional: Display a welcome message
    showNotification('Welcome to PyroSync - Advanced Reactor Simulator', 'info');
});
