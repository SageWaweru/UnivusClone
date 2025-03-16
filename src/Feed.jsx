import React,{useEffect, useState, useRef} from 'react';
// import videos from './data/videos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCommentDots, faShare, faUser,faBullhorn,faMusic, faMugHot, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faBell, faPaperPlane,faHeart,faBookmark } from "@fortawesome/free-regular-svg-icons";

const API_KEY = import.meta.env.VITE_API_KEY;
const URL = "https://api.pexels.com/videos/popular?per_page=5"


function Feed() {
  const [videos, setVideos] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const videoRefs =useRef([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  let startY = 0;
  
  const banners=[
    { color: "rgb(62, 60, 60)" },
    { icon: faMusic, color: "rgb(37, 186, 209)" },
    { icon: faBullhorn, color: "rgb(5, 149, 58)" },
    { icon: faMugHot, color: "rgb(223, 69, 41)" },
  ]

  const navItems = [
    { icon: faHouse, isCurrent: true },
    { icon: faPaperPlane},
    { label: "Create", isLarge: true, add: "+" },
    { icon: faBell },
    { icon: faUser, isProfile: true }
  ];
  
  const getRandomNumber = (min = 20, max = 5000) => 
    Math.floor(Math.random() * (max - min + 1)) + min;

  useEffect(()=>{
   const fetchVideos = async() => {
    try {
      const response = await fetch(URL,{
        headers: {Authorization: API_KEY},
      });

      if (!response.ok) throw new Error ("Failed to fetch videos");

      const data = await response.json();
      const getStoredEngagements = () => {
        return JSON.parse(localStorage.getItem("videoEngagements")) || {};
      };

      let engagements = getStoredEngagements();

      const videoStats = data.videos.map((video) => {
        if (!engagements[video.id]) {
          engagements[video.id] = {
            likes: getRandomNumber(),
            comments: getRandomNumber(),
            shares: getRandomNumber(),
            saves: getRandomNumber(),
          };
        }
        return {
          ...video,
          ...engagements[video.id], 
        };
      });

      localStorage.setItem("videoEngagements", JSON.stringify(engagements));

      setVideos(videoStats);    }catch (error) {
      console.error("Error fetching videos:", error);
    }
   };

   fetchVideos();
  },[]);

  
  const updateEngagement = (videoId, type) => {
    let engagements = JSON.parse(localStorage.getItem("videoEngagements")) || {};
    let userActions = JSON.parse(localStorage.getItem("userActions")) || {}; // Track user actions
  
    if (!engagements[videoId]) {
      engagements[videoId] = {
        likes: Math.floor(Math.random() * 100),
        comments: Math.floor(Math.random() * 50),
        shares: Math.floor(Math.random() * 30),
        saves: Math.floor(Math.random() * 20),
      };
    }
  
    if (!userActions[videoId]) {
      userActions[videoId] = { likes: 0, comments: 0, shares: 0, saves: 0 };
    }
  
    if (userActions[videoId][type] === 1) {
      engagements[videoId][type] -= 1;
      userActions[videoId][type] = -1; 
    } else {
      engagements[videoId][type] += 1;
      userActions[videoId][type] = 1; 
    }
  
    localStorage.setItem("videoEngagements", JSON.stringify(engagements));
    localStorage.setItem("userActions", JSON.stringify(userActions));
  
    setVideos((prevVideos) =>
      prevVideos.map((video) =>
        video.id === videoId ? { ...video, [type]: engagements[videoId][type] } : video
      )
    );
  };

  useEffect(()=>{
    const observer = new IntersectionObserver(
      (entries) =>{
        entries.forEach((entry)=>{
          const video =entry.target;
          if(entry.isIntersecting){
            video.play();
            setCurrentIndex(Number(video.dataset.index));
          } else {
            video.pause();
          }
        })
      },
      { threshold: 0.7}
    )
     
    videoRefs.current.forEach((video)=> {
      if (video) observer.observe(video)
    });
     
    return () => observer.disconnect();
  },[]);

  const videoScroll = (index) => {
    if (index >= 0 && index < videos.length){
      videoRefs.current[index]?.scrollIntoView({behavior: "smooth"});
      setCurrentIndex(index);
    }
  };

// Update the function call in event handlers
const handleScroll = (e) => {
  if (e.deltaY > 0) {
    videoScroll(currentIndex + 1);
  } else if (e.deltaY < 0) {
    videoScroll(currentIndex - 1);
  }
};

const handleTouchStart = (e) => {
  startY = e.touches[0].clientY;
};

const handleTouchEnd = (e) => {
  let endY = e.changedTouches[0].clientY;
  let diff = startY - endY;

  if (diff > 50) {
    videoScroll(currentIndex + 1);
  } else if (diff < -50) {
    videoScroll(currentIndex - 1);
  }
};

// Attach event listeners properly
useEffect(() => {
  const handleScrollEvent = (e) => handleScroll(e);
  const handleTouchStartEvent = (e) => handleTouchStart(e);
  const handleTouchEndEvent = (e) => handleTouchEnd(e);

  document.addEventListener("wheel", handleScrollEvent);
  document.addEventListener("touchstart", handleTouchStartEvent);
  document.addEventListener("touchend", handleTouchEndEvent);

  return () => {
    document.removeEventListener("wheel", handleScrollEvent);
    document.removeEventListener("touchstart", handleTouchStartEvent);
    document.removeEventListener("touchend", handleTouchEndEvent);
  };
}, [currentIndex]);

      return (
    <div className="bg-light">
      {videos.map((video, index) => (
        <div 
          key={index} 
          className="video-container position-relative d-flex justify-content-center align-items-center mx-auto"
          style={{ 
            width: "100vw", 
            height: "100vh", 
            maxWidth: "400px", 
            overflowX: "hidden"
          }}
        >
            <div className="position-absolute top-0 d-flex w-100 py-3 d-flex flex-column">
              <div className='d-flex'>
                <div className="fw-bold border-bottom border-3 border-black text-black w-50 p-2 m-1">
                  For You
                </div>
                <div className="text-black w-50 p-2 m-1">
                  Live
                </div>
              </div>
              
              <div className='d-flex' style={{justifyContent:"space-evenly", marginTop:"6px"}}>
                {banners.map((item, index)=>(
                  <div key={index} style={{
                    backgroundColor:"white",
                    padding:"6px",
                    borderRadius: "50px",                    }}>
                     <div>
                     <span 
                      style={{
                        backgroundColor:item.color,
                        padding:"6px",
                        width:"40px",
                        height:"40px",
                        borderRadius:"50%"
                      }}
                     >
                {item.icon?(
                  <FontAwesomeIcon icon={item.icon} size="md" style={{color:"white"}} />
                ) : (
                  <span style={{ fontSize: "18px", fontWeight: "700", color:"white" }}>W</span>
                )}
                     </span>
                     <FontAwesomeIcon icon={faUserGroup} size="sm" style={{marginLeft:"3px"}} />
                      <span style={{fontSize:"14px"}} >10K+ </span>  
                     </div>
                  </div>
                  
                ))}

              </div>
            
            </div>
        
          <video
            ref={(el) => {
              if (el) videoRefs.current[index] = el;
            }}
            data-index={index}
            src={video.video_files[1]?.link}
            className="object-fit-cover w-100 h-100"
            controls
            autoPlay
            loop
            muted
          />

 <div className="position-absolute top-50 end-0 translate-middle-y d-flex flex-column text-white p-3">
            {[
              { type:"likes", icon: faHeart, count: video.likes },
              { type:"comments", icon: faCommentDots, count: video.comments },
              { type:"saves", icon: faBookmark, count: video.saves },
              { type:"shares", icon: faShare, count: video.shares },
            ].map((item, index) => (
              <div
                key={index}
                className="d-flex flex-column justify-content-center align-items-center mx-auto mb-2"
              >
                <button
                  className="btn text-white rounded-circle text-center d-flex justify-content-center align-items-center"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "rgba(240, 240, 240, 0.17)",
                    backdropFilter: "blur(10px)",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "rgba(240, 240, 240, 0.51)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "rgba(240, 240, 240, 0.17)")
                  }
                  onClick={() =>  item.type === "comments" ? setShowModal(true) :updateEngagement(video.id, item.type)}
                >
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                </button>
                <span className="text-white fw-bold">{item.count}</span>
              </div>
            ))}          </div>
            {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Comments</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Creator turned of comments.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
          <div className="position-fixed bottom-0 start-50 translate-middle-x w-100 d-flex justify-content-around align-items-center py-3"
            style={{
              backgroundColor: "white",
              height: "70px",
              borderTop: "1px solid rgba(0, 0, 0, 0.1)",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              backdropFilter: "blur(10px)",
              width: "100vw",
              maxWidth: "400px",
            }}
          >
            {navItems.map((item, index) => (
              <div key={index} className="d-flex flex-column justify-content-center align-items-center position-relative">
                <button
                  className="btn d-flex justify-content-center align-items-center nav-btn"
                  style={{
                    width: item.isLarge ? "60px" : "40px",
                    height: item.isLarge ? "60px" : "40px",
                    transform: item.isLarge ? "translateY(-10px)" : "none",
                    backgroundColor: item.isLarge ? "rgb(62, 60, 60)" : "transparent",
                    color: item.isLarge ? "white" : "black",
                    border: item.isLarge ? "2px solid white" : "none",
                    borderRadius: item.isLarge ? "50%" : "0",
                    backdropFilter: "blur(5px)",
                    transition: "background-color 0.3s ease",
                    position: "relative",
                    fontSize: item.isLarge ? "30px" : "20px", 
                    fontWeight: item.isLarge ? "600" : "normal", 
                  }}
                >
                 {item.icon ? (
                    <FontAwesomeIcon icon={item.icon} size={item.isLarge ? "2x" : "lg"} style={{ color: "rgb(100, 99, 99)" }} />
                  ) : (
                    <span style={{ fontSize: "30px", fontWeight: "700" }}>W</span>
                  )}                </button>

                {item.isLarge && (
                  <div className="d-flex justify-content-center align-items-center"
                    style={{
                      position: "absolute",
                      bottom: "30px",
                      right: "2px",
                      borderRadius: "50%",
                      width: "20px",
                      height: "20px",
                      fontSize: "12px",
                      backgroundColor: "rgb(37, 186, 209)",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}>
                    <span style={{ 
                      color: "white",
                      fontSize:"23px", 
                      padding:"10px",
                      fontWeight:"600", 
                      textAlign:"center" 
                      }}>
                      {item.add}
                    </span>
                  </div>
                )}

                {item.isCurrent && (
                  <span
                    style={{
                      position: "absolute",
                      bottom: "-4px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "20px",
                      height: "4px",
                      backgroundColor: "rgb(62, 60, 60)",
                      borderRadius: "4px",
                    }}
                  />
                )}

                {item.label && (
                  <span className="small" style={{ color: "rgb(62, 60, 60)", transform: "translateY(-50%)" }}>
                    {item.label}
                  </span>
                )}
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}

export default Feed;
