function Filters({ filter, onSelect }) {
  return (
    <div className="filters">
      {["all", "active", "done"].map((type) => (
        <button
          key={type}
          className={filter === type ? "active" : ""}
          onClick={() => onSelect(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}

export default Filters;
