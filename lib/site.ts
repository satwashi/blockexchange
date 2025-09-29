export function getWebsiteName(): string {
  const env = process.env.WEBSITE_NAME?.trim();
  return env && env.length > 0 ? env : "blockechange.com";
}

export function getWebsiteHost(): string {
  // Strip protocol if provided and ensure bare host
  const name = getWebsiteName();
  return name.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getWebsiteUrl(): string {
  const host = getWebsiteHost();
  const hasProtocol = /^https?:\/\//i.test(process.env.WEBSITE_NAME || "");
  return hasProtocol ? (process.env.WEBSITE_NAME as string) : `https://${host}`;
}

export function email(address: string): string {
  const host = getWebsiteHost();
  return `${address}@${host}`;
}
