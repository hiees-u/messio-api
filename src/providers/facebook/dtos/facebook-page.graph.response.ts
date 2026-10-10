interface Category {
  id: string;
  name: string;
}

interface FacebookPageGraphResponse {
  access_token: string;
  category: string;
  category_list: Category[];
  name: string;
  id: string;
  tasks: string[];
  registered?: boolean;
}

interface FacebookPaging {
  cursors: {
    before: string;
    affter: string;
  };
}

interface FacebookPagesGraphResponse {
  data: FacebookPageGraphResponse[];
  paging: FacebookPaging;
}

export type {
  FacebookPagesGraphResponse,
  FacebookPageGraphResponse,
  // SetPagesGraphInput
};
