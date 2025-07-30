const ConstructionPage = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
        <rect x="10" y="60" width="100" height="40" rx="8" fill="#e0e0e0" />
        <rect x="20" y="40" width="80" height="40" rx="8" fill="#bdbdbd" />
        <rect x="30" y="20" width="60" height="40" rx="8" fill="#9e9e9e" />
        <circle cx="60" cy="60" r="10" fill="#757575" />
      </svg>
      <h2
        style={{
          marginTop: "2rem",
          fontFamily: "serif",
          fontWeight: 600,
          color: "#444",
          fontSize: "2rem",
        }}
      >
        Página en construcción
      </h2>
      <p
        style={{
          color: "#888",
          fontSize: "1.1rem",
          marginTop: "0.5rem",
          fontFamily: "serif",
        }}
      >
        Estamos trabajando para ofrecerte una experiencia elegante.
      </p>
    </div>
  );
};

export default ConstructionPage;
