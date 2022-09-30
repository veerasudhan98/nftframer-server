const { resolve } = require("path");
const { jwt, JwtPayload } = "jsonwebtoken";
const { generateKeyPairSync } = "crypto";
const { readFileSync, writeFileSync, existsSync, mkdirSync } = "fs";

class JWTHelper {
  JWT_SECRET = App.Config.JWT_SECRET;
  JWT_EXPIRY = App.Config.JWT_EXPIRY;
  keyDir = resolve(`${process.cwd()}/src/keys`);
  publicKeyPath = resolve(`${this.keyDir}/rsa.pub`);
  privateKeyPath = resolve(`${this.keyDir}/rsa`);

  async GetUser(payload) {
    const { token } = payload;
    const verification = this.VerifyToken(token);
    if (verification) {
      const keys = verification.sub.toString().split("#");
      const pk = keys.slice(0, 2).join("#");
      const sk = keys.slice(2).join("#");
      const { Item: user } = await App.Models.User.get({ pk, sk });
      delete user?.password;
      delete user?.verification;
      delete user?.unverifiedUpdate;
      return user;
    }
    return null;
  }

  /**
   * Verify the token with rsa public key.
   * @param {string} token
   * @returns string | JwtPayload
   */
  VerifyToken(token) {
    try {
      const publicKey = readFileSync(this.publicKeyPath);
      return jwt.verify(token, publicKey, {
        algorithms: ["RS256"],
      });
    } catch (error) {
      Logger.error(error);
    }
    return null;
  }

  /**
   * Create a signed JWT with the rsa private key.
   * @param {*} payload
   * @returns token
   */
  GenerateToken(payload) {
    const { _id: _user } = payload;

    const privateKey = readFileSync(this.privateKeyPath);

    const jwtPayload = {
      roles: payload.roles,
    };
    return jwt.sign(
      jwtPayload,
      { key: privateKey.toString(), passphrase: this.JWT_SECRET },
      {
        algorithm: "RS256",
        expiresIn: this.JWT_EXPIRY,
        subject: _user,
      }
    );
  }

  /**
   * Generates RSA Key Pairs for JWT authentication
   * It will generate the keys only if the keys are not present.
   */
  GenerateKeys() {
    try {
      const keyDir = this.keyDir;
      const publicKeyPath = this.publicKeyPath;
      const privateKeyPath = this.privateKeyPath;

      const JWT_SECRET = this.JWT_SECRET;

      // Throw error if JWT_SECRET is not set
      if (!JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined.");
      }

      // Check if config/keys exists or not
      if (!existsSync(keyDir)) {
        mkdirSync(keyDir);
      }

      // Check if PUBLIC and PRIVATE KEY exists else generate new
      if (!existsSync(publicKeyPath) && !existsSync(privateKeyPath)) {
        const result = generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "spki",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs8",
            format: "pem",
            cipher: "aes-256-cbc",
            passphrase: JWT_SECRET,
          },
        });

        const { publicKey, privateKey } = result;
        writeFileSync(`${keyDir}/rsa.pub`, publicKey, { flag: "wx" });
        writeFileSync(`${keyDir}/rsa`, privateKey, { flag: "wx" });
        Logger.warn("New public and private key generated.");
      }
    } catch (error) {
      Logger.error(error);
    }
  }
}

// All Done
module.exports = new JWTHelper();
