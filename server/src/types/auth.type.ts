import { auth } from "../lib/auth";


export type AuthEnv = {
  Variables: {
    user: typeof auth.$Infer.Session.user;
    session: typeof auth.$Infer.Session.session;
  };
};

type PublicEnv = {
  Variables: {};
};
