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

  componentWithCSSModules: (lowerCasedName: string) => `
        import React from 'react';
        import styles from './${lowerCasedName}.module.css';
    
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
