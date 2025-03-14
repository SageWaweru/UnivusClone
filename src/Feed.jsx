import React from 'react';
import videos from './data/videos';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faCommentDots, faShare, faUser } from "@fortawesome/free-solid-svg-icons";
import { faBell, faPaperPlane,faHeart,faBookmark } from "@fortawesome/free-regular-svg-icons";

function Feed() {
  const navItems = [
    { icon: faHouse, isCurrent: true },
    { icon: faPaperPlane},
    { label: "Create", isLarge: true, add: "+" },
    { icon: faBell },
    { icon: faUser, isProfile: true }
  ];

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
          <div className="position-absolute top-0 d-flex w-100 py-3">
            <div className="fw-bold border-bottom border-3 border-black text-black w-50 p-2 m-1">
              For You
            </div>
            <div className="text-black w-50 p-2 m-1">
              Live
            </div>
          </div>

          <video
            src={video.url}
            className="object-fit-cover w-100 h-100"
            controls
            autoPlay
            loop
            muted
          />

 <div className="position-absolute top-50 end-0 translate-middle-y d-flex flex-column text-white p-3">
            {[
              { icon: faHeart, count: video.likes },
              { icon: faCommentDots, count: video.comments },
              { icon: faBookmark, count: video.saves },
              { icon: faShare, count: video.shares },
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
                >
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                </button>
                <span className="text-white fw-bold">{item.count}</span>
              </div>
            ))}          </div>

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
