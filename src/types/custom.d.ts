declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

declare module '@corva/ui/componentsV2' {
  import * as React from 'react';
  export const AppContainer: React.ComponentType<any>;
  export const AppHeader: React.ComponentType<any>;
  export const TextInput: React.ComponentType<any>;
}

declare module '@corva/ui/components' {
  import * as React from 'react';
  export const AppFilterPanelLayout: React.ComponentType<any>;
  export const ColorPicker: React.ComponentType<any>;
  export const MenuItem: React.ComponentType<any>;
  export const Select: React.ComponentType<any>;
  export const StyledDropdownEditor: React.ComponentType<any>;
  export const AssetsMultipleSelector: React.ComponentType<any>;
}


