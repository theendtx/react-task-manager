function Search({ value, onChange }) {
    return (
        <input 
        className="search"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={onChange}
        />
    );
}

export default Search;