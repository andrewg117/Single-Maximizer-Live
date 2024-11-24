import { useAppSelector } from "../app/hooks";

interface CheckBoxProps {
  item: string;
  list: Array<string>;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
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
  list: Array<string>;
}

function GenreCheckBox({ changeList, list }: GenreCheckBoxProps) {
  const { genreList } = useAppSelector((state) => state.tracks);

  return (
    <>
      <fieldset>
        {genreList.map((item, i) => {
          return (
            <CheckBox
              key={i}
              item={item}
              list={list}
              onChange={changeList}
            />
          );
        })}
      </fieldset>
    </>
  );
}

export default GenreCheckBox;
