import { NICKNAMES_DICT } from "../dictionaries/nicknames";

export const generateNicknameOptions = (count: number = 5) => {
  const options: {
    male: string[];
    female: string[];
  } = { male: [], female: [] };

  for (let i = 0; i < count; i++) {
    const adjective =
      NICKNAMES_DICT.adjectives[
        Math.floor(Math.random() * NICKNAMES_DICT.adjectives.length)
      ];
    const maleNoun =
      NICKNAMES_DICT.male[
        Math.floor(Math.random() * NICKNAMES_DICT.male.length)
      ];
    const femaleNoun =
      NICKNAMES_DICT.female[
        Math.floor(Math.random() * NICKNAMES_DICT.female.length)
      ];

    options.female.push(`${adjective} ${femaleNoun}`);
    options.male.push(`${adjective} ${maleNoun}`);
  }

  return options;
};
