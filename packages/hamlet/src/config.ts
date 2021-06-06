import * as YAML from "yaml";
import * as fs from "fs";
import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { pipe, identity } from "fp-ts/function";
import { fold, isLeft } from "fp-ts/Either";

const ConfigCodec = t.type({
  auth: t.type({
    clientID: t.string,
    clientSecret: t.string,
    callbackURL: t.string
  })
});

type Config = t.TypeOf<typeof ConfigCodec>;

export const loadConfig = (): Config => {
  const file = fs.readFileSync("../../config/config.yml", "utf-8");
  const parsed: unknown = YAML.parse(file);
  const decoded = ConfigCodec.decode(parsed);

  if (isLeft(decoded))
    throw new Error(PathReporter.report(decoded).join("\n"))
  else return decoded.right;
}

export const validate = (config: unknown): config is Config =>
  ConfigCodec.is(config);
