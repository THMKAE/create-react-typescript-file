import { generateStyleFileName } from './helpers';

export const componentTemplates = (name: string) => ({
  index: `export { default } from './${name}';`,

  parentIndex: `export { default as ${name} } from './${name}';`,

  component: `
        import React from 'react';
    
        type Props = React.ComponentPropsWithoutRef<'div'> & {};
    
        const ${name}: React.FunctionComponent<Props> = () => {
            return <div />;
        };
    
        export default ${name};`,

  componentWithStyling: (lowerCasedName: string, ext: string) => `
        import React from 'react';
        import styles from './${generateStyleFileName(lowerCasedName, ext)}';
    
        type Props = React.ComponentPropsWithoutRef<'div'> & {};
    
        const ${name}: React.FunctionComponent<Props> = () => {
            return <div />;
        };
    
        export default ${name};`,

  hook: `
        const ${name} = () => {
            return {}
        };
  
        export default ${name};
    `,
});

export const entryTemplates = {
  index: `export {};`,
};
