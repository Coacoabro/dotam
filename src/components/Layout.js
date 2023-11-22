
import TopBar from './TopBar';

const Layout = ({children}) => {
  return (
    <div className="layout">
      <TopBar />
      <main>{children}</main>
      
    </div>
  );
};

export default Layout;
