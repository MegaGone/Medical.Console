import { registerAs } from "@nestjs/config";

export default registerAs("global", () => ({
  seed: process.env.SEED || false,
  port: process.env.PORT || 3000,
  secret: process.env.SECRET_KEY || "",
  password_base: process.env.PASSWORD_BASE || "",
  jwt_expiration: process.env.JWT_EXPIRATION || "4h",
}));
