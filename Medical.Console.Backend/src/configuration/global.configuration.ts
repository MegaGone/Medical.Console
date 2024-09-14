import { registerAs } from "@nestjs/config";

export default registerAs(
    "global",
    () => ({
        port: process.env.PORT || 3000,
        jwt_expiration: process.env.JWT_EXPIRATION || "4h"
    })
)