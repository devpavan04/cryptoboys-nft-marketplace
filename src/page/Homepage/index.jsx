import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Slider from "react-slick";

const Homepage = (props) => {
  const history = useHistory();
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };
  const [asset, setAsset] = useState({});

  const getTopFavoriteAsset = async () => {
    const result = await axios.get(
      `${process.env.REACT_APP_API_URL}/assets/favorite`
    );
    setAsset(result.data);
  };
  console.log(asset);
  useEffect(() => {
    getTopFavoriteAsset();
  }, []);

  return (
    <div>
      <div>
        <div className="position-absolute crypto-boyz-homepage__banner__wrapper w-100">
          <div className="crypto-boyz-homepage__banner w-100 h-100"></div>
        </div>
        <div className="container w-100 h-100">
          <div className="row p-5">
            <div className="col-12 col-lg-6 crypto-boyz-homepage__banner__title__wrapper">
              <p className="h1 font-weight-bold">
                Discover, collect, and sell extraordinary NFTs
              </p>
              <p className="crypto-boyz-homepage__banner__title">
                HUFT Marketplace is one of the world largest NFT marketplace
              </p>
              <div className="crypto-boyz-homepage__banner__title__submit__wrapper">
                <button
                  onClick={() => history.push("/explore")}
                  className="mr-4 crypto-boyz-homepage__banner__title__submit__button crypto-boyz-homepage__banner__title__submit__button--explore"
                >
                  Explore
                </button>
                <button
                  onClick={() => history.push("/mint")}
                  className="crypto-boyz-homepage__banner__title__submit__button crypto-boyz-homepage__banner__title__submit__button--create"
                >
                  Create
                </button>
              </div>
            </div>
            <div
              className="col-12 col-lg-6"
              onClick={(e) => {
                history.push("/assets/" + asset._id);
              }}
            >
              <article className="crypto-boyz-homepage__banner__thumb">
                <a className="crypto-boyz-homepage__banner__thumb__link">
                  <div className="crypto-boyz-homepage__banner__thumb__wrapper">
                    <img
                      src={asset.uriID}
                      onError={(e) =>
                        (e.target.src = "/Anh-avatar-bua-cute-dep-390x390.jpg")
                      }
                    />
                  </div>
                  <footer className="crypto-boyz-homepage__banner__thumb__footer row ml-0 mr-0">
                    <div className="col-2">
                      <img
                        className="rounded-circle"
                        src="https://lh3.googleusercontent.com/nHLZ4vfcqC0kcul6U89BQEjOy2hnjUx66j-A04bTK1qXmuLRE6kIYrUPvYFrYZ3Fwi9g0oNSiH8YGbkUSVNhRZibTlnEodIupdFRzUk=s80"
                      />
                    </div>
                    <div>
                      <p className="crypto-boyz-homepage__banner__thumb__footer--title">
                        {(asset.name && asset.name) || ""}
                      </p>
                      <p className="crypto-boyz-homepage__banner__thumb__footer--link">
                        {(asset.description && asset.description) || ""}
                      </p>
                    </div>
                    <div className="col-2"></div>
                  </footer>
                </a>
              </article>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-5">
        <div className="text-center">
          <span className="h3">Notable drops</span>
        </div>
        <div className="mt-4">
          <Slider className="container" {...settings}>
            <div className="crypto-boyz-homepage__notable__wrapper">
              <a>
                <div className="crypto-boyz-homepage__notable__wrapper__container">
                  <div className="crypto-boyz-homepage__notable__wrapper__container__header">
                    <div className="crypto-boyz-homepage__notable__wrapper__container__header__content">
                      <div className="crypto-boyz-homepage__notable__wrapper__container__header__content--title">
                        <p>Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="crypto-boyz-homepage__notable__wrapper">
              <a>
                <div className="crypto-boyz-homepage__notable__wrapper__container">
                  <div className="crypto-boyz-homepage__notable__wrapper__container__header">
                    <div className="crypto-boyz-homepage__notable__wrapper__container__header__content">
                      <div className="crypto-boyz-homepage__notable__wrapper__container__header__content--title">
                        <p>Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="crypto-boyz-homepage__notable__wrapper">
              <a>
                <div className="crypto-boyz-homepage__notable__wrapper__container">
                  <div className="crypto-boyz-homepage__notable__wrapper__container__header">
                    <div className="crypto-boyz-homepage__notable__wrapper__container__header__content">
                      <div className="crypto-boyz-homepage__notable__wrapper__container__header__content--title">
                        <p>Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="crypto-boyz-homepage__notable__wrapper">
              <a>
                <div className="crypto-boyz-homepage__notable__wrapper__container">
                  <div className="crypto-boyz-homepage__notable__wrapper__container__header">
                    <div className="crypto-boyz-homepage__notable__wrapper__container__header__content">
                      <div className="crypto-boyz-homepage__notable__wrapper__container__header__content--title">
                        <p>Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
            <div className="crypto-boyz-homepage__notable__wrapper">
              <a>
                <div className="crypto-boyz-homepage__notable__wrapper__container">
                  <div className="crypto-boyz-homepage__notable__wrapper__container__header">
                    <div className="crypto-boyz-homepage__notable__wrapper__container__header__content">
                      <div className="crypto-boyz-homepage__notable__wrapper__container__header__content--title">
                        <p>Live</p>
                      </div>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
