import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import { promoCars, stats, Car } from '@/data/cars';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = stats.saleEndDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage);
  };

  return (
    <div className={styles.page}>
      {/* Hero Section */}
      <motion.section 
        className={styles.hero}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className={styles.heroContent}>
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className={styles.badge}
          >
            🔥 СУПЕР РАСПРОДАЖА
          </motion.div>

          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className={styles.title}
          >
            АВТО СО СКЛАДА
            <br />
            <span className={styles.titleGradient}>ПО СУПЕРЦЕНАМ!</span>
          </motion.h1>

          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className={styles.subtitle}
          >
            Растаможены • Готовы к выдаче • Из Европы и Азии
          </motion.p>

          {/* Timer */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className={styles.timer}
          >
            <div className={styles.timerLabel}>⏰ До конца акции осталось:</div>
            <div className={styles.timerBoxes}>
              <div className={styles.timerBox}>
                <div className={styles.timerValue}>{timeLeft.days}</div>
                <div className={styles.timerUnit}>дней</div>
              </div>
              <div className={styles.timerSeparator}>:</div>
              <div className={styles.timerBox}>
                <div className={styles.timerValue}>{timeLeft.hours}</div>
                <div className={styles.timerUnit}>часов</div>
              </div>
              <div className={styles.timerSeparator}>:</div>
              <div className={styles.timerBox}>
                <div className={styles.timerValue}>{timeLeft.minutes}</div>
                <div className={styles.timerUnit}>минут</div>
              </div>
              <div className={styles.timerSeparator}>:</div>
              <div className={styles.timerBox}>
                <div className={styles.timerValue}>{timeLeft.seconds}</div>
                <div className={styles.timerUnit}>секунд</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className="container">
          <div className={styles.statsGrid}>
            <motion.div
              className={styles.statCard}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className={styles.statIcon}>🚗</div>
              <div className={styles.statValue}>
                <CountUp end={stats.totalCars} duration={2} />
              </div>
              <div className={styles.statLabel}>Машин на складе</div>
            </motion.div>

            <motion.div
              className={`${styles.statCard} ${styles.statCardPrimary}`}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className={styles.statIcon}>⚡</div>
              <div className={styles.statValue}>
                <CountUp end={stats.remainingCars} duration={2} />
              </div>
              <div className={styles.statLabel}>Осталось в наличии!</div>
            </motion.div>

            <motion.div
              className={styles.statCard}
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className={styles.statIcon}>✅</div>
              <div className={styles.statValue}>
                <CountUp end={stats.soldCars} duration={2} />
              </div>
              <div className={styles.statLabel}>Уже продано</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cars Grid */}
      <section className={styles.carsSection}>
        <div className="container">
          <motion.h2
            className={styles.sectionTitle}
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            🏆 УСПЕЙ КУПИТЬ! ОСТАЛОСЬ ВСЕГО {stats.remainingCars} АВТО
          </motion.h2>

          <div className={styles.carsGrid}>
            {promoCars.map((car, index) => (
              <motion.div
                key={car.id}
                className={styles.carCard}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ scale: 1.03, y: -10 }}
              >
                <div className={styles.carDiscount}>-{car.discount}%</div>
                
                <div className={styles.carEmoji}>{car.image}</div>
                
                <div className={styles.carTags}>
                  {car.tags.map((tag, i) => (
                    <span key={i} className={styles.carTag}>{tag}</span>
                  ))}
                </div>

                <h3 className={styles.carTitle}>{car.brand} {car.model}</h3>
                
                <div className={styles.carSpecs}>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>📅</span>
                    {car.year} год
                  </div>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>🛣️</span>
                    {formatMileage(car.mileage)} км
                  </div>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>🌍</span>
                    {car.origin}
                  </div>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>⚙️</span>
                    {car.transmission}
                  </div>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>⛽</span>
                    {car.fuel}
                  </div>
                  <div className={styles.carSpec}>
                    <span className={styles.carSpecIcon}>🎨</span>
                    {car.color}
                  </div>
                </div>

                <div className={styles.carPriceSection}>
                  <div className={styles.carOldPrice}>
                    {formatPrice(Math.round(car.price / (1 - car.discount / 100)))} ₽
                  </div>
                  <div className={styles.carPrice}>
                    {formatPrice(car.price)} ₽
                  </div>
                </div>

                <a 
                  href={`tel:+79991234567`}
                  className={styles.carButton}
                >
                  📞 Позвонить
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        className={styles.cta}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>
              ⚡ НЕ УПУСТИ ШАНС!
            </h2>
            <p className={styles.ctaText}>
              Осталось всего {stats.remainingCars} автомобиля из {stats.totalCars}!<br />
              Звони прямо сейчас и получи скидку до 30%!
            </p>
            <motion.a
              href="tel:+79991234567"
              className={styles.ctaButton}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📞 ПОЗВОНИТЬ СЕЙЧАС
            </motion.a>
            <div className={styles.ctaNote}>
              Работаем 24/7 • Быстрое оформление • Помощь с доставкой
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className="container">
          <p>© 2025 АвтоПромо. Распродажа автомобилей со склада.</p>
          <p className={styles.footerNote}>
            ⚠️ Количество автомобилей ограничено. Акция действует до {stats.saleEndDate.toLocaleDateString('ru-RU')}.
          </p>
        </div>
      </footer>
    </div>
  );
}

