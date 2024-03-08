const Filter = ({ search, handleSearchChange }) => {
  return (
    <>
      filter shown with <input value={search} onChange={handleSearchChange} />
    </>
  );
};

export default Filter;
