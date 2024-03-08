const Persons = ({ personsToShow, removePersonById }) => {
  return (
    <ul>
      {personsToShow.map(({ name, number, id }) => (
        <li key={name}>
          {name} {number}
          <button onClick={() => removePersonById(id)}>delete</button>
        </li>
      ))}
    </ul>
  );
};

export default Persons;
