import { useState } from "react";

export const useSingleGenres = (initGenres: Array<string> = []) => {
  const [genres, setGenres] = useState<Array<string>>(initGenres);

  const changeGenreList = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Add to list if checked
    if (e.target.checked && !genres.includes(e.target.value)) {
      setGenres([...genres, e.target.value]);
    }
    // Remove from list if unchecked
    if (!e.target.checked) {
      setGenres(genres.filter((item) => item !== e.target.value));
    }
  };

  return { genres, setGenres, changeGenreList };
};
