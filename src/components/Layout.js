import Head from 'next/head';
import TopBar from './TopBar';

const Layout = ({children}) => {
  return (
    <div className="layout">
      <Head>
        <title>Dotam.gg</title>
      </Head>
      <TopBar />
      <main>{children}</main>
      
    </div>
  );
};

export default Layout;
