import { createCookieSessionStorage, redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";

import { db } from "./db.server";

type LoginForm = {
  username: string;
  password: string;
};

export async function register({ username, password }: LoginForm) {
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await db.user.create({
    data: { username, passwordHash },
  });

  // TODO: check if profile configuration created correctly if not delete the user and send an error

  await db.profileConfiguration.create({
    data: {
      userId: user.id,
    },
  });

  return { id: user.id, username };
}

export async function login({ username, password }: LoginForm) {
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) return null;

  const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isCorrectPassword) return null;

  return {
    id: user.id,
    username,
  };
}

export async function logout(request: Request) {
  const session = await getUserSession(request);

  const cookie = await storage.destroySession(session);

  return redirect("/login", {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) throw new Error("SESSION_SECRET must be set");

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");

  if (!userId || typeof userId !== "string") return null;

  return userId;
}

export async function requireUserId(request: Request) {
  const userId = await getUserId(request);

  if (!userId || typeof userId !== "string") {
    throw redirect(`/login`);
  }

  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);

  if (typeof userId !== "string") return null;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true },
    });

    return user;
  } catch {
    throw logout(request);
  }
}

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await storage.getSession();
  session.set("userId", userId);

  const cookie = await storage.commitSession(session);

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": cookie,
    },
  });
}
