import React from "react";
import Carousel from "react-material-ui-carousel";
import { Paper } from "@mui/material";

const Main = () => {
  const carouselItems = [
    {
      id: 1,
      image: "./assets/main.png.jpg",
      title: "New Season Arrivals",
      description: "Discover the latest trends in fashion and accessories",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Men's Collection",
      description: "Stylish clothing for the modern gentleman",
      buttonText: "Explore Men's"
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Women's Fashion",
      description: "Elegant designs for every occasion",
      buttonText: "Explore Women's"
    },
    {
      id: 4,
      image: "https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1200",
      title: "Jewelry Collection",
      description: "Timeless pieces that tell your story",
      buttonText: "View Jewelry"
    }
  ];

  return (
    <>
      <div className="hero border-1 pb-3">
        <Carousel
          autoPlay={true}
          interval={4000}
          animation="slide"
          indicators={true}
          navButtonsAlwaysVisible={true}
          cycleNavigation={true}
          fullHeightHover={true}
          sx={{
            height: "500px",
            "& .MuiPaper-root": {
              borderRadius: "0",
            },
            "& .MuiButton-root": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              color: "#333",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 1)",
              },
            },
          }}
        >
          {carouselItems.map((item) => (
            <Paper key={item.id} elevation={0}>
              <div className="card bg-dark text-white border-0 mx-3" style={{ height: "500px" }}>
                <img
                  className="card-img img-fluid"
                  src={item.image}
                  alt={item.title}
                  style={{ 
                    height: "500px", 
                    objectFit: "cover",
                    width: "100%" 
                  }}
                />
                <div className="card-img-overlay d-flex align-items-center">
                  <div className="container">
                    <h5 className="card-title fs-1 text fw-lighter">{item.title}</h5>
                    <p className="card-text fs-5 d-none d-sm-block mb-4">
                      {item.description}
                    </p>
                    <button className="btn btn-outline-light btn-lg">
                      {item.buttonText}
                    </button>
                  </div>
                </div>
              </div>
            </Paper>
          ))}
        </Carousel>
      </div>
    </>
  );
};

export default Main;
