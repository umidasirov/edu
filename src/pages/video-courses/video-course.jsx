import React, { useEffect, useState } from 'react';
import "./video-course.scss";
import { Link } from 'react-router-dom';
import Loading from '../../components/loading/loading';

// const courses = [
//     {
//         id: 1,
//         title: "HTML Asoslari",
//         img: "https://www.w3docs.com/uploads/media/book_gallery/0001/02/ea50fd5ac033ccb1ab19a9aa4f1135464bbc1399.png",
//         count: 3,
//         price: 20000,
//     }
// ]

const VideoCourse = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);

    const formatName = (text) => {
        return text.toLowerCase().replace(/'/g, "").replace(/\s+/g, "-")
    }

    useEffect(() => {
        const fetchVideos = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://api.edumark.uz/darslik/courses/`);

                if (!response.ok) {
                    throw new Error("Failed to fetch");
                }

                const coursesData = await response.json();

                setCourses(coursesData);
            } catch (error) {
                console.log(error.message || "Videolarni yuklashda xatolik!");
            } finally {
                setLoading(false);
            }
        }
        fetchVideos();
    }, []);

    if (loading) {
        return <Loading />
    }

    return (
        <div className="video-page">
            <h1>Video kurslar</h1>
            <div className="video-content">
                {
                    courses.map((course, index) => (
                        <div className="video-card">
                            <Link to={`${formatName(course.title)}/${course.id}`}>
                                <div className="course-img">
                                    <img src={course.img} alt="" />
                                </div>
                                <div className="course-title">
                                    <p>{course.title}</p>
                                </div>
                                <div className={`videos-count`}>
                                    <span>
                                        {`${course.price} so'm` || "Bepul"}
                                    </span>
                                    {
                                        course.count > 0 && <div className="circle"></div>
                                    }
                                    {
                                        course.count > 0 ? `${course.count} ta dars` : ""
                                    }
                                </div>
                            </Link>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default VideoCourse