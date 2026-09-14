import { Link } from "react-router-dom";
import vehicles from "../data/vehicles";
import VehicleCard from "../components/VehicleCard";
import "../styles/home.css";

function Home() {
  const featured = vehicles.slice(0, 4);

  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="overlay">
          <div className="container hero-content">
            <h1>Find Your Perfect Drive</h1>

            <p>
              Buy & Sell Premium Second-Hand Vehicles Across India
            </p>

            <div className="hero-buttons">
              <Link to="/vehicles">
                <button>Browse Vehicles</button>
              </Link>

              <Link to="/sell">
                <button className="outline">Sell Vehicle</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="container section">
        <h2>Featured Vehicles</h2>

        <div className="grid">
          {featured.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </section>

      {/* BRANDS */}
      <section className="brands">
        <div className="container">
          <h2>Popular Brands</h2>

          <div className="brand-grid">
            <div>TOYOTA</div>
            <div>HYUNDAI</div>
            <div>HONDA</div>
            <div>TATA</div>
            <div>MAHINDRA</div>
            <div>KIA</div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="container section">
        <h2>Why Choose Velora Drive?</h2>

        <div className="why-grid">

          <div className="why-card">
            <h3>✔ Verified Listings</h3>
            <p>Every vehicle is carefully reviewed before appearing.</p>
          </div>

          <div className="why-card">
            <h3>💰 Best Prices</h3>
            <p>Affordable vehicles from trusted sellers.</p>
          </div>

          <div className="why-card">
            <h3>⚡ Easy Comparison</h3>
            <p>Compare specifications side-by-side instantly.</p>
          </div>

        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials">
        <div className="container">

          <h2>What Our Customers Say</h2>

          <div className="review-grid">

            <div className="review">
              <h4>Priya</h4>
              <p>
                “I found my dream Hyundai Creta within two days!”
              </p>
            </div>

            <div className="review">
              <h4>Rahul</h4>
              <p>
                “The comparison feature made my decision so much easier.”
              </p>
            </div>

            <div className="review">
              <h4>Arjun</h4>
              <p>
                “Selling my bike was quick and completely hassle-free.”
              </p>
            </div>

          </div>

        </div>
      </section>
    </>
  );
}

export default Home;