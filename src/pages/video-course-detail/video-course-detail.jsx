import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import './video-course-detail.scss';
import Loading from '../../components/loading/loading';

const VideoCourseDetail = () => {
    const { id } = useParams();
    const [activeVideo, setActiveVideo] = useState(0);
    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [playerData, setPlayerData] = useState(null);
    const [playerInstance, setPlayerInstance] = useState(null);
    const playerRef = useRef(null);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await fetch(`https://api.edumark.uz/darslik/darsliks/?thema_id=${Number(id)}`);

                if (!response.ok) {
                    throw new Error('Kurs topilmadi yoki serverda xatolik yuz berdi');
                }

                const data = await response.json();

                if (!data || !Array.isArray(data)) {
                    throw new Error('Kurs maʼlumotlari notoʻgʻri formatda');
                }

                setCourse({
                    title: `Mavzu ${id}`,
                    videos: data.map(item => ({
                        id: item.id,
                        title: item.title || 'Nomsiz video',
                        descriptions: item.descriptions,
                        video_id: item.video_id,
                        duration: item.duration || '0:00'
                    }))
                });
            } catch (err) {
                setError(err.message);
                console.error('Error fetching course:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    useEffect(() => {
        if (course && course.videos && course.videos.length > 0) {
            fetchVideoData(course.videos[activeVideo].video_id);
        }
    }, [course, activeVideo]);

    const [videoDurations, setVideoDurations] = useState({});

    const fetchVideoData = async (videoId) => {
        try {
            const response = await fetch('https://api.edumark.uz/darslik/get-otp/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ video_id: videoId })
            });

            if (!response.ok) {
                throw new Error('Video maʼlumotlarini olishda xatolik');
            }

            const data = await response.json();
            setPlayerData(data);

            // Store the duration for this video
            setVideoDurations(prev => ({
                ...prev,
                [videoId]: data.duration
            }));

            // Initialize or change player
            initializePlayer(data);
        } catch (err) {
            console.error('Error fetching video data:', err);
            setPlayerData(null);
        }
    };

    const [playerLoading, setPlayerLoading] = useState(false);

    const initializePlayer = (data) => {
  // Avvalgi pleerni tozalash
  if (playerInstance) {
    // Pleer obyektida destroy yoki close funksiyasi borligini tekshiramiz
    if (typeof playerInstance.destroy === 'function') {
      playerInstance.destroy();
    } else if (typeof playerInstance.close === 'function') {
      playerInstance.close();
    }
    setPlayerInstance(null);
  }

  // Qolgan kod o'zgarishsiz qoladi
  if (!window.VdoPlayer) {
    const script = document.createElement('script');
    script.src = 'https://player.vdocipher.com/playerAssets/1.6.10/vdo.js';
    script.async = true;
    script.onload = () => createPlayer(data);
    document.body.appendChild(script);
  } else {
    createPlayer(data);
  }
};

const createPlayer = (data) => {
  if (!playerRef.current || !window.VdoPlayer) return;

  try {
    const player = new window.VdoPlayer({
      otp: data.otp,
      playbackInfo: data.playbackInfo,
      theme: "9ae8bbe8dd964ddc9bdb932cca1cb59a",
      container: playerRef.current,
    });

    // Pleer yaratilganda uni saqlaymiz
    setPlayerInstance(player);

    // Event listener qo'shamiz
    if (window.VdoPlayerEvents) {
      player.addEventListener(window.VdoPlayerEvents.LOAD, function() {
        console.log("Player loaded");
      });
    }
  } catch (err) {
    console.error('Error creating player:', err);
  }
};

useEffect(() => {
  // Komponent unmount bo'lganda tozalash
  return () => {
    if (playerInstance) {
      // Pleer obyektida destroy yoki close funksiyasi borligini tekshiramiz
      if (typeof playerInstance.destroy === 'function') {
        playerInstance.destroy();
      } else if (typeof playerInstance.close === 'function') {
        playerInstance.close();
      }
    }
  };
}, [playerInstance]);

    const handleVideoChange = (index) => {
        setActiveVideo(index);
    };

    function formatDuration(seconds) {
        if (!seconds) return '--:--';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="course-not-found">
                <div className="err-cont">
                    <span>{error}</span>
                    <Link to="/video-courses">Ortga qaytish</Link>
                </div>
            </div>
        );
    }

    if (!course || !course.videos || course.videos.length === 0) {
        return (
            <div className="course-not-found">
                <div className="err-cont">
                    <span>Kurs maʼlumotlari topilmadi</span>
                    <Link to="/video-courses">Ortga qaytish</Link>
                </div>
            </div>
        );
    }

    const currentVideo = course.videos[activeVideo];

    return (
        <div className="video-course">
            <div className="back-btn">
                <Link to="/video-courses">
                    <div className="back-icon">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="ionicon" viewBox="0 0 512 512">
                                <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292" />
                            </svg>
                        </span>
                        <p>Ortga</p>
                    </div>
                </Link>
            </div>

            <h1 className="video-course__header">{course.title}</h1>

            <div className="video-course__container">
                <div className="video-course__list-section">
                    <div className="video-list">
                        <div className="video-list__header">
                            Kurs videolari ({course.videos.length} ta)
                        </div>

                        <div className="video-list__items">
                            {course.videos.map((video, index) => (
                                <div
                                    key={video.id}
                                    onClick={() => handleVideoChange(index)}
                                    className={`video-item ${activeVideo === index ? 'active' : ''}`}
                                >
                                    <span className="video-item__number">{index + 1}</span>
                                    <div className="video-item__content">
                                        <div className="video-item__content-title">{video.title}</div>
                                        <div className="video-item__content-duration">
                                            {formatDuration(videoDurations[video.video_id] || video.duration)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="video-course__player-section">
                    <div className="video-wrapper">
                        <div id="vdo-player" ref={playerRef} style={{ width: '100%', height: '100%' }}>
                            {(playerLoading || !playerData) && (
                                <div className="video-loading">Video yuklanmoqda...</div>
                            )}
                        </div>
                    </div>

                    <div className="video-info">
                        <h2 className="video-info__title">{currentVideo.title}</h2>
                        <p className="video-info__description">
                            {currentVideo.descriptions || 'Tavsif mavjud emas'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoCourseDetail;