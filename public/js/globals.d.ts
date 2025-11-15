import * as ReactTypes from 'react';
import * as ReactDOMTypes from 'react-dom/client';

declare global {
    const React: typeof ReactTypes;
    const ReactDOM: typeof ReactDOMTypes;
}

export {};
