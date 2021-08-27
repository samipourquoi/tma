import { TfIdf } from "natural";
import * as fs from "fs";

export module SearchSystem {
  export let documents = new TfIdf();

  export const init = () => fs
    .readdirSync("../../store")
    .sort((a, b) => + a - +b)
    // TODO: read readme.json
    .forEach(id => documents.addFileSync(`../../store/${id}/readme.json`, void 0, id));

  export const search = (query: string) => {
    let ratings: { id: number, measure: number }[] = [];

    documents = new TfIdf();
    documents.tfidfs(query, (i, measure) => {
      const id = i + 1;
      ratings.push({ id, measure });
    });

    ratings.sort((a, b) => b.measure - a.measure);
    return ratings.map(rating => rating.id);
  }
}
