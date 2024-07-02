interface CheckBoxProps {
  item: string;
  list: any[];
  onChange: any;
}

const CheckBox = (props: CheckBoxProps) => {
  return (
    <div>
      <label htmlFor={props.item}>{props.item}</label>
      <input
        name={props.item}
        type="checkbox"
        value={props.item}
        checked={props.list.includes(props.item)}
        onChange={props.onChange}
      />
    </div>
  );
};

interface GenreCheckBoxProps {
  changeList: any;
  list: any[];
}

function GenreCheckBox({ changeList, list }: GenreCheckBoxProps) {
  const genreList = ["CHH", "Hip Hop", "Gospel", "R&B", "Pop", "Rock", "CCM"];

  const onChange = (e: any) => {
    // Add to list if checked
    if (e.target.checked && !list.includes(e.target.value)) {
      changeList((prevState: any) => ({
        ...prevState,
        genres: [...list, e.target.value],
      }));
    }

    // Remove from list if unchecked
    if (!e.target.checked) {
      changeList((prevState: any) => ({
        ...prevState,
        genres: list.filter((item) => item !== e.target.value),
      }));
    }
  };

  return (
    <>
      <fieldset>
        {genreList.map((item, i) => {
          return (
            <CheckBox
              key={i}
              item={item}
              list={list}
              onChange={onChange}
            />
          );
        })}
      </fieldset>
    </>
  );
}

export default GenreCheckBox;
