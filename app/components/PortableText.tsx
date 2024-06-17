// components/PortableTextComponent.tsx
import React from 'react';
import { PortableText, PortableTextComponents } from '@portabletext/react';

interface PortableTextComponentProps {
  value: any; // Adjust this type according to your Portable Text structure
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <img src={value.asset.url} alt={value.alt || 'Image'} />
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a href={value.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

const PortableTextComponent: React.FC<PortableTextComponentProps> = ({ value }) => {
  return <PortableText value={value} components={components} />;
};

export default PortableTextComponent;
