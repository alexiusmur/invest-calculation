import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export const BarChart = ({ data }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    let timeoutId;
  
    if (chartInstance.current !== null) {
      chartInstance.current.destroy(); // Уничтожаем предыдущий экземпляр графика
    }
  
    // Создаем таймер, который запускает отрисовку графика через 2 секунды
    timeoutId = setTimeout(() => {
      const ctx = chartRef.current.getContext('2d');
  
      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: data.map(result => result.paymentDate),
          datasets: [{
            label: 'Загальний дохід на дату',
            data: data.map(result => result.totalAmount),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            hoverBackgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1.5,
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
    }, 500); // Отрисовываем график через 2 секунды
  
    return () => {
      clearTimeout(timeoutId); // Очищаем таймер при размонтировании компонента
      if (chartInstance.current !== null) {
        chartInstance.current.destroy(); // Уничтожаем экземпляр графика при размонтировании компонента
      }
    };
  }, [data]);

  return <canvas className="barchart" ref={chartRef} />;
};


