import { JwtService } from "@nestjs/jwt";

export var jwtService = new JwtService({
	secret: process.env.JWT_SECRET_KEY, // Replace with your own secret key
	signOptions: { expiresIn: '30d' }, // Set the token expiration time
  });