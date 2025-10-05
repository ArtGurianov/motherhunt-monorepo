import { Session, User } from "@shared/db";

export type AppSession = { session: Session; user: User };
