import ReactDOM from 'react-dom';

export default function TooltipPortal({children}) {
    return ReactDOM.createPortal(children, document.body);
}