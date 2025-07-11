import React from "react";
import Hero from "../components/Hero";
import FeaturedDestination from "../components/FeaturedDestination";
import ExclusiveOffers from '../components/ExclusiveOffers'
import Testimonial from "../components/Testimonial";
import NewsLatter from "../components/NewsLetter";

const Home = () => {
   return(
    <>
            <Hero/>
            <FeaturedDestination />
            <ExclusiveOffers/>
            <Testimonial/>
            <NewsLatter/>
    </>
   )
}
export default Home