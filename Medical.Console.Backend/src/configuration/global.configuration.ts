import { registerAs } from "@nestjs/config";

export default registerAs(
    "global",
    () => ({
        jwt_expiration: process.env.JWT_EXPIRATION || "4h"
    })
)