export interface SocialLink {
  name: string;
  url: string;
}

export interface SiteInfo {
  id: number;
  name: string;
  description: string;
  logo: string;
  icp: string;
  socialLinks: SocialLink[];
}
