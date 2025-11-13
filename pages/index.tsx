import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { getCars, getFileUrl, Car as ApiCar } from '@/lib/api';
import PhotoGallery from '@/components/PhotoGallery';
import styles from '@/styles/TikTok.module.css';
import filterStyles from '@/styles/Filters.module.css';

interface Stats {
  totalCars: number;
  remainingCars: number;
  soldCars: number;
  saleEndDate: Date;
}

export default function Home() {
  const [cars, setCars] = useState<ApiCar[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalCars: 0,
    remainingCars: 0,
    soldCars: 0,
    saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<{
    search?: string;
    maxPrice?: number;
    gearbox?: string;
    fuel?: string;
  }>({});
  const [allCars, setAllCars] = useState<ApiCar[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Загружаем машины из API
  useEffect(() => {
    const loadCars = async () => {
      setIsLoading(true);
      const fetchedCars = await getCars({ limit: 50 });
      const availableCars = fetchedCars.filter(car => !car.isSold);
      
      console.log('Loaded cars:', availableCars.length);
      console.log('First car files:', availableCars[0]?.files);
      
      setAllCars(availableCars);
      setCars(availableCars);
      
      // Обновляем статистику
      setStats({
        totalCars: 67,
        remainingCars: availableCars.length,
        soldCars: 67 - availableCars.length,
        saleEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      });
      
      setIsLoading(false);
    };

    loadCars();
  }, []);

  const applyFilters = () => {
    let filtered = [...allCars];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(car => 
        car.brand.toLowerCase().includes(search) || 
        car.model.toLowerCase().includes(search)
      );
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(car => car.price <= filters.maxPrice!);
    }

    if (filters.gearbox) {
      filtered = filtered.filter(car => car.gearbox.includes(filters.gearbox!));
    }

    if (filters.fuel) {
      filtered = filtered.filter(car => car.fuel === filters.fuel);
    }

    setCars(filtered);
    setCurrentIndex(0);
    setShowFilters(false);
    
    // Scroll to top
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({});
    setCars(allCars);
    setCurrentIndex(0);
    setShowFilters(false);
    containerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };


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
        
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cars.length) {
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

  const calculateDiscount = (price: number) => {
    // Примерная скидка для промо (15-30%)
    const discountPercent = Math.floor(15 + Math.random() * 15);
    return {
      discount: discountPercent,
      oldPrice: Math.round(price / (1 - discountPercent / 100)),
      savings: Math.round(price / (1 - discountPercent / 100)) - price
    };
  };

  if (isLoading) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>
          <div className={styles.loadingSpinner}></div>
          <div className={styles.loadingText}>Загружаем автомобили...</div>
        </div>
      </div>
    );
  }

  if (cars.length === 0) {
    return (
      <div className={styles.app}>
        <div className={styles.loading}>
          <div className={styles.loadingText}>Нет доступных автомобилей</div>
        </div>
      </div>
    );
  }

  const scrollToNext = () => {
    if (currentIndex < cars.length - 1) {
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
      {/* Компактный Header с инлайн-фильтрами */}
      <motion.div 
        className={styles.header}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className={styles.headerTop}>
          <div className={styles.badge}>РАСПРОДАЖА СКЛАДА</div>
          <div className={styles.stockInfo}>
            Найдено <span className={styles.highlight}>{cars.length}</span> авто
          </div>
        </div>
        
        <div className={styles.headerFilters}>
          <input 
            type="text" 
            placeholder="Марка/модель..."
            value={filters.search || ''}
            onChange={(e) => setFilters({...filters, search: e.target.value})}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            className={styles.filterInputCompact}
          />
          
          <select 
            value={filters.gearbox || ''}
            onChange={(e) => setFilters({...filters, gearbox: e.target.value || undefined})}
            className={styles.filterSelectCompact}
          >
            <option value="">КПП</option>
            <option value="Автомат">Автомат</option>
            <option value="Механика">Механика</option>
          </select>

          <select 
            value={filters.fuel || ''}
            onChange={(e) => setFilters({...filters, fuel: e.target.value || undefined})}
            className={styles.filterSelectCompact}
          >
            <option value="">Топливо</option>
            <option value="Бензин">Бензин</option>
            <option value="Дизель">Дизель</option>
            <option value="Гибрид">Гибрид</option>
          </select>

          <button onClick={applyFilters} className={styles.applyButtonCompact}>
            ✓
          </button>
          
          {(filters.search || filters.gearbox || filters.fuel || filters.maxPrice) && (
            <button onClick={clearFilters} className={styles.clearButtonCompact}>
              ✕
            </button>
          )}
        </div>
      </motion.div>

      {/* Вертикальная лента карточек */}
      <div className={styles.scrollContainer} ref={containerRef}>
        {cars.map((car, index) => {
          const priceInfo = calculateDiscount(car.price);
          
          return (
          <div key={car.id} className={styles.slide}>
            {/* Галерея фотографий с свайпом */}
            <PhotoGallery photos={car.files} getFileUrl={getFileUrl} />
            
            {/* Градиентный оверлей */}
            <div className={styles.slideOverlay} />

            {/* Контент карточки */}
            <div className={styles.slideContent}>
              {/* Левая сторона - основная информация */}
              <div className={styles.mainInfo}>
                  <div className={styles.carTags}>
                    {car.promo && <span className={styles.tag}>ПРОМО</span>}
                    <span className={styles.tag}>{car.year} ГОД</span>
                    <span className={styles.tag}>{car.fuel.toUpperCase()}</span>
                  </div>
                  
                  <h2 className={styles.carBrand}>{car.brand}</h2>
                  <h1 className={styles.carModel}>{car.model}</h1>
                  
                  <div className={styles.priceBlock}>
                    <div className={styles.oldPrice}>
                      {formatPrice(priceInfo.oldPrice)} ₽
                    </div>
                    <div className={styles.newPrice}>
                      {formatPrice(car.price)} ₽
                    </div>
                    <div className={styles.saveAmount}>
                      Экономия {formatPrice(priceInfo.savings)} ₽
                    </div>
                  </div>

                  <a href="tel:+79991234567" className={styles.ctaButton}>
                    УЗНАТЬ ЦЕНУ ПОД КЛЮЧ
                  </a>
              </div>

              {/* Правая сторона - иконки характеристик (TikTok style) */}
              <div className={styles.sidePanel}>
                <div className={styles.feature}>
                  <div className={styles.featureIcon}>📅</div>
                  <div className={styles.featureValue}>{car.year}</div>
                  <div className={styles.featureLabel}>год</div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🛣️</div>
                  <div className={styles.featureValue}>{formatMileage(car.mileage)}</div>
                  <div className={styles.featureLabel}>км</div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>⚙️</div>
                  <div className={styles.featureValue}>{car.gearbox}</div>
                  <div className={styles.featureLabel}>КПП</div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>⛽</div>
                  <div className={styles.featureValue}>{car.engine}L</div>
                  <div className={styles.featureLabel}>{car.fuel}</div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>🏎️</div>
                  <div className={styles.featureValue}>{car.powerValue}</div>
                  <div className={styles.featureLabel}>л.с.</div>
                </div>

                <div className={styles.feature}>
                  <div className={styles.featureIcon}>-{priceInfo.discount}%</div>
                  <div className={styles.featureLabel}>скидка</div>
                </div>
              </div>

              {/* Нижний индикатор прогресса */}
              <div className={styles.progressIndicator}>
                {cars.map((_, idx) => (
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
              -{priceInfo.discount}%
            </div>
          </div>
        );
        })}
      </div>

      {/* Навигационные стрелки */}
      {currentIndex > 0 && (
        <button className={styles.navButton} style={{ top: '50%' }} onClick={scrollToPrev}>
          ↑
        </button>
      )}
      {currentIndex < cars.length - 1 && (
        <button className={styles.navButton} style={{ bottom: '100px' }} onClick={scrollToNext}>
          ↓
        </button>
      )}
    </div>
  );
}
