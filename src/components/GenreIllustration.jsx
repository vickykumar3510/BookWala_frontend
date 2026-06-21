const ILLUSTRATIONS = {
  Fantasy: (
    <>
      <path d="M40 14l4 8h8l-6.5 5 2.5 8.5L40 31l-8 4.5 2.5-8.5L28 22h8l4-8z" fill="currentColor" opacity="0.9" />
      <path d="M22 48h36v18H22z" fill="currentColor" opacity="0.25" />
      <path d="M28 48V38h8v10M44 48V34h8v14" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M18 66h44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  Mystery: (
    <>
      <circle cx="36" cy="36" r="14" stroke="currentColor" strokeWidth="3" fill="none" />
      <path d="M46 46l12 12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M30 36c0-3.3 2.7-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
      <circle cx="52" cy="24" r="2" fill="currentColor" opacity="0.45" />
    </>
  ),
  Thriller: (
    <>
      <path d="M40 12v44" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M28 24l12-8 12 8M28 44l12 8 12-8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 58h44" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
    </>
  ),
  "Non-Fiction": (
    <>
      <path d="M24 22h32v36H24z" fill="currentColor" opacity="0.2" />
      <path d="M30 30h20M30 38h14M30 46h18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M48 48v10M42 54h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M44 48l4-6 4 6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </>
  ),
  History: (
    <>
      <path d="M28 58V34l12-10 12 10v24" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="none" />
      <path d="M34 58V44h12v14" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" fill="currentColor" opacity="0.2" />
      <path d="M22 58h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="40" cy="24" r="3" fill="currentColor" />
    </>
  ),
  Romance: (
    <>
      <path
        d="M40 58c-12-8-18-14-18-22a10 10 0 0 1 18-6 10 10 0 0 1 18 6c0 8-6 14-18 22z"
        fill="currentColor"
        opacity="0.85"
      />
      <path d="M24 20l3 6M56 20l-3 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.45" />
    </>
  ),
  Fiction: (
    <>
      <path d="M26 24c0-4 6-8 14-8s14 4 14 8v32c-4-2-8-3-14-3s-10 1-14 3V24z" fill="currentColor" opacity="0.22" />
      <path d="M26 24c4-2 8-3 14-3s10 1 14 3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M40 21v32M26 32h28M26 42h28M26 52h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.55" />
    </>
  ),
  "Science Fiction": (
    <>
      <path d="M38 18l4-8 4 8 8 2-6 6 2 8-8-4-8 4 2-8-6-6 8-2z" fill="currentColor" opacity="0.35" />
      <path d="M34 52l6-22 6 22-6-6-6 6z" fill="currentColor" opacity="0.85" />
      <ellipse cx="58" cy="28" rx="6" ry="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="22" cy="34" r="2" fill="currentColor" opacity="0.5" />
    </>
  ),
  Biography: (
    <>
      <rect x="26" y="22" width="28" height="34" rx="3" stroke="currentColor" strokeWidth="2.5" fill="currentColor" fillOpacity="0.15" />
      <circle cx="40" cy="34" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path d="M30 48c2.5-4 7.5-6 10-6s7.5 2 10 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </>
  ),
  Children: (
    <>
      <circle cx="34" cy="30" r="8" fill="currentColor" opacity="0.85" />
      <circle cx="48" cy="30" r="8" fill="currentColor" opacity="0.85" />
      <path d="M26 38h28c0 10-6 18-14 18s-14-8-14-18z" fill="currentColor" opacity="0.3" />
      <path d="M22 58h36" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="52" cy="22" r="2" fill="currentColor" opacity="0.45" />
      <circle cx="58" cy="30" r="1.5" fill="currentColor" opacity="0.35" />
    </>
  ),
};

const GenreIllustration = ({ genre }) => (
  <svg
    className="landing__illustration"
    viewBox="0 0 80 80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    {ILLUSTRATIONS[genre] ?? ILLUSTRATIONS.Fiction}
  </svg>
);

export default GenreIllustration;
