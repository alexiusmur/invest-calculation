import { useEffect } from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import { useState } from 'react';
import { BarChart } from './components/BarChart';

import logoImg from './images/money-box.gif';

function App() {

  const [percent, setPersent] = useState('')
  const [amount, setAmount] = useState('')
  const [numPayments, setNumPayments] = useState('4')
  const [results, setResults] = useState([]);

  const generatePaymentDates = (startDate, numPayments) => {
    const paymentDates = [];
    let currentDate = new Date(startDate); // Перетворюємо рядок початкової дати в об'єкт Date

    // Генеруємо дати для вказаної кількості платежів
    for (let i = 0; i < numPayments; i++) {
      // Додаємо пів року дл тривалої дати
      currentDate.setMonth(currentDate.getMonth() + 6);
      const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Добавляем ведущий ноль, если месяц состоит из одной цифры
      const year = currentDate.getFullYear().toString().slice(-2); // Берем последние две цифры года
      const paymentDate = `${currentDate.getDate()}.${month}.${year}`;
      paymentDates.push(paymentDate);
    }

    return paymentDates;
  };
  const startDate = '2024-01-30'; // Начальная дата в формате год-месяц-день
  const numPaymentss = numPayments; // Количество платежей


  const calculate = () => {
    const percentFloat = parseFloat(percent);
    const amountInt = parseInt(amount);

    if (!isNaN(percentFloat) && !isNaN(amountInt)) {
      // const paymentDates = ['31.07.24', '29.01.25', '30.07.25', '28.01.26'];
      const paymentDates = generatePaymentDates(startDate, numPaymentss);
      const array = Array.from({ length: numPayments }, (_, index) => index + 1);

      let totalAmount = 0;
      const returns = array.map((paymentDate, index) => {
        const countBonds = amountInt; // кількість облігацій
        const totalPerDate = countBonds * percentFloat * 10; // Дохід на дату виплат
        totalAmount += totalPerDate; // загальний дохід на дану дату
        return {
          paymentDate: paymentDates[index],
          countBonds: countBonds,
          totalPerDate: totalPerDate / 2,
          totalAmount: totalAmount / 2,
        };
      });

      setResults(returns);
    } else {
      // Обробка помилки вводу
      console.error('Invalid input');
    }
  };

  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    function simulateNetworkRequest() {
      return new Promise((resolve) => setTimeout(resolve, 500));
    }

    if (isLoading) {
      simulateNetworkRequest().then(() => {
        setLoading(false);
      });
    }
  }, [isLoading]);

  const handleClick = () => setLoading(true);

  const [displayedIndex, setDisplayedIndex] = useState(0);

  useEffect(() => {
    // Якщо всі рядки відображено, завершуємо ефект
    if (displayedIndex >= results.length) return;

    // Встановлюємо таймер для відображення наступного рядка через 1 секунду
    const timerId = setTimeout(() => {
      // Збільшуємо індекс для відображення наступного рядка
      setDisplayedIndex(displayedIndex + 1);
    }, 250);

    // Очищаємо таймер під час розмонтування компонента
    return () => clearTimeout(timerId);
  }, [displayedIndex, results]);


  return (
    <div className="App">
      <header className="App-header">
        <a href="/">
          <img src={logoImg} alt='logo' />
        </a>
      </header>
      <Container>
        <div className='block'>
          <Form.Control
            placeholder="ставка %"
            value={percent}
            type='number'
            className='input'
            onChange={(e) => setPersent(e.target.value)}
          />
          <p>% ставка</p>
        </div>

        <div className='block'>
          <Form.Control
            placeholder="кількість облігацій"
            value={amount}
            type='number'
            className='input'
            onChange={(e) => setAmount(e.target.value)}
          />
          <p>кількість облігацій 📈</p>
        </div>

        <div className='block'>
          <Form.Control
            placeholder="кількість платежів"
            value={numPayments}
            type='number'
            className='input'
            onChange={(e) => setNumPayments(e.target.value)}
          />
          <p>кількість платежів 💳</p>
        </div>

        <Button
          variant='outline-success'
          className='btn'
          onClick={() => {
            handleClick();
            calculate();
          }}
        >
          {isLoading ? 'Загрузка…' : 'Розрахувати'}
        </Button>

        <div className='block_results'>
          <h2>Результати:</h2>
          {amount ?
            <p>{amount.toLocaleString()} облігацій = {(amount * 1000).toLocaleString()} грн</p>
            :
            <></>
          }

          <table className="results-table">
            <thead>
              <tr>
                <th>Дата виплат</th>
                <th>К-сть облігацій</th>
                <th>Дохід</th>
                <th>Спільний дохід</th>
              </tr>
            </thead>
            <tbody>
            {results.slice(0, displayedIndex).map((result, index) => (
                <tr key={index}>
                  <td>{result.paymentDate}</td>
                  <td>{result.countBonds}</td>
                  <td>{result.totalPerDate}</td>
                  <td>{result.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <BarChart data={results} />

      </Container >

    </div >
  );
}

export default App;
