export interface SpotifyUserResource {
  country: string;
  display_name: string;
  email: string;
  explicit_content: {
    filter_enabled: boolean;
    filter_locked: boolean;
  };
  external_urls: {
    spotify: string;
  };
  followers: {
    href: null;
    total: number;
  };
  href: string;
  id: string;
  images: [
    {
      height: null;
      url: string;
      width: null;
    }
  ];
  product: string;
  type: string;
  uri: string;
}