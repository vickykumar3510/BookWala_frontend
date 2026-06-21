import HeaderNoSearchBar from "../components/HeaderNoSearchBar";
import Footer from "../components/Footer";
import GenreIllustration from "../components/GenreIllustration";
import { Link } from "react-router-dom";

const CATEGORIES = [
  { label: "Fantasy", value: "Fantasy", tone: "violet" },
  { label: "Mystery", value: "Mystery", tone: "slate" },
  { label: "Thriller", value: "Thriller", tone: "crimson" },
  { label: "Non-Fiction", value: "Non-Fiction", tone: "teal" },
  { label: "History", value: "History", tone: "amber" },
  { label: "Romance", value: "Romance", tone: "rose" },
  { label: "Fiction", value: "Fiction", tone: "indigo" },
  { label: "Science Fiction", value: "Science Fiction", tone: "sky" },
  { label: "Biography", value: "Biography", tone: "stone" },
  { label: "Children", value: "Children", tone: "lime" },
];

const Landing = () => {
  return (
    <>
      <HeaderNoSearchBar />
      <main className="landing">
        <div className="landing__inner">
          <h1 className="landing__title">Browse by category</h1>
          <p className="landing__subtitle">Choose a genre to explore our collection</p>
          <div className="landing__grid">
            {CATEGORIES.map(({ label, value, tone }) => (
              <Link
                key={value}
                className={`landing__card landing__card--${tone}`}
                to={`/dashboard?genre=${encodeURIComponent(value)}`}
              >
                <span className="landing__art" aria-hidden="true">
                  <GenreIllustration genre={value} />
                </span>
                <span className="landing__label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Landing;
