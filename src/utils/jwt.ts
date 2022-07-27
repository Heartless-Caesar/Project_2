import config from "config";
import Jwt from "jsonwebtoken";

//Public key
const publicKey = Buffer.from(
  config.get<string>("publicKey"),
  "base64"
).toString("ascii");
//Private key
const privateKey = Buffer.from(
  config.get<string>("privateKey"),
  "base64"
).toString("ascii");

export function signJwt(object: Object, options?: Jwt.SignOptions | undefined) {
  return Jwt.sign(object, privateKey, {
    ...(options && options),
    algorithm: "RS256",
  });
}

export function verifyJwt<T>(token: string): T | null {
  try {
    const decoded = Jwt.verify(token, publicKey) as T;
    console.log(decoded);

    return decoded;
  } catch (error) {
    console.log(error);

    return null;
  }
}
