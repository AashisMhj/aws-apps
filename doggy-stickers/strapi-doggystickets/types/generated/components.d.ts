import type { Schema, Attribute } from '@strapi/strapi';

export interface ComponentsVariant extends Schema.Component {
  collectionName: 'components_components_variants';
  info: {
    displayName: 'Variant';
    icon: 'attachment';
  };
  attributes: {
    type: Attribute.Enumeration<['variant 3x3', 'variant 4x4', 'variant 5x5']>;
    price: Attribute.Integer;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'components.variant': ComponentsVariant;
    }
  }
}
