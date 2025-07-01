import { useState, useEffect } from 'react';
import styles from './TV.module.css';

const channels = [
  {
    id: 1,
    name: 'Lofi Girl',
    category: 'Music',
    stream: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    description: 'Расслабляющая музыка для работы и учёбы - 24/7 live stream'
  },
  {
    id: 2,
    name: 'ChilledCow Jazz',
    category: 'Music',
    stream: 'https://www.youtube.com/embed/5yx6BWlEVcY',
    description: 'Джаз и блюз для расслабления - круглосуточная трансляция'
  },
  {
    id: 3,
    name: 'The Good Life Radio',
    category: 'Music',
    stream: 'https://www.youtube.com/embed/36YnV9STBqc',
    description: 'Лучшие хиты и новая музыка - 24/7 радио'
  },
  {
    id: 4,
    name: 'Deep House Radio',
    category: 'Music',
    stream: 'https://www.youtube.com/embed/WsDyRAPFBC8',
    description: 'Deep House & Electronic Music - круглосуточная трансляция'
  },
  {
    id: 5,
    name: 'Nature Relaxation',
    category: 'Relax',
    stream: 'https://www.youtube.com/embed/162rOoqvcKE',
    description: 'Успокаивающие виды природы в 4K качестве'
  },
  {
    id: 6,
    name: 'Aquarium 4K',
    category: 'Relax',
    stream: 'https://www.youtube.com/embed/Kt4u8Yl5Zko',
    description: 'Расслабляющий аквариум с музыкой для медитации'
  },
  {
    id: 7,
    name: 'Space Videos',
    category: 'Science',
    stream: 'https://www.youtube.com/embed/86YLFOog4GM',
    description: 'Прямая трансляция из космоса в HD качестве'
  },
  {
    id: 8,
    name: 'Synthwave Radio',
    category: 'Music',
    stream: 'https://www.youtube.com/embed/4xDzrJKXOOY',
    description: 'Synthwave & Retrowave музыка - круглосуточное радио'
  }
];

const categories = ['All', 'Music', 'Relax', 'Science'];

function TV() {
  const [activeChannel, setActiveChannel] = useState(channels[0]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const filteredChannels = activeCategory === 'All' 
    ? channels 
    : channels.filter(channel => channel.category === activeCategory);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className={styles.tvBg}>
      <div className={`${styles.container} ${isFullscreen ? styles.fullscreen : ''}`}>
        {/* Основной плеер */}
        <div className={styles.playerSection}>
          <div className={styles.playerWrapper}>
            <iframe
              src={activeChannel.stream}
              title={activeChannel.name}
              className={styles.mainPlayer}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
            <button 
              className={styles.fullscreenBtn}
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? '↙' : '↗'}
            </button>
          </div>
          <div className={styles.channelInfo}>
            <div className={styles.channelMeta}>
              <h2 className={styles.channelName}>{activeChannel.name}</h2>
              <p className={styles.channelDescription}>{activeChannel.description}</p>
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className={styles.sidebar}>
          {/* Категории */}
          <div className={styles.categories}>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles.categoryBtn} ${activeCategory === category ? styles.activeCategory : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Список каналов */}
          <div className={styles.channelList}>
            <h3 className={styles.listTitle}>Прямой эфир</h3>
            {filteredChannels.map(channel => (
              <button
                key={channel.id}
                className={`${styles.channelButton} ${activeChannel.id === channel.id ? styles.activeChannel : ''}`}
                onClick={() => setActiveChannel(channel)}
              >
                <div className={styles.channelButtonInfo}>
                  <span className={styles.channelButtonName}>{channel.name}</span>
                  <span className={styles.channelButtonCategory}>{channel.category}</span>
                </div>
                <span className={styles.liveIndicator}>LIVE</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TV; 