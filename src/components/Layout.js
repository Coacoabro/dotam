import TopBar from './TopBar';
import BottomBar from './BottomBar';

const Layout = ({children}) => {
  return (
    <div className="layout">
      <TopBar />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
