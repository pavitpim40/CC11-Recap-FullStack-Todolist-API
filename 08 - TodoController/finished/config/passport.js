const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const passport = require("passport");
const { User } = require("../../start/models");
const option = {
  secretOrKey: process.env.JWT_SECRET_KEY || "1QAZ2WSX3EDC",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const extractFunction = async (payload, done) => {
  try {
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) {
      done(new Error("user not found"), false);
    }

    if (payload.iat * 1000 < new Date(user.lastUpdatedPassword).getTime()) {
      done(new Error("token expired"), false);
    }
    // ส่ง user เข้าไปใน req เพื่อให้ middleware ตัวถัดไปทำงาน
    done(null, user); // req.user = user
  } catch (error) {
    done(error, false);
  }
};

passport.use(new JwtStrategy(option, extractFunction));
