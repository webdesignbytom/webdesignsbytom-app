import React from 'react';
// Components
import Footer from '../../components/footer/Footer';
import HeroSection from '../../components/hero/HeroSection';
import Navbar from '../../components/nav/Navbar';
import PriceTable from '../../components/pricing/PriceTable';
import ReviewsContainer from '../../components/reviews/ReviewsContainer';

function SalesHome() {
  return (
    <div className='w-full'>
      <Navbar />
      <HeroSection />
      <ReviewsContainer />
      <PriceTable />
      <Footer />
    </div>
  );
}

export default SalesHome;
