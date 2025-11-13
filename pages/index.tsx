import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { promoCars, stats } from '@/data/cars';
import styles from '@/styles/TikTok.module.css';

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Scroll handler для TikTok-style навигации
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        const scrollTop = containerRef.current!.scrollTop;
        const windowHeight = window.innerHeight;
        const newIndex = Math.round(scrollTop / windowHeight);
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < promoCars.length) {
          setCurrentIndex(newIndex);
          containerRef.current!.scrollTo({
            top: newIndex * windowHeight,
            behavior: 'smooth'
          });
        }
      }, 100);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [currentIndex]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('ru-RU').format(mileage);
  };

  const scrollToNext = () => {
    if (currentIndex < promoCars.length - 1) {
      setCurrentIndex(currentIndex + 1);
      containerRef.current?.scrollTo({
        top: (currentIndex + 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  const scrollToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      containerRef.current?.scrollTo({
        top: (currentIndex - 1) * window.innerHeight,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={styles.app}>
      {/* Фиксированный Header с акцией и таймером */}
      <motion.div 
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.badge}>РАСПРОДАЖА СКЛАДА</div>
            <div className={styles.stockInfo}>
              Осталось <span className={styles.highlight}>{stats.remainingCars}</span> из {stats.totalCars}
            </div>
          </div>
          <div className={styles.headerTimer}>
            <div className={styles.timerCompact}>
              <span className={styles.timerValue}>{timeLeft.days.toString().padStart(2, '0')}</span>:
              <span className={styles.timerValue}>{timeLeft.hours.toString().padStart(2, '0')}</span>:
              <span className={styles.timerValue}>{timeLeft.minutes.toString().padStart(2, '0')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Вертикальная лента карточек */}
      <div className={styles.scrollContainer} ref={containerRef}>
        {promoCars.map((car, index) => (
          <div key={car.id} className={styles.slide}>
            {/* Фоновое изображение */}
            <div 
              className={styles.slideBackground}
              style={{
                backgroundImage: `url(${car.image})`
              }}
            />
            
            {/* Градиентный оверлей */}
            <div className={styles.slideOverlay} />

            {/* Контент карточки */}
            <div className={styles.slideContent}>
              {/* Левая сторона - основная информация */}
              <div className={styles.mainInfo}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : -50 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <div className={styles.carTags}>
                    {car.tags.map((tag, i) => (
                      <span key={i} className={styles.tag}>{tag}</span>
                    ))}
                  </div>
                  
                  <h2 className={styles.carBrand}>{car.brand}</h2>
                  <h1 className={styles.carModel}>{car.model}</h1>
                  
                  <div className={styles.priceBlock}>
                    <div className={styles.oldPrice}>
                      {formatPrice(Math.round(car.price / (1 - car.discount / 100)))} ₽
                    </div>
                    <div className={styles.newPrice}>
                      {formatPrice(car.price)} ₽
                    </div>
                    <div className={styles.saveAmount}>
                      Экономия {formatPrice(Math.round(car.price / (1 - car.discount / 100)) - car.price)} ₽
                    </div>
                  </div>

                  <a href="tel:+79991234567" className={styles.ctaButton}>
                    УЗНАТЬ ЦЕНУ ПОД КЛЮЧ
                  </a>
                </motion.div>
              </div>

              {/* Правая сторона - иконки характеристик (TikTok style) */}
              <div className={styles.sidePanel}>
                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <div className={styles.featureIcon}>📅</div>
                  <div className={styles.featureValue}>{car.year}</div>
                  <div className={styles.featureLabel}>год</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className={styles.featureIcon}>🛣️</div>
                  <div className={styles.featureValue}>{formatMileage(car.mileage)}</div>
                  <div className={styles.featureLabel}>км</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className={styles.featureIcon}>⚙️</div>
                  <div className={styles.featureValue}>{car.transmission.split(' ')[0]}</div>
                  <div className={styles.featureLabel}>КПП</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <div className={styles.featureIcon}>⛽</div>
                  <div className={styles.featureValue}>{car.engine}</div>
                  <div className={styles.featureLabel}>{car.fuel}</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <div className={styles.featureIcon}>🌍</div>
                  <div className={styles.featureValue}>{car.origin}</div>
                  <div className={styles.featureLabel}>откуда</div>
                </motion.div>

                <motion.div
                  className={styles.feature}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: currentIndex === index ? 1 : 0, x: currentIndex === index ? 0 : 50 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <div className={styles.featureIcon}>-{car.discount}%</div>
                  <div className={styles.featureLabel}>скидка</div>
                </motion.div>
              </div>

              {/* Нижний индикатор прогресса */}
              <div className={styles.progressIndicator}>
                {promoCars.map((_, idx) => (
                  <div
                    key={idx}
                    className={`${styles.progressDot} ${idx === currentIndex ? styles.progressDotActive : ''}`}
                    onClick={() => {
                      setCurrentIndex(idx);
                      containerRef.current?.scrollTo({
                        top: idx * window.innerHeight,
                        behavior: 'smooth'
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Скидочный бейдж */}
            <div className={styles.discountBadge}>
              -{car.discount}%
            </div>
          </div>
        ))}
      </div>

      {/* Навигационные стрелки */}
      {currentIndex > 0 && (
        <button className={styles.navButton} style={{ top: '50%' }} onClick={scrollToPrev}>
          ↑
        </button>
      )}
      {currentIndex < promoCars.length - 1 && (
        <button className={styles.navButton} style={{ bottom: '100px' }} onClick={scrollToNext}>
          ↓
        </button>
      )}
    </div>
  );
}
