import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function hashData(sub: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(sub, salt);
}

export async function compareData(
  sub: string,
  hashedSub: string
): Promise<boolean> {
  return bcrypt.compare(sub, hashedSub);
}
