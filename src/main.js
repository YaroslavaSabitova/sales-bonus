/**
 * Функция для расчета выручки
 * @param purchase запись о покупке
 * @param _product карточка товара
 * @returns {number}
 */
function calculateSimpleRevenue(purchase, _product) {
  // @TODO: Расчет выручки от операции

  const { discount, sale_price, quantity } = purchase;
}

/**
 * Функция для расчета бонусов
 * @param index порядковый номер в отсортированном массиве
 * @param total общее число продавцов
 * @param seller карточка продавца
 * @returns {number}
 */
function calculateBonusByProfit(index, total, seller) {
  // @TODO: Расчет бонуса от позиции в рейтинге
  const { profit } = seller;
}

/**
 * Функция для анализа данных продаж
 * @param data
 * @param options
 * @returns {{revenue, top_products, bonus, name, sales_count, profit, seller_id}[]}
 */
function analyzeSalesData(data, options) {
  // @TODO: Проверка входных данных
  if (!data || !Array.isArray(data.sellers) || data.sellers.length === 0) {
    throw new Error('Некорректные входные данные');
  }

  // @TODO: Проверка наличия опций
  const { calculateRevenue, calculateBonus } = options;
  if (
    !typeof options === 'object' ||
    !typeof calculateRevenue === 'function'
  ) {
    throw new Error('Чего-то не хватает');
  }

  // @TODO: Подготовка промежуточных данных для сбора статистики
  const sellerStats = data.sellers.map(seller =>
    // Заполним начальными данными
    ({
      id: seller.id,
      name: `${seller.first_name} ${seller.last_name}`,
      revenue: 0,
      profit: 0,
      sales_count: 0,
      products_sold: {},
    })
  );
  console.log('sellerStats', sellerStats);

  // @TODO: Индексация продавцов и товаров для быстрого доступа
  const sellerIndex = Object.fromEntries(
    sellerStats.map(item => [item.id, item])
  ); // Ключом будет id, значением — запись из sellerStats
  console.log('sellerIndex', sellerIndex);

  const productIndex = Object.fromEntries(
    data.products.map(item => [item.sku, item])
  ); // Ключом будет sku, значением — запись из data.products
  console.log('productIndex', productIndex);

  // @TODO: Расчет выручки и прибыли для каждого продавца
  data.purchase_records.forEach(record => {
    // Чек
    const seller = sellerIndex[record.seller_id]; // Продавец
    // Увеличить количество продаж
    if (seller) {
      seller.sales_count += 1;
    }
    // Увеличить общую сумму выручки всех продаж
    if (seller.revenue) {
      seller.revenue += record.total_amount;
    }

    // Расчёт прибыли для каждого товара
    record.items.forEach(item => {
      const product = productIndex[item.sku]; // Товар

      // Посчитать себестоимость (cost) товара как product.purchase_price, умноженную на количество товаров из чека
      const cost = product.purchase_price * item.quantity;

      // Посчитать выручку (revenue) с учётом скидки через функцию calculateRevenue
      const revenue = calculateRevenue(item, product);

      // Посчитать прибыль: выручка минус себестоимость
      const profit = revenue - cost;

      // Увеличить общую накопленную прибыль (profit) у продавца
      seller.profit = seller.profit + profit;

      // Учёт количества проданных товаров
      if (!seller.products_sold[item.sku]) {
        seller.products_sold[item.sku] = 0;
      }
      // По артикулу товара увеличить его проданное количество у продавца
      seller.products_sold[item.sku] =
        seller.products_sold[item.sku] + item.quantity;
    });
  });

  // @TODO: Сортировка продавцов по прибыли

  // @TODO: Назначение премий на основе ранжирования

  // @TODO: Подготовка итоговой коллекции с нужными полями
}
