import * as YAML from "yaml";
import * as fs from "fs";

export interface Config {
  auth: {
    clientID: string,
    clientSecret: string,
    callbackURL: string
  }
}

export function loadConfig(): Config {
  const file = fs.readFileSync("../../config/config.yml", "utf-8");
  return YAML.parse(file);
}
