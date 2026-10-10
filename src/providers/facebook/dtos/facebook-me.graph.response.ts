interface FacebookMeGraphResponse {
  id: string;
  name: string;
  email?: string;
  picture: {
    data: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
}

export type { FacebookMeGraphResponse };
