import React from "react";
import Slider from "react-slick";

const Homepage = (props) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
  };
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
                Cryptoboyz is the world's first and largest NFT marketplace
              </p>
              <div className="crypto-boyz-homepage__banner__title__submit__wrapper">
                <button className="mr-4 crypto-boyz-homepage__banner__title__submit__button crypto-boyz-homepage__banner__title__submit__button--explore">
                  Explore
                </button>
                <button className="crypto-boyz-homepage__banner__title__submit__button crypto-boyz-homepage__banner__title__submit__button--create">
                  Create
                </button>
              </div>
              <div className="crypto-boyz-homepage__banner__learn-more__wrapper">
                <a className="crypto-boyz-homepage__banner__learn-more__link">
                  Learn more about OpenSea
                </a>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <article className="crypto-boyz-homepage__banner__thumb">
                <a className="crypto-boyz-homepage__banner__thumb__link">
                  <div className="crypto-boyz-homepage__banner__thumb__wrapper">
                    <img src="https://lh3.googleusercontent.com/LwSL45hmFmoSVu5C6HuWGuxt2kxcI_xw6HS9oq4YUhpp81qnJfSibsauZSdsDyCk48eQ01EPlx6jzCld9uWt-DkukLTa-KYw6l0GaAA=s550" />
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
                        An Ugly Dance with the Sky
                      </p>
                      <p className="crypto-boyz-homepage__banner__thumb__footer--link">
                        Kacii_Eleven_and_the_Toy_Wors
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
