"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryTemplates = exports.componentTemplates = void 0;
var componentTemplates = function (name) { return ({
    index: "export { default } from './".concat(name, "'"),
    component: "\n        import React from 'react';\n    \n        type Props = React.ComponentPropsWithoutRef<'div'> & {};\n    \n        const ".concat(name, ": React.FunctionComponent<Props> = () => {\n            return <div />;\n        };\n    \n        export default ").concat(name, ";"),
    componentWithCSSModules: function (lowerCasedName) { return "\n        import React from 'react';\n        import styles from './".concat(lowerCasedName, ".module.css';\n    \n        type Props = React.ComponentPropsWithoutRef<'div'> & {};\n    \n        const ").concat(name, ": React.FunctionComponent<Props> = () => {\n            return <div />;\n        };\n    \n        export default ").concat(name, ";"); },
    hook: "\n        const ".concat(name, " = () => {\n            return {}\n        };\n  \n        export default ").concat(name, ";\n    "),
}); };
exports.componentTemplates = componentTemplates;
exports.entryTemplates = {
    index: "export {};",
};
