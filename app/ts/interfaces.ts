export interface CategoryProp {
    _id: string;
    _ref: string;
    title: string;
    slug?: {
        current: string;
    }
    color: {
        hex: string;
    };
}

export interface About {
    _id: string;
    about: {
      _key: string;
      _type: 'block';
      children: [{ text: string }];
    }[];
}


export interface Project {
    _id: string;
    title: string;
    categories: CategoryProp[];
    description: string;
    slug: {      
        current: string;
    }
    url: string;
    images: {
        _type: 'image';
        asset: {
            _ref: string;
            url: string;
        };
        altText?: string;
    }[];
}
